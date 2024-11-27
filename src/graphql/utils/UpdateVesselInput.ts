import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class UpdateVesselInput {
   @Field(() => String, { defaultValue: '' })
   name_of_vessel: string

   @Field(() => Number)
   IMO: number

   @Field(() => Boolean, { defaultValue: false })
   imo_frozen: boolean
}
