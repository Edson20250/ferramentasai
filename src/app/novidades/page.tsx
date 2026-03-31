import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { isDatabaseConfigured } from '@/lib/db-config'
import { ToolCard } from '@/components/ToolCard'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Novidades — Ferramentas de IA adicionadas recentemente | FerramentasAI',
  description: 'As ferramentas de inteligência artificial mais recentes adicionadas ao diretório em português.',
}

export default async function NovidadesPage() {
  const ferramentas = isDatabaseConfigured()
    ? await prisma.ferramenta.findMany({
        where: { aprovado: true },
        include: { categoria: true },
        orderBy: { criadoEm: 'desc' },
        take: 48,
      })
    : []

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <nav className="text-xs text-slate-400 mb-6">
        <Link href="/" className="hover:text-slate-600">Início</Link>
        <span className="mx-1.5">/</span>
        <span className="text-slate-600">Novidades</span>
      </nav>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-700 text-slate-900 mb-2">Novidades</h1>
        <p className="text-slate-500 text-sm">
          Ferramentas adicionadas ou atualizadas recentemente no diretório.
        </p>
      </div>
      {ferramentas.length === 0 ? (
        <div className="text-center py-16 text-slate-400 border border-dashed border-slate-200 rounded-2xl">
          <p className="text-3xl mb-3">✨</p>
          <p className="text-sm">
            {isDatabaseConfigured()
              ? 'Ainda não há ferramentas aprovadas no diretório.'
              : 'Configura DATABASE_URL e corre o seed para ver as novidades aqui.'}
          </p>
          <Link href="/categorias" className="inline-block mt-6 text-sm text-emerald-700 font-medium hover:underline">
            Explorar categorias →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ferramentas.map(f => (
            <ToolCard key={f.id} ferramenta={f as any} />
          ))}
        </div>
      )}
    </div>
  )
}
