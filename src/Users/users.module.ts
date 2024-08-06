import { Module, forwardRef } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from 'src/Auth/auth.module'
import { JwtAuthGuard } from 'src/Auth/jwt-auth.guard'
import { ErrorMessageScalar } from 'src/graphql/common/error.scalar'
import { Job } from 'src/graphql/models/Job'
import { User } from 'src/graphql/models/User'
import { JobResolver } from './JobResolver'
import { JobService } from './JobService'
import { UserResolver } from './UserResolver'
import { UsersService } from './UsersService'

@Module({
   imports: [TypeOrmModule.forFeature([User, Job]), forwardRef(() => AuthModule), JwtModule],
   providers: [UsersService, UserResolver, JobService, JobResolver, ErrorMessageScalar, JwtAuthGuard]
})
export class UsersModule {}
