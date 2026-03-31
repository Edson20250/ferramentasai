import { queryStripeAuditFull } from '@/lib/admin/queries'
import { formatDateTime } from '@/lib/admin/format'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { flagLabel } from '@/lib/admin/audit-consistency'
import { computeListingHealth, isTrulyActiveListing } from '@/lib/admin/listing-status'

export const dynamic = 'force-dynamic'

export default async function AdminStripeAuditPage() {
  const now = new Date()
  const rows = await queryStripeAuditFull()

  const withIssues = rows.filter((r) => r.flags.length > 0)
  const inconsistentCount = withIssues.length

  return (
    <div>
      <h1 className="font-display text-2xl font-800 text-white mb-2">Auditoria Stripe</h1>
      <p className="text-sm text-slate-500 mb-6">
        Sessões processadas vs listagens e destaques — {rows.length} sessões,{' '}
        <span className={inconsistentCount > 0 ? 'text-amber-400' : 'text-emerald-400'}>
          {inconsistentCount} com inconsistências
        </span>
      </p>

      <div className="rounded-xl border border-slate-800 overflow-x-auto">
        <table className="w-full text-xs min-w-[1000px]">
          <thead className="bg-slate-900/80 text-slate-500 text-left">
            <tr>
              <th className="px-3 py-2 font-medium">Session ID</th>
              <th className="px-3 py-2 font-medium">Processado</th>
              <th className="px-3 py-2 font-medium">Plano</th>
              <th className="px-3 py-2 font-medium">Ferramenta</th>
              <th className="px-3 py-2 font-medium">Listagem</th>
              <th className="px-3 py-2 font-medium">Destaque tool</th>
              <th className="px-3 py-2 font-medium">Listagem ativa (negócio)</th>
              <th className="px-3 py-2 font-medium">Flags</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-3 py-12 text-center text-slate-500">
                  Nenhuma sessão Stripe registada
                </td>
              </tr>
            ) : (
              rows.map((r) => {
                const listing = r.listing
                const truly = listing ? isTrulyActiveListing(listing, now) : false
                const health = listing ? computeListingHealth(listing, now) : 'inconsistent'
                return (
                  <tr key={r.session.stripeSessionId} className="hover:bg-slate-900/40">
                    <td className="px-3 py-2 font-mono text-[10px] text-slate-400 max-w-[160px] break-all">
                      {r.session.stripeSessionId}
                    </td>
                    <td className="px-3 py-2 text-slate-500">{formatDateTime(r.session.createdAt)}</td>
                    <td className="px-3 py-2 text-slate-400">{r.session.plano}</td>
                    <td className="px-3 py-2 text-slate-200">
                      {listing ? (
                        <>
                          {listing.ferramenta.nome}
                          <span className="block text-[10px] text-slate-600">{listing.ferramenta.slug}</span>
                        </>
                      ) : (
                        <span className="text-red-400">Sem listagem</span>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      {listing ? (
                        <span className="text-slate-400">
                          {listing.ativa ? 'marcada ativa' : 'inativa'}
                          {listing.stripeSessionId === r.session.stripeSessionId ? '' : ' · session ID diferente'}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="px-3 py-2">
                      {listing ? (listing.ferramenta.destaque ? 'Sim' : 'Não') : '—'}
                    </td>
                    <td className="px-3 py-2">
                      {listing ? (
                        truly ? (
                          <StatusBadge kind="healthy" label="Ativa (válida)" />
                        ) : (
                          <StatusBadge kind={health === 'expired' ? 'expired' : 'inactive'} />
                        )
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="px-3 py-2">
                      {r.flags.length === 0 ? (
                        <StatusBadge kind="ok" />
                      ) : (
                        <ul className="space-y-1 max-w-[280px]">
                          {r.flags.map((f) => (
                            <li key={f}>
                              <StatusBadge kind="inconsistent" label={flagLabel(f)} />
                            </li>
                          ))}
                        </ul>
                      )}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
