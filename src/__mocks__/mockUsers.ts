const BODY = {
   employee: 'Otinov_AV',
   currentTask: 'ss',
   describe_name: 'Otinov Anton',
   describe_date: '02.03.1985',
   describe_specialization: 'Engineer',
   describe_position: 'Chief Engineer',
   describe_role: 'Employee',
   describe_password: 'asdadasa2342342',
   reports: [
      {
         period: 'January 2024',
         jobs: [
            {
               id: '3e96db28-65a9-4d8b-b8db-63d8b687255d',
               project_number: '234234',
               ship_name: 'DUEXE Third',
               job_description: 'DUEXE Third Description',
               hours_worked: [
                  2, 0, 0, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
               ]
            },
            {
               id: '3e96db28-65a9-4d8b-b8db-63d8b687255d',
               project_number: '234234',
               ship_name: 'DUEXE Third',
               job_description: 'DUEXE Third Description',
               hours_worked: [
                  2, 0, 0, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
               ]
            }
         ]
      }
   ]
}

const user = {
   id: '1111',
   ...BODY
}

const users = [
   user,
   {
      id: '1112',
      employee: 'Otinov_SV',
      ...BODY
   },
   {
      id: '1113',
      employee: 'Otinov_DV',
      ...BODY
   }
]

export const mockUsers = {
   user,
   users
}
