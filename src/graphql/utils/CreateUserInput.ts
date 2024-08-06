import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CreateUserInput {
   @Field({ nullable: true })
   CTO: boolean

   @Field()
   describe_name: string

   @Field()
   describe_password: string

   @Field({ nullable: true })
   describe_date?: string

   @Field({ nullable: true })
   describe_specialization: string

   @Field({ nullable: true })
   describe_position: string

   @Field({ nullable: true })
   describe_role: string

   @Field({ nullable: true })
   mail: string
}
