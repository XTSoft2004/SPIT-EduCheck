'use server';
import globalConfig from "@/app.config";
import { cookies, headers } from 'next/headers';

import { IClass, IClassCreate, IClassDeleteLecturer, IClassUpdate } from "@/types/class";
import { IIndexResponse, IResponse } from "@/types/global";
import { revalidateTag } from "next/cache";

/**
 * Get all classes
 * @returns List of classes
 */
export const getClasses = async () => {
    const response = await fetch(`${globalConfig.baseUrl}/class`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: headers().get('Authorization') || `Bearer ${cookies().get('accessToken')?.value || ' '}`,
            },
            next: {
                tags: ['class.index'],
            }
        });

    const data = await response.json();

    return {
        ok: response.ok,
        status: response.status,
        ...data,
    } as IIndexResponse<IClass>;
}

/**
 * Create a new class
 * @param class - The class to create
 * @returns The created class
 */
export const createClass = async (classObj: IClassCreate) => {
    const response = await fetch(`${globalConfig.baseUrl}/class/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: headers().get('Authorization') || `Bearer ${cookies().get('accessToken')?.value || ' '}`,
        },
        body: JSON.stringify(classObj)
    });
    revalidateTag('class.index');
    revalidateTag('class.show');

    const data = await response.json();

    return {
        ok: response.ok,
        ...data,
    } as IResponse;
}

/**
 * Update a class
 * @param class - The class to update
 * @returns The updated class
 */
export const updateClass = async (classObj: IClassUpdate) => {
    const response = await fetch(`${globalConfig.baseUrl}/class/${classObj.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: headers().get('Authorization') || `Bearer ${cookies().get('accessToken')?.value || ' '}`,
        },
        body: JSON.stringify(classObj)
    });
    revalidateTag('class.index');
    revalidateTag('class.show');

    const data = await response.json();
    return {
        ok: response.ok,
        ...data,
    } as IResponse;
}

/**
 * Delete a class
 * @param id - The class id to delete
 * @returns The deleted class
 */
export const deleteClass = async (id: number) => {
    const response = await fetch(`${globalConfig.baseUrl}/class/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: headers().get('Authorization') || `Bearer ${cookies().get('accessToken')?.value || ' '}`,
        }
    });
    revalidateTag('class.index');

    const data = await response.json();

    return {
        ok: response.ok,
        ...data,
    } as IResponse;
};

/**
 * Delete a lecturer from a class
 * @param classId - The class id
 * @returns The deleted lecturer
 */
export const deleteLecturer = async (classObj: IClassDeleteLecturer) => {
    const response = await fetch(`${globalConfig.baseUrl}/class/remove-lecturer?ClassId=${classObj.classId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: headers().get('Authorization') || `Bearer ${cookies().get('accessToken')?.value || ' '}`,
        },
        body: JSON.stringify({ classObj })
    });
    revalidateTag('class.index');

    const data = await response.json();

    return {
        ok: response.ok,
        ...data,
    } as IResponse;
}