import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { withDatabase } from '@/lib/with-database'
import { LUSO_AUDIENCE_LINE } from '@/lib/site-copy'
import { labelPreco } from '@/lib/utils'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'FerramentasAI — Diretório de Ferramentas de IA em Português',
}

async function getDados() {
  return withDatabase(
    { categorias: [], ferramentasDestaque: [], totalFerramentas: 0 },
    async () => {
      const [categorias, ferramentasDestaque, totalFerramentas] = await Promise.all([
        prisma.categoria.findMany({
          orderBy: { nome: 'asc' },
          include: {
            _count: { select: { ferramentas: { where: { aprovado: true } } } },
          },
        }),
        prisma.ferramenta.findMany({
          where: { aprovado: true },
          include: { categoria: true },
          orderBy: [{ destaque: 'desc' }, { visualizacoes: 'desc' }],
          take: 6,
        }),
        prisma.ferramenta.count({ where: { aprovado: true } }),
      ])
      return { categorias, ferramentasDestaque, totalFerramentas }
    },
  )
}

function getAvatarColor(name: string): string {
  const colors = [
    '#6366f1', '#ec4899', '#f59e0b', '#10b981',
    '#3b82f6', '#8b5cf6', '#ef4444', '#06b6d4',
    '#84cc16', '#f97316',
  ]
  const hash = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return colors[hash % colors.length]
}

function badgeClass(precificacao: string): string {
  switch (precificacao) {
    case 'GRATUITO': return 'badge-free'
    case 'FREEMIUM': return 'badge-freemium'
    case 'PAGO':     return 'badge-paid'
    default:         return 'badge-freemium'
  }
}

const MARQUEE_TEXT = 'FERRAMENTAS DE IA  ·  EM PORTUGUÊS  ·  CPLP  ·  ANGOLA  ·  BRASIL  ·  PORTUGAL  ·  MOÇAMBIQUE  ·  '

