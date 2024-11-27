import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Vessel } from 'src/graphql/models/Vessel'
import { UpdateVesselInput } from 'src/graphql/utils/UpdateVesselInput'
import { VesselsService } from './vessels.service'

@Resolver(() => Vessel)
export class VesselsResolver {
   constructor(private vesselsService: VesselsService) {}

   @Query(() => [Vessel])
   getVessels() {
      return this.vesselsService.getVessels()
   }

   @Query(() => Boolean, { nullable: true })
   deleteVessel(@Args('IMO') IMO: number) {
      return this.vesselsService.deleteVessel(IMO)
   }

   @Mutation(() => Vessel)
   createVessel(@Args('createVesselData', { type: () => UpdateVesselInput }) createVesselData: UpdateVesselInput) {
      return this.vesselsService.createVessel(createVesselData)
   }

   @Mutation(() => [Vessel])
   updateVessels(
      @Args('updateVesselsData', { type: () => [UpdateVesselInput] }) updateVesselsData: UpdateVesselInput[]
   ) {
      return this.vesselsService.updateVessels(updateVesselsData)
   }
}
