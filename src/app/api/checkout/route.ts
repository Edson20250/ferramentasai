import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const PLANOS: Record<string, { nome: string; preco: number; descricao: string }> = {
  basico: {
    nome: 'Destaque Básico',
    preco: 4900,
    descricao: 'Listagem verificada com badge e posição destacada — 30 dias',
  },
  pro: {
    nome: 'Destaque Pro',
    preco: 9900,
    descricao: 'Topo de categoria + homepage + badge dourado — 30 dias',
  },
  destaque: {
    nome: 'Destaque Premium',
    preco: 19900,
    descricao: 'Posição #1 + newsletter + redes sociais — 30 dias',
  },
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const planoId = searchParams.get('plano') || 'basico'
    const plano = PLANOS[planoId]

    if (!plano) {
      return NextResponse.redirect(new URL('/destaque', req.url))
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: plano.nome,
              description: plano.descricao,
            },
            unit_amount: plano.preco,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/destaque/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/destaque`,
      metadata: { plano: planoId },
      allow_promotion_codes: true,
    })

    return NextResponse.redirect(session.url!)
  } catch (err) {
    console.error('Stripe error:', err)
    return NextResponse.redirect(new URL('/destaque?erro=1', req.url))
  }
}
