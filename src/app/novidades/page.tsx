import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { isDatabaseConfigured } from '@/lib/db-config'
import { withDatabase } from '@/lib/with-database'
import { ToolCard } from '@/components/ToolCard'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Novidades — Ferramentas de IA adicionadas recentemente | FerramentasAI',
  description: 'As ferramentas de inteligencia artificial mais recentes adicionadas ao diretorio em portugues.',
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <nav className="text-xs text-slate-400 mb-6 flex items-center gap-1.5">
        <Link href="/" className="hover:text-emerald-600 transition-colors">Inicio</Link>
        <svg className="w-3 h-3 text-slate-300" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
        <span className="text-slate-600 font-medium">Novidades</span>
      </nav>

      <div className="mb-10">
        <span className="section-label">Recentes</span>
        <h1 className="font-display text-3xl font-700 text-slate-900 mb-2">Novidades</h1>
        <p className="text-slate-500 text-sm">
          Ferramentas adicionadas ou atualizadas recentemente no diretorio.
        </p>
      </div>

      {ferramentas.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-2xl">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-2xl mx-auto mb-4">✨</div>
          <p className="font-display font-600 text-slate-700 mb-1">
            {isDatabaseConfigured()
              ? 'Ainda nao ha ferramentas aprovadas no diretorio.'
              : 'Configura DATABASE_URL e corre o seed para ver as novidades aqui.'}
          </p>
          <Link href="/categorias" className="inline-block mt-5 btn-primary text-sm">
            Explorar categorias &rarr;
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