export default async function HomePage() {
  const { categorias, ferramentasDestaque, totalFerramentas } = await getDados()

  return (
    <div className="bg-white">

      {/* ── HERO ─── Stripe-style animated gradient ──────── */}
      <section className="hero-stripe">
        <div className="relative z-[1] max-w-5xl mx-auto px-6 text-center">

          {/* Badge pill — like Stripe's "Sessions conference" banner */}
          <div className="inline-flex items-center gap-2 bg-white border border-[var(--border)] rounded-full px-4 py-1.5 mb-8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium text-[var(--text-secondary)]">
              Diretório de ferramentas de IA em Português
            </span>
          </div>

          {/* Main headline — Stripe uses italic for emphasis */}
          <h1
            className="font-extrabold text-[var(--text-primary)] mb-6 tracking-tight"
            style={{ fontSize: 'clamp(2.6rem, 6vw, 4rem)', lineHeight: 1.1, letterSpacing: '-0.03em' }}
          >
            A melhor IA para{' '}
            <em className="not-italic text-green-600">cada tarefa</em>
            ,<br />em português.
          </h1>

          {/* Sub */}
          <p
            className="text-[var(--text-secondary)] mb-10 max-w-2xl mx-auto"
            style={{ fontSize: '1.125rem', lineHeight: 1.7 }}
          >
            Descobre, compara e acede às melhores ferramentas de inteligência artificial — curadas para {LUSO_AUDIENCE_LINE}.
          </p>

          {/* CTAs — like Stripe's "Get started" + "Contact sales" */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
            <Link href="/categorias" className="btn-primary-clean text-sm">
              Explorar ferramentas →
            </Link>
            <Link href="/submeter" className="btn-outline-clean text-sm">
              Submeter ferramenta
            </Link>
          </div>

          {/* Search */}
          <form
            action="/pesquisa"
            method="GET"
            className="flex gap-2 max-w-lg mx-auto"
          >
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm select-none">🔍</span>
              <input
                name="q"
                type="text"
                placeholder="ex: escrever textos, gerar imagens…"
                className="w-full bg-white border border-[var(--border)] rounded-xl pl-9 pr-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm"
              />
            </div>
            <button type="submit" className="btn-accent-clean text-sm whitespace-nowrap" style={{ borderRadius: '10px' }}>
              Pesquisar
            </button>
          </form>

          <p className="mt-4 text-sm text-slate-400">
            Popular:{' '}
            {['ChatGPT', 'Midjourney', 'Copilot', 'Perplexity'].map((t, i) => (
              <span key={t}>
                <Link href={`/pesquisa?q=${encodeURIComponent(t)}`} className="hover:text-green-600 transition-colors">
                  {t}
                </Link>
                {i < 3 && <span className="mx-2 text-slate-300">·</span>}
              </span>
            ))}
          </p>
        </div>
      </section>

      {/* ── STATS BAND — "The backbone of global commerce" ── */}
      <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: '#fff' }}>
        <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { number: `${totalFerramentas}+`,    label: 'ferramentas curadas' },
            { number: `${categorias.length}`,    label: 'categorias de IA' },
            { number: '100%',                    label: 'em português' },
            { number: 'CPLP',                    label: 'e diáspora lusófona' },
          ].map(({ number, label }) => (
            <div key={label}>
              <div className="stat-number">{number}</div>
              <div className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── MARQUEE — "Global GDP running on Stripe" adaptation */}
      <div className="marquee-wrap">
        <div className="marquee-inner">
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', marginRight: '0' }}
            >
              {MARQUEE_TEXT}
            </span>
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={`d${i}`}
              style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', marginRight: '0' }}
            >
              {MARQUEE_TEXT}
            </span>
          ))}
        </div>
      </div>

      {/* ── CATEGORIES — "Flexible solutions for every business model" */}
      <section style={{ background: 'var(--bg-subtle)', padding: '80px 0' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="section-label mb-2">Explorar por categoria</p>
              <h2
                className="font-bold text-[var(--text-primary)] tracking-tight"
                style={{ fontSize: 'clamp(1.6rem, 3vw, 2.25rem)', letterSpacing: '-0.02em' }}
              >
                Soluções para cada necessidade
              </h2>
            </div>
            <Link
              href="/categorias"
              className="text-sm font-medium text-green-600 hover:text-green-700 transition-colors whitespace-nowrap"
            >
              Ver todas →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categorias.map((cat) => (
              <Link
                key={cat.id}
                href={`/categoria/${cat.slug}`}
                className="feature-card block group"
                style={{ '--cat-color': cat.cor } as React.CSSProperties}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-4"
                  style={{ background: `${cat.cor}18` }}
                >
                  {cat.icone}
                </div>
                <p className="font-semibold text-[var(--text-primary)] text-sm mb-1 group-hover:text-green-700 transition-colors">
                  {cat.nome}
                </p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {cat._count.ferramentas} ferramenta{cat._count.ferramentas !== 1 ? 's' : ''}
                </p>
                <p
                  className="text-xs mt-3 font-medium text-green-600 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Ver categoria →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED TOOLS — "Powering businesses of all sizes" ── */}
      <section style={{ background: '#fff', padding: '80px 0' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="section-label mb-2">Em destaque</p>
              <h2
                className="font-bold text-[var(--text-primary)] tracking-tight"
                style={{ fontSize: 'clamp(1.6rem, 3vw, 2.25rem)', letterSpacing: '-0.02em' }}
              >
                As mais populares da comunidade
              </h2>
            </div>
            <Link
              href="/novidades"
              className="text-sm font-medium text-green-600 hover:text-green-700 transition-colors whitespace-nowrap"
            >
              Ver todas →
            </Link>
          </div>

          {ferramentasDestaque.length === 0 ? (
            <div
              className="rounded-2xl p-16 text-center"
              style={{ border: '2px dashed var(--border)' }}
            >
              <p className="text-3xl mb-3">🚀</p>
              <p className="font-semibold text-slate-500 mb-4">Em breve aqui</p>
              <Link href="/submeter" className="btn-accent-clean text-sm" style={{ padding: '8px 20px' }}>
                Submeter ferramenta →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ferramentasDestaque.map((f) => {
                const avatarColor = getAvatarColor(f.nome)
                const initials = f.nome.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()
                const linkExterno = f.urlAfiliado || f.url

                return (
                  <div key={f.id} className="tool-card-clean group">
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div
                        className="rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
                        style={{
                          width: '44px',
                          height: '44px',
                          background: f.logoUrl ? '#f6f9fc' : `${avatarColor}15`,
                          border: `1.5px solid ${avatarColor}25`,
                        }}
                      >
                        {f.logoUrl ? (
                          <Image
                            src={f.logoUrl}
                            alt={f.nome}
                            width={44}
                            height={44}
                            className="w-full h-full object-contain p-1"
                          />
                        ) : (
                          <span className="text-sm font-bold" style={{ color: avatarColor }}>
                            {initials}
                          </span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <Link
                            href={`/ferramenta/${f.slug}`}
                            className="font-semibold text-sm text-[var(--text-primary)] hover:text-green-700 transition-colors leading-snug"
                          >
                            {f.nome}
                          </Link>
                          {f.destaque && <span className="badge-featured">⭐ Destaque</span>}
                        </div>
                        <p className="text-xs leading-relaxed mb-3 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                          {f.descricao}
                        </p>
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className={badgeClass(f.precificacao)}>{labelPreco(f.precificacao)}</span>
                            <Link
                              href={`/categoria/${f.categoria.slug}`}
                              className="text-xs transition-colors hover:text-green-600"
                              style={{ color: 'var(--text-muted)' }}
                            >
                              {f.categoria.icone} {f.categoria.nome}
                            </Link>
                          </div>
                          <a
                            href={linkExterno}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-medium text-green-600 hover:text-green-700 transition-colors flex items-center gap-0.5"
                          >
                            Visitar →
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── NEWSLETTER — dark section like Stripe's bottom CTA ── */}
      <section style={{ background: 'var(--text-primary)', padding: '80px 0' }}>
        <div className="max-w-2xl mx-auto px-6 text-center">
          <p className="section-label mb-3" style={{ color: '#4ade80' }}>Newsletter gratuita</p>
          <h2
            className="font-bold text-white mb-4 tracking-tight"
            style={{ fontSize: 'clamp(1.6rem, 3vw, 2rem)', letterSpacing: '-0.02em' }}
          >
            Novidades de IA todas as semanas
          </h2>
          <p className="mb-8" style={{ color: '#8898aa', lineHeight: 1.7 }}>
            As melhores ferramentas novas, tutoriais e dicas de IA — em português, sem spam.
          </p>
          <form action="/api/newsletter" method="POST" className="flex gap-2 max-w-sm mx-auto">
            <input
              name="email"
              type="email"
              required
              placeholder="o.teu@email.com"
              className="flex-1 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
            />
            <button type="submit" className="btn-accent-clean text-sm whitespace-nowrap" style={{ padding: '10px 18px' }}>
              Subscrever
            </button>
          </form>
        </div>
      </section>

      {/* ── CTA — green section like Stripe's "Ready to get started?" */}
      <section style={{ background: '#16a34a', padding: '72px 0' }}>
        <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h2
              className="font-bold text-white mb-2 tracking-tight"
              style={{ fontSize: '1.5rem', letterSpacing: '-0.02em' }}
            >
              Tens uma ferramenta de IA?
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '15px' }}>
              Aparece em frente de milhares de profissionais lusófonos — CPLP e diáspora.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link
              href="/submeter"
              className="text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
              style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.25)' }}
            >
              Submeter grátis
            </Link>
            <Link
              href="/destaque"
              className="text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
              style={{ background: 'white', color: '#16a34a' }}
            >
              Destacar ↗
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
