import { Field, ObjectType } from '@nestjs/graphql'
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
import { CurrencyType, TypeExecutorEngineering } from '../constants/enums'

@Entity({ name: 'business_works_engineering' })
@ObjectType()
export class BusinessWorkEngineering {
   @PrimaryGeneratedColumn('uuid')
   @Field(() => String)
   id: string

   @Column()
   @Field(() => Number)
   work_number: number

   @Column()
   @Field(() => String)
   name_of_vessel: string

   @Column()
   @Field(() => String)
   name_of_work: string

   @Column()
   @Field(() => String)
   name_of_company: string

   @Column()
   @Field(() => String)
   name_of_company_locale: string

   @Column()
   @Field(() => CurrencyType)
   agreement_currency: CurrencyType

   @Column()
   @Field(() => TypeExecutorEngineering)
   executor: TypeExecutorEngineering

   @Column()
   @Field(() => Number)
   coef_usd: number

   @Column()
   @Field(() => Number)
   rate_usd_currency: number

   @Column()
   @Field(() => String)
   work_status: string

   @Column()
   @Field(() => Number)
   agreement_cost_currency: number

   @Column()
   @Field(() => Number)
   agreement_cost_of_work_day_person_currency: number

   @Column()
   @Field(() => Number)
   extra_day_cost_day_person_currency: number

   @Column()
   @Field(() => String)
   day_started: string

   @Column()
   @Field(() => String)
   day_finished: string

   @Column()
   @Field(() => String)
   day_extra_days_started: string

   @Column()
   @Field(() => String)
   day_extra_days_finished: string

   @Column()
   @Field(() => Number)
   travelling_days_currency: number

   @Column()
   @Field(() => Number)
   accomodation_expenses_currency: number

   @Column()
   @Field(() => Number)
   b: number

   @Column()
   @Field(() => Number)
   other_expenses_currency: number

   @Column()
   @Field(() => Number)
   bakshish_currency: number

   @Column()
   @Field(() => Number)
   total_cost_currency: number

   @Column()
   @Field(() => Number)
   total_cost_with_expenses_currency: number

   @Column()
   @Field(() => Number)
   salary: number

   @Column()
   @Field(() => Number)
   salary_with_expenses: number

   static isTypeOf(obj: any) {
      return obj instanceof BusinessWorkEngineering || 'engineeringSpecificField' in obj
   }
}
