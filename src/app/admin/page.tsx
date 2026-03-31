import Link from 'next/link'
import { StatCard } from '@/components/admin/StatCard'
import { AdminToolbar } from '@/components/admin/AdminToolbar'
import { StatusBadge } from '@/components/admin/StatusBadge'
import {
  getDashboardSummary,
  getRecentPayments,
  getRecentExpiring,
  getRecentStripeAudit,
} from '@/lib/admin/queries'
import { formatDateTime } from '@/lib/admin/format'
import { computeListingHealth } from '@/lib/admin/listing-status'
import { flagLabel } from '@/lib/admin/audit-consistency'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const now = new Date()
  const [summary, recentPay, expiring, stripeRows] = await Promise.all([
    getDashboardSummary(now),
    getRecentPayments(8),
    getRecentExpiring(8, now),
    getRecentStripeAudit(10),
  ])

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl font-800 text-white">Visão geral</h1>
          <p className="text-sm text-slate-500 mt-1">Saúde do negócio e listagens pagas</p>
        </div>
        <AdminToolbar />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mb-8">
        <StatCard title="Listagens ativas" value={summary.activePaidListings} hint="ativa + fim ≥ hoje" />
        <StatCard title="Expiradas (hist.)" value={summary.expiredListings} hint="fim &lt; agora" />
        <StatCard title="A expirar 7d" value={summary.expiringIn7Days} variant="warning" />
        <StatCard title="Sessões Stripe" value={summary.stripeProcessedTotal} />
        <StatCard title="Ferramentas em destaque" value={summary.featuredTools} />
        <StatCard title="Novos (30d)" value={summary.recentPayments30d} hint="registos listagem" />
      </div>

      <div className="mb-8">
        <StatCard
          title="Saúde do sistema"
          value={summary.inconsistentRecords}
          hint="Listagens com flags + processamentos Stripe órfãos"
          variant={summary.inconsistentRecords > 0 ? 'danger' : 'default'}
        />
        <p className="text-xs text-slate-500 mt-2">
          <Link href="/admin/stripe-audit" className="text-emerald-400 hover:underline">
            Ver auditoria detalhada →
          </Link>
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <section>
          <h2 className="text-sm font-600 text-slate-300 mb-3">Pagamentos recentes</h2>
          <div className="rounded-xl border border-slate-800 overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-slate-900/80 text-slate-500 text-left">
                <tr>
                  <th className="px-3 py-2 font-medium">Ferramenta</th>
                  <th className="px-3 py-2 font-medium">Plano</th>
                  <th className="px-3 py-2 font-medium">Criado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {recentPay.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-3 py-8 text-center text-slate-500">
                      Sem listagens
                    </td>
                  </tr>
                ) : (
                  recentPay.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-900/40">
                      <td className="px-3 py-2 text-slate-200">{row.ferramenta.nome}</td>
                      <td className="px-3 py-2 text-slate-400">{row.plano}</td>
                      <td className="px-3 py-2 text-slate-500">{formatDateTime(row.criadoEm)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-sm font-600 text-slate-300 mb-3">A expirar em breve</h2>
          <div className="rounded-xl border border-slate-800 overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-slate-900/80 text-slate-500 text-left">
                <tr>
                  <th className="px-3 py-2 font-medium">Ferramenta</th>
                  <th className="px-3 py-2 font-medium">Fim</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {expiring.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="px-3 py-8 text-center text-slate-500">
                      Nada a expirar nos próximos 7 dias
                    </td>
                  </tr>
                ) : (
                  expiring.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-900/40">
                      <td className="px-3 py-2 text-slate-200">{row.ferramenta.nome}</td>
                      <td className="px-3 py-2 text-amber-400/90">{formatDateTime(row.fimEm)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <section className="mt-10">
        <h2 className="text-sm font-600 text-slate-300 mb-3">Auditoria Stripe (recente)</h2>
        <div className="rounded-xl border border-slate-800 overflow-x-auto">
          <table className="w-full text-xs min-w-[640px]">
            <thead className="bg-slate-900/80 text-slate-500 text-left">
              <tr>
                <th className="px-3 py-2 font-medium">Session</th>
                <th className="px-3 py-2 font-medium">Ferramenta</th>
                <th className="px-3 py-2 font-medium">Processado</th>
                <th className="px-3 py-2 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {stripeRows.map((r) => {
                const health = r.listing
                  ? computeListingHealth(r.listing, now)
                  : 'inconsistent'
                return (
                  <tr key={r.session.stripeSessionId} className="hover:bg-slate-900/40">
                    <td className="px-3 py-2 font-mono text-[10px] text-slate-500 max-w-[140px] truncate">
                      {r.session.stripeSessionId}
                    </td>
                    <td className="px-3 py-2 text-slate-200">
                      {r.listing?.ferramenta.nome ?? '—'}
                    </td>
                    <td className="px-3 py-2 text-slate-500">{formatDateTime(r.session.createdAt)}</td>
                    <td className="px-3 py-2">
                      {r.flags.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {r.flags.slice(0, 2).map((f) => (
                            <StatusBadge key={f} kind="inconsistent" label={flagLabel(f)} />
                          ))}
                          {r.flags.length > 2 ? (
                            <span className="text-slate-500">+{r.flags.length - 2}</span>
                          ) : null}
                        </div>
                      ) : (
                        <StatusBadge kind="ok" />
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
