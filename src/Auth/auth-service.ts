import { Injectable, Res, UnauthorizedException } from '@nestjs/common'
import { Context } from '@nestjs/graphql'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcrypt from 'bcryptjs'
import { Request, Response } from 'express'
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

      const payload = { describe_name, describe_role, id }

      return {
         access_token: this.jwtService.sign(payload, { expiresIn: '15m' }),
         refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' })
      }
   }

   @CatchError()
   async login(loginDto: LoginInput, @Context('res') res: Response): Promise<Token> {
      const user = await this.validateUser(loginDto)
      const tokens = await this.generateToken(user)

      res.cookie('refresh_token', tokens.refresh_token, {
         httpOnly: true,
         secure: true,
         sameSite: 'lax',
         maxAge: 1000 * 60 * 60 * 24 * 7
      })

      return { access_token: tokens.access_token, refresh_token: tokens.refresh_token }
   }

   @CatchError()
   async refresh(@Context('req') req: Request): Promise<Token> {
      const refresh_token = req.cookies['refresh_token']

      if (!refresh_token) {
         throw new UnauthorizedException('Refresh token missing')
      }

      try {
         const payload = this.jwtService.verify(refresh_token)
         const access_token = this.jwtService.sign({ userId: payload.userId }, { expiresIn: '15m' })

         return { access_token }
      } catch (error) {
         throw new UnauthorizedException('Invalid refresh token')
      }
   }

   @CatchError()
   async checkAuth(@Context('req') req: Request): Promise<any> {
      const refresh_token = req.cookies['refresh_token']

      if (!refresh_token) {
         throw new UnauthorizedException('Refresh token missing')
      }

      try {
         const payload = this.jwtService.verify(refresh_token, { secret: process.env.JWT_REFRESH_TOKEN_SECRET })

         const user = await this.usersRepository.findOne({ where: { id: payload.id }, relations: ['jobs'] })

         if (!user) {
            throw new UnauthorizedException('User not found')
         }

         return { id: user.id }
      } catch (error) {
         throw new UnauthorizedException('Invalid or expired refresh token')
      }
   }

   @CatchError()
   async logout(@Res() res: Response) {
      res.clearCookie('refresh_token')
      return true
   }
}
