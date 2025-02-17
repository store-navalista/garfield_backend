import { Module } from '@nestjs/common'
import { BusinessWorksResolver } from './business_works.resolver'
import { BusinessWorksService } from './business_works.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BusinessWorkDesign } from 'src/graphql/models/BusinessWorkDesign'
import { BusinessWorkEngineering } from 'src/graphql/models/BusinessWorkEngineering'
import { BusinessWorkUTM } from 'src/graphql/models/BusinessWorkUTM'
import { BusinessWorkSupply } from 'src/graphql/models/BusinessWorkSupply'

@Module({
   imports: [
      TypeOrmModule.forFeature([BusinessWorkDesign, BusinessWorkEngineering, BusinessWorkSupply, BusinessWorkUTM])
   ],
   providers: [BusinessWorksResolver, BusinessWorksService]
})
export class BusinessWorksModule {}
