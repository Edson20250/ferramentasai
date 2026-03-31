import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { addDaysUtc, parsePlanoQueryParam, PLAN_DURATION_DAYS } from '@/lib/stripe-listings'
import { stripeLog } from '@/lib/stripe-log'
import type { PlanoListagem } from '@prisma/client'

export const dynamic = 'force-dynamic'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

function normalizePlanoMeta(raw: string | null | undefined): PlanoListagem | null {
  if (!raw) return null
  const t = raw.trim()
  const fromQuery = parsePlanoQueryParam(t)
  if (fromQuery) return fromQuery
  const u = t.toUpperCase()
  if (u === 'BASICO' || u === 'PRO' || u === 'DESTAQUE') return u as PlanoListagem
  return null
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session): Promise<void> {
  const sessionId = session.id
  const ferramentaId = session.metadata?.ferramentaId?.trim()
  const planoRaw = session.metadata?.plano
  const plano = normalizePlanoMeta(planoRaw ?? null)

  if (!ferramentaId || !plano) {
    stripeLog('warn', 'webhook_missing_metadata', {
      sessionId,
      hasFerramentaId: Boolean(ferramentaId),
      planoRaw: planoRaw ?? null,
    })
    return
  }

  if (session.payment_status !== 'paid') {
    stripeLog('warn', 'webhook_session_not_paid', {
      sessionId,
      payment_status: session.payment_status,
    })
    return
  }

  const existingProcessed = await prisma.stripeProcessedSession.findUnique({
    where: { stripeSessionId: sessionId },
  })
  if (existingProcessed) {
    stripeLog('info', 'webhook_idempotent_skip', { sessionId })
    return
  }

  const ferramenta = await prisma.ferramenta.findUnique({
    where: { id: ferramentaId },
    select: { id: true, aprovado: true },
  })

  if (!ferramenta || !ferramenta.aprovado) {
    stripeLog('warn', 'webhook_invalid_ferramenta', { sessionId, ferramentaId })
    return
  }

  const days = PLAN_DURATION_DAYS[plano]
  const now = new Date()

  try {
    await prisma.$transaction(async (tx) => {
      await tx.stripeProcessedSession.create({
        data: {
          stripeSessionId: sessionId,
          ferramentaId,
          plano,
        },
      })

      const existing = await tx.listagemPaga.findUnique({
        where: { ferramentaId },
      })

      const baseEnd =
        existing?.fimEm && existing.fimEm > now ? existing.fimEm : now
      const fimEm = addDaysUtc(baseEnd, days)
      const inicioEm =
        existing?.inicioEm && existing.fimEm && existing.fimEm > now
          ? existing.inicioEm
          : now

      await tx.listagemPaga.upsert({
        where: { ferramentaId },
        create: {
          ferramentaId,
          stripeSessionId: sessionId,
          plano,
          ativa: true,
          inicioEm,
          fimEm,
        },
        update: {
          stripeSessionId: sessionId,
          plano,
          ativa: true,
          inicioEm,
          fimEm,
        },
      })

      await tx.ferramenta.update({
        where: { id: ferramentaId },
        data: { destaque: true },
      })
    })

    stripeLog('info', 'webhook_listing_activated', {
      sessionId,
      ferramentaId,
      plano,
    })
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      stripeLog('info', 'webhook_race_duplicate_session', { sessionId })
      return
    }
    stripeLog('error', 'webhook_transaction_failed', {
      sessionId,
      error: err instanceof Error ? err.message : String(err),
    })
    throw err
  }
}

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) {
    stripeLog('error', 'webhook_missing_secret', {})
    return NextResponse.json({ error: 'config' }, { status: 500 })
  }

  const body = await req.text()
  const sig = req.headers.get('stripe-signature')
  if (!sig) {
    return NextResponse.json({ error: 'missing_signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret)
  } catch (err) {
    stripeLog('error', 'webhook_signature_invalid', {
      error: err instanceof Error ? err.message : String(err),
    })
    return NextResponse.json({ error: 'invalid_signature' }, { status: 400 })
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      await handleCheckoutCompleted(session)
    }
  } catch (err) {
    stripeLog('error', 'webhook_handler_error', {
      type: event.type,
      error: err instanceof Error ? err.message : String(err),
    })
    return NextResponse.json({ received: false }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
