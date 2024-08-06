import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcrypt from 'bcryptjs'
import { CatchError } from 'src/common/decorators/ErrorHandling'
import { Job } from 'src/graphql/models/Job'
import { User } from 'src/graphql/models/User'
import { CreateModeratorInput } from 'src/graphql/utils/CreateModeratorInput'
import { CreateUserInput } from 'src/graphql/utils/CreateUserInput'
import { UpdateUserInput } from 'src/graphql/utils/UpdateUserInput'
import { Repository } from 'typeorm'
import { v4 as UUID } from 'uuid'

@Injectable()
export class UsersService {
   constructor(
      @InjectRepository(User) private usersRepository: Repository<User>,
      @InjectRepository(Job) private jobsRepository: Repository<Job>
   ) {}

   @CatchError('Failed to get CTO')
   async getCTO(): Promise<User | undefined> {
      const users = await this.usersRepository.find({ relations: ['jobs'] })
      const cto = users.filter((user) => user.describe_role === 'CTO')[0]
      return cto
   }

   @CatchError('Failed to get user')
   async getUser(userId: string): Promise<User | undefined> {
      const user = await this.usersRepository.findOne({
         where: { id: userId },
         relations: ['jobs']
      })
      return user
   }

   @CatchError('Failed to get users')
   async getUsers() {
      const users = await this.usersRepository.find({ relations: ['jobs'] })
      return users.filter((user) => user.describe_role === 'Employee')
   }

   @CatchError('Failed to delete user by ID')
   async deleteUser(id: string): Promise<boolean | null> {
      const user = await this.usersRepository.findOne({ where: { id }, relations: ['jobs'] })
      if (!user) return null

      await Promise.all(
         user.jobs.map(async (job) => {
            await this.jobsRepository.delete(job.id)
         })
      )

      await this.usersRepository.delete(id)

      return true
   }

   @CatchError()
   async createModerator(createModeratorInput: CreateModeratorInput): Promise<User> {
      const { describe_password, mail } = createModeratorInput

      const modifiedData = {
         id: UUID(),
         describe_password: await bcrypt.hash(describe_password, 5),
         describe_name: mail,
         describe_role: 'Moderator',
         describe_date: '',
         describe_specialization: '',
         describe_position: '',
         currentTask: '',
         mail
      }

      const isExist = (await this.getUsers()).filter((u) => u.describe_role === 'Moderator')
      if (isExist.length) throw new BadRequestException('Can be only one Moderator!')

      const newUser = this.usersRepository.create(modifiedData)
      return this.usersRepository.save(newUser)
   }

   @CatchError()
   async createUser(createUserData: CreateUserInput): Promise<User> {
      const { describe_name, describe_date, describe_specialization, describe_position, describe_password, CTO, mail } =
         createUserData

      const additionally = CTO ? { describe_role: 'CTO', mail } : { describe_role: 'Employee' }

      const modifiedData = {
         id: UUID(),
         describe_name,
         describe_date,
         describe_specialization,
         describe_position,
         describe_password: await bcrypt.hash(describe_password, 5),
         currentTask: '',
         jobs: [],
         ...additionally
      }

      const isExist = (await this.getUsers()).filter((u) => u.describe_name === describe_name)
      if (isExist.length) throw new BadRequestException('user_exist_error')

      const newUser = this.usersRepository.create(modifiedData)
      return this.usersRepository.save(newUser)
   }

   @CatchError('Failed to update user')
   async updateUser(userId: string, updateUserInput: UpdateUserInput) {
      const user = await this.usersRepository.findOne({ where: { id: userId } })

      if (!user) throw new BadRequestException('This employee does not exist!')

      Object.assign(user, updateUserInput)

      return await this.usersRepository.save(user)
   }

   @CatchError('Failed to update password')
   async updatePassword(userId: string, newPassword: string) {
      const user = await this.usersRepository.findOne({ where: { id: userId } })

      if (user) {
         const hashPassword = await bcrypt.hash(newPassword, 5)
         await this.usersRepository.update(userId, { describe_password: hashPassword })
         return true
      }

      return false
   }
}
