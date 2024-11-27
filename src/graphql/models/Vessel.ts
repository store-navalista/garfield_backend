import { Field, ObjectType } from '@nestjs/graphql'
import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity({ name: 'vessels' })
@ObjectType()
export class Vessel {
   @PrimaryColumn()
   @Field(() => Number)
   IMO: number

   @Column()
   @Field(() => String)
   name_of_vessel: string

   @Column({ default: false })
   @Field(() => Boolean, { defaultValue: false })
   imo_frozen: boolean
}
