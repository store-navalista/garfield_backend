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
import { Observable } from 'rxjs'
import { Reflector } from '@nestjs/core'
import { ROLES_KEY } from './roles-auth.decorator'

@Injectable()
export class RolesGuard implements CanActivate {
   constructor(
      private jwtService: JwtService,
      private reflector: Reflector
   ) {}

   canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
      try {
         const requiredRoles = this.reflector.getAllAndOverride(ROLES_KEY, [context.getHandler(), context.getClass()])
         if (!requiredRoles) return true

         const req = this.getRequest(context)

         if (!req) {
            throw new UnauthorizedException({ message: 'Request is not valid' })
         }

         try {
            const token = this.extractTokenFromHeader(req.headers.authorization)
            if (!token) {
               throw new UnauthorizedException({ message: 'User is not authorized' })
            }

            const user = this.jwtService.verify(token)
            req.user = user

            return requiredRoles.includes(user.describe_role)
         } catch (e) {
            throw new HttpException('No access', HttpStatus.FORBIDDEN)
         }
      } catch (error) {
         console.log(error)
      }
   }

   private extractTokenFromHeader(authHeader: string): string | null {
      if (!authHeader) {
         return null
      }

      const parts = authHeader.split(' ')
      if (parts.length !== 2 || parts[0] !== 'Bearer') {
         return null
      }

      return parts[1]
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
