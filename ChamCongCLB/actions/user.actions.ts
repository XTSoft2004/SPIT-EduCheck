'use server';
import { cookies, headers } from 'next/headers';
import globalConfig from '@/app.config';

import { IUser, IUserSearch, IUserCreate } from '@/types/user.d';
import { IIndexResponse } from '@/types/global';

const baseUrl = globalConfig.baseUrl;

/**
 * Get all users
 * @returns List of users
 */
export const getUsers = async () => {
    const response = await fetch(`${baseUrl}/user`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: headers().get('Authorization') || `Bearer ${cookies().get('accessToken')?.value || ' '}`,
        },
        next: {
            tags: ['user.index']
        }
    });

    const data = await response.json();

    return {
        ok: response.ok,
        status: response.status,
        ...data,
    } as IIndexResponse<IUser>
}

/**
 * Get user by id
 * @param search - Search to apply
 * @returns User
 */
export const getUserById = async (search: IUserSearch) => {
    const response = await fetch(`${baseUrl}/user/${search.id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: headers().get('Authorization') || `Bearer ${cookies().get('accessToken')?.value || ' '}`,
        },
        next: {
            tags: ['user.search']
        }
    });

    const data = await response.json();

    return {
        ok: response.ok,
        status: response.status,
        ...data,
    } as IIndexResponse<IUser>
}