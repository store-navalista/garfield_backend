import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Contractor } from 'src/graphql/models/Contractor'
import { Executor } from 'src/graphql/models/Executor'
import { ParticipantsResolver } from './participant.resolver'
import { ParticipantsService } from './participant.service'
import { Vessel } from 'src/graphql/models/Vessel'

@Module({
   imports: [TypeOrmModule.forFeature([Executor, Contractor, Vessel])],
   providers: [ParticipantsResolver, ParticipantsService]
})
export class ParticipantsModule {}
