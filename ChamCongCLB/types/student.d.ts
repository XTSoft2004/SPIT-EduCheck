export interface IStudent {
  id: number
  maSinhVien: string
  firstName: string
  lastName: string
  class: string
  phoneNumber: string
  email: string
  gender: boolean
  dob: Date
  urlAvatar: string
  userName: string
}

export interface IStudentFilter {
  pageNumber: number
  pageSize: number
}

export interface IStudentCreate {
  id: number
  maSinhVien: string
  firstName: string
  lastName: string
  class: string
  phoneNumber: string
  email: string
  gender: boolean
  dob: Date
}

export interface IStudentUpdate {
  id?: number
  maSinhVien?: string
  firstName?: string
  lastName?: string
  class?: string
  phoneNumber?: string
  email?: string
  gender?: true
  dob?: Date
}

export interface IStudentAdd {
  idUser: string
  idStudent: string
}

export interface IStudentRemove {
  idUser: string
}
