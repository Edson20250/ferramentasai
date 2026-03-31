import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyAdminCookie, ADMIN_COOKIE_NAME, isAdminConfigured } from '@/lib/admin/auth'

export function middleware(request: NextRequest) {
  if (!isAdminConfigured()) {
    if (
      request.nextUrl.pathname.startsWith('/admin') ||
      request.nextUrl.pathname.startsWith('/api/admin')
    ) {
      return new NextResponse('Admin não configurado (ADMIN_SECRET)', { status: 503 })
    }
    return NextResponse.next()
  }

  const secret = process.env.ADMIN_SECRET!.trim()

  if (
    request.nextUrl.pathname === '/api/admin/auth' &&
    (request.method === 'POST' || request.method === 'DELETE')
  ) {
    return NextResponse.next()
  }

  if (request.nextUrl.pathname.startsWith('/api/admin')) {
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value
    if (!verifyAdminCookie(token, secret)) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }
    return NextResponse.next()
  }

  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next()
    }
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value
    if (!verifyAdminCookie(token, secret)) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      url.search = ''
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
