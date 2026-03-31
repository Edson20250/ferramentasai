import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import {
  CHECKOUT_PRICE_DATA,
  getStripePriceId,
  parsePlanoQueryParam,
} from '@/lib/stripe-listings'
import { stripeLog } from '@/lib/stripe-log'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

function redirectDestaque(req: NextRequest, code: string) {
  return NextResponse.redirect(new URL(`/destaque?erro=${encodeURIComponent(code)}`, req.url))
}

export async function GET(req: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      stripeLog('error', 'checkout_missing_stripe_secret', {})
      return redirectDestaque(req, 'config')
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, '')
    if (!baseUrl) {
      stripeLog('error', 'checkout_missing_base_url', {})
      return redirectDestaque(req, 'config')
    }

    const { searchParams } = new URL(req.url)
    const ferramentaId = searchParams.get('ferramentaId')?.trim()
    const planoRaw = searchParams.get('plano')?.trim() ?? 'basico'

    if (!ferramentaId) {
      return redirectDestaque(req, 'missing_ferramenta')
    }

    const plano = parsePlanoQueryParam(planoRaw)
    if (!plano) {
      return redirectDestaque(req, 'invalid_plano')
    }

    const ferramenta = await prisma.ferramenta.findUnique({
      where: { id: ferramentaId },
      select: { id: true, aprovado: true },
    })

    if (!ferramenta) {
      return redirectDestaque(req, 'ferramenta_not_found')
    }

    if (!ferramenta.aprovado) {
      return redirectDestaque(req, 'ferramenta_not_approved')
    }

    const priceId = getStripePriceId(plano)
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = priceId
      ? [{ price: priceId, quantity: 1 }]
      : [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: CHECKOUT_PRICE_DATA[plano].nome,
                description: CHECKOUT_PRICE_DATA[plano].descricao,
              },
              unit_amount: CHECKOUT_PRICE_DATA[plano].unitAmount,
            },
            quantity: 1,
          },
        ]

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      success_url: `${baseUrl}/destaque/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/destaque?ferramentaId=${encodeURIComponent(ferramentaId)}`,
      metadata: {
        ferramentaId,
        plano,
      },
      allow_promotion_codes: true,
    })

    if (!session.url) {
      stripeLog('error', 'checkout_session_no_url', { sessionId: session.id })
      return redirectDestaque(req, 'stripe')
    }

    return NextResponse.redirect(session.url)
  } catch (err) {
    stripeLog('error', 'checkout_failed', {
      error: err instanceof Error ? err.message : String(err),
    })
    return redirectDestaque(req, 'stripe')
  }
}
