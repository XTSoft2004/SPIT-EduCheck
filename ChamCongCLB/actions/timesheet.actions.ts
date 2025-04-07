'use server'
import globalConfig from '@/app.config'
import { cookies, headers } from 'next/headers'

import {
  ITimesheet,
  ITimesheetCreate,
  ITimesheetUpdate,
} from '@/types/timesheet'
import { IIndexResponse, IResponse } from '@/types/global'
import { revalidateTag } from 'next/cache'

export const getTimesheets = async (
  search: string = '',
  pageNumber: number = -1,
  pageSize: number = -1,
) => {
  const response = await fetch(
    `${globalConfig.baseUrl}/timesheet?search=${search}&pageNumber=${pageNumber}&pageSize=${pageSize}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          headers().get('Authorization') ||
          `Bearer ${cookies().get('accessToken')?.value || ' '}`,
      },
      next: {
        tags: ['timesheet.index'],
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

export const createTimesheet = async (timesheet: ITimesheetCreate) => {
  const response = await fetch(`${globalConfig.baseUrl}/timesheet/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization:
        headers().get('Authorization') ||
        `Bearer ${cookies().get('accessToken')?.value || ' '}`,
    },
    body: JSON.stringify(timesheet), // Sử dụng FormData
  })
  revalidateTag('timesheet.index')
  revalidateTag('timesheet.show')

  const data = await response.json()
  return {
    ok: response.ok,
    ...data,
  } as IResponse
}

export const updateTimesheet = async (timesheet: ITimesheetUpdate) => {
  const response = await fetch(
    `${globalConfig.baseUrl}/timesheet/${timesheet.id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          headers().get('Authorization') ||
          `Bearer ${cookies().get('accessToken')?.value || ' '}`,
      },
      body: JSON.stringify(timesheet),
    },
  )
  revalidateTag('timesheet.index')
  revalidateTag('timesheet.show')

  const data = await response.json()
  return {
    ok: response.ok,
    ...data,
  } as IResponse
}

export const deleteTimesheet = async (timesheet: ITimesheet) => {
  const response = await fetch(
    `${globalConfig.baseUrl}/timesheet/${timesheet.id}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          headers().get('Authorization') ||
          `Bearer ${cookies().get('accessToken')?.value || ' '}`,
      },
    },
  )
  revalidateTag('timesheet.index')
  revalidateTag('timesheet.show')

  const data = await response.json()

  return {
    ok: response.ok,
    ...data,
  } as IResponse
}
