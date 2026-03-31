'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const nav = [
  { href: '/admin', label: 'Visão geral' },
  { href: '/admin/payments', label: 'Pagamentos' },
  { href: '/admin/listings', label: 'Listagens' },
  { href: '/admin/stripe-audit', label: 'Auditoria Stripe' },
]

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <aside className="w-56 shrink-0 border-r border-slate-800 bg-slate-900/80 flex flex-col">
        <div className="p-4 border-b border-slate-800">
          <p className="font-display font-700 text-sm text-white">FerramentasAI</p>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-0.5">Admin</p>
        </div>
        <nav className="p-2 flex-1 space-y-0.5">
          {nav.map((item) => {
            const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                  active ? 'bg-emerald-600/20 text-emerald-400 font-medium' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="p-2 border-t border-slate-800">
          <Link href="/" className="block rounded-lg px-3 py-2 text-xs text-slate-500 hover:text-slate-300">
            ← Site público
          </Link>
          <button
            type="button"
            className="w-full text-left rounded-lg px-3 py-2 text-xs text-slate-500 hover:text-red-400"
            onClick={async () => {
              await fetch('/api/admin/auth', { method: 'DELETE' })
              window.location.href = '/admin/login'
            }}
          >
            Terminar sessão
          </button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-12 border-b border-slate-800 flex items-center px-6 bg-slate-900/40">
          <span className="text-xs text-slate-500">Consola de operações</span>
        </header>
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
