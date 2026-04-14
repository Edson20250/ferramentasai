'use client'

import Link from 'next/link'
import { useState } from 'react'

export function Navbar() {
  const [menuAberto, setMenuAberto] = useState(false)

  return (
    <header className="navbar">
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-6">

        {/* Logo — "ferramentasai" like Stripe's wordmark */}
        <Link href="/" className="flex items-center gap-1 shrink-0">
          <span className="font-bold text-[var(--text-primary)] text-base tracking-tight">
            ferramentas
          </span>
          <span className="font-bold text-green-600 text-base tracking-tight">ai</span>
        </Link>

        {/* Nav links desktop — like Stripe's "Products, Solutions, Developers..." */}
        <div className="hidden md:flex items-center gap-6 flex-1">
          {[
            { href: '/categorias',  label: 'Categorias' },
            { href: '/novidades',   label: 'Novidades'  },
            { href: '/newsletter',  label: 'Newsletter' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-medium transition-colors"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* CTAs — like Stripe's "Sign in" + "Start now" */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <Link href="/submeter" className="btn-outline-clean text-sm" style={{ padding: '7px 16px' }}>
            Submeter ferramenta
          </Link>
          <Link href="/destaque" className="btn-accent-clean text-sm" style={{ padding: '7px 16px' }}>
            Destacar ↗
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-lg transition-colors"
          style={{ color: 'var(--text-secondary)' }}
          onClick={() => setMenuAberto(!menuAberto)}
          aria-label="Menu"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            {menuAberto ? (
              <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            ) : (
              <>
                <line x1="3" y1="6"  x2="17" y2="6"  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="3" y1="10" x2="17" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="3" y1="14" x2="17" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {menuAberto && (
        <div
          className="md:hidden border-t px-6 py-5 flex flex-col gap-4"
          style={{ background: '#fff', borderColor: 'var(--border)' }}
        >
          {[
            { href: '/categorias', label: 'Categorias' },
            { href: '/novidades',  label: 'Novidades'  },
            { href: '/newsletter', label: 'Newsletter' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-medium py-1"
              style={{ color: 'var(--text-secondary)' }}
            >
              {label}
            </Link>
          ))}
          <div className="flex flex-col gap-2 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
            <Link href="/submeter" className="btn-outline-clean text-sm text-center">Submeter ferramenta</Link>
            <Link href="/destaque" className="btn-accent-clean text-sm text-center">Destacar ferramenta ↗</Link>
          </div>
        </div>
      )}
    </header>
  )
}
