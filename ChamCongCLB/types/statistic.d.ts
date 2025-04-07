export interface IStatisticInfo {
  numberStudent: number
  numberTimesheet: number
  topTimesheetStudentName: string
}

export interface IStatisticClass {
  className: string
  studentClasses: {
    studentName: string
    numberTimesheet: number
  }[]
}

interface IStatisticSalary {
  toltalSalary: number
  salaryInfoStudents: SalaryInfoStudent[]
}

interface SalaryInfoStudent {
  codeName: string
  studentName: string
  day: number
  salary: number
}
