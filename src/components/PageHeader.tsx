import Link from 'next/link'
import type { ReactNode } from 'react'

export type Crumb = { label: string; href?: string }

type Props = {
  breadcrumbs?: Crumb[]
  eyebrow?: string
  title: ReactNode
  subtitle?: string
  /** Extra content rendered in the bottom-right (e.g. a filter, a count) */
  aside?: ReactNode
  /** Tight vertical padding — useful for hero-style headers with custom content below */
  compact?: boolean
}

/**
 * Consistent white page header used on every inner public page.
 * Handles breadcrumb, eyebrow, h1, subtitle, and optional right-side slot.
 */
export function PageHeader({ breadcrumbs, eyebrow, title, subtitle, aside, compact }: Props) {
  return (
    <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
      <div className={`max-w-6xl mx-auto px-5 sm:px-8 ${compact ? 'py-7' : 'py-10'}`}>

        {/* Breadcrumb */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)] mb-5">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span aria-hidden>/</span>}
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-[var(--foreground)] transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-[var(--foreground)]">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}

        {/* Title row */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            {eyebrow && <span className="section-eyebrow">{eyebrow}</span>}
            <h1
              className="font-bold text-[var(--foreground)] tracking-tight"
              style={{
                fontSize: 'clamp(1.375rem, 3vw, 1.875rem)',
                letterSpacing: '-0.025em',
                marginTop: eyebrow ? '4px' : undefined,
              }}
            >
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-[var(--muted)] mt-1.5 max-w-2xl">{subtitle}</p>
            )}
          </div>
          {aside && <div className="shrink-0">{aside}</div>}
        </div>
      </div>
    </div>
  )
}
