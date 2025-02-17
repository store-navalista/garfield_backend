import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { GqlExecutionContext, GqlContextType } from '@nestjs/graphql'

@Injectable()
export class JwtAuthGuard implements CanActivate {
   constructor(private jwtService: JwtService) {}

   async canActivate(context: ExecutionContext): Promise<boolean> {
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

         return true
      } catch (e) {
         throw new UnauthorizedException({ message: 'User is not authorized' })
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
