'use server'
import globalConfig from '@/app.config'
import { cookies, headers } from 'next/headers'

import {
  ITimesheet,
  ITimesheetCreate,
  ITimesheetUpdate,
} from '@/types/timesheet'
import { IIndexResponse, IResponse } from '@/types/global'

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
  const formData = new FormData()

  formData.append('studentsId', timesheet.studentsId.toString())
  formData.append('classId', timesheet.classId.toString())
  formData.append('timeId', timesheet.timeId.toString())
  formData.append('date', timesheet.date)
  formData.append('ImageFile', timesheet.ImageFile) // Upload file
  formData.append('status', timesheet.status)
  if (timesheet.note) {
    formData.append('note', timesheet.note)
  }

  const response = await fetch(`${globalConfig.baseUrl}/timesheet/create`, {
    method: 'POST',
    headers: {
      Authorization:
        headers().get('Authorization') ||
        `Bearer ${cookies().get('accessToken')?.value || ' '}`,
    },
    body: formData, // Sử dụng FormData
  })

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

  const data = await response.json()

  return {
    ok: response.ok,
    ...data,
  } as IResponse
}
