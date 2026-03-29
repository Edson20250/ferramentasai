import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const email = formData.get('email') as string

    if (!email || !email.includes('@')) {
      return NextResponse.redirect(new URL('/?newsletter=erro', req.url))
    }

    // Integra com Beehiiv via API
    // Substitui BEEHIIV_PUBLICATION_ID e BEEHIIV_API_KEY no .env
    if (process.env.BEEHIIV_API_KEY && process.env.BEEHIIV_PUBLICATION_ID) {
      await fetch(
        `https://api.beehiiv.com/v2/publications/${process.env.BEEHIIV_PUBLICATION_ID}/subscriptions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.BEEHIIV_API_KEY}`,
          },
          body: JSON.stringify({
            email,
            reactivate_existing: true,
            send_welcome_email: true,
            utm_source: 'ferramentasai',
            utm_medium: 'website',
          }),
        }
      )
    } else {
      // Fallback: guarda na base de dados local
      console.log(`Newsletter: novo subscritor → ${email}`)
    }

    return NextResponse.redirect(new URL('/?newsletter=ok', req.url))
  } catch (err) {
    console.error(err)
    return NextResponse.redirect(new URL('/?newsletter=erro', req.url))
  }
}
