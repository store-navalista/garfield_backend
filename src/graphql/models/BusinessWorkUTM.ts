import { Field, Float, ObjectType } from '@nestjs/graphql'
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
import { CurrencyType, WorkCompanyType } from '../constants/enums'

@Entity({ name: 'business_works_utm' })
@ObjectType()
export class BusinessWorkUTM {
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

   @Column({ type: 'numeric' })
   @Field(() => Float)
   rate_usd_currency: number

   @Column()
   @Field(() => CurrencyType)
   agreement_currency: CurrencyType

   @Column()
   @Field(() => String)
   executor: string

   @Column({ type: 'numeric' })
   @Field(() => Float)
   coef_usd: number

   @Column()
   @Field(() => String)
   work_status: string

   @Column({ type: 'numeric' })
   @Field(() => Float)
   agreement_cost_utm_currency: number

   @Column({ type: 'numeric' })
   @Field(() => Float)
   agreement_cost_supervision_currency: number

   @Column({ type: 'numeric' })
   @Field(() => Float)
   utm_extra_day_cost_currency: number

   @Column()
   @Field(() => String)
   day_utm_started: string

   @Column()
   @Field(() => String)
   day_utm_finished: string

   @Column()
   @Field(() => String)
   day_supervision_started: string

   @Column()
   @Field(() => String)
   day_supervision_finished: string

   @Column()
   @Field(() => String)
   day_extra_days_started: string

   @Column()
   @Field(() => String)
   day_extra_days_finished: string

   @Column({ type: 'numeric' })
   @Field(() => Float)
   travelling_expenses_currency: number

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
   supervision_cost_total_currency: number

   @Column({ type: 'numeric' })
   @Field(() => Float)
   extra_days_cost_total_currency: number

   @Column({ type: 'numeric' })
   @Field(() => Float)
   total_cost_with_currency: number

   @Column({ type: 'numeric' })
   @Field(() => Float)
   total_cost_with_expenses_currency: number

   @Column({ type: 'numeric' })
   @Field(() => Float)
   salary: number

   // @Column({ type: 'numeric' })
   // @Field(() => Float)
   // salary_with_expenses: number

   // @Column({ type: 'numeric' })
   // @Field(() => Float)
   // navalista_profit_currency: number

   // @Column({ type: 'numeric' })
   // @Field(() => Float)
   // navalista_profit: number

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
      return obj instanceof BusinessWorkUTM || 'utmSpecificField' in obj
   }
}
