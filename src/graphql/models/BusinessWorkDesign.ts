import { Field, Float, ObjectType } from '@nestjs/graphql'
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
import { CurrencyType, WorkCompanyType } from '../constants/enums'

@Entity({ name: 'business_works_design' })
@ObjectType()
export class BusinessWorkDesign {
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

   @Column({ type: 'numeric' })
   @Field(() => Float)
   rate_usd_currency: number

   @Column()
   @Field(() => CurrencyType)
   agreement_currency: CurrencyType

   @Column()
   @Field(() => String)
   name_of_company: string

   @Column()
   @Field(() => WorkCompanyType)
   name_of_company_locale: WorkCompanyType

   @Column({ type: 'numeric' })
   @Field(() => Float)
   coef_usd: number

   @Column()
   @Field(() => String)
   work_status: string

   @Column({ type: 'numeric' })
   @Field(() => Float)
   salary_usd: number

   @Column({ type: 'numeric' })
   @Field(() => Float)
   travelling_expenses_currency: number

   @Column({ type: 'numeric' })
   @Field(() => Float)
   outsourcing_approval_expenses_currency: number

   @Column({ type: 'numeric' })
   @Field(() => Float)
   bakshish_currency: number

   @Column({ type: 'numeric' })
   @Field(() => Float)
   estimated_working_hours: number

   @Column({ type: 'numeric' })
   @Field(() => Float)
   agreement_cost_currency: number

   @Column()
   @Field(() => String)
   start_of_work: string

   @Column()
   @Field(() => String)
   end_of_work: string

   @Column()
   @Field(() => String)
   contractor: string

   @Column()
   @Field(() => String)
   invoice_no: string

   @Column()
   @Field(() => Number)
   payment_sum: number

   @Column()
   @Field(() => String)
   date_paid: string

   @Column({ type: 'numeric' })
   @Field(() => Float)
   actual_working_hours: number

   static isTypeOf(obj: any) {
      return obj instanceof BusinessWorkDesign || 'designSpecificField' in obj
   }
}
