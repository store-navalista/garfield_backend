import { Scalar, CustomScalar } from '@nestjs/graphql'
import { Kind, ValueNode } from 'graphql'

@Scalar('Buffer')
export class BufferScalar implements CustomScalar<string, Buffer> {
   description = 'Buffer custom scalar type'

   parseValue(value: string): Buffer {
      return Buffer.from(value, 'base64') // Convert incoming string to Buffer
   }

   serialize(value: Buffer): string {
      return value.toString('base64') // Convert outgoing Buffer to string
   }

   parseLiteral(ast: ValueNode): Buffer {
      if (ast.kind === Kind.STRING) {
         return Buffer.from(ast.value, 'base64') // Convert hardcoded AST string to Buffer
      }
      return null
   }
}
