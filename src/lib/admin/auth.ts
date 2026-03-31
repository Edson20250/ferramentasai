import { createHmac, timingSafeEqual } from 'crypto'

export const ADMIN_COOKIE_NAME = 'fa_admin'

const COOKIE_PAYLOAD = 'ferramentasai-admin-session-v1'

export function getAdminCookieToken(secret: string): string {
  return createHmac('sha256', secret).update(COOKIE_PAYLOAD).digest('base64url')
}

export function verifyAdminCookie(cookieValue: string | undefined, secret: string | undefined): boolean {
  if (!secret || !cookieValue) return false
  try {
    const expected = getAdminCookieToken(secret)
    const a = Buffer.from(cookieValue, 'utf8')
    const b = Buffer.from(expected, 'utf8')
    if (a.length !== b.length) return false
    return timingSafeEqual(a, b)
  } catch {
    return false
  }
}

export function isAdminConfigured(): boolean {
  return Boolean(process.env.ADMIN_SECRET?.trim())
}
