'use server'
import { cookies, headers } from 'next/headers'
import globalConfig from '@/app.config'

import {
  IStudent,
  IStudentData,
  IStudentCreate,
  IStudentUpdate,
  IStudentAdd,
  IStudentRemove,
} from '@/types/student.d'
import { IIndexResponse, IResponse } from '@/types/global'
import { revalidateTag } from 'next/cache'

const baseUrl = globalConfig.baseUrl

/**
 * Get all students
 * @returns List of students
 */
export const getStudents = async () => {
  const response = await fetch(`${baseUrl}/student`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization:
        headers().get('Authorization') ||
        `Bearer ${cookies().get('accessToken')?.value || ' '}`,
    },
    next: {
      tags: ['student.index'],
    },
  })

  const data = await response.json()

  return {
    ok: response.ok,
    status: response.status,
    ...data,
  } as IIndexResponse<IStudent>
}

export const getStudents123 = async () => {
  const response = await fetch(`${baseUrl}/student`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization:
        headers().get('Authorization') ||
        `Bearer ${cookies().get('accessToken')?.value || ' '}`,
    },
    next: {
      tags: ['student.index'],
    },
  })

  const data = await response.json()

  return {
    ok: response.ok,
    status: response.status,
    ...data,
  } as IIndexResponse<IStudentData>
}

/**
 * Create student
 * @param formData Student data
 * @returns Created student
 */
export const createStudent = async (formData: IStudentCreate) => {
  const response = await fetch(`${baseUrl}/student/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization:
        headers().get('Authorization') ||
        `Bearer ${cookies().get('accessToken')?.value || ' '}`,
    },
    body: JSON.stringify(formData),
  })
  revalidateTag('student.index')
  revalidateTag('student.show')

  const data = await response.json()

  return {
    ok: response.ok,
    ...data,
  } as IResponse
}

/**
 * Update student
 * @param formData Student data
 * @returns Updated student
 */
export const updateStudent = async (formData: IStudentUpdate) => {
  const response = await fetch(`${baseUrl}/student/${formData.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization:
        headers().get('Authorization') ||
        `Bearer ${cookies().get('accessToken')?.value || ' '}`,
    },
    body: JSON.stringify(formData),
  })
  revalidateTag('student.index')
  revalidateTag('student.show')

  const data = await response.json()

  return {
    ok: response.ok,
    ...data,
  } as IResponse
}

/**
 * Delete student
 * @param id Student id
 * @returns Deleted student
 */
export const deleteStudent = async (id: number) => {
  const response = await fetch(`${baseUrl}/student/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization:
        headers().get('Authorization') ||
        `Bearer ${cookies().get('accessToken')?.value || ' '}`,
    },
  })
  revalidateTag('student.index')
  revalidateTag('student.show')

  const data = await response.json()

  return {
    ok: response.ok,
    ...data,
  } as IResponse
}

/**
 * Add student to user
 * @param formData Student data
 * @returns Added student
 */
export const addStudent = async (formData: IStudentAdd) => {
  const response = await fetch(
    `${baseUrl}/student/add-user?IdUser=${formData.idUser}&IdStudent=${formData.idStudent}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          headers().get('Authorization') ||
          `Bearer ${cookies().get('accessToken')?.value || ' '}`,
      },
      body: JSON.stringify(formData),
    },
  )
  revalidateTag('user.student.index')

  const data = await response.json()

  return {
    ok: response.ok,
    ...data,
  } as IResponse
}

/**
 * Remove student from user
 * @param student Student data
 * @returns Removed student
 */
export const removeStudent = async (student: IStudentRemove) => {
  const response = await fetch(
    `${baseUrl}/student/remove-user?IdUser=${student.idUser}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          headers().get('Authorization') ||
          `Bearer ${cookies().get('accessToken')?.value || ' '}`,
      },
      body: JSON.stringify(student),
    },
  )
  revalidateTag('user.student.index')

  const data = await response.json()

  return {
    ok: response.ok,
    ...data,
  } as IResponse
}
