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