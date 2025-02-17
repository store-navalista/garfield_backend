import { Field, InputType } from '@nestjs/graphql'
import { WorkCompanyType } from '../constants/enums'

@InputType()
export class CreateJobData {
   @Field(() => Number, { nullable: true })
   id?: number

   @Field(() => String)
   job_description: string

   @Field(() => String)
   project_number: string

   @Field(() => String)
   ship_name: string

   @Field(() => WorkCompanyType, { nullable: true })
   name_of_company_locale: WorkCompanyType

   @Field(() => [Number])
   hours_worked: number[]

   @Field(() => String)
   report_period: string

   @Field()
   order: number

   @Field({ nullable: true })
   notes: string
}

@InputType()
export class UpdateJobsInput {
   @Field()
   userId: string

   @Field()
   period: string

   @Field(() => [CreateJobData])
   jobs: CreateJobData[]
}
