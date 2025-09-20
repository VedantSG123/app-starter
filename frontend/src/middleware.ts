import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { authClient } from './lib/auth-client'

function isAuthRoute(pathname: string): boolean {
  return pathname === '/auth' || pathname.startsWith('/auth/')
}

function isSessionData(
  session: unknown
): session is { data: { user: unknown }; error: null } {
  return (
    session != null &&
    typeof session === 'object' &&
    'data' in session &&
    session.data != null &&
    typeof session.data === 'object' &&
    'user' in session.data &&
    (!('error' in session) || session.error == null)
  )
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  if (pathname === '/') {
    return NextResponse.next()
  }

  const sessionHeaders = await headers()
  const session = await authClient.getSession({
    fetchOptions: {
      headers: sessionHeaders,
    },
  })

  const isAuthenticated = isSessionData(session) ? !!session.data.user : false

  if (isAuthRoute(pathname)) {
    if (isAuthenticated) {
      // redirect authenticated users away from /auth/*
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  if (!isAuthenticated) {
    const url = new URL('/auth/login', request.url)
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
}
