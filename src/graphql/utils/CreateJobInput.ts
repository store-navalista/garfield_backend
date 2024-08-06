import { InputType } from '@nestjs/graphql'
import { CreateJobData } from './UpdateJobsInput'
import { User } from '../models/User'

@InputType()
export class CreateJobInput extends CreateJobData {
   user: User
}
