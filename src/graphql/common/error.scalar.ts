import { Scalar } from '@nestjs/graphql'

@Scalar('ErrorMessage')
export class ErrorMessageScalar {
   description = 'ErrorMessage scalar type'
   parseValue(value: string) {
      return value
   }
   serialize(value: string) {
      return value
   }
   parseLiteral(ast) {
      if (ast.kind === 'StringValue') {
         return ast.value
      }
      return null
   }
}
