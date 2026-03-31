import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { isDatabaseConfigured } from '@/lib/db-config'
import { ToolCard } from '@/components/ToolCard'
import { Metadata } from 'next'

type Props = { searchParams: Promise<{ q?: string }> }

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams
  return {
    title: q ? `\u201C${q}\u201D — Pesquisa de Ferramentas de IA` : 'Pesquisa — FerramentasAI',
  }
}

async function pesquisar(q: string) {
  if (!q || q.length < 2 || !isDatabaseConfigured()) return []
  return prisma.ferramenta.findMany({
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
  })
}

export default async function PesquisaPage({ searchParams }: Props) {
  const { q = '' } = await searchParams
  const resultados = await pesquisar(q)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-display text-2xl font-700 text-slate-900 mb-6">
        {q ? (
          <>
            Resultados para <span className="text-emerald-700">&ldquo;{q}&rdquo;</span>
          </>
        ) : (
          'Pesquisar ferramentas de IA'
        )}
      </h1>
      <form method="GET" className="mb-8">
        <div className="flex gap-2">
          <input name="q" type="text" defaultValue={q} placeholder="Pesquisa ferramentas de IA…" autoFocus className="input-search flex-1" />
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
          <p className="text-3xl mb-3">🔍</p>
          <p className="font-display font-600 text-slate-900 mb-2">
            Nenhum resultado para <span className="text-emerald-700">&ldquo;{q}&rdquo;</span>
          </p>
          <p className="text-sm text-slate-400 mb-6">Tenta pesquisar de outra forma ou explora por categoria.</p>
          <Link href="/categorias" className="btn-primary">Explorar categorias →</Link>
        </div>
      ) : (
        <div className="text-center py-16 text-slate-400">
          <p className="text-3xl mb-3">✨</p>
          <p>Começa a escrever para encontrar a ferramenta perfeita</p>
        </div>
      )}
    </div>
  )
}
