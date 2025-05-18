export interface IStatisticInfo {
  numberStudent: number
  numberTimesheet: number
  topTimesheetStudentName: string
  numberTimesheetDay: number
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
  idName: number
  codeName: string
  studentName: string
  day: number
  salary: number
}
