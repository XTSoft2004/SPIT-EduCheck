export interface ITimesheet {
  id: number
  studentsId: number
  classId: number
  timeId: number
  date: string
  image_Check: string
  status: string
  note: string
}

export interface ITimesheetFilter {
  pageNumber: number
  pageSize: number
}

export interface ITimesheetCreate {
  studentsId: number
  classId: number
  timeId: number
  date: string
  image_Check: string
  status: string
  note?: string
}

export interface ITimesheetUpdate {
  id: number
  studentsId?: number
  classId?: number
  timeId?: number
  date?: string
  image_Check?: string
  status?: string
  note?: string
}
