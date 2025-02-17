import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Token } from 'src/graphql/models/Token'
import { User } from 'src/graphql/models/User'
import { LoginInput } from 'src/graphql/utils/LoginInput'
import { AuthService } from './auth-service'
import { Response, Request } from 'express'

@Resolver(() => User)
export class AuthResolver {
   constructor(private authService: AuthService) {}

   @Query(() => User)
   checkAuth(@Context('req') req: Request) {
      return this.authService.checkAuth(req)
   }

   @Mutation(() => Boolean)
   logout(@Context('res') res: Response) {
      return this.authService.logout(res)
   }

   @Mutation(() => Token, { nullable: true })
   login(@Args('loginDto') loginDto: LoginInput, @Context('res') res: Response): Promise<Token> {
      return this.authService.login(loginDto, res)
   }

   @Mutation(() => Token, { nullable: true })
   refresh(@Context('req') req: Request): Promise<Token> {
      return this.authService.refresh(req)
   }
}
