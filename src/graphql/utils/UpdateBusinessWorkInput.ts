import { Field, Float, InputType, PartialType } from '@nestjs/graphql'
import { CurrencyType, TypeExecutorEngineering, WorkCompanyType } from '../constants/enums'

@InputType()
class BaseUpdateBusinessWorkInput {
   @Field(() => String)
   id: string

   @Field(() => Number)
   work_number: number

   @Field(() => String)
   name_of_vessel: string

   @Field(() => String)
   name_of_work: string

   @Field(() => Float)
   rate_usd_currency: number

   @Field(() => CurrencyType)
   agreement_currency: CurrencyType

   @Field(() => String)
   name_of_company: string

   @Field(() => WorkCompanyType)
   name_of_company_locale: WorkCompanyType

   @Field(() => Float)
   coef_usd: number

   @Field(() => String)
   work_status: string

   @Field(() => Float)
   salary_usd: number

   @Field(() => Float)
   travelling_expenses_currency: number

   @Field(() => Float)
   outsourcing_approval_expenses_currency: number

   @Field(() => Float)
   bakshish_currency: number

   @Field(() => Float)
   estimated_working_hours: number

   @Field(() => Float)
   agreement_cost_currency: number

   @Field(() => String)
   start_of_work: string

   @Field(() => String)
   end_of_work: string

   @Field(() => String)
   contractor: string

   @Field(() => String)
   invoice_no: string

   @Field(() => Number)
   payment_sum: number

   @Field(() => String)
   date_paid: string

   @Field(() => Float)
   actual_working_hours: number

   @Field(() => TypeExecutorEngineering)
   executor: TypeExecutorEngineering

   @Field(() => Float)
   agreement_cost_of_work_day_person_currency: number

   @Field(() => Float)
   extra_day_cost_day_person_currency: number

   @Field(() => String)
   day_started: string

   @Field(() => String)
   day_finished: string

   // @Column()
   // @Field(() => String)
   // day_extra_days_started: string

   // @Column()
   // @Field(() => String)
   // day_extra_days_finished: string

   @Field(() => Float)
   travelling_days_currency: number

   @Field(() => Float)
   accomodation_expenses_currency: number

   @Field(() => Float)
   other_expenses_currency: number

   @Field(() => Float)
   salary: number
}

@InputType()
export class UpdateBusinessWorkInput extends PartialType(BaseUpdateBusinessWorkInput) {}
