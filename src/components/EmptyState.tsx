import Link from 'next/link'

type Action = { label: string; href: string; variant?: 'primary' | 'outline' }

type Props = {
  icon?: string
  title: string
  description?: string
  actions?: Action[]
}

/**
 * Premium empty / zero-data state used across listing pages.
 */
export function EmptyState({ icon = '✨', title, description, actions }: Props) {
  return (
    <div
      className="text-center py-20 rounded-2xl"
      style={{ border: '2px dashed var(--border)' }}
    >
      <p className="text-4xl mb-4" aria-hidden>{icon}</p>
      <p className="font-semibold text-[var(--foreground)] text-base mb-2">{title}</p>
      {description && (
        <p className="text-sm text-[var(--muted-foreground)] mb-7 max-w-xs mx-auto leading-relaxed">
          {description}
        </p>
      )}
      {actions && actions.length > 0 && (
        <div className="flex flex-wrap gap-3 justify-center">
          {actions.map(a => (
            <Link
              key={a.href}
              href={a.href}
              className={a.variant === 'outline' ? 'btn-outline' : 'btn-primary'}
              style={{ fontSize: '13.5px' }}
            >
              {a.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
