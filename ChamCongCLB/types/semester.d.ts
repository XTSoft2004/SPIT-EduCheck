export interface ISemester {
  id: number
  semesters_Number: number
  yearStart: number
  yearEnd: number
}

export interface ISemesterFilter {
  pageNumber: number
  pageSize: number
}

export interface ISemesterCreate {
  semesters_Number: number
  yearStart: number
  yearEnd: number
}

export interface ISemesterUpdate {
  id: number
  semesters_Number?: number
  yearStart: number
  yearEnd: number
}
