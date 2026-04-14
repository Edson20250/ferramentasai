import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { isDatabaseConfigured } from '@/lib/db-config'
import { withDatabase } from '@/lib/with-database'
import { ToolCard } from '@/components/ToolCard'
import { PageHeader } from '@/components/PageHeader'
import { EmptyState } from '@/components/EmptyState'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Novidades — Ferramentas de IA adicionadas recentemente | FerramentasAI',
  description: 'As ferramentas de inteligência artificial mais recentes adicionadas ao diretório em português.',
}

export default async function NovidadesPage() {
  const ferramentas = await withDatabase([], () =>
    prisma.ferramenta.findMany({
      where: { aprovado: true },
      include: { categoria: true },
      orderBy: { criadoEm: 'desc' },
      take: 48,
    }),
  )

  return (
    <div className="min-h-screen" style={{ background: 'var(--surface-subtle)' }}>

      <PageHeader
        breadcrumbs={[{ label: 'Início', href: '/' }, { label: 'Novidades' }]}
        eyebrow="Adicionadas recentemente"
        title="Novidades no diretório"
        subtitle="Ferramentas adicionadas ou atualizadas recentemente — sempre em português."
        aside={
          ferramentas.length > 0 ? (
            <span className="text-xs font-medium text-[var(--muted-foreground)]">
              {ferramentas.length} ferramenta{ferramentas.length !== 1 ? 's' : ''}
            </span>
          ) : undefined
        }
      />

      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8">
        {ferramentas.length === 0 ? (
          <EmptyState
            icon="✨"
            title="Ainda sem novidades"
            description={
              isDatabaseConfigured()
                ? 'Ainda não há ferramentas aprovadas no diretório.'
                : 'Configura DATABASE_URL e corre o seed para ver as novidades aqui.'
            }
            actions={[{ label: 'Explorar categorias →', href: '/categorias' }]}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ferramentas.map(f => (
              <ToolCard key={f.id} ferramenta={f as any} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
