export interface IUser {
  id: number
  username: string
  isLocked: boolean
  isVerify: boolean
  roleName: string
  semesterId: number
  studentName: string
  avatarUrl: string
}

interface IUserProfile {
  id: number
  username: string
  roleName: string
  semesterId: number
  studentName: string
  expiryDate: string
}

export interface IUserFilter {
  pageNumber: number
  pageSize: number
}

export interface IUserSearch {
  id: number
}

export interface IUserUpdate {
  oldPassword: string
  password: string
  confirmPassword: string
}

export interface IUserCreate {
  username: string
  password: string
}

export interface IUserChangePassword {
  userId: number
  passwordNew: string
}

interface IInfoUser {
  id: number
  maSinhVien: string
  firstName: string
  lastName: string
  class: string
  phoneNumber: string
  email: string
  gender: null
  dob: string
  urlAvatar: null
  userName: null
}

interface IInfoUpdate {
  firstName: string
  lastName: string
  class: string
  phoneNumber: string
  email: string
  gender: boolean
  dob: string
}

interface IAvatarUpdate {
  imageBase64: string
}
