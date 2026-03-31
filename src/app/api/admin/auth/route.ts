import { NextRequest, NextResponse } from 'next/server'
import {
  getAdminCookieToken,
  ADMIN_COOKIE_NAME,
  isAdminConfigured,
} from '@/lib/admin/auth'

export async function POST(req: NextRequest) {
  if (!isAdminConfigured()) {
    return NextResponse.json({ error: 'config' }, { status: 503 })
  }

  const secret = process.env.ADMIN_SECRET!.trim()
  let body: { secret?: string } = {}
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 })
  }

  if (!body.secret || body.secret !== secret) {
    return NextResponse.json({ error: 'invalid_credentials' }, { status: 401 })
  }

  const token = getAdminCookieToken(secret)
  const res = NextResponse.json({ ok: true })
  res.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })
  return res
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.delete(ADMIN_COOKIE_NAME)
  return res
}
