import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { JwtAuthGuard } from 'src/Auth/jwt-auth.guard'
import { Roles } from 'src/Auth/roles-auth.decorator'
import { RolesGuard } from 'src/Auth/roles.guard'
import { User } from 'src/graphql/models/User'
import { CreateModeratorInput } from 'src/graphql/utils/CreateModeratorInput'
import { CreateUserInput } from 'src/graphql/utils/CreateUserInput'
import { UpdateUserInput } from 'src/graphql/utils/UpdateUserInput'
import { LocalhostGuard } from './ip.guard'
import { UsersService } from './UsersService'

@Resolver(() => User)
export class UserResolver {
   constructor(private userService: UsersService) {}
   @UseGuards(LocalhostGuard)
   @Mutation(() => User)
   createModerator(@Args('createModeratorInput') createModeratorInput: CreateModeratorInput) {
      return this.userService.createModerator(createModeratorInput)
   }

   @UseGuards(JwtAuthGuard)
   @Roles('Moderator')
   @UseGuards(RolesGuard)
   @Query(() => User, { nullable: true })
   getCTO(): Promise<User | undefined> {
      return this.userService.getCTO()
   }

   @UseGuards(JwtAuthGuard)
   @Roles('Employee', 'CTO', 'Moderator', 'DeputyCTO')
   @UseGuards(RolesGuard)
   @Query(() => User, { nullable: true })
   getUser(@Args('userId') userId: string): Promise<User | undefined> {
      return this.userService.getUser(userId)
   }

   @UseGuards(JwtAuthGuard)
   @Roles('CTO', 'Moderator', 'DeputyCTO', 'Employee')
   @UseGuards(RolesGuard)
   @Query(() => [User], { nullable: 'items' })
   getUsers(): Promise<User[]> {
      const users = this.userService.getUsers()
      return users
   }

   @UseGuards(JwtAuthGuard)
   @Roles('CTO', 'Moderator', 'DeputyCTO')
   @UseGuards(RolesGuard)
   @Mutation(() => User)
   createUser(@Args('createUserData') createUserData: CreateUserInput) {
      return this.userService.createUser(createUserData)
   }

   @UseGuards(JwtAuthGuard)
   @Roles('CTO', 'Moderator', 'DeputyCTO')
   @UseGuards(RolesGuard)
   @Mutation(() => User)
   updateUser(@Args('id') userId: string, @Args('updateUserData') updateUserData: UpdateUserInput) {
      return this.userService.updateUser(userId, updateUserData)
   }

   @UseGuards(JwtAuthGuard)
   @Roles('CTO', 'Moderator', 'DeputyCTO')
   @UseGuards(RolesGuard)
   @Mutation(() => Boolean, { nullable: true })
   deleteUser(@Args('id') id: string) {
      return this.userService.deleteUser(id)
   }

   @UseGuards(JwtAuthGuard)
   @Roles('CTO', 'Moderator', 'DeputyCTO')
   @UseGuards(RolesGuard)
   @Mutation(() => Boolean)
   updatePassword(@Args('id') userId: string, @Args('newPassword') newPassword: string) {
      return this.userService.updatePassword(userId, newPassword)
   }
}
