import globalConfig from './app.config';

import { IProfile } from './types/auth';
import { NextRequest, NextResponse } from 'next/server';

const baseUrl = globalConfig.baseUrl;

const checkConnect = async () => {
    try {
        const response = await fetch(`${baseUrl}`, {
            method: 'GET',
        })
        return response.ok;
    } catch (error) {
        return false;
    }
}

/**
 * Get the profile of the user
 * @param accessToken - The access token of the user
 * @returns The profile of the user
 * @throws Error if the request fails
 */
const getProfile = async (accessToken: string): Promise<IProfile> => {
    const response = await fetch(`${baseUrl}user/me`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    });

    if (!response.ok)
        throw response;

    return (await response.json()).data as IProfile;
};

/**
 * Redirect to the login page and delete the tokens the cookies
 * @param request - The request object
 */
const redirectLogin = (request: NextRequest) => {
    const isLoginPage = request.nextUrl.pathname === '/login';

    if (!isLoginPage) {
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('accessToken');
        response.cookies.delete('refreshToken');
        return response;
    }

    const response = NextResponse.next();
    response.cookies.delete('accessToken');
    response.cookies.delete('refreshToken');
    return response;
}

export async function middleware(request: NextRequest) {
    if (!(await checkConnect()))
        return NextResponse.redirect(new URL('/500', request.url))

    const globalREsponse = request.nextUrl.pathname === '/login' ? NextResponse.redirect(new URL('/', request.url)) : NextResponse.next();

    try {
        const accessToken = request.cookies.get('accessToken')?.value ?? ' ';

        await getProfile(accessToken);
    } catch (error) {
        const response = error as Response;

        if (response.status === 500)
            return NextResponse.redirect(new URL('/500', request.url));

        if (response.status === 401) {
            const refreshToken = request.cookies.get('refreshToken')?.value ?? ' ';

            if (!refreshToken)
                return redirectLogin(request);
        }
    }
    return globalREsponse;
}