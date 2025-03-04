'use server';
import globalConfig from "@/app.config";
import { IProfile } from "@/types/auth";
import { cookies, headers } from 'next/headers';

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
    } as IProfile;
}

