import { Field, ObjectType } from '@nestjs/graphql'
import { Column, Entity, Generated, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'executor' })
@ObjectType()
export class Executor {
   @PrimaryGeneratedColumn('uuid')
   @Generated('uuid')
   @Field(() => String)
   id: string

   @Column({ unique: true })
   @Field(() => String)
   executor_name: string

   @Column()
   @Field(() => String, { nullable: true })
   description: string
}
