'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const NAV_LINKS = [
  { href: '/categorias', label: 'Categorias' },
  { href: '/novidades', label: 'Novidades' },
  { href: '/newsletter', label: 'Newsletter' },
]

export function Navbar() {
  const [menuAberto, setMenuAberto] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMenuAberto(false)
  }, [pathname])

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/')

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/85 backdrop-blur-xl border-b border-slate-200/80 shadow-sm'
          : 'bg-white/60 backdrop-blur-md border-b border-transparent'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-500 flex items-center justify-center text-white text-xs font-bold shadow-sm shadow-emerald-600/20 group-hover:shadow-emerald-600/40 transition-shadow">
            IA
          </div>
          <span className="font-display font-700 text-slate-900 text-lg tracking-tight">
            ferramentasai
            <span className="text-emerald-500">.pt</span>
          </span>
        </Link>

        {/* Nav desktop */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive(link.href)
                  ? 'text-emerald-700 bg-emerald-50 font-medium'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="w-px h-6 bg-slate-200 mx-2" />
          <Link href="/submeter" className="btn-outline text-sm !py-2 !px-4">
            Submeter
          </Link>
          <Link href="/destaque" className="btn-primary text-sm !py-2 !px-4 ml-1.5">
            Destacar
          </Link>
        </div>

        {/* Menu mobile toggle */}
        <button
          className="md:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors"
          onClick={() => setMenuAberto(!menuAberto)}
          aria-label="Menu"
        >
          <div className="w-5 h-4 flex flex-col justify-between">
            <span className={`block h-0.5 bg-slate-800 rounded-full transition-all duration-300 origin-center ${menuAberto ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`block h-0.5 bg-slate-800 rounded-full transition-all duration-300 ${menuAberto ? 'opacity-0 scale-0' : ''}`} />
            <span className={`block h-0.5 bg-slate-800 rounded-full transition-all duration-300 origin-center ${menuAberto ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </div>
        </button>
      </nav>

      {/* Menu mobile expandido */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuAberto ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="border-t border-slate-100 bg-white/95 backdrop-blur-xl px-4 py-4 flex flex-col gap-1 animate-fade-in">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm py-2.5 px-3 rounded-xl transition-colors ${
                isActive(link.href)
                  ? 'text-emerald-700 bg-emerald-50 font-medium'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="h-px bg-slate-100 my-2" />
          <Link href="/submeter" className="btn-outline text-center text-sm">
            Submeter ferramenta
          </Link>
          <Link href="/destaque" className="btn-primary text-center text-sm">
            Destacar ferramenta
          </Link>
        </div>
      </div>
    </header>
  )
}
