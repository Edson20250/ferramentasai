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
  description:
    'Descobre, compara e acede às melhores ferramentas de inteligência artificial em português. Curado para profissionais lusófonos.',
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

const MARQUEE_ITEMS = [
  'Portugal', '·', 'Brasil', '·', 'Angola', '·', 'Moçambique', '·',
  'Cabo Verde', '·', 'Timor-Leste', '·', 'São Tomé e Príncipe', '·',
  'Guiné-Bissau', '·', 'Macau', '·', 'Diáspora Lusófona', '·',
]

export default async function HomePage() {
  const { categorias, ferramentasDestaque, totalFerramentas } = await getDados()

  return (
    <div>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="hero-premium">
        <div className="relative z-[1] max-w-3xl mx-auto px-5 sm:px-8 text-center">

          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-[var(--surface-subtle)] border border-[var(--border)] text-sm">
            <span className="inline-flex w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0" />
            <span className="font-medium text-[var(--muted)]">
              O diretório de IA para o mundo lusófono
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-extrabold tracking-tight text-[var(--foreground)] mb-5"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              lineHeight: 1.08,
              letterSpacing: '-0.035em',
            }}
          >
            A IA que precisas,<br />
            <span className="text-green-600">em português.</span>
          </h1>

          {/* Subtitle */}
          <p
            className="text-[var(--muted)] mb-10 max-w-xl mx-auto leading-relaxed"
            style={{ fontSize: '1.0625rem' }}
          >
            Descobre, compara e acede às melhores ferramentas de inteligência artificial —
            curadas para {LUSO_AUDIENCE_LINE}.
          </p>

          {/* Search — primary action */}
          <div className="max-w-lg mx-auto mb-6">
            <form action="/pesquisa" method="GET" className="search-premium">
              <svg
                width="16" height="16" viewBox="0 0 16 16" fill="none"
                className="text-[var(--muted-foreground)] shrink-0"
              >
                <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M10.5 10.5L13.5 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                name="q"
                type="text"
                placeholder="Pesquisar ferramentas de IA…"
                autoComplete="off"
              />
              <button type="submit" className="btn-accent" style={{ padding: '9px 18px', fontSize: '13px', borderRadius: '8px' }}>
                Pesquisar
              </button>
            </form>
          </div>

          {/* Popular searches */}
          <div className="flex flex-wrap items-center justify-center gap-x-1 gap-y-1.5 text-sm text-[var(--muted-foreground)] mb-10">
            <span className="mr-1">Popular:</span>
            {[
              { label: 'ChatGPT', q: 'ChatGPT' },
              { label: 'Midjourney', q: 'Midjourney' },
              { label: 'Copilot', q: 'Copilot' },
              { label: 'Perplexity', q: 'Perplexity' },
              { label: 'Gamma', q: 'Gamma' },
            ].map(({ label, q }, i, arr) => (
              <span key={q} className="inline-flex items-center gap-1">
                <Link
                  href={`/pesquisa?q=${encodeURIComponent(q)}`}
                  className="hover:text-green-600 hover:underline underline-offset-2 transition-colors font-medium"
                >
                  {label}
                </Link>
                {i < arr.length - 1 && <span className="text-[var(--border-strong)]">·</span>}
              </span>
            ))}
          </div>

          {/* Secondary CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/categorias" className="btn-primary" style={{ fontSize: '13.5px' }}>
              Explorar ferramentas
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link href="/submeter" className="btn-outline" style={{ fontSize: '13.5px' }}>
              Submeter ferramenta
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS BAND ───────────────────────────────────────────── */}
      <div className="stats-band">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[var(--border)]">
            {[
              { value: `${totalFerramentas}+`, label: 'ferramentas curadas' },
              { value: `${categorias.length}`,  label: 'categorias de IA' },
              { value: '100%',                  label: 'em português' },
              { value: 'CPLP',                  label: 'e diáspora lusófona' },
            ].map(({ value, label }) => (
              <div key={label} className="stat-item text-center">
                <span className="stat-value">{value}</span>
                <span className="stat-label">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MARQUEE ──────────────────────────────────────────────── */}
      <div className="marquee-wrap">
        <div className="marquee-inner" aria-hidden>
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span
              key={i}
              className={item === '·' ? 'marquee-dot' : 'marquee-item'}
            >
              {item}
            </span>
          ))}
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span
              key={`b${i}`}
              className={item === '·' ? 'marquee-dot' : 'marquee-item'}
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── CATEGORIES ───────────────────────────────────────────── */}
      <section style={{ background: 'var(--surface-subtle)', padding: '88px 0' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8">

          {/* Section header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
            <div>
              <span className="section-eyebrow">Explorar por categoria</span>
              <h2 className="section-heading">
                Soluções para cada necessidade
              </h2>
            </div>
            <Link
              href="/categorias"
              className="text-sm font-semibold text-green-600 hover:text-green-700 transition-colors flex items-center gap-1 shrink-0"
            >
              Ver todas as categorias
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {categorias.map((cat) => (
              <Link
                key={cat.id}
                href={`/categoria/${cat.slug}`}
                className="cat-card-premium group"
                style={{ '--cat-color': cat.cor } as React.CSSProperties}
              >
                {/* Color accent line */}
                <span className="card-accent" />

                {/* Icon */}
                <div
                  className="cat-icon-wrap"
                  style={{ background: `${cat.cor}15` }}
                >
                  {cat.icone}
                </div>

                {/* Name */}
                <p className="font-semibold text-sm text-[var(--foreground)] mb-1 group-hover:text-green-700 transition-colors leading-snug">
                  {cat.nome}
                </p>

                {/* Count */}
                <p className="text-xs text-[var(--muted-foreground)]">
                  {cat._count.ferramentas}{' '}
                  ferramenta{cat._count.ferramentas !== 1 ? 's' : ''}
                </p>

                {/* Hover arrow */}
                <span className="mt-3 text-xs font-semibold text-green-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  Ver categoria
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED TOOLS ───────────────────────────────────────── */}
      <section style={{ background: 'var(--surface)', padding: '88px 0' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8">

          {/* Section header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
            <div>
              <span className="section-eyebrow">Em destaque</span>
              <h2 className="section-heading">
                As mais populares da comunidade
              </h2>
            </div>
            <Link
              href="/novidades"
              className="text-sm font-semibold text-green-600 hover:text-green-700 transition-colors flex items-center gap-1 shrink-0"
            >
              Ver todas
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          {ferramentasDestaque.length === 0 ? (
            <div
              className="rounded-2xl p-16 text-center"
              style={{ border: '2px dashed var(--border)' }}
            >
              <p className="text-3xl mb-3">🚀</p>
              <p className="font-semibold text-[var(--muted)] mb-4">Em breve aqui</p>
              <Link href="/submeter" className="btn-accent" style={{ padding: '8px 20px', fontSize: '13px' }}>
                Submeter ferramenta →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ferramentasDestaque.map((f) => {
                const avatarColor = getAvatarColor(f.nome)
                const initials = f.nome
                  .split(' ')
                  .map((w: string) => w[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase()
                const linkExterno = f.urlAfiliado || f.url

                return (
                  <article key={f.id} className="tool-card-premium group">

                    {/* Header: avatar + name + badge */}
                    <div className="flex items-start gap-3.5">
                      {/* Avatar */}
                      <div
                        className="tool-avatar"
                        style={{
                          background: f.logoUrl ? 'var(--surface-subtle)' : `${avatarColor}16`,
                          border: `1.5px solid ${avatarColor}28`,
                        }}
                      >
                        {f.logoUrl ? (
                          <Image
                            src={f.logoUrl}
                            alt={f.nome}
                            width={48}
                            height={48}
                            className="w-full h-full object-contain p-1.5"
                          />
                        ) : (
                          <span style={{ color: avatarColor }}>{initials}</span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 pt-0.5">
                        <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                          <Link
                            href={`/ferramenta/${f.slug}`}
                            className="font-semibold text-[var(--foreground)] hover:text-green-700 transition-colors text-sm leading-snug"
                          >
                            {f.nome}
                          </Link>
                          {f.destaque && (
                            <span className="badge-featured">⭐ Destaque</span>
                          )}
                        </div>

                        {/* Category */}
                        <Link
                          href={`/categoria/${f.categoria.slug}`}
                          className="text-xs text-[var(--muted-foreground)] hover:text-green-600 transition-colors"
                        >
                          {f.categoria.icone} {f.categoria.nome}
                        </Link>
                      </div>
                    </div>

                    {/* Description */}
                    <p
                      className="text-sm leading-relaxed line-clamp-2"
                      style={{ color: 'var(--muted)' }}
                    >
                      {f.descricao}
                    </p>

                    {/* Footer: badge + CTA */}
                    <div className="flex items-center justify-between pt-1" style={{ borderTop: '1px solid var(--border)', paddingTop: '14px', marginTop: '-2px' }}>
                      <span className={badgeClass(f.precificacao)}>
                        {labelPreco(f.precificacao)}
                      </span>
                      <a
                        href={linkExterno}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-green-600 hover:text-green-700 transition-colors flex items-center gap-1"
                      >
                        Visitar
                        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                          <path d="M2 9L9 2M9 2H5M9 2v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </a>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── NEWSLETTER ───────────────────────────────────────────── */}
      <section style={{ background: 'var(--primary)', padding: '80px 0' }}>
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-center gap-10 md:gap-16">

            {/* Text */}
            <div className="flex-1">
              <span className="section-eyebrow" style={{ color: '#4ade80' }}>
                Newsletter gratuita
              </span>
              <h2
                className="font-bold text-white mb-3 tracking-tight"
                style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', letterSpacing: '-0.025em' }}
              >
                Novidades de IA todas as semanas
              </h2>
              <p style={{ color: '#8898aa', lineHeight: 1.7, fontSize: '15px' }}>
                As melhores ferramentas novas, tutoriais e dicas de IA — em português, sem spam.
              </p>
            </div>

            {/* Form */}
            <div className="md:w-80 shrink-0">
              <form action="/api/newsletter" method="POST" className="flex flex-col gap-3">
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="o.teu@email.com"
                  className="w-full rounded-lg px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                  style={{
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.12)',
                  }}
                />
                <button type="submit" className="btn-accent w-full">
                  Subscrever newsletter
                </button>
              </form>
              <p className="text-xs mt-3" style={{ color: 'rgba(255,255,255,0.25)' }}>
                Sem spam. Cancelamento fácil a qualquer momento.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SUBMISSION CTA ────────────────────────────────────────── */}
      <section style={{ background: '#f0fdf4', borderTop: '1px solid #bbf7d0', padding: '72px 0' }}>
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">

            {/* Text */}
            <div>
              <span className="section-eyebrow">Para criadores e empresas</span>
              <h2
                className="font-bold text-[var(--foreground)] mb-2 tracking-tight"
                style={{ fontSize: 'clamp(1.4rem, 3vw, 1.875rem)', letterSpacing: '-0.025em' }}
              >
                Tens uma ferramenta de IA?
              </h2>
              <p className="text-[var(--muted)]" style={{ fontSize: '15px', maxWidth: '440px' }}>
                Aparece em frente de milhares de profissionais lusófonos — CPLP e diáspora.
                Submissão gratuita sempre disponível.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link href="/submeter" className="btn-outline">
                Submeter grátis
              </Link>
              <Link href="/destaque" className="btn-accent">
                Destacar ferramenta ↗
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
