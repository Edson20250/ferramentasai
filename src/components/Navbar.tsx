'use client'

import Link from 'next/link'
import { useState } from 'react'

export function Navbar() {
  const [menuAberto, setMenuAberto] = useState(false)

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-md"
      style={{ background: 'rgba(8,8,8,0.9)', borderBottom: '1px solid #1a1a1a' }}
    >
      <nav
        className="max-w-7xl mx-auto px-6 sm:px-10 h-16 flex items-center justify-between"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span
            className="font-grotesk font-bold"
            style={{ color: '#00ff88', fontSize: '1.4rem', letterSpacing: '-0.03em' }}
          >
            FA.
          </span>
        </Link>

        {/* Nav desktop */}
        <div className="hidden md:flex items-center gap-7">
          {[
            { href: '/categorias', label: 'Categorias' },
            { href: '/novidades', label: 'Novidades' },
            { href: '/newsletter', label: 'Newsletter' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm transition-colors"
              style={{ color: 'rgba(240,240,240,0.5)' }}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/submeter"
            className="text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            style={{ border: '1px solid #2a2a2a', color: 'rgba(240,240,240,0.6)' }}
          >
            Submeter
          </Link>
          <Link
            href="/destaque"
            className="btn-accent text-sm"
            style={{ padding: '8px 18px', borderRadius: '8px' }}
          >
            Destacar ↗
          </Link>
        </div>

        {/* Menu mobile toggle */}
        <button
          className="md:hidden p-2 rounded-lg transition-colors"
          style={{ color: 'rgba(240,240,240,0.6)' }}
          onClick={() => setMenuAberto(!menuAberto)}
          aria-label="Menu"
        >
          <div className="w-5 h-4 flex flex-col justify-between">
            <span
              className="block h-0.5 transition-all"
              style={{
                background: 'rgba(240,240,240,0.7)',
                transform: menuAberto ? 'rotate(45deg) translateY(6px)' : 'none',
              }}
            />
            <span
              className="block h-0.5 transition-all"
              style={{
                background: 'rgba(240,240,240,0.7)',
                opacity: menuAberto ? 0 : 1,
              }}
            />
            <span
              className="block h-0.5 transition-all"
              style={{
                background: 'rgba(240,240,240,0.7)',
                transform: menuAberto ? 'rotate(-45deg) translateY(-6px)' : 'none',
              }}
            />
          </div>
        </button>
      </nav>

      {/* Mobile menu */}
      {menuAberto && (
        <div
          className="md:hidden px-6 py-5 flex flex-col gap-4"
          style={{ background: '#0d0d0d', borderTop: '1px solid #1a1a1a' }}
        >
          {[
            { href: '/categorias', label: 'Categorias' },
            { href: '/novidades', label: 'Novidades' },
            { href: '/newsletter', label: 'Newsletter' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm py-1 transition-colors"
              style={{ color: 'rgba(240,240,240,0.5)' }}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/submeter"
            className="text-sm font-medium text-center px-4 py-3 rounded-lg transition-colors"
            style={{ border: '1px solid #2a2a2a', color: 'rgba(240,240,240,0.6)' }}
          >
            Submeter ferramenta
          </Link>
          <Link href="/destaque" className="btn-accent text-sm text-center">
            Destacar ferramenta ↗
          </Link>
        </div>
      )}
    </header>
  )
}
