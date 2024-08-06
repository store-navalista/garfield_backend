import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Job } from 'src/graphql/models/Job'
import { UpdateJobsInput } from 'src/graphql/utils/UpdateJobsInput'
import { JobService } from './JobService'

@Resolver(() => Job)
export class JobResolver {
   constructor(private jobService: JobService) {}

   @Query(() => [Job], { nullable: 'items' })
   getJobsByUserIdAndPeriod(@Args('userId') userId: string, @Args('period') period: string) {
      return this.jobService.getJobsByUserIdAndPeriod(userId, period)
   }

   @Query(() => [Job], { nullable: 'items' })
   getJobsByUserId(@Args('userId') userId: string) {
      return this.jobService.getJobsByUserId(userId)
   }

   @Mutation(() => [Job])
   updateJobsByUserIdAndPeriod(
      @Args('updateJobsData', { type: () => UpdateJobsInput }) updateJobsData: UpdateJobsInput
   ) {
      return this.jobService.updateJobsByUserIdAndPeriod(updateJobsData)
   }
}
