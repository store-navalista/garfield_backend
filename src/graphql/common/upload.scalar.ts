import { Scalar } from '@nestjs/graphql'
import { GraphQLScalarType, Kind } from 'graphql'

@Scalar('Upload')
export class UploadScalar extends GraphQLScalarType {
   name = 'Upload'
   description = 'Upload scalar type'

   serialize = (value) => {
      return value
   }

   parseValue = (value) => {
      return value
   }

   parseLiteral = (ast) => {
      if (ast.kind === Kind.STRING) {
         return ast.value
      }
      return null
   }
}
