import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { VesselsResolver } from './vessels.resolver'
import { VesselsService } from './vessels.service'
import { Vessel } from 'src/graphql/models/Vessel'

@Module({
   imports: [TypeOrmModule.forFeature([Vessel])],
   providers: [VesselsResolver, VesselsService]
})
export class VesselsModule {}
