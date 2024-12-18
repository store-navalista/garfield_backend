import { registerEnumType } from '@nestjs/graphql'

export enum UserRole {
   CTO = 'CTO',
   DeputyCTO = 'DeputyCTO',
   Employee = 'Employee',
   Moderator = 'Moderator'
}

export enum CurrencyType {
   USD = 'USD',
   UAH = 'UAH',
   EUR = 'EUR'
}

export enum WorkStatusType {
   UNDER_REVIEW = 'UNDER REVIEW',
   IN_PROGRESS = 'IN PROGRESS',
   DONE = 'DONE',
   CANCEL = 'CANCEL',
   PLANNED = 'PLANNED'
}

export enum WorkCompanyType {
   EXTERNAL = 'EXTERNAL',
   INTERNAL = 'INTERNAL'
}

export enum TypeExecutorEngineering {
   'empty' = '--empty--',
   'ROK_AJ' = 'ROK // AJ',
   'ROK_OOV' = 'ROK // OOV',
   'OOV_AJ' = 'OOV // AJ',
   'AOV' = 'AOV',
   'DVC' = 'DVC',
   'IS' = 'IS',
   'SB' = 'SB',
   'VSH' = 'VSH',
   'ROK' = 'ROK',
   'AJ' = 'AJ',
   'OOV' = 'OOV'
}

export enum FilterTypes {
   work_number = 'work_number',
   name_of_vessel = 'name_of_vessel',
   name_of_work = 'name_of_work'
}

registerEnumType(UserRole, {
   name: 'UserRole',
   description: 'Roles for system users'
})

registerEnumType(CurrencyType, {
   name: 'CurrencyType',
   description: 'Supported currencies'
})

registerEnumType(WorkStatusType, {
   name: 'WorkStatusType',
   description: 'Possible statuses for work'
})

registerEnumType(WorkCompanyType, {
   name: 'WorkCompanyType',
   description: 'Company types involved in work'
})

registerEnumType(TypeExecutorEngineering, {
   name: 'TypeExecutorEngineering',
   description: 'Types of engineering executors'
})

registerEnumType(FilterTypes, {
   name: 'FilterTypes',
   description: 'FilterTypes for filter works'
})
