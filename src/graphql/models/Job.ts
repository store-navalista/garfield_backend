import { Field, Float, ObjectType } from '@nestjs/graphql'
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './User'

@Entity({ name: 'job' })
@ObjectType()
export class Job {
   @PrimaryGeneratedColumn('increment')
   @Field()
   id: number

   @Column()
   @Field({ nullable: true })
   ship_name: string

   @Column()
   @Field({ nullable: true })
   job_description: string

   @Column()
   @Field({ nullable: true })
   project_number: string

   @Column('double precision', { array: true })
   @Field(() => [Float], { nullable: true })
   hours_worked: number[]

   @Column()
   @Field({ nullable: true })
   report_period: string

   @Column()
   @Field()
   order: number

   @Column({ nullable: true })
   @Field({ nullable: true, defaultValue: '' })
   notes: string

   @ManyToOne(() => User)
   @JoinColumn({ name: 'user_id' })
   @Field(() => User)
   user: User
}
