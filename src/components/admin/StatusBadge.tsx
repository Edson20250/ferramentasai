import type { ListingHealth } from '@/lib/admin/listing-status'
import { healthLabel } from '@/lib/admin/audit-consistency'

const styles: Record<ListingHealth | 'inconsistent' | 'ok', string> = {
  healthy: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  expiring_soon: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  expired: 'bg-slate-600/30 text-slate-400 border-slate-600',
  inactive: 'bg-slate-700/40 text-slate-400 border-slate-600',
  inconsistent: 'bg-red-500/15 text-red-400 border-red-500/30',
  ok: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
}

export function StatusBadge({
  kind,
  label,
}: {
  kind: keyof typeof styles
  label?: string
}) {
  const text =
    label ??
    (kind === 'ok'
      ? 'OK'
      : kind === 'inconsistent'
        ? 'Inconsistente'
        : healthLabel(kind as ListingHealth))
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border ${styles[kind]}`}>
      {text}
    </span>
  )
}
