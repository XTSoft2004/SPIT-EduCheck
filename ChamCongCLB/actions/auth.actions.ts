'use server';
import globalConfig from "@/app.config";
import { IProfile, ILoginForm } from "@/types/auth";
import { cookies, headers } from 'next/headers';

import { IIndexResponse, IResponse, IShowResponse } from '@/types/global';
import { revalidateTag } from "next/cache";

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
    } as IShowResponse<IProfile>;
}

/**
 * Create account
 * @param formData - Body to create account
 * @returns Account
 */
export const createAccount = async (formData: ILoginForm) => {
    const profile = await getProfile();
    if (!profile.ok || !profile.data) {
        return {
            ok: profile.ok,
            message: profile.message,
        } as IResponse;
    }

    const user: ILoginForm = {
        username: formData.username,
        password: formData.password,
    };

    const response = await fetch(`${globalConfig.baseUrl}/auth/sign-up`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user)
    });

    revalidateTag('user.index');
    revalidateTag('user.show')

    const data = await response.json();
    
    return {
        ok: response.ok,
        ...data,
    } as IResponse;
}