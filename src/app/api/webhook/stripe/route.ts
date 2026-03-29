import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
})

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    return NextResponse.json({ error: 'Webhook inválido' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.CheckoutSession
    const plano = session.metadata?.plano as string

    const planoMap: Record<string, 'BASICO' | 'PRO' | 'DESTAQUE'> = {
      basico: 'BASICO',
      pro: 'PRO',
      destaque: 'DESTAQUE',
    }

    // Aqui atualizarias a listagem com o ferramentaId passado via metadata
    // (adiciona ferramentaId ao checkout session ao integrar o formulário)
    console.log(`Pagamento confirmado: plano=${plano}, session=${session.id}`)
  }

  return NextResponse.json({ recebido: true })
}
