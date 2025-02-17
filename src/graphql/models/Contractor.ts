import { Field, ObjectType } from '@nestjs/graphql'
import { Column, Entity, Generated, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'contractor' })
@ObjectType()
export class Contractor {
   @PrimaryGeneratedColumn('uuid')
   @Generated('uuid')
   @Field(() => String)
   id: string

   @Column({ unique: true })
   @Field(() => String)
   contractor_name: string

   @Column()
   @Field(() => String, { nullable: true })
   description: string
}
