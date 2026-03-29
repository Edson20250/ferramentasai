import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params
    const ferramenta = await prisma.ferramenta.findUnique({
      where: { slug },
      select: { id: true, urlAfiliado: true, url: true },
    })
    if (!ferramenta) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })

    await prisma.ferramenta.update({
      where: { id: ferramenta.id },
      data: { cliques: { increment: 1 } },
    })

    const destino = ferramenta.urlAfiliado || ferramenta.url
    return NextResponse.json({ url: destino })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
