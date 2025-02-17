import { ConflictException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CatchError } from 'src/common/decorators/ErrorHandling'
import { Contractor } from 'src/graphql/models/Contractor'
import { Executor } from 'src/graphql/models/Executor'
import { Vessel } from 'src/graphql/models/Vessel'
import { Not, Repository } from 'typeorm'
import { AllParticipants, ParticipantsTypes } from './participant.resolver'

@Injectable()
export class ParticipantsService {
   private repositoryMap: Record<ParticipantsTypes, Repository<AllParticipants>>

   constructor(
      @InjectRepository(Vessel)
      private vesselRepository: Repository<Vessel>,

      @InjectRepository(Executor)
      private executorRepository: Repository<Executor>,

      @InjectRepository(Contractor)
      private contractorRepository: Repository<Contractor>
   ) {
      this.repositoryMap = {
         vessel: this.vesselRepository,
         executor: this.executorRepository,
         contractor: this.contractorRepository
      }
   }

   private getRepository(type: ParticipantsTypes): Repository<AllParticipants> {
      const repository = this.repositoryMap[type]
      if (!repository) {
         throw new Error('Unsupported work type')
      }
      return repository
   }

   @CatchError()
   async getParticipantsByType(type: ParticipantsTypes): Promise<AllParticipants[]> {
      const getOrder = () => {
         switch (type) {
            case 'contractor':
               return { contractor_name: 'ASC' }
            case 'executor':
               return { executor_name: 'ASC' }
            default:
               return { name_of_vessel: 'ASC' }
         }
      }

      return await this.getRepository(type).find({
         order: getOrder()
      })
   }

   @CatchError()
   async deleteParticipant(type: ParticipantsTypes, id: string): Promise<boolean | null> {
      const participant = await this.getRepository(type).findOne({ where: { id: id } })

      if (!participant) return null
      await this.getRepository(type).delete(id)

      return true
   }

   @CatchError()
   async createParticipant(type: ParticipantsTypes, createParticipantData: AllParticipants): Promise<AllParticipants> {
      switch (type) {
         case 'vessel': {
            const { IMO } = createParticipantData as Vessel

            const existingVessel = await this.vesselRepository.findOne({ where: { IMO } })
            if (existingVessel) {
               throw new ConflictException(`Vessel with IMO ${IMO} already exists`)
            }
            break
         }
         case 'executor': {
            const { executor_name } = createParticipantData as Executor

            const existingExecutor = await this.executorRepository.findOne({ where: { executor_name } })
            if (existingExecutor) {
               throw new ConflictException(`Executor with name ${executor_name} already exists`)
            }
            break
         }
         case 'contractor': {
            const { contractor_name } = createParticipantData as Contractor

            const existingContractor = await this.contractorRepository.findOne({ where: { contractor_name } })
            if (existingContractor) {
               throw new ConflictException(`Contractor with name ${contractor_name} already exists`)
            }
            break
         }
      }

      const newParticipant = this.getRepository(type).create(createParticipantData)
      await this.getRepository(type).save(newParticipant)

      return newParticipant
   }

   @CatchError()
   async updateParticipants(type: ParticipantsTypes, updateParticipantsData: AllParticipants[]): Promise<boolean> {
      const updatedParticipants: AllParticipants[] = []

      for (const participantData of updateParticipantsData) {
         const { id } = participantData

         const existingParticipant = await this.getRepository(type).findOne({ where: { id } })

         if (!existingParticipant) {
            throw new Error(`Participant with id ${id} not found`)
         }

         switch (type) {
            case 'vessel': {
               const { IMO } = participantData as Vessel

               const duplicateIMO = await this.vesselRepository.findOne({
                  where: { IMO, id: Not(id) }
               })

               if (duplicateIMO) {
                  throw new ConflictException(`Another vessel with IMO ${IMO} already exists`)
               }
               break
            }
            case 'executor': {
               const { executor_name } = participantData as Executor

               const duplicateExecutor = await this.executorRepository.findOne({
                  where: { executor_name, id: Not(id) }
               })

               if (duplicateExecutor) {
                  throw new ConflictException(`Another executor with name ${executor_name} already exists`)
               }
               break
            }
            case 'contractor': {
               const { contractor_name } = participantData as Contractor

               const duplicateContractor = await this.contractorRepository.findOne({
                  where: { contractor_name, id: Not(id) }
               })

               if (duplicateContractor) {
                  throw new ConflictException(`Another contractor with name ${contractor_name} already exists`)
               }
               break
            }
         }

         const updatedParticipant = this.getRepository(type).merge(existingParticipant, participantData)
         await this.getRepository(type).save(updatedParticipant)
         updatedParticipants.push(updatedParticipant)
      }

      return true
   }
}
