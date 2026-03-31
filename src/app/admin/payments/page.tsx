import Link from 'next/link'
import { queryPayments } from '@/lib/admin/queries'
import { formatDateTime } from '@/lib/admin/format'
import { computeListingHealth } from '@/lib/admin/listing-status'
import { StatusBadge } from '@/components/admin/StatusBadge'
import type { PlanoListagem } from '@prisma/client'

export const dynamic = 'force-dynamic'

type Props = {
  searchParams: Promise<{
    page?: string
    plano?: string
    ativa?: string
    dateFrom?: string
    dateTo?: string
    q?: string
    sort?: string
  }>
}

const PLANOS: PlanoListagem[] = ['BASICO', 'PRO', 'DESTAQUE']

export default async function AdminPaymentsPage({ searchParams }: Props) {
  const sp = await searchParams
  const page = parseInt(sp.page || '1', 10)
  const plano = (sp.plano as PlanoListagem) || ''
  const ativa = (sp.ativa as 'all' | 'true' | 'false') || 'all'
  const sort = (sp.sort as 'criadoEm_desc' | 'fimEm_asc' | 'inicioEm_desc') || 'criadoEm_desc'

  const result = await queryPayments({
    page,
    limit: 20,
    plano: PLANOS.includes(plano) ? plano : '',
    ativa,
    dateFrom: sp.dateFrom,
    dateTo: sp.dateTo,
    q: sp.q,
    sort,
  })

  const q = new URLSearchParams()
  if (plano) q.set('plano', plano)
  if (ativa !== 'all') q.set('ativa', ativa)
  if (sp.dateFrom) q.set('dateFrom', sp.dateFrom)
  if (sp.dateTo) q.set('dateTo', sp.dateTo)
  if (sp.q) q.set('q', sp.q)
  if (sort !== 'criadoEm_desc') q.set('sort', sort)
  const baseQs = q.toString()

  function pageHref(p: number) {
    const nq = new URLSearchParams(baseQs)
    nq.set('page', String(p))
    return `/admin/payments?${nq.toString()}`
  }

  const exportQs = new URLSearchParams(baseQs)
  exportQs.set('limit', '5000')
  exportQs.set('page', '1')

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-800 text-white">Pagamentos</h1>
          <p className="text-sm text-slate-500 mt-1">{result.total} registos</p>
        </div>
        <a
          href={`/api/admin/export/payments?${exportQs.toString()}`}
          className="text-xs px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-emerald-400 hover:bg-slate-700"
        >
          Exportar CSV
        </a>
      </div>

      <form
        method="GET"
        className="mb-6 grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3 p-4 rounded-xl border border-slate-800 bg-slate-900/40"
      >
        <input type="hidden" name="page" value="1" />
        <div>
          <label className="block text-[10px] text-slate-500 mb-1">Pesquisa</label>
          <input
            name="q"
            defaultValue={sp.q}
            placeholder="Nome, slug, session…"
            className="w-full rounded-lg bg-slate-950 border border-slate-700 px-2 py-1.5 text-xs text-white"
          />
        </div>
        <div>
          <label className="block text-[10px] text-slate-500 mb-1">Plano</label>
          <select
            name="plano"
            defaultValue={plano}
            className="w-full rounded-lg bg-slate-950 border border-slate-700 px-2 py-1.5 text-xs text-white"
          >
            <option value="">Todos</option>
            {PLANOS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[10px] text-slate-500 mb-1">Ativa</label>
          <select
            name="ativa"
            defaultValue={ativa}
            className="w-full rounded-lg bg-slate-950 border border-slate-700 px-2 py-1.5 text-xs text-white"
          >
            <option value="all">Todas</option>
            <option value="true">Sim</option>
            <option value="false">Não</option>
          </select>
        </div>
        <div>
          <label className="block text-[10px] text-slate-500 mb-1">Desde</label>
          <input
            type="date"
            name="dateFrom"
            defaultValue={sp.dateFrom}
            className="w-full rounded-lg bg-slate-950 border border-slate-700 px-2 py-1.5 text-xs text-white"
          />
        </div>
        <div>
          <label className="block text-[10px] text-slate-500 mb-1">Até</label>
          <input
            type="date"
            name="dateTo"
            defaultValue={sp.dateTo}
            className="w-full rounded-lg bg-slate-950 border border-slate-700 px-2 py-1.5 text-xs text-white"
          />
        </div>
        <div>
          <label className="block text-[10px] text-slate-500 mb-1">Ordenar</label>
          <select
            name="sort"
            defaultValue={sort}
            className="w-full rounded-lg bg-slate-950 border border-slate-700 px-2 py-1.5 text-xs text-white"
          >
            <option value="criadoEm_desc">Mais recentes</option>
            <option value="fimEm_asc">Fim ↑</option>
            <option value="inicioEm_desc">Início ↓</option>
          </select>
        </div>
        <div className="sm:col-span-2 lg:col-span-4 xl:col-span-6 flex gap-2">
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-500"
          >
            Filtrar
          </button>
          <Link
            href="/admin/payments"
            className="px-4 py-2 rounded-lg border border-slate-700 text-slate-400 text-xs hover:bg-slate-800"
          >
            Limpar
          </Link>
        </div>
      </form>

      <div className="rounded-xl border border-slate-800 overflow-x-auto">
        <table className="w-full text-xs min-w-[900px]">
          <thead className="bg-slate-900/80 text-slate-500 text-left">
            <tr>
              <th className="px-3 py-2 font-medium">Stripe session</th>
              <th className="px-3 py-2 font-medium">Ferramenta</th>
              <th className="px-3 py-2 font-medium">Plano</th>
              <th className="px-3 py-2 font-medium">Ativa</th>
              <th className="px-3 py-2 font-medium">Início</th>
              <th className="px-3 py-2 font-medium">Fim</th>
              <th className="px-3 py-2 font-medium">Criado</th>
              <th className="px-3 py-2 font-medium">Destaque</th>
              <th className="px-3 py-2 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {result.items.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-3 py-12 text-center text-slate-500">
                  Sem resultados
                </td>
              </tr>
            ) : (
              result.items.map((row) => {
                const health = computeListingHealth(row, new Date())
                const kind =
                  health === 'healthy'
                    ? 'healthy'
                    : health === 'expiring_soon'
                      ? 'expiring_soon'
                      : health === 'expired'
                        ? 'expired'
                        : health === 'inactive'
                          ? 'inactive'
                          : 'inconsistent'
                return (
                  <tr key={row.id} className="hover:bg-slate-900/40">
                    <td className="px-3 py-2 font-mono text-[10px] text-slate-500 max-w-[120px] truncate">
                      {row.stripeSessionId ?? '—'}
                    </td>
                    <td className="px-3 py-2">
                      <span className="text-slate-200">{row.ferramenta.nome}</span>
                      <span className="block text-[10px] text-slate-600">{row.ferramenta.slug}</span>
                    </td>
                    <td className="px-3 py-2 text-slate-400">{row.plano}</td>
                    <td className="px-3 py-2">{row.ativa ? 'Sim' : 'Não'}</td>
                    <td className="px-3 py-2 text-slate-500">{formatDateTime(row.inicioEm)}</td>
                    <td className="px-3 py-2 text-slate-500">{formatDateTime(row.fimEm)}</td>
                    <td className="px-3 py-2 text-slate-500">{formatDateTime(row.criadoEm)}</td>
                    <td className="px-3 py-2">{row.ferramenta.destaque ? 'Sim' : 'Não'}</td>
                    <td className="px-3 py-2">
                      <StatusBadge kind={kind} />
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {result.totalPages > 1 ? (
        <div className="flex justify-center gap-2 mt-6">
          {page > 1 ? (
            <Link
              href={pageHref(page - 1)}
              className="px-3 py-1 rounded-lg border border-slate-700 text-slate-400 text-xs hover:bg-slate-800"
            >
              Anterior
            </Link>
          ) : null}
          <span className="text-xs text-slate-500 py-1">
            Página {page} / {result.totalPages}
          </span>
          {page < result.totalPages ? (
            <Link
              href={pageHref(page + 1)}
              className="px-3 py-1 rounded-lg border border-slate-700 text-slate-400 text-xs hover:bg-slate-800"
            >
              Seguinte
            </Link>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
