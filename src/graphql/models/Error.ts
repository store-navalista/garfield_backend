import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Error {
   @Field()
   error: string
}
