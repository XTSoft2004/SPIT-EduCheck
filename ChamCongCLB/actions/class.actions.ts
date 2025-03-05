'use server';
import globalConfig from "@/app.config";
import { cookies, headers } from 'next/headers';

import { IClass, IClassCreate, IClassDeleteLecturer, IClassUpdate } from "@/types/class";
import { IIndexResponse } from "@/types/global";

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
        body: JSON.stringify(classObj),
        next: {
            tags: ['class.create'],
        }
    });

    return await response.json();
}

/**
 * Update a class
 * @param class - The class to update
 * @returns The updated class
 */
export const updateClass = async (classObj: IClassUpdate) => {
    const response = await fetch(`${globalConfig.baseUrl}/class/update`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: headers().get('Authorization') || `Bearer ${cookies().get('accessToken')?.value || ' '}`,
        },
        body: JSON.stringify(classObj),
        next: {
            tags: ['class.update'],
        }
    });

    return await response.json();
}