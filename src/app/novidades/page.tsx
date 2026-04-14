import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { isDatabaseConfigured } from '@/lib/db-config'
import { withDatabase } from '@/lib/with-database'
import { ToolCard } from '@/components/ToolCard'
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

      {/* ── Page header ──────────────────────────────── */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
          <nav className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)] mb-5">
            <Link href="/" className="hover:text-[var(--foreground)] transition-colors">Início</Link>
            <span>/</span>
            <span className="text-[var(--foreground)]">Novidades</span>
          </nav>
          <span className="section-eyebrow">Adicionadas recentemente</span>
          <h1 className="section-heading mt-1 mb-2">Novidades no diretório</h1>
          <p className="text-sm text-[var(--muted)]">
            Ferramentas adicionadas ou atualizadas recentemente — sempre em português.
          </p>
        </div>
      </div>

      {/* ── Grid ─────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8">
        {ferramentas.length === 0 ? (
          <div
            className="text-center py-20 rounded-2xl"
            style={{ border: '2px dashed var(--border)' }}
          >
            <p className="text-4xl mb-4">✨</p>
            <p className="font-semibold text-[var(--muted)] mb-2">Ainda sem novidades</p>
            <p className="text-sm text-[var(--muted-foreground)] mb-6">
              {isDatabaseConfigured()
                ? 'Ainda não há ferramentas aprovadas no diretório.'
                : 'Configura DATABASE_URL e corre o seed para ver as novidades aqui.'}
            </p>
            <Link href="/categorias" className="btn-primary" style={{ fontSize: '13.5px' }}>
              Explorar categorias →
            </Link>
          </div>
        ) : (
          <>
            <p className="text-xs text-[var(--muted-foreground)] mb-5">
              {ferramentas.length} ferramenta{ferramentas.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ferramentas.map(f => (
                <ToolCard key={f.id} ferramenta={f as any} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
