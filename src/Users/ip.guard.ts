import {
   CanActivate,
   ExecutionContext,
   HttpException,
   HttpStatus,
   Injectable,
   UnauthorizedException
} from '@nestjs/common'
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql'
import { Observable } from 'rxjs'

@Injectable()
export class LocalhostGuard implements CanActivate {
   constructor() {}

   canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
      try {
         const req = this.getRequest(context)

         if (!req) {
            throw new UnauthorizedException({ message: 'Request is not valid' })
         }

         if (req.ip !== '127.0.0.1' && req.hostname !== 'localhost') {
            throw new UnauthorizedException({ message: 'Access allowed only from localhost' })
         }

         return true
      } catch (e) {
         throw new HttpException('Server Error', HttpStatus.FORBIDDEN)
      }
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
