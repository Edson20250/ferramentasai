import { NextRequest, NextResponse } from 'next/server'
import { queryPayments } from '@/lib/admin/queries'
import type { PlanoListagem } from '@prisma/client'

function cell(v: string | number | null | undefined): string {
  const s = v == null ? '' : String(v)
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`
  return s
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const plano = (searchParams.get('plano') as PlanoListagem) || ''
  const ativa = (searchParams.get('ativa') as 'all' | 'true' | 'false') || 'all'
  const sort = (searchParams.get('sort') as 'criadoEm_desc' | 'fimEm_asc' | 'inicioEm_desc') || 'criadoEm_desc'

  const exportLimit = Math.min(10_000, Math.max(1, parseInt(searchParams.get('limit') || '5000', 10)))
  const result = await queryPayments({
    page: 1,
    limit: exportLimit,
    maxLimit: exportLimit,
    plano: ['BASICO', 'PRO', 'DESTAQUE'].includes(plano) ? plano : '',
    ativa,
    dateFrom: searchParams.get('dateFrom') ?? undefined,
    dateTo: searchParams.get('dateTo') ?? undefined,
    q: searchParams.get('q') ?? undefined,
    sort,
  })

  const headers = [
    'id',
    'ferramentaId',
    'ferramenta_nome',
    'ferramenta_slug',
    'plano',
    'ativa',
    'stripeSessionId',
    'inicioEm',
    'fimEm',
    'criadoEm',
    'ferramenta_destaque',
  ]

  const lines = [
    headers.join(','),
    ...result.items.map((r) =>
      [
        cell(r.id),
        cell(r.ferramentaId),
        cell(r.ferramenta.nome),
        cell(r.ferramenta.slug),
        cell(r.plano),
        cell(r.ativa ? 'true' : 'false'),
        cell(r.stripeSessionId),
        cell(r.inicioEm?.toISOString()),
        cell(r.fimEm?.toISOString()),
        cell(r.criadoEm.toISOString()),
        cell(r.ferramenta.destaque ? 'true' : 'false'),
      ].join(','),
    ),
  ]

  const csv = '\uFEFF' + lines.join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="ferramentasai-payments-${Date.now()}.csv"`,
    },
  })
}
