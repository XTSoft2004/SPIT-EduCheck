import globalConfig from './app.config'

import { IProfile, ITokens } from '@/types/auth'
import { NextRequest, NextResponse } from 'next/server'

const baseUrl = globalConfig.baseUrl

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|slides|logo).*)',
  ],
}

/**
 * Get the profile of the user
 * @param accessToken - The access token of the user
 * @returns The profile of the user
 * @throws Error if the request fails
 */
const getMe = async (accessToken: string): Promise<IProfile> => {
  const response = await fetch(`${baseUrl}/user/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) throw response

  const data = await response.json()

  return {
    ...data,
  } as IProfile
}

const refresh = async (accessToken: string): Promise<ITokens> => {
  const response = await fetch(`${globalConfig.baseUrl}/auth/refresh-token`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) throw response

  return (await response.json()).data as ITokens
}

/**
 * Redirect to the login page and delete the tokens the cookies
 * @param request - The request object
 */
const redirectLogin = (request: NextRequest) => {
  const isLoginPage = request.nextUrl.pathname === '/login'
  if (!isLoginPage) {
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete('accessToken')
    response.cookies.delete('refreshToken')
    return response
  }

  const response = NextResponse.next()
  response.cookies.delete('accessToken')
  response.cookies.delete('refreshToken')
  return response
}

const redirectChangePassword = (request: NextRequest) => {
  const isChangePasswordPage =
    request.nextUrl.pathname === '/change-password' &&
    request.nextUrl.search === ''

  if (!isChangePasswordPage) {
    const response = NextResponse.redirect(
      new URL('/change-password', request.url),
    )
    return response
  }

  return NextResponse.next()
}

const redirectLocked = (request: NextRequest) => {
  const isLockedPage =
    request.nextUrl.pathname === '/locked' && request.nextUrl.search === ''

  if (!isLockedPage) {
    const response = NextResponse.redirect(new URL('/locked', request.url))
    return response
  }

  return NextResponse.next()
}

export async function middleware(request: NextRequest) {
  console.log('server >> middleware', request.nextUrl.pathname)

  const globalResponse = NextResponse.next()

  try {
    // Kiểm tra profile xem còn hợp lệ hay không
    const accessToken = request.cookies.get('accessToken')?.value ?? ' '

    // Nếu không có accessToken thì chuyển hướng về trang login
    if (!accessToken) return redirectLogin(request)

    const profile = await getMe(accessToken)

    // Nếu profile.isVerify là true hoặc !isLocked thì chuyển hướng về trang dashboard
    if ((profile.isVerify && request.nextUrl.pathname === '/login') || (!profile.isLocked && request.nextUrl.pathname === '/locked'))
      return NextResponse.redirect(new URL('/', request.url))

    // Kiểm tra nếu profile.isVerify là false, chuyển hướng về trang change-password
    if (!profile.isVerify && request.nextUrl.pathname !== '/change-password')
      return redirectChangePassword(request)
  } catch (error) {
    const response = error as Response

    if (response.status === 500)
      return NextResponse.redirect(new URL('/500', request.url))

    if (response.status === 401) {
      /// Kiểm tra xem token có hết hạn hay không
      const refreshToken = request.cookies.get('refreshToken')?.value ?? ' '
      if (!refreshToken) return redirectLogin(request)
      try {
        // Nếu token hết hạn thì gọi api refresh token
        const newToken = await refresh(refreshToken)

        // Set lại token vào cookie
        globalResponse.cookies.set('accessToken', newToken.accessToken)
        globalResponse.cookies.set('refreshToken', newToken.refreshToken)

        globalResponse.headers.set(
          'Authorization',
          `Bearer ${newToken.accessToken}`,
        )
      } catch (error) {
        /// Nếu refresh token cũng không hợp lệ thì redirect về trang login
        const resposne = error as Response
        if (resposne.status === 500)
          return NextResponse.redirect(new URL('/500', request.url))

        return redirectLogin(request)
      }
    }

    if (response.status === 423) {
      // Nếu token không có quyền truy cập thì redirect về trang locked
      return redirectLocked(request)
    }
  }
  return globalResponse
}
