import { CurrencyType, WorkCompanyType } from 'src/graphql/constants/enums'
import { BusinessWorkDesign } from 'src/graphql/models/BusinessWorkDesign'
import { v4 as UUID } from 'uuid'

export type WorksTypes = 'design' | 'engineering' | 'supply' | 'utm'

export const newWork = (type: WorksTypes) => {
   const base = {
      id: UUID(),
      work_number: 0,
      name_of_vessel: '--name of vessel--',
      name_of_work: '',
      agreement_currency: 'USD' as CurrencyType,
      name_of_company: '',
      name_of_company_locale: 'EXTERNAL' as WorkCompanyType,
      rate_usd_currency: 0,
      coef_usd: 0,
      work_status: 'PLANNED'
   }

   const work = {
      design: {
         ...base,
         salary_usd: 0,
         travelling_expenses_currency: 0,
         outsourcing_approval_expenses_currency: 0,
         bakshish_currency: 0,
         estimated_working_hours: 0,
         agreement_cost_currency: 0,
         start_of_work: '',
         end_of_work: '',
         contractor: '',
         invoice_no: '',
         payment_sum: 0,
         date_paid: '',
         actual_working_hours: 0
      } as BusinessWorkDesign,

      engineering: {
         ...base,
         agreement_cost_currency: 0,
         executer: '',
         agreement_cost_of_work_day_person_currency: 0,
         extra_day_cost_day_person_currency: 0,
         day_started: '',
         day_finished: '',
         // day_extra_days_started: =>
         day_extra_days_finished: '',
         travelling_days_currency: 0,
         accomodation_expenses_currency: 0,
         other_expenses_currency: 0,
         bakshish_currency: 0,
         total_cost_currency: 0,
         total_cost_with_expenses_currency: 0,
         salary: 0,
         salary_with_expenses: 0,
         navalista_profit_currency: 0,
         navalista_profit: '',
         contractor: '',
         invoice_no: '',
         payment_sum: 0,
         date_paid: ''
      },
      supply: {
         ...base,
         executer: '',
         rate_usd_currency: 0,
         coef_usd: 0,
         work_status: '',
         contract_price_currency: 0,
         price_for_supplier: 0,
         margin: 0,
         expected_expenses: 0,
         delivery_expenses: 0,
         expected_commission: 0,
         date_started: '',
         advance_payment: 0,
         advance_invoice_no: '',
         advance_date_paid: '',
         final_payment: 0,
         final_invoice_no: '',
         final_date_paid: '',
         date_of_delivery: ''
      },
      utm: {
         ...base,
         executer: '',
         rate_usd_currency: 0,
         coef_usd: 0,
         work_status: ''
      }
   }

   return work[type]
}
