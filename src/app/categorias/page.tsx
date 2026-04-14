import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { isDatabaseConfigured } from '@/lib/db-config'
import { withDatabase } from '@/lib/with-database'
import { PageHeader } from '@/components/PageHeader'
import { EmptyState } from '@/components/EmptyState'
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

  const totalFerramentas = categorias.reduce((s, c) => s + c._count.ferramentas, 0)

  return (
    <div className="min-h-screen" style={{ background: 'var(--surface-subtle)' }}>

      <PageHeader
        breadcrumbs={[{ label: 'Início', href: '/' }, { label: 'Categorias' }]}
        eyebrow="Explorar"
        title="Todas as categorias"
        subtitle={`${categorias.length} categorias · ${totalFerramentas} ferramentas de IA organizadas por área`}
      />

      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
        {categorias.length === 0 ? (
          <EmptyState
            icon="🗂️"
            title="Ainda sem categorias"
            description={
              isDatabaseConfigured()
                ? 'Ainda não há categorias na base de dados.'
                : 'Configura DATABASE_URL e corre o seed para carregar as categorias.'
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categorias.map(cat => (
              <Link
                key={cat.id}
                href={`/categoria/${cat.slug}`}
                className="cat-card-premium group block scroll-reveal"
                style={{ '--cat-color': cat.cor } as React.CSSProperties}
              >
                <span className="card-accent" />

                <div className="flex items-start justify-between mt-1.5">
                  <div
                    className="cat-icon-wrap"
                    style={{ background: `${cat.cor}15`, marginBottom: '12px', marginTop: 0 }}
                  >
                    {cat.icone}
                  </div>
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-full shrink-0"
                    style={{ background: 'var(--surface-muted)', color: 'var(--muted-foreground)' }}
                  >
                    {cat._count.ferramentas}
                  </span>
                </div>

                <p className="font-semibold text-[var(--foreground)] text-sm mb-1.5 group-hover:text-green-700 transition-colors">
                  {cat.nome}
                </p>
                {cat.descricao && (
                  <p className="text-xs leading-relaxed text-[var(--muted)] line-clamp-2 mb-3">
                    {cat.descricao}
                  </p>
                )}

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
