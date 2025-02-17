import { Field, InputType, PartialType } from '@nestjs/graphql'

@InputType()
export class BaseParticipantData {
   @Field(() => String)
   id: string

   @Field(() => String)
   name_of_vessel: string

   @Field(() => Number)
   IMO: number

   @Field(() => Boolean)
   imo_frozen: boolean

   @Field(() => String)
   executor_name: string

   @Field(() => String)
   contractor_name: string

   @Field(() => String)
   description: string
}

@InputType()
export class ParticipantData extends PartialType(BaseParticipantData) {}
