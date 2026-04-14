import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { ToolCard } from '@/components/ToolCard'
import { formatPreco, labelPreco, safeUrlHostname } from '@/lib/utils'
import { isDatabaseConfigured } from '@/lib/db-config'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    if (!isDatabaseConfigured()) return {}
    const f = await prisma.ferramenta.findUnique({ where: { slug }, include: { categoria: true } })
    if (!f) return {}
    return {
      title: `${f.nome} — Ferramenta de IA em Português | FerramentasAI`,
      description: f.descricao,
      keywords: [...f.tags, f.categoria.nome, 'ferramenta ia português'],
    }
  } catch {
    return {}
  }
}

/* ── Helpers ─────────────────────────────────────────────── */

function getAvatarColor(name: string): string {
  const palette = [
    '#6366f1','#ec4899','#f59e0b','#10b981',
    '#3b82f6','#8b5cf6','#ef4444','#06b6d4',
    '#84cc16','#f97316',
  ]
  const hash = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  return palette[hash % palette.length]
}

function badgeClass(p: string) {
  if (p === 'GRATUITO') return 'badge-free'
  if (p === 'PAGO')     return 'badge-paid'
  return 'badge-freemium'
}

/** Render 5 star SVGs, filled up to `rating` */
function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`${rating.toFixed(1)} estrelas`}>
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            fill={i <= Math.round(rating) ? '#f59e0b' : 'none'}
            stroke={i <= Math.round(rating) ? '#f59e0b' : '#d1d5db'}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </span>
  )
}

/* ── Page ────────────────────────────────────────────────── */

