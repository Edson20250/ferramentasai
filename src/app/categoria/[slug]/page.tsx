import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { ToolCard } from '@/components/ToolCard'
import { Metadata } from 'next'

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ ordem?: string; preco?: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const cat = await prisma.categoria.findUnique({ where: { slug } })
  if (!cat) return {}
  return { title: `${cat.nome} — Ferramentas de IA em Português`, description: cat.descricao }
}

export async function generateStaticParams() {
  const categorias = await prisma.categoria.findMany({ select: { slug: true } })
  return categorias.map(c => ({ slug: c.slug }))
}

export const revalidate = 3600

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

  const categoria = await prisma.categoria.findUnique({
    where: { slug },
    include: { _count: { select: { ferramentas: { where: { aprovado: true } } } } },
  })
  if (!categoria) notFound()

  const where: any = { categoriaId: categoria!.id, aprovado: true }
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

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <nav className="text-xs text-slate-400 mb-6 flex items-center gap-1.5">
        <Link href="/" className="hover:text-slate-600">Início</Link>
        <span>/</span>
        <span className="text-slate-600">{categoria!.nome}</span>
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
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{categoria!.icone}</span>
              <h1 className="font-display text-2xl font-700 text-slate-900">{categoria!.nome}</h1>
            </div>
            <p className="text-slate-500 text-sm">{categoria!.descricao}</p>
            <p className="text-xs text-slate-400 mt-1">{categoria!._count.ferramentas} ferramentas</p>
          </div>
          <div className="flex flex

cat > src/app/ferramenta/\[slug\]/page.tsx << 'ENDOFFILE'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { ToolCard } from '@/components/ToolCard'
import { badgePreco, formatPreco, labelPreco } from '@/lib/utils'
import { Metadata } from 'next'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const f = await prisma.ferramenta.findUnique({ where: { slug }, include: { categoria: true } })
  if (!f) return {}
  return {
    title: `${f.nome} — Ferramenta de IA em Português`,
    description: f.descricao,
    keywords: [...f.tags, f.categoria.nome, 'ferramenta ia português'],
  }
}

export async function generateStaticParams() {
  const ferramentas = await prisma.ferramenta.findMany({ where: { aprovado: true }, select: { slug: true } })
  return ferramentas.map(f => ({ slug: f.slug }))
}

export const revalidate = 3600

export default async function FerramentaPage({ params }: Props) {
  const { slug } = await params
  const f = await prisma.ferramenta.findUnique({ where: { slug, aprovado: true }, include: { categoria: true } })
  if (!f) notFound()

  prisma.ferramenta.update({ where: { id: f!.id }, data: { visualizacoes: { increment: 1 } } }).catch(() => {})

  const relacionadas = await prisma.ferramenta.findMany({
    where: { categoriaId: f!.categoriaId, aprovado: true, id: { not: f!.id } },
    include: { categoria: true },
    orderBy: { destaque: 'desc' },
    take: 4,
  })

  const linkExterno = f!.urlAfiliado || f!.url
  const initials = f!.nome.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <nav className="text-xs text-slate-400 mb-6 flex items-center gap-1.5">
        <Link href="/" className="hover:text-slate-600">Início</Link>
        <span>/</span>
        <Link href={`/categoria/${f!.categoria.slug}`} className="hover:text-slate-600">{f!.categoria.nome}</Link>
        <span>/</span>
        <span className="text-slate-600">{f!.nome}</span>
      </nav>
      <div className="flex gap-8 flex-col lg:flex-row">
        <article className="flex-1 min-w-0">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center text-base font-bold text-slate-500 shrink-0">
                {f!.logoUrl ? <img src={f!.logoUrl} alt={f!.nome} className="w-full h-full object-contain p-1.5" /> : <span className="font-display text-lg">{initials}</span>}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="font-display text-2xl font-700 text-slate-900">{f!.nome}</h1>
                  {f!.emPortugues && <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium">🇵🇹 PT</span>}
                  {f!.destaque && <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-medium">⭐ Destaque</span>}
                </div>
                <Link href={`/categoria/${f!.categoria.slug}`} className="text-sm text-slate-500 hover:text-emerald-700 transition-colors">{f!.categoria.icone} {f!.categoria.nome}</Link>
              </div>
            </div>
            <p className="text-slate-600 leading-relaxed mb-5">{f!.descricao}</p>
            {f!.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-5">
                {f!.tags.map(tag => <Link key={tag} href={`/pesquisa?q=${encodeURIComponent(tag)}`} className="text-xs bg-slate-100 text-slate-600 hover:bg-slate-200 px-2.5 py-1 rounded-full transition-colors">#{tag}</Link>)}
              </div>
            )}
            <div className="flex flex-wrap gap-3">
              <a href={linkExterno} target="_blank" rel="noopener noreferrer" className="btn-primary flex items-center gap-2">Visitar {f!.nome} <span className="text-xs opacity-70">↗</span></a>
              <Link href={`/categoria/${f!.categoria.slug}`} className="btn-outline">Ver ferramentas similares</Link>
            </div>
            {f!.urlAfiliado && <p className="text-xs text-slate-400 mt-3">* Link de afiliado — podemos receber comissão.</p>}
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6">
            <h2 className="font-display font-600 text-slate-900 mb-4">Informações</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><p className="text-xs text-slate-400 mb-1">Precificação</p><span className={badgePreco(f!.precificacao)}>{labelPreco(f!.precificacao)}</span></div>
              {f!.precoMensal && <div><p className="text-xs text-slate-400 mb-1">Preço</p><p className="text-sm text-slate-700 font-medium">{formatPreco(f!.precificacao, f!.precoMensal)}</p></div>}
              <div><p className="text-xs text-slate-400 mb-1">Português</p><p className="text-sm text-slate-700">{f!.emPortugues ? '✅ Sim' : '❌ Apenas inglês'}</p></div>
              <div><p className="text-xs text-slate-400 mb-1">Categoria</p><Link href={`/categoria/${f!.categoria.slug}`} className="text-sm text-emerald-700 hover:underline">{f!.categoria.icone} {f!.categoria.nome}</Link></div>
            </div>
          </div>
        </article>
        <aside className="lg:w-72 shrink-0 space-y-4">
          <div className="bg-slate-900 text-white rounded-xl p-5">
            <p className="font-display font-600 text-sm mb-1">Trabalhas nesta ferramenta?</p>
            <p className="text-xs text-slate-400 mb-4">Destaca-a e alcança milhares de profissionais PT/BR</p>
            <Link href="/destaque" className="block text-center bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors">Saber mais →</Link>
          </div>
          {relacionadas.length > 0 && (
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">Ferramentas similares</p>
              <div className="space-y-2">{relacionadas.map(rel => <ToolCard key={rel.id} ferramenta={rel as any} />)}</div>
              <Link href={`/categoria/${f!.categoria.slug}`} className="block text-center text-sm text-emerald-700 hover:text-emerald-800 mt-3 font-medium">Ver todas →</Link>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
