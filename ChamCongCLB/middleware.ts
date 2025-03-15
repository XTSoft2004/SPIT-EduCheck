import globalConfig from './app.config';

import { IProfile, ITokens } from '@/types/auth';
import { NextRequest, NextResponse } from 'next/server';

const baseUrl = globalConfig.baseUrl;

export const config = {
    matcher: [
        /**
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt, logo.png (metadata files)
         * - All files inside public (including subfolders and images)
         */
        '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|logo.png|500|[^/]+\.[a-zA-Z]+).*)',
    ],
};




const checkConnect = async () => {
    try {
        const response = await fetch(`${baseUrl}/`, {
            method: 'GET',
        })
        return response.status;
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
    const response = await fetch(`${baseUrl}/user/me`, {
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
 * refresh the access token
 * @param refreshToken - The refresh token of the user
 * @returns - The new access token
 */
const refresh = async (refreshToken: string): Promise<ITokens> => {
    const response = await fetch(`${baseUrl}/auth/refresh-token`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({ refreshToken })
    });

    if (!response.ok)
        throw response;

    return (await response.json()).data as ITokens;
}

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
    console.log('server >> middleware', request.nextUrl.pathname);

    if ((await checkConnect()) === 500)
        return NextResponse.redirect(new URL('/500', request.url))

    const isLoginPage = request.nextUrl.pathname === '/login' && request.nextUrl.search === '';
    const globalResponse = isLoginPage
        ? NextResponse.redirect(new URL('/', request.url))
        : NextResponse.next();

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

            try {
                const newToken = await refresh(refreshToken);

                globalResponse.cookies.set('accessToken', newToken.accessToken);
                globalResponse.cookies.set('refreshToken', newToken.refreshToken);

                globalResponse.headers.set('Authorization', `Bearer ${newToken.accessToken}`);
            }
            catch (error) {
                const resposne = error as Response;
                if (resposne.status === 500)
                    return NextResponse.redirect(new URL('/500', request.url));

                return redirectLogin(request);
            }
        }
    }
    return globalResponse;
}
