import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { Token } from 'src/graphql/models/Token'
import { User } from 'src/graphql/models/User'
import { LoginInput } from 'src/graphql/utils/LoginInput'
import { AuthService } from './auth-service'

@Resolver(() => User)
export class AuthResolver {
   constructor(private authService: AuthService) {}

   @Mutation(() => Token, { nullable: true })
   login(@Args('loginDto') loginDto: LoginInput): Promise<Token> {
      return this.authService.login(loginDto)
   }
}
