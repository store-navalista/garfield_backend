import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CatchError } from 'src/common/decorators/ErrorHandling'
import { Job } from 'src/graphql/models/Job'
import { User } from 'src/graphql/models/User'
import { CreateJobInput } from 'src/graphql/utils/CreateJobInput'
import { UpdateJobsInput } from 'src/graphql/utils/UpdateJobsInput'
import { Repository } from 'typeorm'
import * as _ from 'lodash'

@Injectable()
export class JobService {
   constructor(
      @InjectRepository(Job) private jobRepository: Repository<Job>,
      @InjectRepository(User) private usersRepository: Repository<User>
   ) {}

   @CatchError('Failed to get reports by user ID')
   async getJobsByUserId(userId: string): Promise<Job[]> {
      const jobs = await this.jobRepository
         .createQueryBuilder('job')
         .select(['job.*'])
         .where({ user: userId })
         .getRawMany()

      return jobs
   }

   @CatchError('Failed to get reports by user ID')
   async getJobsByUserIdAndPeriod(userId: string, period: string): Promise<Job[]> {
      const jobs = await this.jobRepository
         .createQueryBuilder('job')
         .select(['job.*'])
         .where({ user: userId })
         .andWhere({ report_period: period })
         .getRawMany()

      return jobs
   }

   @CatchError('Failed to update report')
   async createJob(createJobData: CreateJobInput): Promise<Job> {
      const newJob = new Job()

      newJob.user = createJobData.user
      newJob.job_description = createJobData.job_description
      newJob.project_number = createJobData.project_number
      newJob.ship_name = createJobData.ship_name
      newJob.hours_worked = createJobData.hours_worked
      newJob.report_period = createJobData.report_period
      newJob.order = createJobData.order
      newJob.notes = createJobData.notes

      const savedJob = await this.jobRepository.save(newJob)

      return savedJob
   }

   @CatchError('Failed to delete job')
   async removeJob(user: User, period: string, id: number): Promise<void> {
      const jobToRemove = await this.jobRepository.findOne({
         where: { id, user, report_period: period }
      })

      if (!jobToRemove) {
         throw new Error('Job not found')
      }

      await this.jobRepository.remove(jobToRemove)
   }

   @CatchError('Failed to update report')
   async updateJobsByUserIdAndPeriod(updateJobsData: UpdateJobsInput): Promise<Job[] | null> {
      const user = await this.usersRepository.findOne({ where: { id: updateJobsData.userId } })
      const jobsToUpdate = await this.getJobsByUserIdAndPeriod(updateJobsData.userId, updateJobsData.period)

      const existsIDs = jobsToUpdate.map((j) => j.id)
      const updateIDs = updateJobsData.jobs.map((j) => j.id)
      const willRemove = existsIDs.filter((num) => !updateIDs.includes(num))

      willRemove.forEach(async (id) => {
         const deleteJob = jobsToUpdate.find((j) => j.id == id)
         await this.removeJob(deleteJob.user, deleteJob.report_period, id)
      })

      const mutatedJobs: Job[] = []

      for (const jobData of updateJobsData.jobs) {
         const existingJob = jobsToUpdate.find((job) => job.id === jobData.id)

         if (existingJob) {
            const isEqual = _.isEqual(existingJob, { ...jobData, user_id: updateJobsData.userId })

            if (!isEqual) {
               for (const key in jobData) {
                  if (key !== 'id' && key in existingJob) {
                     existingJob[key] = jobData[key]
                  }
               }
               const updatedJob = await this.jobRepository.save(existingJob)
               mutatedJobs.push(updatedJob)
            }
         } else {
            const newJob = await this.createJob({ ...jobData, user })
            mutatedJobs.push(newJob)
         }
      }

      return mutatedJobs
   }
}
