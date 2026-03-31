export function formatDateTime(d: Date | null | undefined): string {
  if (!d) return '—'
  return new Intl.DateTimeFormat('pt-PT', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(d)
}

export function formatDate(d: Date | null | undefined): string {
  if (!d) return '—'
  return new Intl.DateTimeFormat('pt-PT', { dateStyle: 'short' }).format(d)
}
