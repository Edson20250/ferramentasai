import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const categoria = searchParams.get('categoria')
    const preco = searchParams.get('preco')
    const q = searchParams.get('q')
    const destaque = searchParams.get('destaque')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const where: any = { aprovado: true }
    if (categoria) where.categoria = { slug: categoria }
    if (preco) where.precificacao = preco.toUpperCase()
    if (destaque === 'true') where.destaque = true
    if (q) {
      where.OR = [
        { nome: { contains: q, mode: 'insensitive' } },
        { descricao: { contains: q, mode: 'insensitive' } },
        { tags: { has: q.toLowerCase() } },
      ]
    }

    const [ferramentas, total] = await Promise.all([
      prisma.ferramenta.findMany({
        where,
        include: { categoria: true },
        orderBy: [{ destaque: 'desc' }, { visualizacoes: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.ferramenta.count({ where }),
    ])

    return NextResponse.json({
      ferramentas,
      total,
      pagina: page,
      totalPaginas: Math.ceil(total / limit),
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
