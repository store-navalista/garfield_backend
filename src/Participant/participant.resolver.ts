import { Args, createUnionType, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Contractor } from 'src/graphql/models/Contractor'
import { Executor } from 'src/graphql/models/Executor'
import { ParticipantsService } from './participant.service'
import { Vessel } from 'src/graphql/models/Vessel'
import { ParticipantData } from 'src/graphql/utils/ParticipantData'

export type AllParticipants = Executor | Contractor | Vessel
export type ParticipantsTypes = 'executor' | 'contractor' | 'vessel'

export const Participant = createUnionType({
   name: 'Participant',
   types: () => [Vessel, Executor, Contractor],
   resolveType(value) {
      if (value instanceof Vessel) {
         return Vessel
      }
      if (value instanceof Executor) {
         return Executor
      }
      if (value instanceof Contractor) {
         return Contractor
      }
      return null
   }
})

@Resolver(() => Participant)
export class ParticipantsResolver {
   constructor(private participantsService: ParticipantsService) {}

   @Query(() => [Participant])
   getParticipantsByType(@Args('type') type: ParticipantsTypes) {
      return this.participantsService.getParticipantsByType(type)
   }

   @Mutation(() => Boolean, { nullable: true })
   deleteParticipant(@Args('type') type: ParticipantsTypes, @Args('id') id: string) {
      return this.participantsService.deleteParticipant(type, id)
   }

   @Mutation(() => Participant)
   createParticipant(
      @Args('type') type: ParticipantsTypes,
      @Args('createParticipantData', { type: () => ParticipantData }) createParticipantData: AllParticipants
   ) {
      return this.participantsService.createParticipant(type, createParticipantData)
   }

   @Mutation(() => Boolean)
   updateParticipants(
      @Args('type') type: ParticipantsTypes,
      @Args('updateParticipantsData', { type: () => [ParticipantData] }) updateParticipantsData: AllParticipants[]
   ) {
      return this.participantsService.updateParticipants(type, updateParticipantsData)
   }
}
