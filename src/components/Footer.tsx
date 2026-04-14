import Link from 'next/link'
import { LUSO_AUDIENCE_SHORT } from '@/lib/site-copy'

const NAV = [
  {
    title: 'Explorar',
    links: [
      { href: '/categorias',  label: 'Todas as categorias' },
      { href: '/novidades',   label: 'Novidades'           },
      { href: '/destaque',    label: 'Em destaque'         },
      { href: '/pesquisa',    label: 'Pesquisa avançada'   },
    ],
  },
  {
    title: 'Categorias',
    links: [
      { href: '/categoria/escrita',  label: 'Escrita e Texto'  },
      { href: '/categoria/imagem',   label: 'Imagem e Design'  },
      { href: '/categoria/codigo',   label: 'Código e Dev'     },
      { href: '/categoria/negocios', label: 'Negócios'         },
      { href: '/categoria/audio',    label: 'Áudio e Voz'      },
    ],
  },
  {
    title: 'Empresa',
    links: [
      { href: '/submeter',    label: 'Submeter ferramenta' },
      { href: '/destaque',    label: 'Anunciar / Destacar' },
      { href: '/newsletter',  label: 'Newsletter'          },
      { href: '/sobre',       label: 'Sobre nós'           },
      { href: '/afiliados',   label: 'Afiliados'           },
    ],
  },
]

export function Footer() {
  return (
    <footer
      style={{
        background: 'var(--primary)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14">

        {/* ── Top grid: brand + nav ───────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8 mb-12">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-0 mb-4 group">
              <span className="font-bold text-white text-[15px] tracking-tight">ferramentas</span>
              <span className="font-bold text-green-400 text-[15px] tracking-tight">ai</span>
            </Link>
            <p className="text-sm leading-relaxed" style={{ color: '#8898aa', maxWidth: '220px' }}>
              O melhor diretório de ferramentas de IA em português. Curado para {LUSO_AUDIENCE_SHORT}.
            </p>
          </div>

          {/* Nav columns */}
          {NAV.map((col) => (
            <div key={col.title}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] mb-4" style={{ color: 'rgba(255,255,255,0.28)' }}>
                {col.title}
              </p>
              <ul className="space-y-2.5">
                {col.links.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-[13px] hover:text-white transition-colors"
                      style={{ color: '#8898aa' }}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Bottom bar ──────────────────────────────── */}
        <div
          className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-8"
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
        >
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.22)' }}>
            © {new Date().getFullYear()} FerramentasAI · Feito em Portugal 🇵🇹
          </p>
          <div className="flex gap-5">
            {[
              { href: '/privacidade', label: 'Privacidade' },
              { href: '/termos',      label: 'Termos'      },
              { href: '/afiliados',   label: 'Afiliados'   },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-xs transition-colors hover:text-white"
                style={{ color: 'rgba(255,255,255,0.22)' }}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
