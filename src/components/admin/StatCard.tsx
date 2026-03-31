export function StatCard({
  title,
  value,
  hint,
  variant = 'default',
}: {
  title: string
  value: string | number
  hint?: string
  variant?: 'default' | 'warning' | 'danger'
}) {
  const border =
    variant === 'danger'
      ? 'border-red-900/50 bg-red-950/20'
      : variant === 'warning'
        ? 'border-amber-900/50 bg-amber-950/20'
        : 'border-slate-800 bg-slate-900/50'

  return (
    <div className={`rounded-xl border p-4 ${border}`}>
      <p className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">{title}</p>
      <p className="font-display text-2xl font-800 text-white mt-1 tabular-nums">{value}</p>
      {hint ? <p className="text-xs text-slate-500 mt-1">{hint}</p> : null}
    </div>
  )
}
