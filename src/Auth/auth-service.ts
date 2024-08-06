import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcrypt from 'bcryptjs'
import { CatchError } from 'src/common/decorators/ErrorHandling'
import { Token } from 'src/graphql/models/Token'
import { User } from 'src/graphql/models/User'
import { LoginInput } from 'src/graphql/utils/LoginInput'
import { Repository } from 'typeorm'

@Injectable()
export class AuthService {
   constructor(
      @InjectRepository(User) private usersRepository: Repository<User>,
      private jwtService: JwtService
   ) {}

   @CatchError()
   async getUserByName(describe_name: string): Promise<any> {
      const user = await this.usersRepository.findOne({ where: { describe_name }, relations: ['jobs'] })
      return user
   }

   @CatchError()
   private async validateUser(loginDto: LoginInput): Promise<User> {
      const user = (await this.getUserByName(loginDto.username)) as User

      if (!user) throw new UnauthorizedException({ message: 'No such employee exists' })

      const passwordEquals = await bcrypt.compare(loginDto.password, user.describe_password)

      if (!passwordEquals) throw new UnauthorizedException({ message: 'Incorrect password' })

      return user
   }

   @CatchError()
   private async generateToken(user: User): Promise<Token> {
      const { describe_name, describe_role, id } = user

      return {
         token: this.jwtService.sign({ describe_name, describe_role, id }),
         id
      }
   }

   @CatchError()
   async login(loginDto: LoginInput): Promise<Token> {
      const user = await this.validateUser(loginDto)

      return this.generateToken(user)
   }
}
