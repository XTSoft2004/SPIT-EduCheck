export interface IUser {
  id: number
  username: string
  isLocked: boolean
  isVerify: boolean
  roleName: string
  semesterId: number
  studentName: string
}

interface IUserProfile {
  id: number
  username: string
  roleName: string
  semesterId: number
  expiryDate: string
}

export interface IUserFilter {
  pageNumber: number
  pageSize: number
}

export interface IUserSearch {
  id: number
}

export interface IUSerUpdate {
  oldPassword: string
  password: string
  confirmPassword: string
}

export interface IUserCreate {
  username: string
  password: string
}
