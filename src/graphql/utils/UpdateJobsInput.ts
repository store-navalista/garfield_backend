import { Field, InputType } from '@nestjs/graphql'

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

   @Field(() => [Number])
   hours_worked: number[]

   @Field(() => String)
   report_period: string

   @Field()
   order: number
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
