import Link from 'next/link'
import { LUSO_AUDIENCE_LINE } from '@/lib/site-copy'

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 mt-20 relative overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.06),transparent_60%)]" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                IA
              </div>
              <span className="text-white font-display font-700 text-sm">
                ferramentasai<span className="text-emerald-400">.pt</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-500 mb-5">
              O melhor diretorio de ferramentas de IA em portugues. Curado para {LUSO_AUDIENCE_LINE}.
            </p>
            {/* Social links */}
            <div className="flex gap-2">
              {[
                { label: 'X / Twitter', icon: <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /> },
                { label: 'LinkedIn', icon: <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /> },
              ].map((s) => (
                <span
                  key={s.label}
                  className="w-8 h-8 rounded-lg bg-slate-800/60 hover:bg-slate-700 flex items-center justify-center text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                  aria-label={s.label}
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">{s.icon}</svg>
                </span>
              ))}
            </div>
          </div>

          {/* Explorar */}
          <div>
            <p className="text-white text-xs font-semibold mb-4 uppercase tracking-wider">Explorar</p>
            <ul className="space-y-2.5">
              {[
                { href: '/categorias', label: 'Todas as categorias' },
                { href: '/novidades', label: 'Novidades' },
                { href: '/destaque', label: 'Ferramentas em destaque' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white transition-colors text-xs">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categorias */}
          <div>
            <p className="text-white text-xs font-semibold mb-4 uppercase tracking-wider">Categorias</p>
            <ul className="space-y-2.5">
              {[
                { href: '/categoria/escrita', label: 'Escrita e Texto' },
                { href: '/categoria/imagem', label: 'Imagem e Design' },
                { href: '/categoria/codigo', label: 'Codigo e Dev' },
                { href: '/categoria/negocios', label: 'Negocios' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white transition-colors text-xs">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Site */}
          <div>
            <p className="text-white text-xs font-semibold mb-4 uppercase tracking-wider">Site</p>
            <ul className="space-y-2.5">
              {[
                { href: '/submeter', label: 'Submeter ferramenta' },
                { href: '/destaque', label: 'Anunciar / Destacar' },
                { href: '/newsletter', label: 'Newsletter' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white transition-colors text-xs">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-600">
            &copy; {new Date().getFullYear()} FerramentasAI. Feito em Portugal &middot; Para quem fala portugues em todo o mundo
          </p>
          <div className="flex gap-5 text-xs text-slate-600">
            <Link href="/privacidade" className="hover:text-slate-400 transition-colors">Privacidade</Link>
            <Link href="/termos" className="hover:text-slate-400 transition-colors">Termos</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
