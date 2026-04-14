import Link from 'next/link'
import { LUSO_AUDIENCE_LINE } from '@/lib/site-copy'

const NAV = [
  {
    title: 'Explorar',
    links: [
      { href: '/categorias',         label: 'Todas as categorias' },
      { href: '/novidades',          label: 'Novidades'           },
      { href: '/destaque',           label: 'Em destaque'         },
      { href: '/gratuitas',          label: 'Ferramentas grátis'  },
      { href: '/pesquisa',           label: 'Pesquisa avançada'   },
    ],
  },
  {
    title: 'Categorias',
    links: [
      { href: '/categoria/escrita',  label: '✍️ Escrita e Texto'  },
      { href: '/categoria/imagem',   label: '🎨 Imagem e Design'  },
      { href: '/categoria/codigo',   label: '💻 Código e Dev'     },
      { href: '/categoria/negocios', label: '📈 Negócios'         },
      { href: '/categoria/audio',    label: '🎵 Áudio e Voz'      },
    ],
  },
  {
    title: 'Site',
    links: [
      { href: '/submeter',           label: 'Submeter ferramenta' },
      { href: '/destaque',           label: 'Anunciar / Destacar' },
      { href: '/newsletter',         label: 'Newsletter'          },
      { href: '/sobre',              label: 'Sobre nós'           },
      { href: '/afiliados',          label: 'Afiliados'           },
    ],
  },
]

export function Footer() {
  return (
    <footer style={{ background: '#0a2540', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="max-w-6xl mx-auto px-6 py-14">

        {/* Top: logo + nav columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">

          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-0 mb-4">
              <span className="font-bold text-white text-base tracking-tight">ferramentas</span>
              <span className="font-bold text-green-400 text-base tracking-tight">ai</span>
            </Link>
            <p className="text-sm leading-relaxed text-[#8898aa]">
              O melhor diretório de ferramentas de IA em português. Curado para {LUSO_AUDIENCE_LINE}.
            </p>
          </div>

          {/* Nav columns */}
          {NAV.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-4 text-white/30">
                {col.title}
              </p>
              <ul className="space-y-2.5">
                {col.links.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-[#8898aa] hover:text-white transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-8"
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
        >
          <p className="text-xs text-white/20">
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
                className="text-xs text-white/20 hover:text-white/50 transition-colors"
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
