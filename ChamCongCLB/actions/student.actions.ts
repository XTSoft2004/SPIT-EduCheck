'use server';
import { cookies, headers } from 'next/headers';
import globalConfig from '@/app.config';

import { IStudent, IStudentCreate, IStudentUpdate, IStudentAdd, IStudentRemove } from '@/types/student.d';
import { IIndexResponse } from '@/types/global';

const baseUrl = globalConfig.baseUrl;

/**
 * Get all students
 * @returns List of students
 */
export const getStudents = async () => {
    const response = await fetch(`${baseUrl}/student`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: headers().get('Authorization') || `Bearer ${cookies().get('accessToken')?.value || ' '}`,
        },
        next:
        {
            tags: ['student.index']
        }
    });

    const data = await response.json();

    return {
        ok: response.ok,
        status: response.status,
        ...data,
    } as IIndexResponse<IStudent>
}

/**
 * Create student
 * @param student Student data
 * @returns Created student
 */
export const createStudent = async (student: IStudentCreate) => {
    const response = await fetch(`${baseUrl}/student/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: headers().get('Authorization') || `Bearer ${cookies().get('accessToken')?.value || ' '}`,
        },
        body: JSON.stringify(student),
        next:
        {
            tags: ['student.create']
        }
    });

    const data = await response.json();

    return {
        ok: response.ok,
        status: response.status,
        ...data,
    } as IStudent;
}

/**
 * Update student
 * @param student Student data
 * @returns Updated student
 */
export const updateStudent = async (student: IStudentUpdate) => {
    const response = await fetch(`${baseUrl}/student/${student.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: headers().get('Authorization') || `Bearer ${cookies().get('accessToken')?.value || ' '}`,
        },
        body: JSON.stringify(student),
        next:
        {
            tags: ['student.update']
        }
    });

    const data = await response.json();

    return {
        ok: response.ok,
        status: response.status,
        ...data,
    } as IStudent;
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
            Authorization: headers().get('Authorization') || `Bearer ${cookies().get('accessToken')?.value || ' '}`,
        },
        next:
        {
            tags: ['student.delete']
        }
    });

    const data = await response.json();

    return {
        ok: response.ok,
        status: response.status,
        ...data,
    } as IStudent;
}

/**
 * Add student to user
 * @param student Student data
 * @returns Added student
 */
export const addStudent = async (student: IStudentAdd) => {
    const response = await fetch(`${baseUrl}/student/add-user?IdUser=${student.idUser}&IdStudent=${student.idStudent}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: headers().get('Authorization') || `Bearer ${cookies().get('accessToken')?.value || ' '}`,
        },
        body: JSON.stringify(student),
        next:
        {
            tags: ['student.add']
        }
    });

    const data = await response.json();

    return {
        ok: response.ok,
        status: response.status,
        ...data,
    } as IStudent;
}

/**
 * Remove student from user
 * @param student Student data
 * @returns Removed student
 */
export const removeStudent = async (student: IStudentRemove) => {
    const response = await fetch(`${baseUrl}/student/remove-user?IdUser=${student.idUser}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: headers().get('Authorization') || `Bearer ${cookies().get('accessToken')?.value || ' '}`,
        },
        body: JSON.stringify(student),
        next:
        {
            tags: ['student.remove']
        }
    });

    const data = await response.json();

    return {
        ok: response.ok,
        status: response.status,
        ...data,
    } as IStudent;
}