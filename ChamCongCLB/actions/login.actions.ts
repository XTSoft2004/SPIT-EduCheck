'use server';
import { cookies } from 'next/headers';
import globalConfig from "@/app.config";

import { ILoginForm, ILoginResponse } from "@/types/auth";
import { IResponse } from "@/types/global";

const baseUrl = globalConfig.baseUrl;

export const login = async (body: ILoginForm) => {
    const response = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
    });

    const data = await response.json();

    if (response.ok) {
        const token = (data as ILoginResponse).data;
        cookies().set('accessToken', token.accessToken);
        cookies().set('refreshToken', token.refreshToken);
    }

    return {
        ok: response.ok,
        ...data,
    } as IResponse
}