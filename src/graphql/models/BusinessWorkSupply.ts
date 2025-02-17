import { Field, Float, ObjectType } from '@nestjs/graphql'
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
import { CurrencyType, WorkCompanyType } from '../constants/enums'

@Entity({ name: 'business_works_supply' })
@ObjectType()
export class BusinessWorkSupply {
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
   @Field(() => String)
   executor: string

   @Column()
   @Field(() => CurrencyType)
   agreement_currency: CurrencyType

   @Column({ type: 'numeric' })
   @Field(() => Float)
   coef_usd: number

   @Column()
   @Field(() => String)
   work_status: string

   @Column({ type: 'numeric' })
   @Field(() => Float)
   contract_price_currency: number

   @Column({ type: 'numeric' })
   @Field(() => Float)
   price_for_supplier: number

   @Column({ type: 'numeric' })
   @Field(() => Float)
   margin: number

   @Column({ type: 'numeric' })
   @Field(() => Float)
   expected_expenses: number

   @Column({ type: 'numeric' })
   @Field(() => Float)
   delivery_expenses: number

   @Column({ type: 'numeric' })
   @Field(() => Float)
   expected_commission: number

   @Column()
   @Field(() => String)
   date_started: string

   @Column({ type: 'numeric' })
   @Field(() => Float)
   advance_payment: number

   @Column()
   @Field(() => String)
   invoice_no: string

   @Column()
   @Field(() => String)
   date_paid: string

   @Column({ type: 'numeric' })
   @Field(() => Float)
   final_payment: number

   @Column()
   @Field(() => String)
   date_of_delivery: string

   static isTypeOf(obj: any) {
      return obj instanceof BusinessWorkSupply || 'supplySpecificField' in obj
   }
}
