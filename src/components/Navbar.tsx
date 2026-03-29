'use client'

import Link from 'next/link'
import { useState } from 'react'

export function Navbar() {
  const [menuAberto, setMenuAberto] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white text-sm font-bold group-hover:bg-emerald-600 transition-colors">
            IA
          </div>
          <span className="font-display font-700 text-slate-900 text-lg tracking-tight">
            ferramentasai
            <span className="text-emerald-500">.pt</span>
          </span>
        </Link>

        {/* Nav desktop */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/categorias" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
            Categorias
          </Link>
          <Link href="/novidades" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
            Novidades
          </Link>
          <Link href="/newsletter" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
            Newsletter
          </Link>
          <Link href="/submeter" className="btn-outline text-sm">
            Submeter ferramenta
          </Link>
          <Link href="/destaque" className="btn-primary text-sm">
            Destacar ↗
          </Link>
        </div>

        {/* Menu mobile */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
          onClick={() => setMenuAberto(!menuAberto)}
          aria-label="Menu"
        >
          <div className="w-5 h-4 flex flex-col justify-between">
            <span className={`block h-0.5 bg-slate-800 transition-all ${menuAberto ? 'rotate-45 translate-y-1.5' : ''}`} />
            <span className={`block h-0.5 bg-slate-800 transition-all ${menuAberto ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 bg-slate-800 transition-all ${menuAberto ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </button>
      </nav>

      {/* Menu mobile expandido */}
      {menuAberto && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-4 flex flex-col gap-3">
          <Link href="/categorias" className="text-sm text-slate-600 py-2">Categorias</Link>
          <Link href="/novidades" className="text-sm text-slate-600 py-2">Novidades</Link>
          <Link href="/newsletter" className="text-sm text-slate-600 py-2">Newsletter</Link>
          <Link href="/submeter" className="btn-outline text-center">Submeter ferramenta</Link>
          <Link href="/destaque" className="btn-primary text-center">Destacar ferramenta ↗</Link>
        </div>
      )}
    </header>
  )
}
