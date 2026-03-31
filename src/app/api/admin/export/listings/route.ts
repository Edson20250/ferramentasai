import { NextResponse } from 'next/server'
import { queryListings } from '@/lib/admin/queries'

function cell(v: string | number | null | undefined): string {
  const s = v == null ? '' : String(v)
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`
  return s
}

export async function GET() {
  const now = new Date()
  const rows = await queryListings('all', now)

  const headers = [
    'id',
    'ferramentaId',
    'nome',
    'slug',
    'plano',
    'ativa',
    'stripeSessionId',
    'inicioEm',
    'fimEm',
    'criadoEm',
    'destaque_ferramenta',
    'health',
    'dias_restantes',
    'flags',
  ]

  const lines = [
    headers.join(','),
    ...rows.map((r) =>
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
        cell(r.health),
        cell(r.daysLeft ?? ''),
        cell(r.flags.join(';')),
      ].join(','),
    ),
  ]

  const csv = '\uFEFF' + lines.join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="ferramentasai-listings-${Date.now()}.csv"`,
    },
  })
}
