import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { ToolCard } from '@/components/ToolCard'
import { Metadata } from 'next'

type Props = { params: { slug: string }; searchParams: { ordem?: string; preco?: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cat = await prisma.categoria.findUnique({ where: { slug: params.slug } })
  if (!cat) return {}
  return {
    title: `${cat.nome} — Ferramentas de IA em Português`,
    description: cat.descricao,
  }
}

export async function generateStaticParams() {
  const categorias = await prisma.categoria.findMany({ select: { slug: true } })
  return categorias.map(c => ({ slug: c.slug }))
}

export const revalidate = 3600

async function getDados(slug: string, ordem: string, preco: string) {
  const categoria = await prisma.categoria.findUnique({
    where: { slug },
    include: { _count: { select: { ferramentas: { where: { aprovado: true } } } } },
  })
  if (!categoria) return null

  const where: any = { categoriaId: categoria.id, aprovado: true }
  if (preco && preco !== 'todos') where.precificacao = preco.toUpperCase()

  const orderBy: any =
    ordem === 'nome' ? { nome: 'asc' } :
    ordem === 'novos' ? { criadoEm: 'desc' } :
    { destaque: 'desc' }

  const ferramentas = await prisma.ferramenta.findMany({
    where,
    include: { categoria: true },
    orderBy: [orderBy, { visualizacoes: 'desc' }],
  })

  const todasCategorias = await prisma.categoria.findMany({ orderBy: { nome: 'asc' } })

  return { categoria, ferramentas, todasCategorias }
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
  const ordem = searchParams.ordem || 'destaque'
  const preco = searchParams.preco || 'todos'
  const dados = await getDados(params.slug, ordem, preco)
  if (!dados) notFound()

  const { categoria, ferramentas, todasCategorias } = dados

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

      {/* Breadcrumb */}
      <nav className="text-xs text-slate-400 mb-6 flex items-center gap-1.5">
        <Link href="/" className="hover:text-slate-600">Início</Link>
        <span>/</span>
        <span className="text-slate-600">{categoria.nome}</span>
      </nav>

      <div className="flex gap-8">
        {/* Sidebar */}
        <aside className="hidden lg:block w-52 shrink-0">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">Categorias</p>
          <ul className="space-y-0.5">
            {todasCategorias.map(cat => (
              <li key={cat.id}>
                <Link
                  href={`/categoria/${cat.slug}`}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    cat.slug === params.slug
                      ? 'bg-slate-900 text-white font-medium'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span>{cat.icone}</span>
                  <span className="truncate">{cat.nome}</span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Header da categoria */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{categoria.icone}</span>
              <h1 className="font-display text-2xl font-700 text-slate-900">{categoria.nome}</h1>
            </div>
            <p className="text-slate-500 text-sm">{categoria.descricao}</p>
            <p className="text-xs text-slate-400 mt-1">{categoria._count.ferramentas} ferramentas</p>
          </div>

          {/* Filtros */}
          <div className="flex flex-wrap gap-2 mb-6 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-400">Preço:</span>
              {FILTROS_PRECO.map(f => (
                <Link
                  key={f.value}
                  href={`/categoria/${params.slug}?preco=${f.value}&ordem=${ordem}`}
                  className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                    preco === f.value
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {f.label}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-1.5 ml-auto">
              <span className="text-xs text-slate-400">Ordem:</span>
              {FILTROS_ORDEM.map(f => (
                <Link
                  key={f.value}
                  href={`/categoria/${params.slug}?preco=${preco}&ordem=${f.value}`}
                  className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                    ordem === f.value
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {f.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Lista de ferramentas */}
          {ferramentas.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p className="text-2xl mb-2">🔍</p>
              <p className="font-medium">Nenhuma ferramenta encontrada</p>
              <p className="text-sm mt-1">Tenta ajustar os filtros</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {ferramentas.map(f => (
                <ToolCard key={f.id} ferramenta={f as any} />
              ))}
            </div>
          )}

          {/* CTA submeter */}
          <div className="mt-10 p-5 border border-dashed border-slate-200 rounded-xl text-center">
            <p className="text-sm text-slate-600 mb-3">
              Conheces uma boa ferramenta de {categoria.nome.toLowerCase()} que não está aqui?
            </p>
            <Link href="/submeter" className="btn-outline text-sm">
              Sugerir ferramenta →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
