import { ObjectType, Field, ID } from '@nestjs/graphql'

@ObjectType()
export class FileType extends Buffer {
   @Field(() => ID)
   id: string

   @Field()
   filename: string

   @Field()
   mimetype: string

   @Field()
   encoding: string

   @Field()
   url: string
}

@ObjectType()
export class FileResponse {
   @Field()
   fileName: string

   @Field()
   size?: number

   @Field()
   buffer?: string
}
