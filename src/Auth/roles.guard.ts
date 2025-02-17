import {
   CanActivate,
   ExecutionContext,
   HttpException,
   HttpStatus,
   Injectable,
   UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { GqlExecutionContext, GqlContextType } from '@nestjs/graphql'
import { Reflector } from '@nestjs/core'
import { ROLES_KEY } from './roles-auth.decorator'

@Injectable()
export class RolesGuard implements CanActivate {
   constructor(
      private jwtService: JwtService,
      private reflector: Reflector
   ) {}

   async canActivate(context: ExecutionContext): Promise<boolean> {
      try {
         const requiredRoles = this.reflector.getAllAndOverride(ROLES_KEY, [context.getHandler(), context.getClass()])
         if (!requiredRoles) return true

         const req = this.getRequest(context)

         if (!req) {
            throw new UnauthorizedException({ message: 'Request is not valid' })
         }

         try {
            const token = this.extractTokenFromCookie(req)

            if (!token) {
               throw new UnauthorizedException({ message: 'User is not authorized' })
            }

            const user = await this.jwtService.verifyAsync(token)
            req.user = user

            return requiredRoles.includes(user.describe_role)
         } catch (e) {
            throw new HttpException('No access', HttpStatus.FORBIDDEN)
         }
      } catch (error) {
         console.log(error)
         throw new UnauthorizedException({ message: 'Access denied' })
      }
   }

   private extractTokenFromCookie(req): string | null {
      return req.cookies?.refresh_token || null
   }

   private getRequest(context: ExecutionContext) {
      if (context.getType<GqlContextType>() === 'http') {
         return context.switchToHttp().getRequest()
      } else if (context.getType<GqlContextType>() === 'graphql') {
         const ctx = GqlExecutionContext.create(context)
         return ctx.getContext().req
      }
      return null
   }
}
