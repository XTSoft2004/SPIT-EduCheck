'use server'
import globalConfig from '@/app.config'
import { cookies, headers } from 'next/headers'

import { ILecturer, ILecturerCreate, ILecturerUpdate } from '@/types/lecturer'
import { IIndexResponse, IResponse } from '@/types/global'
import { revalidateTag } from 'next/cache'

/**
 * Get leturer by search
 * @param search - The search string
 * @param page - The page number
 * @param pageSize - The page size
 * @returns List of lecturers
 */
export const getLecturers = async (
  search: string,
  page: number,
  pageSize: number,
) => {
  const response = await fetch(
    `${globalConfig.baseUrl}/lecturer?search=${search}&pageNumber=${page}&pageSize=${pageSize}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          headers().get('Authorization') ||
          `Bearer ${cookies().get('accessToken')?.value || ' '}`,
      },
      next: {
        tags: ['lecturer.index'],
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
 * Get all lecturers
 * @returns List of lecturers
 */
export const getAllLecturers = async () => {
  const response = await fetch(`${globalConfig.baseUrl}/lecturer`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization:
        headers().get('Authorization') ||
        `Bearer ${cookies().get('accessToken')?.value || ' '}`,
    },
    next: {
      tags: ['lecturer.indexAll'],
    },
  })

  const data = await response.json()
  return {
    ok: response.ok,
    status: response.status,
    ...data,
  } as IIndexResponse<ILecturer>
}

/**
 * Create a new lecturer
 * @param formData - The lecturer to create
 * @returns The created lecturer
 */
export const createLecturer = async (formData: ILecturerCreate) => {
  const response = await fetch(`${globalConfig.baseUrl}/lecturer/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization:
        headers().get('Authorization') ||
        `Bearer ${cookies().get('accessToken')?.value || ' '}`,
    },
    body: JSON.stringify(formData),
  })
  revalidateTag('lecturer.index')
  revalidateTag('lecturer.show')

  const data = await response.json()

  return {
    ok: response.ok,
    ...data,
  } as IResponse
}

/**
 * Update a lecturer
 * @param formData - The lecturer to update
 * @returns The updated lecturer
 */
export const updateLecturer = async (formData: ILecturerUpdate) => {
  const response = await fetch(
    `${globalConfig.baseUrl}/lecturer/${formData.id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          headers().get('Authorization') ||
          `Bearer ${cookies().get('accessToken')?.value || ' '}`,
      },
      body: JSON.stringify(formData),
    },
  )
  revalidateTag('lecturer.index')
  revalidateTag('lecturer.show')

  const data = await response.json()

  return {
    ok: response.ok,
    ...data,
  } as IResponse
}

/**
 * Delete a lecturer
 * @param id - The id of the lecturer to delete
 * @returns The deleted lecturer
 */
export const deleteLecturer = async (id: number) => {
  const response = await fetch(`${globalConfig.baseUrl}/lecturer/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization:
        headers().get('Authorization') ||
        `Bearer ${cookies().get('accessToken')?.value || ' '}`,
    },
  })
  revalidateTag('lecturer.index')
  revalidateTag('lecturer.show')

  const data = await response.json()

  return {
    ok: response.ok,
    ...data,
  } as IResponse
}
