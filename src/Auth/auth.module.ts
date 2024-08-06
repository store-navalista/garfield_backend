import { Module, forwardRef } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from 'src/graphql/models/User'
import { AuthResolver } from './auth-resolver'
import { AuthService } from './auth-service'
import { JwtAuthGuard } from './jwt-auth.guard'
import { UsersModule } from 'src/Users/users.module'

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
            signOptions: { expiresIn: '24h' }
         })
      }),
      TypeOrmModule.forFeature([User]),
      forwardRef(() => UsersModule)
   ],
   exports: [JwtAuthGuard, JwtModule],
   providers: [AuthResolver, AuthService, JwtAuthGuard]
})
export class AuthModule {}
