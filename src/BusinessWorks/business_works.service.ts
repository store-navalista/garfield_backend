import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UUID } from 'crypto'
import { newWork, WorksTypes } from 'src/common/constants'
import { CatchError } from 'src/common/decorators/ErrorHandling'
import { FilterTypes } from 'src/graphql/constants/enums'
import { BusinessWorkDesign } from 'src/graphql/models/BusinessWorkDesign'
import { BusinessWorkEngineering } from 'src/graphql/models/BusinessWorkEngineering'
import { UpdateBusinessWorkInput } from 'src/graphql/utils/UpdateBusinessWorkInput'
import { Repository } from 'typeorm'

type AllWorksSeparate = BusinessWorkDesign | BusinessWorkEngineering
type AllWorksSeparateArray = (BusinessWorkDesign | BusinessWorkEngineering)[]

@Injectable()
export class BusinessWorksService {
   constructor(
      @InjectRepository(BusinessWorkDesign)
      private businessWorkDesignRepository: Repository<BusinessWorkDesign>,
      @InjectRepository(BusinessWorkEngineering)
      private businessWorkEngineeringRepository: Repository<BusinessWorkEngineering>
   ) {}

   @CatchError('Failed to get all types work')
   async getAllBusinessWorkAllTypes(): Promise<AllWorksSeparateArray> {
      const [design_works, engineering_works] = await Promise.all([
         this.businessWorkDesignRepository.find(),
         this.businessWorkEngineeringRepository.find()
      ])

      return [...design_works, ...engineering_works]
   }

   @CatchError('Failed to get all work')
   async getAllBusinessWorkByType(type: WorksTypes): Promise<AllWorksSeparateArray> {
      switch (type) {
         case 'design': {
            const design_works = this.businessWorkDesignRepository.find()
            return design_works
         }
         case 'engineering': {
            const engineering_works = this.businessWorkEngineeringRepository.find()
            return engineering_works
         }
         // case 'supply': {
         // }
         // case 'utm': {
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
         case 'engineering': {
            const work = await this.businessWorkEngineeringRepository.findOne({ where: { id } })
            if (!work) return null
            await this.businessWorkEngineeringRepository.delete(id)
            return true
         }
         // case 'supply': {
         // }
         // case 'utm': {
         // }
         default:
            throw new Error('Unsupported work type')
      }
   }

   @CatchError('Failed to create work')
   async createBusinessWork(type: WorksTypes): Promise<AllWorksSeparate> {
      const empty_work = newWork(type)

      switch (type) {
         case 'design': {
            const newDesignWork = this.businessWorkDesignRepository.create(empty_work)
            await this.businessWorkDesignRepository.save(newDesignWork)
            return newDesignWork
         }
         case 'engineering': {
            const newDesignWork = this.businessWorkEngineeringRepository.create(empty_work)
            await this.businessWorkEngineeringRepository.save(newDesignWork)
            return newDesignWork
         }
         // case 'supply': {
         // }
         // case 'utm': {
         // }
         default:
            throw new Error('Unsupported work type')
      }
   }

   @CatchError('Failed to update work')
   async updateBusinessWork(
      type: WorksTypes,
      updateBusinessWorkInput: UpdateBusinessWorkInput
   ): Promise<AllWorksSeparate | null> {
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
         case 'engineering': {
            const existingWork = await this.businessWorkEngineeringRepository.findOne({
               where: { id: updateBusinessWorkInput.id }
            })

            if (!existingWork) {
               return null
            }

            const updatedWork = this.businessWorkEngineeringRepository.merge(existingWork, updateBusinessWorkInput)
            await this.businessWorkEngineeringRepository.save(updatedWork)

            return updatedWork
         }
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
   ): Promise<AllWorksSeparateArray | null> {
      const updatedWorks: AllWorksSeparateArray = []

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
         case 'engineering': {
            for (const updateInput of updateBusinessWorkInput) {
               const existingWork = await this.businessWorkEngineeringRepository.findOne({
                  where: { id: updateInput.id }
               })

               if (!existingWork) {
                  console.warn(`Work with ID ${updateInput.id} not found for update.`)
                  continue
               }

               const updatedWork = this.businessWorkEngineeringRepository.merge(existingWork, updateInput)
               await this.businessWorkEngineeringRepository.save(updatedWork)
               updatedWorks.push(updatedWork)
            }

            return updatedWorks
         }
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
         case 'engineering': {
            const works = await this.businessWorkEngineeringRepository.find()

            return works.map((w) => w.work_number).filter((n) => n !== 0)
         }
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
   ): Promise<AllWorksSeparateArray | null> {
      switch (type) {
         case 'design': {
            const works = await this.businessWorkDesignRepository.find({
               where: { [parameter]: value }
            })

            return works.length > 0 ? works : null
         }
         case 'engineering': {
            const works = await this.businessWorkEngineeringRepository.find({
               where: { [parameter]: value }
            })

            return works.length > 0 ? works : null
         }
         // case 'supply': {
         // }
         // case 'utm': {
         // }
         default:
            throw new Error('Unsupported work type')
      }
   }
}
