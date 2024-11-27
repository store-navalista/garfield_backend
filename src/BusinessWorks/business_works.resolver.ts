import { Args, createUnionType, Mutation, Query, Resolver } from '@nestjs/graphql'
import { WorksTypes } from 'src/common/constants'
import { BusinessWorkDesign } from 'src/graphql/models/BusinessWorkDesign'
import { BusinessWorkEngineering } from 'src/graphql/models/BusinessWorkEngineering'
import { BusinessWorksService } from './business_works.service'
import { UUID } from 'crypto'
import { UpdateBusinessWorkInput } from 'src/graphql/utils/UpdateBusinessWorkInput'
import { FilterTypes } from 'src/graphql/constants/enums'
// import { StringOrNumberScalar } from 'src/common/scalar/StringOrNumber'

export const BusinessWork = createUnionType({
   name: 'BusinessWork',
   types: () => [BusinessWorkDesign, BusinessWorkEngineering],
   resolveType(value) {
      if (value instanceof BusinessWorkDesign) {
         return BusinessWorkDesign
      }
      if (value instanceof BusinessWorkEngineering) {
         return BusinessWorkEngineering
      }
      return null
   }
})

@Resolver(() => BusinessWorkDesign)
export class BusinessWorksResolver {
   constructor(private businessWorksService: BusinessWorksService) {}

   @Query(() => [BusinessWorkDesign])
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
