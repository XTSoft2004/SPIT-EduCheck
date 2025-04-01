'use server'
import globalConfig from '@/app.config'
import { cookies, headers } from 'next/headers'

import { ISemester, ISemesterCreate, ISemesterUpdate } from '@/types/semester'
import { IIndexResponse, IResponse } from '@/types/global'
import { revalidateTag } from 'next/cache'

export const getSemesters = async (
  search: string = '',
  pageIndex: number = -1,
  pageSize: number = -1,
) => {
  const response = await fetch(
    `${globalConfig.baseUrl}/semester?search=${search}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          headers().get('Authorization') ||
          `Bearer ${cookies().get('accessToken')?.value || ' '}`,
      },
      next: {
        tags: ['semester.index'],
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

export const createSemester = async (semester: ISemesterCreate) => {
  const response = await fetch(`${globalConfig.baseUrl}/semester/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization:
        headers().get('Authorization') ||
        `Bearer ${cookies().get('accessToken')?.value || ' '}`,
    },
    body: JSON.stringify(semester),
  })

  revalidateTag('semester.index')
  revalidateTag('semester.show')

  const data = await response.json()
  return {
    ok: response.ok,
    ...data,
  } as IResponse
}

export const updateSemester = async (semester: ISemesterUpdate) => {
  const response = await fetch(
    `${globalConfig.baseUrl}/semester/${semester.id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          headers().get('Authorization') ||
          `Bearer ${cookies().get('accessToken')?.value || ' '}`,
      },
      body: JSON.stringify(semester),
    },
  )
  revalidateTag('semester.index')
  revalidateTag('semester.show')

  const data = await response.json()

  return {
    ok: response.ok,
    ...data,
  } as IResponse
}

export const deleteSemester = async (id: number) => {
  const response = await fetch(`${globalConfig.baseUrl}/semester/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization:
        headers().get('Authorization') ||
        `Bearer ${cookies().get('accessToken')?.value || ' '}`,
    },
  })
  revalidateTag('semester.index')
  revalidateTag('semester.show')

  const data = await response.json()

  return {
    ok: response.ok,
    ...data,
  } as IResponse
}
