import { Scalar, CustomScalar } from '@nestjs/graphql'
import { Kind, ValueNode } from 'graphql'

@Scalar('StringOrNumber', () => String)
export class StringOrNumberScalar implements CustomScalar<string | number, string | number> {
   description = 'String or Number scalar for input and output'

   parseValue(value: string | number): string | number {
      // Parse client input (input type)
      if (typeof value === 'string') return value
      if (typeof value === 'number') return value
      throw new Error('Value must be a string or a number')
   }

   serialize(value: string | number): string | number {
      // Serialize server output (output type)
      return value
   }

   parseLiteral(ast: ValueNode): string | number {
      // Parse from GraphQL query literals
      if (ast.kind === Kind.STRING) {
         return ast.value
      } else if (ast.kind === Kind.INT) {
         return parseInt(ast.value, 10)
      }
      throw new Error('Value must be a string or a number')
   }
}
