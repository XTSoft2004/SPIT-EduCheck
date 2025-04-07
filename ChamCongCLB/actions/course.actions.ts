'use server'
import globalConfig from '@/app.config'
import { cookies, headers } from 'next/headers'

import { ICourse, ICourseCreate, ICourseUpdate } from '@/types/course'
import { IIndexResponse, IResponse } from '@/types/global'
import { revalidateTag } from 'next/cache'

export const getAllCourses = async () => {
  const response = await fetch(`${globalConfig.baseUrl}/course`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization:
        headers().get('Authorization') ||
        `Bearer ${cookies().get('accessToken')?.value || ' '}`,
    },
    next: {
      tags: ['course.indexAll'],
    },
  })

  const data = await response.json()

  return {
    ok: response.ok,
    status: response.status,
    ...data,
  } as IIndexResponse<ICourse>
}

/**
 * Get course by search
 * @param search - The search string
 * @param page - The page number
 * @param pageSize - The page size
 * @returns List of courses
 */
export const getCourses = async (
  search: string = '',
  page: number = -1,
  pageSize: number = -1,
) => {
  const response = await fetch(
    `${globalConfig.baseUrl}/course?search=${search}&pageNumber=${page}&pageSize=${pageSize}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          headers().get('Authorization') ||
          `Bearer ${cookies().get('accessToken')?.value || ' '}`,
      },
      next: {
        tags: ['course.index'],
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

export const createCourse = async (course: ICourseCreate) => {
  const response = await fetch(`${globalConfig.baseUrl}/course/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization:
        headers().get('Authorization') ||
        `Bearer ${cookies().get('accessToken')?.value || ' '}`,
    },
    body: JSON.stringify(course),
  })
  revalidateTag('course.index')
  revalidateTag('course.show')

  const data = await response.json()

  return {
    ok: response.ok,
    ...data,
  } as IResponse
}

export const updateCourse = async (course: ICourseUpdate) => {
  const response = await fetch(`${globalConfig.baseUrl}/course/${course.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization:
        headers().get('Authorization') ||
        `Bearer ${cookies().get('accessToken')?.value || ' '}`,
    },
    body: JSON.stringify(course),
  })
  revalidateTag('course.index')
  revalidateTag('course.show')

  const data = await response.json()

  return {
    ok: response.ok,
    ...data,
  } as IResponse
}

export const deleteCourse = async (id: number) => {
  const response = await fetch(`${globalConfig.baseUrl}/course/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization:
        headers().get('Authorization') ||
        `Bearer ${cookies().get('accessToken')?.value || ' '}`,
    },
  })
  revalidateTag('course.index')
  revalidateTag('course.show')

  const data = await response.json()

  return {
    ok: response.ok,
    ...data,
  } as IResponse
}
