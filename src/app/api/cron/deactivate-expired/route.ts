import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { deactivateExpiredListings } from '@/lib/listings-expiration'
import { stripeLog } from '@/lib/stripe-log'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (!secret) {
    stripeLog('error', 'cron_missing_secret', {})
    return NextResponse.json({ error: 'config' }, { status: 500 })
  }

  const auth = req.headers.get('authorization')
  const token = auth?.startsWith('Bearer ') ? auth.slice(7) : req.nextUrl.searchParams.get('secret')

  if (token !== secret) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  try {
    const result = await deactivateExpiredListings(prisma)
    return NextResponse.json({ ok: true, ...result })
  } catch (err) {
    stripeLog('error', 'cron_deactivate_failed', {
      error: err instanceof Error ? err.message : String(err),
    })
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }
}
