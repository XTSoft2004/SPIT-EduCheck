'use server'
import globalConfig from "@/app.config";
import { cookies, headers } from 'next/headers';

import { ILecturer, ILecturerCreate, ILecturerFilter, ILecturerUpdate } from "@/types/lecturer";
import { IIndexResponse } from "@/types/global";
/**
 * Get all lecturers
 * @param filter - Filter to search for lecturers
 * @returns List of lecturers
 */
export const getLecturersPagination = async (filter: ILecturerFilter) => {
    const response = await fetch(`${globalConfig.baseUrl}/lecturer?${new URLSearchParams(filter as any)}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: headers().get('Authorization') || `Bearer ${cookies().get('accessToken')?.value || ' '}`,
            },
            next: {
                tags: ['lecturer.index'],
            }
        });

    const data = await response.json();
    return {
        ok: response.ok,
        status: response.status,
        ...data,
    } as IIndexResponse<ILecturer>;
}

/**
 * Create a new lecturer
 * @param lecturer - The lecturer to create
 * @returns The created lecturer
 */
export const createLecturer = async (lecturer: ILecturerCreate) => {
    const response = await fetch(`${globalConfig.baseUrl}/lecturer/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: headers().get('Authorization') || `Bearer ${cookies().get('accessToken')?.value || ' '}`,
        },
        body: JSON.stringify(lecturer),
        next: {
            tags: ['lecturer.create'],
        }
    });

    return await response.json();
}

/**
 * Update a lecturer
 * @param lecturer - The lecturer to update
 * @returns The updated lecturer
 */
export const updateLecturer = async (lecturer: ILecturerUpdate) => {
    const response = await fetch(`${globalConfig.baseUrl}/lecturer/${lecturer.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: headers().get('Authorization') || `Bearer ${cookies().get('accessToken')?.value || ' '}`,
        },
        body: JSON.stringify(lecturer),
        next: {
            tags: ['lecturer.update'],
        }
    });

    return await response.json();
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
            Authorization: headers().get('Authorization') || `Bearer ${cookies().get('accessToken')?.value || ' '}`,
        },
        next: {
            tags: ['lecturer.delete'],
        }
    });

    return await response.json();
}