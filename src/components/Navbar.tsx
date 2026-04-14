'use client'

import Link from 'next/link'
import { useState } from 'react'

const NAV_LINKS = [
  { href: '/categorias', label: 'Categorias' },
  { href: '/novidades',  label: 'Novidades'  },
  { href: '/destaque',   label: 'Em destaque' },
  { href: '/newsletter', label: 'Newsletter'  },
]

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="navbar">
      <nav className="max-w-6xl mx-auto px-5 sm:px-8 h-[60px] flex items-center justify-between gap-6">

        {/* ── Logo ────────────────────────────────────── */}
        <Link
          href="/"
          className="flex items-center gap-0.5 shrink-0 group"
          aria-label="FerramentasAI — página inicial"
        >
          <span className="font-bold text-[var(--foreground)] text-[15px] tracking-tight group-hover:text-[var(--primary)] transition-colors">
            ferramentas
          </span>
          <span className="font-bold text-green-600 text-[15px] tracking-tight">ai</span>
        </Link>

        {/* ── Desktop nav ─────────────────────────────── */}
        <div className="hidden md:flex items-center gap-1 flex-1">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-[13.5px] font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors px-3 py-1.5 rounded-lg hover:bg-[var(--surface-subtle)]"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* ── Desktop CTAs ────────────────────────────── */}
        <div className="hidden md:flex items-center gap-2.5 shrink-0">
          <Link
            href="/submeter"
            className="btn-outline"
            style={{ padding: '7px 14px', fontSize: '13px' }}
          >
            Submeter
          </Link>
          <Link
            href="/destaque"
            className="btn-accent"
            style={{ padding: '7px 14px', fontSize: '13px' }}
          >
            Destacar ↗
          </Link>
        </div>

        {/* ── Mobile toggle ───────────────────────────── */}
        <button
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-subtle)] transition-colors"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={open}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            {open ? (
              <path
                d="M3 3l12 12M15 3L3 15"
                stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"
              />
            ) : (
              <>
                <line x1="2.5" y1="5"  x2="15.5" y2="5"  stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                <line x1="2.5" y1="9"  x2="15.5" y2="9"  stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                <line x1="2.5" y1="13" x2="15.5" y2="13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {/* ── Mobile menu ─────────────────────────────────── */}
      {open && (
        <div
          className="md:hidden border-t px-5 py-5 flex flex-col gap-1"
          style={{ background: 'rgba(255,255,255,0.97)', borderColor: 'var(--border)' }}
        >
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-[13.5px] font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors px-3 py-2.5 rounded-lg hover:bg-[var(--surface-subtle)]"
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
          <div className="mt-3 pt-3 flex flex-col gap-2" style={{ borderTop: '1px solid var(--border)' }}>
            <Link
              href="/submeter"
              className="btn-outline text-center"
              style={{ fontSize: '13.5px' }}
              onClick={() => setOpen(false)}
            >
              Submeter ferramenta
            </Link>
            <Link
              href="/destaque"
              className="btn-accent text-center"
              style={{ fontSize: '13.5px' }}
              onClick={() => setOpen(false)}
            >
              Destacar ferramenta ↗
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