export default async function FerramentaPage({ params }: Props) {
  const { slug } = await params

  let f
  let relacionadas

  try {
    if (!isDatabaseConfigured()) notFound()
    const found = await prisma.ferramenta.findUnique({
      where: { slug, aprovado: true },
      include: {
        categoria: true,
        avaliacoes: {
          where: { NOT: { comentario: null } },
          orderBy: { criadoEm: 'desc' },
          take: 5,
        },
      },
    })
    if (!found) notFound()
    f = found

    prisma.ferramenta
      .update({ where: { id: f.id }, data: { visualizacoes: { increment: 1 } } })
      .catch(() => {})

    relacionadas = await prisma.ferramenta.findMany({
      where: { categoriaId: f.categoriaId, aprovado: true, id: { not: f.id } },
      include: { categoria: true },
      orderBy: { destaque: 'desc' },
      take: 4,
    })
  } catch {
    notFound()
  }

  const linkExterno = f.urlAfiliado || f.url
  const initials = f.nome.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()
  const avatarColor = getAvatarColor(f.nome)
  const temAvaliacao = f.totalAvaliacoes > 0

  return (
    <div className="min-h-screen" style={{ background: 'var(--surface-subtle)' }}>

      {/* ══════════════ PAGE HEADER ══════════════════════ */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8">

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)] mb-6">
            <Link href="/" className="hover:text-[var(--foreground)] transition-colors">Início</Link>
            <span aria-hidden>/</span>
            <Link href={`/categoria/${f.categoria.slug}`} className="hover:text-[var(--foreground)] transition-colors">
              {f.categoria.nome}
            </Link>
            <span aria-hidden>/</span>
            <span className="text-[var(--foreground)] truncate max-w-[180px]">{f.nome}</span>
          </nav>

          {/* Tool identity row */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">

            {/* Avatar */}
            <div
              className="w-[68px] h-[68px] rounded-2xl flex items-center justify-center shrink-0 overflow-hidden font-bold text-xl"
              style={{
                background: f.logoUrl ? 'var(--surface-muted)' : `${avatarColor}16`,
                border: `2px solid ${avatarColor}28`,
              }}
            >
              {f.logoUrl ? (
                <Image src={f.logoUrl} alt={f.nome} width={68} height={68} className="w-full h-full object-contain p-2" />
              ) : (
                <span style={{ color: avatarColor }}>{initials}</span>
              )}
            </div>

            {/* Name + badges */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <h1
                  className="font-bold text-[var(--foreground)] tracking-tight"
                  style={{ fontSize: 'clamp(1.375rem, 3vw, 1.875rem)', letterSpacing: '-0.025em' }}
                >
                  {f.nome}
                </h1>
                <span className={badgeClass(f.precificacao)}>{labelPreco(f.precificacao)}</span>
                {f.emPortugues && (
                  <span className="badge-verified-pt">🇵🇹 Português</span>
                )}
                {f.verificado && (
                  <span className="badge-verified">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Verificado
                  </span>
                )}
                {f.destaque && <span className="badge-featured">⭐ Destaque</span>}
              </div>

              {/* Category + rating */}
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href={`/categoria/${f.categoria.slug}`}
                  className="text-sm text-[var(--muted-foreground)] hover:text-green-600 transition-colors"
                >
                  {f.categoria.icone} {f.categoria.nome}
                </Link>
                {temAvaliacao && (
                  <div className="flex items-center gap-1.5">
                    <Stars rating={f.avaliacaoMedia} />
                    <span className="text-xs font-semibold text-[var(--foreground)]">
                      {f.avaliacaoMedia.toFixed(1)}
                    </span>
                    <span className="text-xs text-[var(--muted-foreground)]">
                      ({f.totalAvaliacoes} avaliação{f.totalAvaliacoes !== 1 ? 'ões' : ''})
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Desktop CTA */}
            <div className="hidden sm:flex items-center gap-2.5 shrink-0 pt-1">
              <Link
                href={`/categoria/${f.categoria.slug}`}
                className="btn-outline"
                style={{ fontSize: '13px', padding: '9px 16px' }}
              >
                Similares
              </Link>
              <a
                href={linkExterno}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-accent"
                style={{ fontSize: '13px', padding: '9px 16px' }}
              >
                Visitar {f.nome} ↗
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════ BODY ═════════════════════════════ */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* ══ MAIN CONTENT ═══════════════════════════════ */}
          <article className="flex-1 min-w-0 space-y-4">

            {/* About card */}
            <div
              className="rounded-2xl p-6"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <h2 className="card-section-label">Sobre</h2>
              <p className="text-[var(--muted)] leading-relaxed">{f.descricao}</p>

              {/* Long description */}
              {f.descricaoLonga && (
                <div
                  className="mt-4 pt-4 space-y-3"
                  style={{ borderTop: '1px solid var(--border)' }}
                >
                  {f.descricaoLonga.split('\n\n').map((para, i) => (
                    <p key={i} className="text-[var(--muted)] leading-relaxed text-sm">
                      {para}
                    </p>
                  ))}
                </div>
              )}

              {/* Tags */}
              {f.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                  {f.tags.map(tag => (
                    <Link
                      key={tag}
                      href={`/pesquisa?q=${encodeURIComponent(tag)}`}
                      className="text-xs font-medium px-2.5 py-1 rounded-full transition-colors"
                      style={{
                        background: 'var(--surface-muted)',
                        color: 'var(--muted-foreground)',
                        border: '1px solid var(--border)',
                      }}
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              )}

              {/* Mobile CTAs */}
              <div className="flex flex-col sm:hidden gap-2 mt-5">
                <a href={linkExterno} target="_blank" rel="noopener noreferrer" className="btn-accent text-center">
                  Visitar {f.nome} ↗
                </a>
                <Link href={`/categoria/${f.categoria.slug}`} className="btn-outline text-center">
                  Ver ferramentas similares
                </Link>
              </div>

              {f.urlAfiliado && (
                <p className="text-[11px] mt-4 pt-3" style={{ color: 'var(--muted-foreground)', borderTop: '1px solid var(--border)' }}>
                  * Link de afiliado — podemos receber comissão sem custo para ti.
                </p>
              )}
            </div>

            {/* Info grid */}
            <div
              className="rounded-2xl p-6"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <h2 className="card-section-label">Informações</h2>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {([
                  {
                    label: 'Precificação',
                    content: <span className={badgeClass(f.precificacao)}>{labelPreco(f.precificacao)}</span>,
                  },
                  f.precoMensal != null && f.precoMensal > 0
                    ? {
                        label: 'Preço',
                        content: <span className="text-sm font-semibold text-[var(--foreground)]">{formatPreco(f.precificacao, f.precoMensal)}</span>,
                      }
                    : null,
                  {
                    label: 'Interface em Português',
                    content: (
                      <span className={`text-sm font-medium ${f.emPortugues ? 'text-green-600' : 'text-[var(--muted)]'}`}>
                        {f.emPortugues ? '✅ Sim' : '❌ Não'}
                      </span>
                    ),
                  },
                  {
                    label: 'Categoria',
                    content: (
                      <Link href={`/categoria/${f.categoria.slug}`} className="text-sm font-medium text-green-600 hover:text-green-700 transition-colors">
                        {f.categoria.icone} {f.categoria.nome}
                      </Link>
                    ),
                  },
                  {
                    label: 'Website',
                    content: (
                      <a href={f.url} target="_blank" rel="noopener noreferrer"
                        className="text-sm font-medium text-green-600 hover:text-green-700 transition-colors truncate block max-w-[200px]">
                        {safeUrlHostname(f.url)} ↗
                      </a>
                    ),
                  },
                  temAvaliacao
                    ? {
                        label: 'Avaliação',
                        content: (
                          <div className="flex items-center gap-2">
                            <Stars rating={f.avaliacaoMedia} />
                            <span className="text-sm font-semibold text-[var(--foreground)]">
                              {f.avaliacaoMedia.toFixed(1)}
                            </span>
                            <span className="text-xs text-[var(--muted-foreground)]">
                              / {f.totalAvaliacoes} votos
                            </span>
                          </div>
                        ),
                      }
                    : null,
                ] as Array<{ label: string; content: React.ReactNode } | null>)
                  .filter(Boolean)
                  .map((item) => {
                    if (!item) return null
                    return (
                      <div key={item.label}>
                        <dt className="info-label">{item.label}</dt>
                        <dd className="mt-1">{item.content}</dd>
                      </div>
                    )
                  })}
              </dl>
            </div>

            {/* Reviews */}
            {f.avaliacoes.length > 0 && (
              <div
                className="rounded-2xl p-6"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
              >
                <div className="flex items-center justify-between mb-5">
                  <h2 className="card-section-label" style={{ marginBottom: 0 }}>Avaliações</h2>
                  {temAvaliacao && (
                    <div className="flex items-center gap-2">
                      <Stars rating={f.avaliacaoMedia} size={13} />
                      <span className="text-xs font-semibold text-[var(--foreground)]">
                        {f.avaliacaoMedia.toFixed(1)} · {f.totalAvaliacoes} avaliação{f.totalAvaliacoes !== 1 ? 'ões' : ''}
                      </span>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  {f.avaliacoes.map(av => (
                    <div
                      key={av.id}
                      className="p-4 rounded-xl"
                      style={{ background: 'var(--surface-subtle)', border: '1px solid var(--border)' }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Stars rating={av.nota} size={12} />
                        <span className="text-xs text-[var(--muted-foreground)]">
                          {new Date(av.criadoEm).toLocaleDateString('pt-PT', {
                            day: 'numeric', month: 'short', year: 'numeric',
                          })}
                        </span>
                      </div>
                      {av.comentario && (
                        <p className="text-sm text-[var(--muted)] leading-relaxed">{av.comentario}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* ══ SIDEBAR ════════════════════════════════════ */}
          <aside className="lg:w-72 shrink-0 space-y-4">

            {/* Visit CTA — sticky card */}
            <div
              className="rounded-2xl p-5"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
            >
              <a
                href={linkExterno}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-accent w-full text-center mb-3"
                style={{ fontSize: '14px', padding: '12px 0' }}
              >
                Visitar {f.nome} ↗
              </a>
              <p className="text-xs text-center" style={{ color: 'var(--muted-foreground)' }}>
                Abre em nova janela
              </p>
            </div>

            {/* Destaque CTA */}
            <div className="rounded-2xl p-5" style={{ background: 'var(--primary)' }}>
              <p className="font-semibold text-white text-sm mb-1.5">
                Trabalhas nesta ferramenta?
              </p>
              <p className="text-xs leading-relaxed mb-4" style={{ color: '#8898aa' }}>
                Destaca-a e alcança profissionais em todo o espaço lusófono — CPLP e diáspora.
              </p>
              <Link
                href={`/destaque?ferramentaId=${encodeURIComponent(f.id)}`}
                className="btn-accent w-full text-center"
                style={{ fontSize: '13px', padding: '9px 0' }}
              >
                Destacar no diretório →
              </Link>
            </div>

            {/* Related tools */}
            {relacionadas.length > 0 && (
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--muted-foreground)] mb-3 px-1">
                  Ferramentas similares
                </p>
                <div className="space-y-3">
                  {relacionadas.map(rel => <ToolCard key={rel.id} ferramenta={rel as any} />)}
                </div>
                <Link
                  href={`/categoria/${f.categoria.slug}`}
                  className="flex items-center justify-center gap-1 mt-4 text-sm font-semibold text-green-600 hover:text-green-700 transition-colors"
                >
                  Ver todas
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  )
}
