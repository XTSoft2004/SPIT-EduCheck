'use server';
import globalConfig from "@/app.config";
import { IProfile, ILoginForm } from "@/types/auth";
import { cookies, headers } from 'next/headers';

import { IIndexResponse } from '@/types/global';

/**
 * Get profile
 */
export const getProfile = async () => {
    const response = await fetch(`${globalConfig.baseUrl}/user/me`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: headers().get('Authorization') || `Bearer ${cookies().get('accessToken')?.value || ' '}`,
        },
        next: {
            tags: ['auth.me'],
        }
    })

    const data = await response.json();

    return {
        ok: response.ok,
        status: response.status,
        ...data,
    } as IIndexResponse<IProfile>;
}

/**
 * Create account
 * @param body - Body to create account
 * @returns Account
 */
export const createAccount = async (body: ILoginForm) => {
    const response = await fetch(`${globalConfig.baseUrl}/auth/sign-up`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        next: {
            tags: ['auth.register'],
        }
    });

    const data = await response.json();

    return {
        ok: response.ok,
        status: response.status,
        ...data,
    } as IIndexResponse<IProfile>;
}