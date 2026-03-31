import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { isDatabaseConfigured } from '@/lib/db-config'
import { ToolCard } from '@/components/ToolCard'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ ordem?: string; preco?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    if (!isDatabaseConfigured()) return {}
    const cat = await prisma.categoria.findUnique({ where: { slug } })
    if (!cat) return {}
    return {
      title: `${cat.nome} — Ferramentas de IA em Português`,
      description: cat.descricao,
    }
  } catch {
    return {}
  }
}

const FILTROS_PRECO = [
  { value: 'todos', label: 'Todos os preços' },
  { value: 'gratuito', label: 'Gratuito' },
  { value: 'freemium', label: 'Freemium' },
  { value: 'pago', label: 'Pago' },
]

const FILTROS_ORDEM = [
  { value: 'destaque', label: 'Em destaque' },
  { value: 'novos', label: 'Mais recentes' },
  { value: 'nome', label: 'Nome A–Z' },
]

export default async function CategoriaPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { ordem = 'destaque', preco = 'todos' } = await searchParams

  let categoria
  let ferramentas
  let todasCategorias

  try {
    if (!isDatabaseConfigured()) notFound()
    categoria = await prisma.categoria.findUnique({
      where: { slug },
      include: { _count: { select: { ferramentas: { where: { aprovado: true } } } } },
    })
    if (!categoria) notFound()

    const where: Record<string, unknown> = { categoriaId: categoria.id, aprovado: true }
    if (preco && preco !== 'todos') where.precificacao = preco.toUpperCase()

    const orderBy =
      ordem === 'nome' ? { nome: 'asc' as const } :
      ordem === 'novos' ? { criadoEm: 'desc' as const } :
      { destaque: 'desc' as const }

    ferramentas = await prisma.ferramenta.findMany({
      where,
      include: { categoria: true },
      orderBy: [orderBy, { visualizacoes: 'desc' }],
    })

    todasCategorias = await prisma.categoria.findMany({ orderBy: { nome: 'asc' } })
  } catch {
    notFound()
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <nav className="text-xs text-slate-400 mb-6 flex items-center gap-1.5">
        <Link href="/" className="hover:text-slate-600">Início</Link>
        <span>/</span>
        <span className="text-slate-600">{categoria.nome}</span>
      </nav>
      <div className="flex gap-8">
        <aside className="hidden lg:block w-52 shrink-0">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">Categorias</p>
          <ul className="space-y-0.5">
            {todasCategorias.map(cat => (
              <li key={cat.id}>
                <Link href={`/categoria/${cat.slug}`} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${cat.slug === slug ? 'bg-slate-900 text-white font-medium' : 'text-slate-600 hover:bg-slate-100'}`}>
                  <span>{cat.icone}</span><span className="truncate">{cat.nome}</span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>
        <div className="flex-1 min-w-0">
          <div className="mb-6">
            <h1 className="font-display text-2xl font-700 text-slate-900 mb-1">{categoria.icone} {categoria.nome}</h1>
            <p className="text-slate-500 text-sm">{categoria.descricao}</p>
            <p className="text-xs text-slate-400 mt-1">{categoria._count.ferramentas} ferramentas</p>
          </div>
          <div className="flex flex-wrap gap-2 mb-6 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-400">Preço:</span>
              {FILTROS_PRECO.map(f => (
                <Link key={f.value} href={`/categoria/${slug}?preco=${f.value}&ordem=${ordem}`} className={`text-xs px-3 py-1 rounded-full border transition-colors ${preco === f.value ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 text-slate-600'}`}>{f.label}</Link>
              ))}
            </div>
            <div className="flex items-center gap-1.5 ml-auto">
              {FILTROS_ORDEM.map(f => (
                <Link key={f.value} href={`/categoria/${slug}?preco=${preco}&ordem=${f.value}`} className={`text-xs px-3 py-1 rounded-full border transition-colors ${ordem === f.value ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 text-slate-600'}`}>{f.label}</Link>
              ))}
            </div>
          </div>
          {ferramentas.length === 0 ? (
            <div className="text-center py-12 text-slate-400"><p className="text-2xl mb-2">🔍</p><p>Nenhuma ferramenta encontrada</p></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {ferramentas.map(f => <ToolCard key={f.id} ferramenta={f as any} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
