import Link from 'next/link'
import { queryListings, type ListingsFilter } from '@/lib/admin/queries'
import { formatDateTime } from '@/lib/admin/format'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { ListingActions } from '@/components/admin/ListingActions'
export const dynamic = 'force-dynamic'

type Props = { searchParams: Promise<{ filter?: string }> }

const FILTERS: { id: ListingsFilter; label: string }[] = [
  { id: 'active', label: 'Ativas' },
  { id: 'expiring', label: 'A expirar (7d)' },
  { id: 'expired', label: 'Expiradas / inativas' },
  { id: 'all', label: 'Todas' },
]

export default async function AdminListingsPage({ searchParams }: Props) {
  const sp = await searchParams
  const filter = (FILTERS.some((f) => f.id === sp.filter) ? sp.filter : 'active') as ListingsFilter
  const now = new Date()
  const rows = await queryListings(filter, now)

  return (
    <div>
      <h1 className="font-display text-2xl font-800 text-white mb-2">Listagens</h1>
      <p className="text-sm text-slate-500 mb-6">Listagens pagas e estado operacional</p>

      <div className="flex flex-wrap gap-2 mb-6">
        {FILTERS.map((f) => {
          const active = filter === f.id
          const q = f.id === 'active' ? '' : `?filter=${f.id}`
          return (
            <Link
              key={f.id}
              href={`/admin/listings${q}`}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                active
                  ? 'bg-emerald-600/20 border-emerald-500/40 text-emerald-400'
                  : 'border-slate-700 text-slate-400 hover:border-slate-600'
              }`}
            >
              {f.label}
            </Link>
          )
        })}
      </div>

      <div className="rounded-xl border border-slate-800 overflow-x-auto">
        <table className="w-full text-xs min-w-[960px]">
          <thead className="bg-slate-900/80 text-slate-500 text-left">
            <tr>
              <th className="px-3 py-2 font-medium">Ferramenta</th>
              <th className="px-3 py-2 font-medium">Plano</th>
              <th className="px-3 py-2 font-medium">Ativa</th>
              <th className="px-3 py-2 font-medium">Início</th>
              <th className="px-3 py-2 font-medium">Fim</th>
              <th className="px-3 py-2 font-medium">Dias</th>
              <th className="px-3 py-2 font-medium">Session</th>
              <th className="px-3 py-2 font-medium">Destaque</th>
              <th className="px-3 py-2 font-medium">Saúde</th>
              <th className="px-3 py-2 font-medium">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-3 py-12 text-center text-slate-500">
                  Sem listagens neste filtro
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                const kind =
                  row.health === 'healthy'
                    ? 'healthy'
                    : row.health === 'expiring_soon'
                      ? 'expiring_soon'
                      : row.health === 'expired'
                        ? 'expired'
                        : row.health === 'inactive'
                          ? 'inactive'
                          : 'inconsistent'
                const canReactivate =
                  Boolean(row.fimEm && row.fimEm > now) && !row.ativa
                return (
                  <tr key={row.id} className="hover:bg-slate-900/40">
                    <td className="px-3 py-2 text-slate-200">{row.ferramenta.nome}</td>
                    <td className="px-3 py-2 text-slate-400">{row.plano}</td>
                    <td className="px-3 py-2">{row.ativa ? 'Sim' : 'Não'}</td>
                    <td className="px-3 py-2 text-slate-500">{formatDateTime(row.inicioEm)}</td>
                    <td className="px-3 py-2 text-slate-500">{formatDateTime(row.fimEm)}</td>
                    <td className="px-3 py-2 text-slate-400 tabular-nums">
                      {row.daysLeft === null ? '—' : row.daysLeft}
                    </td>
                    <td className="px-3 py-2 font-mono text-[10px] text-slate-600 max-w-[100px] truncate">
                      {row.stripeSessionId ?? '—'}
                    </td>
                    <td className="px-3 py-2">{row.ferramenta.destaque ? 'Sim' : 'Não'}</td>
                    <td className="px-3 py-2">
                      <div className="flex flex-col gap-1">
                        <StatusBadge kind={kind} />
                        {row.flags.length > 0 ? (
                          <span className="text-[10px] text-red-400/80">{row.flags.length} flag(s)</span>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <ListingActions listingId={row.id} canReactivate={canReactivate} />
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-slate-600 mt-4">
        <a href="/api/admin/export/listings" className="text-emerald-500 hover:underline">
          Exportar listagens (CSV)
        </a>
      </p>
    </div>
  )
}
