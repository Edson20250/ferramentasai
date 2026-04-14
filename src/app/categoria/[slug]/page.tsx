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
      title: `${cat.nome} — Ferramentas de IA em Português | FerramentasAI`,
      description: cat.descricao,
    }
  } catch {
    return {}
  }
}

const FILTROS_PRECO = [
  { value: 'todos',    label: 'Todos'     },
  { value: 'gratuito', label: 'Gratuito'  },
  { value: 'freemium', label: 'Freemium'  },
  { value: 'pago',     label: 'Pago'      },
]

const FILTROS_ORDEM = [
  { value: 'destaque', label: 'Em destaque'    },
  { value: 'novos',    label: 'Mais recentes'  },
  { value: 'nome',     label: 'A–Z'            },
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
      ordem === 'nome'  ? { nome: 'asc'      as const } :
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

  const filterPill = (active: boolean) =>
    active
      ? 'text-xs px-3 py-1.5 rounded-full font-semibold transition-colors bg-[var(--foreground)] text-white'
      : 'text-xs px-3 py-1.5 rounded-full font-medium transition-colors bg-[var(--surface)] border border-[var(--border)] text-[var(--muted)] hover:border-[var(--border-strong)] hover:text-[var(--foreground)]'

  return (
    <div className="min-h-screen" style={{ background: 'var(--surface-subtle)' }}>

      {/* ── Category hero header ─────────────────────── */}
      <div
        style={{
          background: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)] mb-6">
            <Link href="/" className="hover:text-[var(--foreground)] transition-colors">Início</Link>
            <span>/</span>
            <Link href="/categorias" className="hover:text-[var(--foreground)] transition-colors">Categorias</Link>
            <span>/</span>
            <span className="text-[var(--foreground)]">{categoria.nome}</span>
          </nav>

          <div className="flex items-start gap-4">
            {/* Icon */}
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
              style={{ background: `${categoria.cor}15` }}
            >
              {categoria.icone}
            </div>
            <div>
              <h1 className="font-bold text-[var(--foreground)] text-xl sm:text-2xl mb-1 tracking-tight">
                {categoria.nome}
              </h1>
              {categoria.descricao && (
                <p className="text-sm text-[var(--muted)] max-w-xl">{categoria.descricao}</p>
              )}
              <p className="text-xs text-[var(--muted-foreground)] mt-1.5">
                {categoria._count.ferramentas} ferramenta{categoria._count.ferramentas !== 1 ? 's' : ''} disponív{categoria._count.ferramentas !== 1 ? 'eis' : 'el'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main layout ──────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8">
        <div className="flex gap-8">

          {/* ── Sidebar — category nav ─────────────────── */}
          <aside className="hidden lg:block w-52 shrink-0">
            <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--muted-foreground)] mb-3 px-3">
              Categorias
            </p>
            <nav className="space-y-0.5">
              {todasCategorias.map(cat => (
                <Link
                  key={cat.id}
                  href={`/categoria/${cat.slug}`}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                    cat.slug === slug
                      ? 'bg-[var(--foreground)] text-white font-semibold'
                      : 'text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface)]'
                  }`}
                >
                  <span className="text-base shrink-0">{cat.icone}</span>
                  <span className="truncate">{cat.nome}</span>
                </Link>
              ))}
            </nav>
          </aside>

          {/* ── Content ────────────────────────────────── */}
          <div className="flex-1 min-w-0">

            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center mb-6 pb-6" style={{ borderBottom: '1px solid var(--border)' }}>
              {/* Price filters */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-medium text-[var(--muted-foreground)] mr-1">Preço:</span>
                {FILTROS_PRECO.map(f => (
                  <Link
                    key={f.value}
                    href={`/categoria/${slug}?preco=${f.value}&ordem=${ordem}`}
                    className={filterPill(preco === f.value)}
                  >
                    {f.label}
                  </Link>
                ))}
              </div>

              {/* Sort filters */}
              <div className="flex items-center gap-1.5 ml-auto flex-wrap">
                <span className="text-xs font-medium text-[var(--muted-foreground)] mr-1">Ordenar:</span>
                {FILTROS_ORDEM.map(f => (
                  <Link
                    key={f.value}
                    href={`/categoria/${slug}?preco=${preco}&ordem=${f.value}`}
                    className={filterPill(ordem === f.value)}
                  >
                    {f.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Results */}
            {ferramentas.length === 0 ? (
              <div className="text-center py-16 rounded-2xl" style={{ border: '2px dashed var(--border)' }}>
                <p className="text-3xl mb-3">🔍</p>
                <p className="font-semibold text-[var(--muted)] mb-2">Nenhuma ferramenta encontrada</p>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Tenta remover os filtros ou explorar outra categoria.
                </p>
              </div>
            ) : (
              <>
                <p className="text-xs text-[var(--muted-foreground)] mb-4">
                  {ferramentas.length} ferramenta{ferramentas.length !== 1 ? 's' : ''}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ferramentas.map(f => <ToolCard key={f.id} ferramenta={f as any} />)}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
