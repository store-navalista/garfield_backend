import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { GqlExecutionContext, GqlContextType } from '@nestjs/graphql'
import { Observable } from 'rxjs'

@Injectable()
export class JwtAuthGuard implements CanActivate {
   constructor(private jwtService: JwtService) {}

   canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
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

         return true
      } catch (e) {
         throw new UnauthorizedException({ message: 'User is not authorized' })
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
