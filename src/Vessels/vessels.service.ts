import { BadRequestException, ConflictException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CatchError } from 'src/common/decorators/ErrorHandling'
import { Vessel } from 'src/graphql/models/Vessel'
import { UpdateVesselInput } from 'src/graphql/utils/UpdateVesselInput'
import { Repository } from 'typeorm'

@Injectable()
export class VesselsService {
   constructor(@InjectRepository(Vessel) private vesselRepository: Repository<Vessel>) {}

   @CatchError('Failed to get all vessels')
   async getVessels(): Promise<Vessel[]> {
      const vessels = await this.vesselRepository.find()
      return vessels
   }

   @CatchError('Failed to create vessel')
   async createVessel(createVesselData: UpdateVesselInput): Promise<Vessel> {
      const { IMO } = createVesselData

      const existingVessel = await this.vesselRepository.findOne({ where: { IMO } })
      if (existingVessel) {
         throw new ConflictException(`Vessel with IMO ${IMO} already exists`)
      }

      const newVessel = this.vesselRepository.create(createVesselData)
      await this.vesselRepository.save(newVessel)

      return newVessel
   }

   @CatchError('Failed to update vessels')
   async updateVessels(updateVesselsData: UpdateVesselInput[]): Promise<Vessel[]> {
      const updatedVessels: Vessel[] = []
      const imoCountMap: Record<number, number> = {}

      for (const createVesselData of updateVesselsData) {
         const { IMO } = createVesselData
         if (imoCountMap[IMO]) {
            imoCountMap[IMO] += 1
         } else {
            imoCountMap[IMO] = 1
         }
      }

      const duplicateIMOs = Object.keys(imoCountMap).filter((imo) => imoCountMap[imo] > 1)
      if (duplicateIMOs.length > 0) {
         throw new BadRequestException(`Duplicate IMO(s) found: ${duplicateIMOs.join(', ')}`)
      }

      for (const createVesselData of updateVesselsData) {
         const { IMO } = createVesselData
         const existingVessel = await this.vesselRepository.findOne({ where: { IMO } })

         if (existingVessel) {
            const updatedVessel = this.vesselRepository.merge(existingVessel, createVesselData)
            updatedVessels.push(updatedVessel)
         } else {
            const newVessel = this.vesselRepository.create(createVesselData)
            updatedVessels.push(newVessel)
         }
      }

      await this.vesselRepository.save(updatedVessels)

      return updatedVessels
   }

   @CatchError('Failed to delete vessel by IMO')
   async deleteVessel(IMO: number): Promise<boolean | null> {
      const vessel = await this.vesselRepository.findOne({ where: { IMO } })
      if (!vessel) return null

      await this.vesselRepository.delete(IMO)

      return true
   }
}
