import { InputType, OmitType } from '@nestjs/graphql'
import { CreateUserInput } from './CreateUserInput'

@InputType()
export class UpdateUserInput extends OmitType(CreateUserInput, ['CTO', 'describe_password', 'describe_role']) {}
