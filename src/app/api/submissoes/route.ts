import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { nome, url, descricao, emailContato, categoriaSlug } = body

    if (!nome || !url || !descricao || !emailContato) {
      return NextResponse.json({ error: 'Campos obrigatórios em falta' }, { status: 400 })
    }

    let categoriaId: string | undefined
    if (categoriaSlug) {
      const cat = await prisma.categoria.findUnique({ where: { slug: categoriaSlug } })
      if (cat) categoriaId = cat.id
    }

    const submissao = await prisma.submissao.create({
      data: { nome, url, descricao, emailContato, categoriaId, estado: 'pendente' },
    })

    return NextResponse.json({ ok: true, id: submissao.id })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
