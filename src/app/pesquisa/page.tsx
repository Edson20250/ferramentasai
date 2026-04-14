import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { withDatabase } from '@/lib/with-database'
import { ToolCard } from '@/components/ToolCard'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

type Props = { searchParams: Promise<{ q?: string }> }

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams
  return {
    title: q ? `\u201C${q}\u201D — Pesquisa de Ferramentas de IA` : 'Pesquisa — FerramentasAI',
  }
}

async function pesquisar(q: string) {
  if (!q || q.length < 2) return []
  return withDatabase([], () =>
    prisma.ferramenta.findMany({
      where: {
        aprovado: true,
        OR: [
          { nome: { contains: q, mode: 'insensitive' } },
          { descricao: { contains: q, mode: 'insensitive' } },
          { tags: { has: q.toLowerCase() } },
        ],
      },
      include: { categoria: true },
      orderBy: [{ destaque: 'desc' }, { visualizacoes: 'desc' }],
      take: 30,
    }),
  )
}

export default async function PesquisaPage({ searchParams }: Props) {
  const { q = '' } = await searchParams
  const resultados = await pesquisar(q)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <span className="section-label">Pesquisa</span>
        <h1 className="font-display text-2xl font-700 text-slate-900">
          {q ? (
            <>
              Resultados para <span className="text-emerald-700">&ldquo;{q}&rdquo;</span>
            </>
          ) : (
            'Pesquisar ferramentas de IA'
          )}
        </h1>
      </div>

      <form method="GET" className="mb-8">
        <div className="flex gap-2.5">
          <div className="relative flex-1">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              name="q"
              type="text"
              defaultValue={q}
              placeholder="Pesquisa ferramentas de IA..."
              autoFocus
              className="input-search flex-1 !pl-10"
            />
          </div>
          <button type="submit" className="btn-primary">Pesquisar</button>
        </div>
      </form>

      {q && (
        <p className="text-sm text-slate-400 mb-6">
          {resultados.length} resultado{resultados.length !== 1 ? 's' : ''} encontrado{resultados.length !== 1 ? 's' : ''}
        </p>
      )}

      {resultados.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {resultados.map(f => (
            <ToolCard key={f.id} ferramenta={f as any} />
          ))}
        </div>
      ) : q ? (
        <div className="text-center py-16">
          <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-2xl mx-auto mb-4">🔍</div>
          <p className="font-display font-600 text-slate-900 mb-2">
            Nenhum resultado para <span className="text-emerald-700">&ldquo;{q}&rdquo;</span>
          </p>
          <p className="text-sm text-slate-400 mb-6">Tenta pesquisar de outra forma ou explora por categoria.</p>
          <Link href="/categorias" className="btn-primary">Explorar categorias &rarr;</Link>
        </div>
      ) : (
        <div className="text-center py-16 text-slate-400">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-2xl mx-auto mb-4">✨</div>
          <p className="text-sm">Comeca a escrever para encontrar a ferramenta perfeita</p>
        </div>
      )}
    </div>
  )
}
