import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UUID } from 'crypto'
import { newWork, WorksTypes } from 'src/common/constants'
import { CatchError } from 'src/common/decorators/ErrorHandling'
import { FilterTypes } from 'src/graphql/constants/enums'
import { BusinessWorkDesign } from 'src/graphql/models/BusinessWorkDesign'
import { BusinessWorkEngineering } from 'src/graphql/models/BusinessWorkEngineering'
import { BusinessWorkSupply } from 'src/graphql/models/BusinessWorkSupply'
import { BusinessWorkUTM } from 'src/graphql/models/BusinessWorkUTM'
import { UpdateBusinessWorkInput } from 'src/graphql/utils/UpdateBusinessWorkInput'
import { Repository } from 'typeorm'

type AllWorksSeparate = BusinessWorkDesign | BusinessWorkEngineering | BusinessWorkSupply | BusinessWorkUTM
type AllWorksSeparateArray = AllWorksSeparate[]

@Injectable()
export class BusinessWorksService {
   private repositoryMap: Record<WorksTypes, Repository<AllWorksSeparate>>

   constructor(
      @InjectRepository(BusinessWorkDesign)
      private businessWorkDesignRepository: Repository<BusinessWorkDesign>,

      @InjectRepository(BusinessWorkEngineering)
      private businessWorkEngineeringRepository: Repository<BusinessWorkEngineering>,

      @InjectRepository(BusinessWorkSupply)
      private businessWorkSupplyRepository: Repository<BusinessWorkSupply>,

      @InjectRepository(BusinessWorkUTM)
      private businessWorkUTMRepository: Repository<BusinessWorkUTM>
   ) {
      this.repositoryMap = {
         design: this.businessWorkDesignRepository,
         engineering: this.businessWorkEngineeringRepository,
         supply: this.businessWorkSupplyRepository,
         utm: this.businessWorkUTMRepository
      } as any
   }

   private getRepository(type: WorksTypes): Repository<AllWorksSeparate> {
      const repository = this.repositoryMap[type]
      if (!repository) {
         throw new Error('Unsupported work type')
      }
      return repository
   }

   @CatchError('Failed to get all types work')
   async getAllBusinessWorkAllTypes(): Promise<AllWorksSeparateArray> {
      const [designWorks, engineeringWorks] = await Promise.all([
         this.businessWorkDesignRepository.find(),
         this.businessWorkEngineeringRepository.find()
      ])

      return [...designWorks, ...engineeringWorks]
   }

   @CatchError('Failed to get all work')
   async getAllBusinessWorkByType(type: WorksTypes): Promise<AllWorksSeparateArray> {
      return await this.getRepository(type).find()
   }

   @CatchError('Failed to delete work')
   async deleteWorkByTypeAndId(type: WorksTypes, id: UUID): Promise<boolean | null> {
      const repository = this.getRepository(type)
      const work = await repository.findOne({ where: { id } })
      if (!work) return null
      await repository.delete(id)
      return true
   }

   @CatchError('Failed to create work')
   async createBusinessWork(type: WorksTypes): Promise<AllWorksSeparate> {
      const repository = this.getRepository(type)
      const emptyWork = newWork(type)
      const newWorkEntity = repository.create(emptyWork)
      return await repository.save(newWorkEntity)
   }

   @CatchError('Failed to update work')
   async updateBusinessWork(
      type: WorksTypes,
      updateBusinessWorkInput: UpdateBusinessWorkInput
   ): Promise<AllWorksSeparate | null> {
      const repository = this.getRepository(type)
      const existingWork = await repository.findOne({ where: { id: updateBusinessWorkInput.id } })
      if (!existingWork) return null
      const updatedWork = repository.merge(existingWork, updateBusinessWorkInput)
      return await repository.save(updatedWork)
   }

   @CatchError('Failed to update works')
   async updateBusinessWorks(
      type: WorksTypes,
      updateBusinessWorkInput: UpdateBusinessWorkInput[]
   ): Promise<AllWorksSeparateArray> {
      const repository = this.getRepository(type)
      const updatedWorks: AllWorksSeparateArray = []

      for (const input of updateBusinessWorkInput) {
         const existingWork = await repository.findOne({ where: { id: input.id } })
         if (!existingWork) {
            console.warn(`Work with ID ${input.id} not found for update.`)
            continue
         }
         const updatedWork = repository.merge(existingWork, input)
         updatedWorks.push(await repository.save(updatedWork))
      }

      return updatedWorks
   }

   @CatchError('Failed to get works numbers')
   async getBusinessWorksNumbers(type: WorksTypes): Promise<number[]> {
      const works = await this.getRepository(type).find()
      return works.map((work) => work.work_number).filter((n) => n !== 0)
   }

   @CatchError('Failed to get works by parameter')
   async getBusinessWorksByParameter(
      type: WorksTypes,
      parameter: FilterTypes,
      value: string | number
   ): Promise<AllWorksSeparateArray | null> {
      const works = await this.getRepository(type).find({ where: { [parameter]: value } })
      return works.length > 0 ? works : null
   }
}
