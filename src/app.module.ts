import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersModule } from './Users/users.module'
import { User } from './graphql/models/User'
import { Job } from './graphql/models/Job'
import { AuthModule } from './Auth/auth.module'
import { UploadModule } from './Upload/files.module'
import { BusinessWorksModule } from './BusinessWorks/business_works.module'
import { Vessel } from './graphql/models/Vessel'
import { BusinessWorkDesign } from './graphql/models/BusinessWorkDesign'
import { BusinessWorkEngineering } from './graphql/models/BusinessWorkEngineering'
import { ParticipantsModule } from './Participant/participant.module'
import { Executor } from './graphql/models/Executor'
import { Contractor } from './graphql/models/Contractor'

@Module({
   imports: [
      GraphQLModule.forRoot<ApolloDriverConfig>({
         driver: ApolloDriver,
         autoSchemaFile: 'src/schema.gql',
         context: ({ req, res }) => ({ req, res })
      }),
      ConfigModule.forRoot({ envFilePath: `.${process.env.NODE_ENV}.env`, isGlobal: true }),
      TypeOrmModule.forRoot({
         type: 'postgres',
         host: 'localhost',
         port: Number(process.env.DATABASE_PORT),
         username: 'postgres',
         password: process.env.DATABASE_PASSWORD,
         database: process.env.DATABASE_NAME,
         entities: [User, Job, Vessel, Executor, Contractor, BusinessWorkDesign, BusinessWorkEngineering],
         synchronize: true
      }),
      UsersModule,
      AuthModule,
      UploadModule,
      BusinessWorksModule,
      ParticipantsModule
   ]
})
export class AppModule {}
