import { Field, ObjectType } from '@nestjs/graphql'
import { Entity, Column, PrimaryGeneratedColumn, Generated, OneToMany } from 'typeorm'
import { Job } from './Job'

@Entity({ name: 'users' })
@ObjectType()
export class User {
   @PrimaryGeneratedColumn('uuid')
   @Generated('uuid')
   @Field(() => String)
   id: string

   @Column()
   @Field()
   describe_name: string

   @Column()
   @Field(() => String, { nullable: true })
   describe_date?: string

   @Column()
   @Field({ nullable: true })
   describe_specialization?: string

   @Column()
   @Field({ nullable: true })
   describe_position?: string

   @Column()
   @Field()
   describe_role: string

   @Column()
   @Field({ nullable: true })
   currentTask?: string

   @OneToMany(() => Job, (job) => job.user, { onDelete: 'CASCADE' })
   @Field(() => [Job])
   jobs: Job[]

   @Column()
   @Field()
   describe_password: string

   @Column({ nullable: true })
   @Field({ nullable: true, defaultValue: '' })
   mail: string
}
