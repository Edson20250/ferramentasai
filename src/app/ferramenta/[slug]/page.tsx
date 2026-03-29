import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { ToolCard } from '@/components/ToolCard'
import { badgePreco, formatPreco, labelPreco } from '@/lib/utils'
import { Metadata } from 'next'

type Props = { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const f = await prisma.ferramenta.findUnique({
    where: { slug: params.slug },
    include: { categoria: true },
  })
  if (!f) return {}
  return {
    title: `${f.nome} — Ferramenta de IA em Português`,
    description: f.descricao,
    keywords: [...f.tags, f.categoria.nome, 'ferramenta ia português', 'inteligência artificial'],
    openGraph: {
      title: `${f.nome} | FerramentasAI`,
      description: f.descricao,
      type: 'website',
    },
  }
}

export async function generateStaticParams() {
  const ferramentas = await prisma.ferramenta.findMany({
    where: { aprovado: true },
    select: { slug: true },
  })
  return ferramentas.map(f => ({ slug: f.slug }))
}

export const revalidate = 3600

async function getDados(slug: string) {
  const ferramenta = await prisma.ferramenta.findUnique({
    where: { slug, aprovado: true },
    include: { categoria: true },
  })
  if (!ferramenta) return null

  // Regista visualização em background
  prisma.ferramenta.update({
    where: { id: ferramenta.id },
    data: { visualizacoes: { increment: 1 } },
  }).catch(() => {})

  const relacionadas = await prisma.ferramenta.findMany({
    where: {
      categoriaId: ferramenta.categoriaId,
      aprovado: true,
      id: { not: ferramenta.id },
    },
    include: { categoria: true },
    orderBy: { destaque: 'desc' },
    take: 4,
  })

  return { ferramenta, relacionadas }
}

export default async function FerramentaPage({ params }: Props) {
  const dados = await getDados(params.slug)
  if (!dados) notFound()

  const { ferramenta: f, relacionadas } = dados
  const linkExterno = f.urlAfiliado || f.url
  const initials = f.nome.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

      {/* Breadcrumb */}
      <nav className="text-xs text-slate-400 mb-6 flex items-center gap-1.5">
        <Link href="/" className="hover:text-slate-600">Início</Link>
        <span>/</span>
        <Link href={`/categoria/${f.categoria.slug}`} className="hover:text-slate-600">
          {f.categoria.nome}
        </Link>
        <span>/</span>
        <span className="text-slate-600">{f.nome}</span>
      </nav>

      <div className="flex gap-8 flex-col lg:flex-row">

        {/* Conteúdo principal */}
        <article className="flex-1 min-w-0">

          {/* Header */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center text-base font-bold text-slate-500 shrink-0 overflow-hidden">
                {f.logoUrl ? (
                  <img src={f.logoUrl} alt={f.nome} className="w-full h-full object-contain p-1.5" />
                ) : (
                  <span className="font-display text-lg">{initials}</span>
                )}
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="font-display text-2xl font-700 text-slate-900">{f.nome}</h1>
                  {f.emPortugues && (
                    <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium">🇵🇹 Disponível em PT</span>
                  )}
                  {f.destaque && (
                    <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-medium">⭐ Destaque</span>
                  )}
                </div>

                <Link
                  href={`/categoria/${f.categoria.slug}`}
                  className="text-sm text-slate-500 hover:text-emerald-700 transition-colors"
                >
                  {f.categoria.icone} {f.categoria.nome}
                </Link>
              </div>
            </div>

            <p className="text-slate-600 leading-relaxed mb-5">{f.descricao}</p>

            {f.descricaoLonga && (
              <div className="prose prose-sm prose-slate max-w-none mb-5">
                <p className="text-slate-600 leading-relaxed">{f.descricaoLonga}</p>
              </div>
            )}

            {/* Tags */}
            {f.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-5">
                {f.tags.map(tag => (
                  <Link
                    key={tag}
                    href={`/pesquisa?q=${encodeURIComponent(tag)}`}
                    className="text-xs bg-slate-100 text-slate-600 hover:bg-slate-200 px-2.5 py-1 rounded-full transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}

            {/* CTA principal */}
            <div className="flex flex-wrap gap-3">
              <a
                href={linkExterno}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex items-center gap-2"
              >
                Visitar {f.nome}
                <span className="text-xs opacity-70">↗</span>
              </a>
              <Link href={`/categoria/${f.categoria.slug}`} className="btn-outline">
                Ver ferramentas similares
              </Link>
            </div>

            {f.urlAfiliado && (
              <p className="text-xs text-slate-400 mt-3">
                * Link de afiliado — o FerramentasAI pode receber comissão se subscreveres através deste link.
              </p>
            )}
          </div>

          {/* Informações */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6">
            <h2 className="font-display font-600 text-slate-900 mb-4">Informações</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-400 mb-1">Precificação</p>
                <div className="flex items-center gap-2">
                  <span className={badgePreco(f.precificacao)}>{labelPreco(f.precificacao)}</span>
                </div>
              </div>

              {f.precoMensal && (
                <div>
                  <p className="text-xs text-slate-400 mb-1">Preço</p>
                  <p className="text-sm text-slate-700 font-medium">{formatPreco(f.precificacao, f.precoMensal)}</p>
                </div>
              )}

              <div>
                <p className="text-xs text-slate-400 mb-1">Português</p>
                <p className="text-sm text-slate-700">{f.emPortugues ? '✅ Sim, disponível em PT' : '❌ Apenas em inglês'}</p>
              </div>

              <div>
                <p className="text-xs text-slate-400 mb-1">Categoria</p>
                <Link href={`/categoria/${f.categoria.slug}`} className="text-sm text-emerald-700 hover:underline">
                  {f.categoria.icone} {f.categoria.nome}
                </Link>
              </div>

              <div>
                <p className="text-xs text-slate-400 mb-1">Verificado</p>
                <p className="text-sm text-slate-700">{f.verificado ? '✅ Ferramenta verificada' : '⏳ Pendente verificação'}</p>
              </div>

              <div>
                <p className="text-xs text-slate-400 mb-1">Website oficial</p>
                <a href={f.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline truncate block">
                  {new URL(f.url).hostname}
                </a>
              </div>
            </div>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="lg:w-72 shrink-0 space-y-4">

          {/* CTA destaque */}
          <div className="bg-slate-900 text-white rounded-xl p-5">
            <p className="font-display font-600 text-sm mb-1">Trabalhas nesta ferramenta?</p>
            <p className="text-xs text-slate-400 mb-4">Destaca a tua ferramenta e alcança milhares de profissionais PT/BR</p>
            <Link href="/destaque" className="block text-center bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors">
              Saber mais sobre destaque →
            </Link>
          </div>

          {/* Ferramentas relacionadas */}
          {relacionadas.length > 0 && (
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">
                Ferramentas similares
              </p>
              <div className="space-y-2">
                {relacionadas.map(rel => (
                  <ToolCard key={rel.id} ferramenta={rel as any} />
                ))}
              </div>
              <Link
                href={`/categoria/${f.categoria.slug}`}
                className="block text-center text-sm text-emerald-700 hover:text-emerald-800 mt-3 font-medium"
              >
                Ver todas em {f.categoria.nome} →
              </Link>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
