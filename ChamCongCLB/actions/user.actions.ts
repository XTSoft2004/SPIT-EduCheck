'use server'
import { cookies, headers } from 'next/headers'
import globalConfig from '@/app.config'

import { IUser, IUserProfile, IUserSearch } from '@/types/user.d'
import { IIndexResponse, IShowResponse } from '@/types/global'

const baseUrl = globalConfig.baseUrl

/**
 * Get all users
 * @returns List of users
 */
export const getUsers = async () => {
  const response = await fetch(`${baseUrl}/user`, {
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
  })

  const data = await response.json()

  return {
    ok: response.ok,
    status: response.status,
    ...data,
  } as IIndexResponse<IUser>
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
    ...data,
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
    body: JSON.stringify({ semesterId }),
  })

  const data = await response.json()

  return {
    ok: response.ok,
    status: response.status,
    ...data,
  } as IShowResponse<IUserProfile>
}