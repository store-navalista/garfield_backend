import { Module } from '@nestjs/common'
import { BusinessWorksResolver } from './business_works.resolver'
import { BusinessWorksService } from './business_works.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BusinessWorkDesign } from 'src/graphql/models/BusinessWorkDesign'
// import { BusinessWorkEngineering } from 'src/graphql/models/BusinessWorkEngineering'

@Module({
   imports: [TypeOrmModule.forFeature([BusinessWorkDesign])],
   providers: [BusinessWorksResolver, BusinessWorksService]
})
export class BusinessWorksModule {}
