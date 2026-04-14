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
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colors[hash % colors.length]
}

const MARQUEE_TEXT = 'FERRAMENTAS DE IA · EM PORTUGUÊS · '

export default async function HomePage() {
  const { categorias, ferramentasDestaque, totalFerramentas } = await getDados()
  const heroCategories = categorias.slice(0, 4)

  return (
    <div style={{ background: '#080808', minHeight: '100vh' }}>

      {/* ── HERO ─────────────────────────────────────── */}
      <section className="hero-v2">
        <div
          className="relative max-w-7xl mx-auto px-6 sm:px-10"
          style={{ paddingTop: '64px', paddingBottom: '64px' }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20 items-center">

            {/* Left — 60% */}
            <div className="lg:col-span-3">
              <p
                className="font-grotesk font-bold uppercase mb-6"
                style={{ color: '#00ff88', fontSize: '11px', letterSpacing: '0.3em' }}
              >
                — O DIRETÓRIO
              </p>

              <h1 className="font-grotesk mb-8" style={{ fontWeight: 900, lineHeight: 0.88 }}>
                <span
                  className="block text-white"
                  style={{ fontSize: 'clamp(3.5rem, 9vw, 8.5rem)' }}
                >
                  DESCOBRE
                </span>
                <span
                  className="block text-white"
                  style={{ fontSize: 'clamp(3.5rem, 9vw, 8.5rem)' }}
                >
                  A MELHOR
                </span>
                <span
                  className="block"
                  style={{ fontSize: 'clamp(3.5rem, 9vw, 8.5rem)', color: '#00ff88' }}
                >
                  IA.
                </span>
              </h1>

              <p
                className="leading-relaxed mb-10"
                style={{ color: 'rgba(240,240,240,0.4)', fontSize: '15px', maxWidth: '400px' }}
              >
                Descobre e compara as melhores ferramentas de inteligência artificial. Curadas para{' '}
                {LUSO_AUDIENCE_LINE}.
              </p>

              <form action="/pesquisa" method="GET" className="flex gap-2" style={{ maxWidth: '480px' }}>
                <div className="relative flex-1">
                  <span
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 select-none"
                    style={{ color: 'rgba(240,240,240,0.25)', fontSize: '14px' }}
                  >
                    🔍
                  </span>
                  <input
                    name="q"
                    type="text"
                    placeholder="Pesquisa uma ferramenta de IA…"
                    style={{
                      width: '100%',
                      background: '#111',
                      border: '1px solid #2a2a2a',
                      borderRadius: '10px',
                      paddingLeft: '38px',
                      paddingRight: '16px',
                      paddingTop: '14px',
                      paddingBottom: '14px',
                      fontSize: '14px',
                      color: '#f0f0f0',
                      outline: 'none',
                    }}
                  />
                </div>
                <button
                  type="submit"
                  className="btn-accent text-sm whitespace-nowrap"
                  style={{ borderRadius: '10px', padding: '14px 20px' }}
                >
                  Pesquisar
                </button>
              </form>

              <div className="flex flex-wrap items-center gap-3 mt-5">
                <span style={{ color: 'rgba(240,240,240,0.2)', fontSize: '11px' }}>Popular:</span>
                {['ChatGPT', 'Midjourney', 'Copilot', 'Perplexity'].map((t) => (
                  <Link
                    key={t}
                    href={`/pesquisa?q=${encodeURIComponent(t)}`}
                    className="transition-colors"
                    style={{ color: 'rgba(240,240,240,0.25)', fontSize: '12px' }}
                  >
                    {t}
                  </Link>
                ))}
              </div>

              <div
                className="flex flex-wrap gap-6 mt-10 pt-8"
                style={{ borderTop: '1px solid #1a1a1a' }}
              >
                {[
                  { label: `${totalFerramentas}+ ferramentas` },
                  { label: `${categorias.length} categorias` },
                  { label: '100% em português' },
                  { label: 'Curadas & atualizadas' },
                ].map(({ label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2 text-sm"
                    style={{ color: 'rgba(240,240,240,0.25)' }}
                  >
                    <span
                      style={{
                        width: '4px',
                        height: '4px',
                        borderRadius: '50%',
                        background: '#00ff88',
                        display: 'inline-block',
                        flexShrink: 0,
                      }}
                    />
                    {label}
                  </div>
                ))}
              </div>
            </div>

            {/* Right — 40%: 2×2 category grid */}
            <div className="lg:col-span-2 grid grid-cols-2 gap-3">
              {heroCategories.length > 0
                ? heroCategories.map((cat) => (
                    <Link key={cat.id} href={`/categoria/${cat.slug}`} className="cat-card-v2 block">
                      <div style={{ fontSize: '1.75rem', marginBottom: '12px' }}>{cat.icone}</div>
                      <p
                        className="font-grotesk font-bold text-white leading-snug mb-1"
                        style={{ fontSize: '13px' }}
                      >
                        {cat.nome}
                      </p>
                      <p style={{ color: 'rgba(240,240,240,0.3)', fontSize: '11px' }}>
                        {cat._count.ferramentas} ferramentas
                      </p>
                    </Link>
                  ))
                : [
                    { icon: '✍️', label: 'Escrita' },
                    { icon: '🎨', label: 'Design' },
                    { icon: '💻', label: 'Código' },
                    { icon: '📈', label: 'Negócios' },
                  ].map((c) => (
                    <div key={c.label} className="cat-card-v2">
                      <div style={{ fontSize: '1.75rem', marginBottom: '12px' }}>{c.icon}</div>
                      <p className="font-grotesk font-bold text-white" style={{ fontSize: '13px' }}>
                        {c.label}
                      </p>
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE ──────────────────────────────────── */}
      <div className="marquee-container" style={{ background: '#00ff88', padding: '13px 0' }}>
        <div className="marquee-track">
          {Array.from({ length: 12 }).map((_, i) => (
            <span
              key={i}
              className="font-grotesk font-bold uppercase"
              style={{ color: '#080808', fontSize: '13px', letterSpacing: '0.05em' }}
            >
              {MARQUEE_TEXT}
            </span>
          ))}
        </div>
      </div>

      {/* ── CATEGORIAS ───────────────────────────────── */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '80px 40px' }}>
        <div className="flex items-baseline gap-3 mb-10">
          <h2
            className="font-grotesk text-white"
            style={{ fontWeight: 900, fontSize: 'clamp(2rem, 4vw, 3rem)' }}
          >
            EXPLORAR
          </h2>
          <sup
            className="font-grotesk font-bold"
            style={{ color: '#00ff88', fontSize: '1rem', top: '0' }}
          >
            {categorias.length}
          </sup>
          <Link
            href="/categorias"
            className="ml-auto transition-colors"
            style={{ color: 'rgba(240,240,240,0.25)', fontSize: '12px' }}
          >
            Ver todas →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {categorias.map((cat) => (
            <Link
              key={cat.id}
              href={`/categoria/${cat.slug}`}
              className="cat-card-v2 block relative overflow-hidden"
            >
              <div
                className="absolute top-0 left-0 right-0"
                style={{ height: '3px', background: cat.cor }}
              />
              <div style={{ fontSize: '2rem', marginBottom: '10px', marginTop: '8px' }}>
                {cat.icone}
              </div>
              <p
                className="font-grotesk font-bold text-white leading-snug mb-1"
                style={{ fontSize: '13px' }}
              >
                {cat.nome}
              </p>
              <p style={{ color: 'rgba(240,240,240,0.35)', fontSize: '11px' }}>
                {cat._count.ferramentas} ferramentas
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FERRAMENTAS EM DESTAQUE ───────────────────── */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 40px 80px' }}>
        <div className="flex flex-col md:flex-row gap-10 md:gap-16">

          {/* Vertical label */}
          <div className="flex flex-row md:flex-col items-start gap-4 md:gap-0 shrink-0 md:w-36">
            <div
              style={{ width: '2px', height: '40px', background: '#00ff88' }}
              className="hidden md:block"
            />
            <h2
              className="font-grotesk text-white"
              style={{ fontWeight: 900, fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', lineHeight: 1 }}
            >
              EM
              <br />
              DESTAQUE
            </h2>
            <div
              style={{ width: '2px', flex: 1, background: '#1a1a1a', minHeight: '60px' }}
              className="hidden md:block"
            />
            <Link
              href="/novidades"
              className="transition-colors md:mt-4 whitespace-nowrap"
              style={{ color: 'rgba(240,240,240,0.25)', fontSize: '12px' }}
            >
              Ver todas →
            </Link>
          </div>

          {/* Cards */}
          <div className="flex-1">
            {ferramentasDestaque.length === 0 ? (
              <div
                className="rounded-2xl p-12 text-center"
                style={{ border: '2px dashed #1a1a1a' }}
              >
                <p className="text-3xl mb-3">🚀</p>
                <p
                  className="font-grotesk font-bold mb-4"
                  style={{ color: 'rgba(240,240,240,0.4)' }}
                >
                  Em breve aqui
                </p>
                <Link href="/submeter" className="btn-accent text-xs" style={{ padding: '8px 16px' }}>
                  Submeter →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                    <div key={f.id} className="tool-card-v2">
                      <div className="flex items-start gap-3">
                        <div
                          className="rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
                          style={{
                            width: '44px',
                            height: '44px',
                            background: f.logoUrl ? '#1a1a1a' : `${avatarColor}18`,
                            border: `1.5px solid ${avatarColor}30`,
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
                            <span
                              className="font-grotesk font-bold"
                              style={{ color: avatarColor, fontSize: '13px' }}
                            >
                              {initials}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <Link
                              href={`/ferramenta/${f.slug}`}
                              className="font-grotesk font-semibold text-white transition-colors hover:text-[#00ff88] leading-snug"
                              style={{ fontSize: '14px' }}
                            >
                              {f.nome}
                            </Link>
                            {f.destaque && (
                              <span className="tag-pill" style={{ fontSize: '10px' }}>
                                ⭐ Destaque
                              </span>
                            )}
                          </div>
                          <p
                            className="line-clamp-2 leading-relaxed mb-3"
                            style={{ fontSize: '12px', color: 'rgba(240,240,240,0.45)' }}
                          >
                            {f.descricao}
                          </p>
                          <div className="flex items-center justify-between gap-2">
                            <span className="tag-pill">{labelPreco(f.precificacao)}</span>
                            <a
                              href={linkExterno}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium flex items-center gap-0.5 transition-colors hover:text-[#00ff88]"
                              style={{ fontSize: '12px', color: 'rgba(240,240,240,0.3)' }}
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
        </div>
      </section>

      {/* ── CTA: SUBMETER ────────────────────────────── */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 40px 100px' }}>
        <div
          className="rounded-2xl p-8 md:p-12 flex flex-col sm:flex-row items-center justify-between gap-6"
          style={{ background: '#111', border: '1px solid #1a1a1a' }}
        >
          <div>
            <p
              className="font-grotesk font-bold text-white mb-2"
              style={{ fontSize: '1.2rem' }}
            >
              Tens uma ferramenta de IA?
            </p>
            <p style={{ color: 'rgba(240,240,240,0.35)', fontSize: '14px' }}>
              Aparece em frente de milhares de profissionais lusófonos — CPLP e diáspora.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link
              href="/submeter"
              className="text-sm font-medium px-5 py-3 rounded-lg transition-colors"
              style={{ border: '1px solid #2a2a2a', color: 'rgba(240,240,240,0.7)' }}
            >
              Submeter grátis
            </Link>
            <Link href="/destaque" className="btn-accent text-sm" style={{ padding: '12px 20px' }}>
              Destacar ↗
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
