import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UUID } from 'crypto'
import { newWork, WorksTypes } from 'src/common/constants'
import { CatchError } from 'src/common/decorators/ErrorHandling'
import { FilterTypes } from 'src/graphql/constants/enums'
import { BusinessWorkDesign } from 'src/graphql/models/BusinessWorkDesign'
import { UpdateBusinessWorkInput } from 'src/graphql/utils/UpdateBusinessWorkInput'
// import { BusinessWorkEngineering } from 'src/graphql/models/BusinessWorkEngineering'
import { Repository } from 'typeorm'

@Injectable()
export class BusinessWorksService {
   constructor(
      @InjectRepository(BusinessWorkDesign)
      private businessWorkDesignRepository: Repository<BusinessWorkDesign>
      // @InjectRepository(BusinessWorkEngineering)
      // private businessWorkEngineeringRepository: Repository<BusinessWorkEngineering>
   ) {}

   @CatchError('Failed to get all types work')
   async getAllBusinessWorkAllTypes(): Promise<any> {
      const design_works = this.businessWorkDesignRepository.find()
      return design_works
   }

   @CatchError('Failed to get all work')
   async getAllBusinessWorkByType(type: WorksTypes): Promise<BusinessWorkDesign[]> {
      switch (type) {
         case 'design': {
            const design_works = this.businessWorkDesignRepository.find()
            return design_works
         }
         // case 'engineering': {
         //    const newEngineeringWork = this.businessWorkEngineeringRepository.create(empty_work)
         //    await this.businessWorkEngineeringRepository.save(newEngineeringWork)
         //    return newEngineeringWork
         // }
         // case 'supply': {
         //    const newSupplyWork = this.businessWorkSupplyRepository.create(empty_work);
         //    await this.businessWorkSupplyRepository.save(newSupplyWork);
         //    return newSupplyWork;
         // }
         // case 'utm': {
         //    const newUtmWork = this.businessWorkUtmRepository.create(empty_work);
         //    await this.businessWorkUtmRepository.save(newUtmWork);
         //    return newUtmWork;
         // }
         default:
            throw new Error('Unsupported work type')
      }
   }

   @CatchError('Failed to delete work')
   async deleteWorkByTypeAndId(type: WorksTypes, id: UUID): Promise<boolean | null> {
      switch (type) {
         case 'design': {
            const work = await this.businessWorkDesignRepository.findOne({ where: { id } })
            if (!work) return null
            await this.businessWorkDesignRepository.delete(id)
            return true
         }
         // case 'engineering': {
         //    const newEngineeringWork = this.businessWorkEngineeringRepository.create(empty_work)
         //    await this.businessWorkEngineeringRepository.save(newEngineeringWork)
         //    return newEngineeringWork
         // }
         // case 'supply': {
         //    const newSupplyWork = this.businessWorkSupplyRepository.create(empty_work);
         //    await this.businessWorkSupplyRepository.save(newSupplyWork);
         //    return newSupplyWork;
         // }
         // case 'utm': {
         //    const newUtmWork = this.businessWorkUtmRepository.create(empty_work);
         //    await this.businessWorkUtmRepository.save(newUtmWork);
         //    return newUtmWork;
         // }
         default:
            throw new Error('Unsupported work type')
      }
   }

   @CatchError('Failed to create work')
   async createBusinessWork(type: WorksTypes): Promise<BusinessWorkDesign> {
      const empty_work = newWork(type)

      switch (type) {
         case 'design': {
            const newDesignWork = this.businessWorkDesignRepository.create(empty_work) as BusinessWorkDesign
            await this.businessWorkDesignRepository.save(newDesignWork)
            return newDesignWork
         }
         // case 'engineering': {
         //    const newEngineeringWork = this.businessWorkEngineeringRepository.create(empty_work)
         //    await this.businessWorkEngineeringRepository.save(newEngineeringWork)
         //    return newEngineeringWork
         // }
         // case 'supply': {
         //    const newSupplyWork = this.businessWorkSupplyRepository.create(empty_work);
         //    await this.businessWorkSupplyRepository.save(newSupplyWork);
         //    return newSupplyWork;
         // }
         // case 'utm': {
         //    const newUtmWork = this.businessWorkUtmRepository.create(empty_work);
         //    await this.businessWorkUtmRepository.save(newUtmWork);
         //    return newUtmWork;
         // }
         default:
            throw new Error('Unsupported work type')
      }
   }

   @CatchError('Failed to update work')
   async updateBusinessWork(
      type: WorksTypes,
      updateBusinessWorkInput: UpdateBusinessWorkInput
   ): Promise<BusinessWorkDesign | null> {
      switch (type) {
         case 'design': {
            const existingWork = await this.businessWorkDesignRepository.findOne({
               where: { id: updateBusinessWorkInput.id }
            })

            if (!existingWork) {
               return null
            }

            const updatedWork = this.businessWorkDesignRepository.merge(existingWork, updateBusinessWorkInput)
            await this.businessWorkDesignRepository.save(updatedWork)

            return updatedWork
         }
         // case 'engineering': {
         // }
         // case 'supply': {
         // }
         // case 'utm': {
         // }
         default:
            throw new Error('Unsupported work type')
      }
   }

   @CatchError('Failed to update work')
   async updateBusinessWorks(
      type: WorksTypes,
      updateBusinessWorkInput: UpdateBusinessWorkInput[]
   ): Promise<BusinessWorkDesign[] | null> {
      const updatedWorks: BusinessWorkDesign[] = []

      switch (type) {
         case 'design': {
            for (const updateInput of updateBusinessWorkInput) {
               const existingWork = await this.businessWorkDesignRepository.findOne({
                  where: { id: updateInput.id }
               })

               if (!existingWork) {
                  console.warn(`Work with ID ${updateInput.id} not found for update.`)
                  continue
               }

               const updatedWork = this.businessWorkDesignRepository.merge(existingWork, updateInput)
               await this.businessWorkDesignRepository.save(updatedWork)
               updatedWorks.push(updatedWork)
            }

            return updatedWorks
         }
         // case 'engineering': {
         // }
         // case 'supply': {
         // }
         // case 'utm': {
         // }
         default:
            throw new Error('Unsupported work type')
      }
   }

   @CatchError('Failed to get works numbers')
   async getBusinessWorksNumbers(type: WorksTypes): Promise<number[] | null> {
      switch (type) {
         case 'design': {
            const works = await this.businessWorkDesignRepository.find()

            return works.map((w) => w.work_number).filter((n) => n !== 0)
         }
         // case 'engineering': {
         // }
         // case 'supply': {
         // }
         // case 'utm': {
         // }
         default:
            throw new Error('Unsupported work type')
      }
   }

   @CatchError('Failed to get works numbers')
   async getBusinessWorksByParameter(
      type: WorksTypes,
      parameter: FilterTypes,
      value: string | number
   ): Promise<BusinessWorkDesign[] | null> {
      switch (type) {
         case 'design': {
            const works = await this.businessWorkDesignRepository.find({
               where: { [parameter]: value }
            })

            return works.length > 0 ? works : null
         }
         // case 'engineering': {
         // }
         // case 'supply': {
         // }
         // case 'utm': {
         // }
         default:
            throw new Error('Unsupported work type')
      }
   }
}
