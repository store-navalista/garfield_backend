import { Field, Float, ObjectType } from '@nestjs/graphql'
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
import { CurrencyType, TypeExecutorEngineering, WorkCompanyType } from '../constants/enums'

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
   @Field(() => WorkCompanyType)
   name_of_company_locale: WorkCompanyType

   @Column()
   @Field(() => TypeExecutorEngineering)
   executor: TypeExecutorEngineering

   @Column()
   @Field(() => CurrencyType)
   agreement_currency: CurrencyType

   @Column({ type: 'numeric' })
   @Field(() => Float)
   rate_usd_currency: number

   @Column({ type: 'numeric' })
   @Field(() => Float)
   coef_usd: number

   @Column()
   @Field(() => String)
   work_status: string

   @Column({ type: 'numeric' })
   @Field(() => Float)
   agreement_cost_currency: number

   @Column({ type: 'numeric' })
   @Field(() => Float)
   agreement_cost_of_work_day_person_currency: number

   @Column({ type: 'numeric' })
   @Field(() => Float)
   extra_day_cost_day_person_currency: number

   @Column()
   @Field(() => String)
   day_started: string

   @Column()
   @Field(() => String)
   day_finished: string

   // @Column()
   // @Field(() => String)
   // day_extra_days_started: string

   // @Column()
   // @Field(() => String)
   // day_extra_days_finished: string

   @Column({ type: 'numeric' })
   @Field(() => Float)
   travelling_days_currency: number

   @Column({ type: 'numeric' })
   @Field(() => Float)
   accomodation_expenses_currency: number

   @Column({ type: 'numeric' })
   @Field(() => Float)
   other_expenses_currency: number

   @Column({ type: 'numeric' })
   @Field(() => Float)
   bakshish_currency: number

   @Column({ type: 'numeric' })
   @Field(() => Float)
   salary: number

   @Column()
   @Field(() => String)
   contractor: string

   @Column()
   @Field(() => String)
   invoice_no: string

   @Column({ type: 'numeric' })
   @Field(() => Float)
   payment_sum: number

   @Column()
   @Field(() => String)
   date_paid: string

   static isTypeOf(obj: any) {
      return obj instanceof BusinessWorkEngineering || 'engineeringSpecificField' in obj
   }
}
