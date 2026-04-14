import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { ToolCard } from '@/components/ToolCard'
import { badgePreco, formatPreco, labelPreco, safeUrlHostname } from '@/lib/utils'
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

export default async function FerramentaPage({ params }: Props) {
  const { slug } = await params

  let f
  let relacionadas

  try {
    if (!isDatabaseConfigured()) notFound()
    const found = await prisma.ferramenta.findUnique({
      where: { slug, aprovado: true },
      include: { categoria: true },
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

  return (
    <div className="min-h-screen" style={{ background: 'var(--surface-subtle)' }}>

      {/* ── Page header ──────────────────────────────── */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8">
          <nav className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)] mb-6">
            <Link href="/" className="hover:text-[var(--foreground)] transition-colors">Início</Link>
            <span>/</span>
            <Link href={`/categoria/${f.categoria.slug}`} className="hover:text-[var(--foreground)] transition-colors">
              {f.categoria.nome}
            </Link>
            <span>/</span>
            <span className="text-[var(--foreground)] truncate max-w-[160px]">{f.nome}</span>
          </nav>

          {/* Tool identity */}
          <div className="flex items-start gap-5">
            {/* Avatar */}
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden font-bold text-lg"
              style={{
                background: f.logoUrl ? 'var(--surface-muted)' : `${avatarColor}16`,
                border: `2px solid ${avatarColor}28`,
              }}
            >
              {f.logoUrl ? (
                <Image src={f.logoUrl} alt={f.nome} width={64} height={64} className="w-full h-full object-contain p-2" />
              ) : (
                <span style={{ color: avatarColor }}>{initials}</span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <h1 className="font-bold text-xl sm:text-2xl text-[var(--foreground)] tracking-tight">{f.nome}</h1>
                <span className={badgeClass(f.precificacao)}>{labelPreco(f.precificacao)}</span>
                {f.emPortugues && (
                  <span className="text-[10px] font-semibold bg-green-50 text-green-700 border border-green-200 px-1.5 py-0.5 rounded-full">
                    🇵🇹 PT
                  </span>
                )}
                {f.destaque && <span className="badge-featured">⭐ Destaque</span>}
              </div>
              <Link
                href={`/categoria/${f.categoria.slug}`}
                className="text-sm text-[var(--muted-foreground)] hover:text-green-600 transition-colors"
              >
                {f.categoria.icone} {f.categoria.nome}
              </Link>
            </div>

            {/* CTA — desktop */}
            <div className="hidden sm:flex items-center gap-2.5 shrink-0">
              <Link href={`/categoria/${f.categoria.slug}`} className="btn-outline" style={{ fontSize: '13px', padding: '9px 16px' }}>
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

      {/* ── Body ─────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* ── Article ──────────────────────────────── */}
          <article className="flex-1 min-w-0 space-y-4">

            {/* Description card */}
            <div
              className="rounded-2xl p-6"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)] mb-3">
                Sobre
              </h2>
              <p className="text-[var(--muted)] leading-relaxed">{f.descricao}</p>

              {/* Tags */}
              {f.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                  {f.tags.map(tag => (
                    <Link
                      key={tag}
                      href={`/pesquisa?q=${encodeURIComponent(tag)}`}
                      className="text-xs font-medium px-2.5 py-1 rounded-full transition-colors hover:border-[var(--border-strong)] hover:text-[var(--foreground)]"
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

              {/* Mobile CTA */}
              <div className="flex flex-col sm:hidden gap-2 mt-5">
                <a
                  href={linkExterno}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-accent text-center"
                >
                  Visitar {f.nome} ↗
                </a>
                <Link href={`/categoria/${f.categoria.slug}`} className="btn-outline text-center">
                  Ver ferramentas similares
                </Link>
              </div>

              {f.urlAfiliado && (
                <p className="text-[11px] mt-3" style={{ color: 'var(--muted-foreground)' }}>
                  * Link de afiliado — podemos receber comissão sem custo para ti.
                </p>
              )}
            </div>

            {/* Info grid */}
            <div
              className="rounded-2xl p-6"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)] mb-5">
                Informações
              </h2>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    label: 'Precificação',
                    value: <span className={badgeClass(f.precificacao)}>{labelPreco(f.precificacao)}</span>,
                  },
                  f.precoMensal != null && f.precoMensal > 0
                    ? { label: 'Preço', value: <span className="text-sm font-medium text-[var(--foreground)]">{formatPreco(f.precificacao, f.precoMensal)}</span> }
                    : null,
                  {
                    label: 'Interface em PT',
                    value: (
                      <span className="text-sm text-[var(--foreground)]">
                        {f.emPortugues ? '✅ Sim, disponível em português' : '❌ Apenas inglês'}
                      </span>
                    ),
                  },
                  {
                    label: 'Categoria',
                    value: (
                      <Link href={`/categoria/${f.categoria.slug}`} className="text-sm text-green-600 hover:text-green-700 transition-colors font-medium">
                        {f.categoria.icone} {f.categoria.nome}
                      </Link>
                    ),
                  },
                  {
                    label: 'Website',
                    value: (
                      <a
                        href={f.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-green-600 hover:text-green-700 transition-colors truncate block font-medium"
                      >
                        {safeUrlHostname(f.url)} ↗
                      </a>
                    ),
                  },
                ].filter(Boolean).map((item) => {
                  if (!item) return null
                  return (
                    <div key={item.label} className="space-y-1">
                      <dt className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>
                        {item.label}
                      </dt>
                      <dd>{item.value}</dd>
                    </div>
                  )
                })}
              </dl>
            </div>
          </article>

          {/* ── Sidebar ──────────────────────────────── */}
          <aside className="lg:w-72 shrink-0 space-y-4">

            {/* Destaque CTA card */}
            <div
              className="rounded-2xl p-5"
              style={{ background: 'var(--primary)' }}
            >
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
