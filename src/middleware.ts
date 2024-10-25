import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.get('isAuthenticated')?.value === 'true'

  if (request.nextUrl.pathname.startsWith('/admin') && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}