import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { isDatabaseConfigured } from '@/lib/db-config'
import { withDatabase } from '@/lib/with-database'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Categorias — Ferramentas de IA em Português | FerramentasAI',
  description: 'Explora todas as categorias de ferramentas de inteligência artificial em português.',
}

export default async function CategoriasPage() {
  const categorias = await withDatabase([], () =>
    prisma.categoria.findMany({
      orderBy: { nome: 'asc' },
      include: {
        _count: { select: { ferramentas: { where: { aprovado: true } } } },
        ferramentas: {
          where: { aprovado: true, destaque: true },
          orderBy: { visualizacoes: 'desc' },
          take: 3,
          select: { nome: true, slug: true },
        },
      },
    }),
  )

  return (
    <div className="min-h-screen" style={{ background: 'var(--surface-subtle)' }}>

      {/* ── Page header ──────────────────────────────── */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
          <nav className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)] mb-5">
            <Link href="/" className="hover:text-[var(--foreground)] transition-colors">Início</Link>
            <span>/</span>
            <span className="text-[var(--foreground)]">Categorias</span>
          </nav>
          <span className="section-eyebrow">Todas as categorias</span>
          <h1 className="section-heading mt-1 mb-2">
            Ferramentas organizadas por área
          </h1>
          <p className="text-sm text-[var(--muted)]">
            {categorias.length} categorias · Descobre qual a IA certa para cada tarefa
          </p>
        </div>
      </div>

      {/* ── Grid ─────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
        {categorias.length === 0 ? (
          <div
            className="text-center py-20 rounded-2xl"
            style={{ border: '2px dashed var(--border)' }}
          >
            <p className="text-3xl mb-3">🗂️</p>
            <p className="text-sm text-[var(--muted-foreground)]">
              {isDatabaseConfigured()
                ? 'Ainda não há categorias na base de dados.'
                : 'Configura DATABASE_URL e corre o seed para carregar as categorias.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categorias.map(cat => (
              <Link
                key={cat.id}
                href={`/categoria/${cat.slug}`}
                className="cat-card-premium group block"
                style={{ '--cat-color': cat.cor } as React.CSSProperties}
              >
                {/* Accent line */}
                <span className="card-accent" />

                {/* Top row: icon + count */}
                <div className="flex items-start justify-between mt-1.5">
                  <div
                    className="cat-icon-wrap"
                    style={{ background: `${cat.cor}15`, marginBottom: '12px', marginTop: 0 }}
                  >
                    {cat.icone}
                  </div>
                  <span
                    className="text-xs font-medium px-2.5 py-1 rounded-full shrink-0"
                    style={{ background: 'var(--surface-muted)', color: 'var(--muted-foreground)' }}
                  >
                    {cat._count.ferramentas}
                  </span>
                </div>

                {/* Name + description */}
                <p className="font-semibold text-[var(--foreground)] text-sm mb-1.5 group-hover:text-green-700 transition-colors">
                  {cat.nome}
                </p>
                {cat.descricao && (
                  <p className="text-xs leading-relaxed text-[var(--muted)] line-clamp-2 mb-3">
                    {cat.descricao}
                  </p>
                )}

                {/* Pill tags of top tools */}
                {cat.ferramentas.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {cat.ferramentas.map(f => (
                      <span
                        key={f.slug}
                        className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                        style={{ background: 'var(--surface-muted)', color: 'var(--muted-foreground)' }}
                      >
                        {f.nome}
                      </span>
                    ))}
                  </div>
                )}

                {/* Hover CTA */}
                <span className="mt-3 text-xs font-semibold text-green-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  Explorar ferramentas
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
