import { Args, createUnionType, Mutation, Query, Resolver } from '@nestjs/graphql'
import { UUID } from 'crypto'
import { WorksTypes } from 'src/common/constants'
import { FilterTypes } from 'src/graphql/constants/enums'
import { BusinessWorkDesign } from 'src/graphql/models/BusinessWorkDesign'
import { BusinessWorkEngineering } from 'src/graphql/models/BusinessWorkEngineering'
import { UpdateBusinessWorkInput } from 'src/graphql/utils/UpdateBusinessWorkInput'
import { BusinessWorksService } from './business_works.service'
import { BusinessWorkUTM } from 'src/graphql/models/BusinessWorkUTM'
import { BusinessWorkSupply } from 'src/graphql/models/BusinessWorkSupply'

export const BusinessWork = createUnionType({
   name: 'BusinessWork',
   types: () => [BusinessWorkDesign, BusinessWorkEngineering, BusinessWorkSupply, BusinessWorkUTM],
   resolveType(value) {
      if (value instanceof BusinessWorkDesign) {
         return BusinessWorkDesign
      }
      if (value instanceof BusinessWorkEngineering) {
         return BusinessWorkEngineering
      }
      if (value instanceof BusinessWorkSupply) {
         return BusinessWorkSupply
      }
      if (value instanceof BusinessWorkUTM) {
         return BusinessWorkUTM
      }
      return null
   }
})

@Resolver(() => BusinessWork)
export class BusinessWorksResolver {
   constructor(private businessWorksService: BusinessWorksService) {}

   @Query(() => [BusinessWork])
   getAllBusinessWorkByType(@Args('type') type: WorksTypes) {
      return this.businessWorksService.getAllBusinessWorkByType(type)
   }

   @Query(() => [BusinessWork])
   getAllBusinessWorkAllTypes() {
      return this.businessWorksService.getAllBusinessWorkAllTypes()
   }

   @Query(() => [Number])
   getBusinessWorksNumbers(@Args('type') type: WorksTypes) {
      return this.businessWorksService.getBusinessWorksNumbers(type)
   }

   @Mutation(() => Boolean)
   deleteWorkByTypeAndId(@Args('type') type: WorksTypes, @Args('id') id: UUID) {
      return this.businessWorksService.deleteWorkByTypeAndId(type, id)
   }

   @Mutation(() => BusinessWork)
   createBusinessWork(@Args('type') type: WorksTypes) {
      return this.businessWorksService.createBusinessWork(type)
   }

   @Mutation(() => BusinessWork)
   updateBusinessWork(
      @Args('type') type: WorksTypes,
      @Args('updateBusinessWorkInput') updateBusinessWorkInput: UpdateBusinessWorkInput
   ) {
      return this.businessWorksService.updateBusinessWork(type, updateBusinessWorkInput)
   }

   @Mutation(() => [BusinessWork])
   updateBusinessWorks(
      @Args('type') type: WorksTypes,
      @Args('updateBusinessWorkInput', { type: () => [UpdateBusinessWorkInput] })
      updateBusinessWorkInput: UpdateBusinessWorkInput[]
   ) {
      return this.businessWorksService.updateBusinessWorks(type, updateBusinessWorkInput)
   }

   @Mutation(() => [BusinessWork], { nullable: true })
   getBusinessWorksByParameter(
      @Args('type') type: WorksTypes,
      @Args('parameter') parameter: FilterTypes,
      @Args('value', { type: () => String }) value: string | number
   ) {
      return this.businessWorksService.getBusinessWorksByParameter(type, parameter, value)
   }
}
