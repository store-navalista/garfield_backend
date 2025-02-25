import { Field, ObjectType } from '@nestjs/graphql'
import { Column, Entity, Generated, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'vessels' })
@ObjectType()
export class Vessel {
   @PrimaryGeneratedColumn('uuid')
   @Generated('uuid')
   @Field(() => String)
   id: string

   @Column({ unique: true })
   @Field(() => Number)
   IMO: number

   @Column()
   @Field(() => String)
   name_of_vessel: string

   @Column({ default: false })
   @Field(() => Boolean, { defaultValue: false })
   imo_frozen: boolean
}
