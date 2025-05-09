'use server'
import { cookies, headers } from 'next/headers'
import globalConfig from '@/app.config'

import {
  IUser,
  IUserChangePassword,
  IUserProfile,
  IUserSearch,
  IUserUpdate,
} from '@/types/user.d'
import { IIndexResponse, IShowResponse } from '@/types/global'
import { revalidateTag } from 'next/cache'

const baseUrl = globalConfig.baseUrl

/**
 * Get all users
 * @returns List of users
 */
export const getUsers = async (
  search: string = '',
  page: number = -1,
  pageSize: number = -1,
) => {
  const response = await fetch(
    `${baseUrl}/user?search=${search}&pageNumber=${page}&pageSize=${pageSize}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          headers().get('Authorization') ||
          `Bearer ${cookies().get('accessToken')?.value || ' '}`,
      },
      next: {
        tags: ['user.index'],
      },
    },
  )

  const data = await response.json()

  return {
    ok: response.ok,
    status: response.status,
    data: data.data,
    total: data.totalRecords,
  }
}

/**
 * Get me
 * @returns User
 */
export const getMe = async () => {
  const response = await fetch(`${baseUrl}/user/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization:
        headers().get('Authorization') ||
        `Bearer ${cookies().get('accessToken')?.value || ' '}`,
    },
    next: {
      tags: ['user.me'],
    },
  })
  const data = await response.json()

  return {
    ok: response.ok,
    status: response.status,
    data: {
      ...data,
    },
  } as IShowResponse<IUser>
}

export const getProfile = async () => {
  const response = await fetch(`${baseUrl}/user/profile`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization:
        headers().get('Authorization') ||
        `Bearer ${cookies().get('accessToken')?.value || ' '}`,
    },
    next: {
      tags: ['user.profile'],
    },
  })

  const data = await response.json()

  return {
    ok: response.ok,
    status: response.status,
    data: {
      ...data,
    },
  } as IShowResponse<IUserProfile>
}

/**
 * Get user by id
 * @param search - Search to apply
 * @returns User
 */
export const getUserById = async (search: IUserSearch) => {
  const response = await fetch(`${baseUrl}/user/${search.id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization:
        headers().get('Authorization') ||
        `Bearer ${cookies().get('accessToken')?.value || ' '}`,
    },
    next: {
      tags: ['user.search'],
    },
  })

  const data = await response.json()

  return {
    ok: response.ok,
    status: response.status,
    ...data,
  } as IIndexResponse<IUser>
}

/**
 * Set semesterId in user profile
 * @param semesterId - Semester id to set
 * @returns User profile
 */
export const setSemesterId = async (semesterId: number) => {
  const response = await fetch(`${baseUrl}/user/set-semester/${semesterId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization:
        headers().get('Authorization') ||
        `Bearer ${cookies().get('accessToken')?.value || ' '}`,
    },
  })

  const data = await response.json()

  return {
    ok: response.ok,
    status: response.status,
    message: data.message,
    data: {
      ...data,
    },
  } as IShowResponse<IUserProfile>
}

export const changePassword = async (formData: IUserUpdate) => {
  const response = await fetch(`${baseUrl}/user/change-password`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization:
        headers().get('Authorization') ||
        `Bearer ${cookies().get('accessToken')?.value || ' '}`,
    },
    body: JSON.stringify(formData),
  })

  const data = await response.json()

  return {
    ok: response.ok,
    status: response.status,
    message: data.message,
    data: {
      ...data,
    },
  } as IShowResponse<IUserProfile>
}

export const banUser = async (idUser: number) => {
  const response = await fetch(
    `${baseUrl}/user/ban-account/?IdUser=${idUser}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          headers().get('Authorization') ||
          `Bearer ${cookies().get('accessToken')?.value || ' '}`,
      },
    },
  )

  const data = await response.json()

  return {
    ok: response.ok,
    status: response.status,
    message: data.message,
    data: {
      ...data,
    },
  } as IShowResponse<IUserProfile>
}

export const changePasswordByAdmin = async (formData: IUserChangePassword) => {
  const response = await fetch(`${baseUrl}/user/change-password-admin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization:
        headers().get('Authorization') ||
        `Bearer ${cookies().get('accessToken')?.value || ' '}`,
    },
    body: JSON.stringify(formData),
  })

  const data = await response.json()

  return {
    ok: response.ok,
    status: response.status,
    message: data.message,
    data: {
      ...data,
    },
  } as IShowResponse<IUserProfile>
}
