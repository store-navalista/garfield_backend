import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CreateModeratorInput {
   @Field()
   describe_password: string

   @Field({ nullable: true })
   describe_role: string

   @Field({ nullable: true })
   mail: string
}
