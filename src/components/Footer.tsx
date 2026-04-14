import Link from 'next/link'
import { LUSO_AUDIENCE_LINE } from '@/lib/site-copy'

export function Footer() {
  return (
    <footer style={{ background: '#050505', borderTop: '1px solid #1a1a1a' }}>
      <div
        className="max-w-7xl mx-auto px-6 sm:px-10"
        style={{ paddingTop: '60px', paddingBottom: '60px' }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 mb-12">

          {/* Col 1: Logo + tagline */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <span
                className="font-grotesk font-bold"
                style={{ color: '#00ff88', fontSize: '1.5rem', letterSpacing: '-0.03em' }}
              >
                FA.
              </span>
              <span
                className="font-grotesk font-bold"
                style={{ color: 'rgba(240,240,240,0.6)', fontSize: '14px' }}
              >
                FerramentasAI
              </span>
            </Link>
            <p style={{ color: 'rgba(240,240,240,0.25)', fontSize: '13px', lineHeight: 1.7, maxWidth: '260px' }}>
              O melhor diretório de ferramentas de IA em português. Curado para {LUSO_AUDIENCE_LINE}.
            </p>
          </div>

          {/* Col 2: Links */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p
                className="font-grotesk font-bold uppercase mb-4"
                style={{ color: 'rgba(240,240,240,0.5)', fontSize: '10px', letterSpacing: '0.15em' }}
              >
                Explorar
              </p>
              <ul className="space-y-3">
                {[
                  { href: '/categorias', label: 'Todas as categorias' },
                  { href: '/novidades', label: 'Novidades' },
                  { href: '/destaque', label: 'Em destaque' },
                  { href: '/gratuitas', label: 'Ferramentas grátis' },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="transition-colors hover:text-white"
                      style={{ color: 'rgba(240,240,240,0.25)', fontSize: '13px' }}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p
                className="font-grotesk font-bold uppercase mb-4"
                style={{ color: 'rgba(240,240,240,0.5)', fontSize: '10px', letterSpacing: '0.15em' }}
              >
                Site
              </p>
              <ul className="space-y-3">
                {[
                  { href: '/submeter', label: 'Submeter ferramenta' },
                  { href: '/destaque', label: 'Anunciar / Destacar' },
                  { href: '/newsletter', label: 'Newsletter' },
                  { href: '/sobre', label: 'Sobre nós' },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="transition-colors hover:text-white"
                      style={{ color: 'rgba(240,240,240,0.25)', fontSize: '13px' }}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Col 3: Newsletter CTA */}
          <div>
            <p
              className="font-grotesk font-bold uppercase mb-2"
              style={{ color: 'rgba(240,240,240,0.5)', fontSize: '10px', letterSpacing: '0.15em' }}
            >
              Newsletter
            </p>
            <p
              className="font-grotesk font-bold text-white mb-1"
              style={{ fontSize: '1rem' }}
            >
              Novidades todas as semanas
            </p>
            <p style={{ color: 'rgba(240,240,240,0.3)', fontSize: '13px', marginBottom: '16px' }}>
              As melhores ferramentas novas, em português, sem spam.
            </p>
            <form action="/api/newsletter" method="POST" className="flex flex-col gap-2">
              <input
                name="email"
                type="email"
                required
                placeholder="o.teu@email.com"
                style={{
                  background: '#111',
                  border: '1px solid #2a2a2a',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  fontSize: '13px',
                  color: '#f0f0f0',
                  outline: 'none',
                  width: '100%',
                }}
              />
              <button
                type="submit"
                className="btn-accent text-sm w-full"
                style={{ padding: '10px 16px', borderRadius: '8px' }}
              >
                Subscrever →
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-6"
          style={{ borderTop: '1px solid #141414' }}
        >
          <p style={{ color: 'rgba(240,240,240,0.2)', fontSize: '12px' }}>
            © {new Date().getFullYear()} FerramentasAI — Feito em Portugal 🇵🇹
          </p>
          <div className="flex gap-5">
            {[
              { href: '/privacidade', label: 'Privacidade' },
              { href: '/termos', label: 'Termos' },
              { href: '/afiliados', label: 'Afiliados' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="transition-colors hover:text-white"
                style={{ color: 'rgba(240,240,240,0.2)', fontSize: '12px' }}
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
