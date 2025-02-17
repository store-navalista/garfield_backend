import { Module, forwardRef } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from 'src/graphql/models/User'
import { UsersModule } from 'src/Users/users.module'
import { AuthResolver } from './auth-resolver'
import { AuthService } from './auth-service'
import { JwtAuthGuard } from './jwt-auth.guard'

@Module({
   imports: [
      ConfigModule.forRoot({
         isGlobal: true
      }),
      JwtModule.registerAsync({
         imports: [ConfigModule],
         inject: [ConfigService],
         useFactory: (configService: ConfigService) => ({
            secret: configService.get<string>('JWT_SECRET'),
            signOptions: { expiresIn: '15m' }
         })
      }),
      TypeOrmModule.forFeature([User]),
      forwardRef(() => UsersModule)
   ],
   providers: [AuthResolver, AuthService, JwtAuthGuard],
   exports: [AuthService, JwtAuthGuard, JwtModule]
})
export class AuthModule {}
