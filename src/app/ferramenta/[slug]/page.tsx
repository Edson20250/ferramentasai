import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { ToolCard } from '@/components/ToolCard'
import { badgePreco, formatPreco, labelPreco, safeUrlHostname } from '@/lib/utils'
import { isDatabaseConfigured } from '@/lib/db-config'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    if (!isDatabaseConfigured()) return {}
    const f = await prisma.ferramenta.findUnique({ where: { slug }, include: { categoria: true } })
    if (!f) return {}
    return {
      title: `${f.nome} — Ferramenta de IA em Portugues`,
      description: f.descricao,
      keywords: [...f.tags, f.categoria.nome, 'ferramenta ia portugues'],
    }
  } catch {
    return {}
  }
}

export default async function FerramentaPage({ params }: Props) {
  const { slug } = await params

  let f
  let relacionadas

  try {
    if (!isDatabaseConfigured()) notFound()
    const found = await prisma.ferramenta.findUnique({ where: { slug, aprovado: true }, include: { categoria: true } })
    if (!found) notFound()
    f = found

    prisma.ferramenta.update({ where: { id: f.id }, data: { visualizacoes: { increment: 1 } } }).catch(() => {})

    relacionadas = await prisma.ferramenta.findMany({
      where: { categoriaId: f.categoriaId, aprovado: true, id: { not: f.id } },
      include: { categoria: true },
      orderBy: { destaque: 'desc' },
      take: 4,
    })
  } catch {
    notFound()
  }

  const linkExterno = f.urlAfiliado || f.url
  const initials = f.nome.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <nav className="text-xs text-slate-400 mb-6 flex items-center gap-1.5">
        <Link href="/" className="hover:text-emerald-600 transition-colors">Inicio</Link>
        <svg className="w-3 h-3 text-slate-300" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
        <Link href={`/categoria/${f.categoria.slug}`} className="hover:text-emerald-600 transition-colors">{f.categoria.nome}</Link>
        <svg className="w-3 h-3 text-slate-300" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
        <span className="text-slate-600 font-medium">{f.nome}</span>
      </nav>

      <div className="flex gap-8 flex-col lg:flex-row">
        {/* Main */}
        <article className="flex-1 min-w-0">
          {/* Hero card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-7 mb-5">
            <div className="flex items-start gap-5 mb-5">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center font-bold text-slate-400 shrink-0 overflow-hidden ring-1 ring-black/5">
                {f.logoUrl ? (
                  <Image src={f.logoUrl} alt={f.nome} width={64} height={64} className="w-full h-full object-contain p-2" />
                ) : (
                  <span className="font-display text-xl">{initials}</span>
                )}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                  <h1 className="font-display text-2xl font-700 text-slate-900">{f.nome}</h1>
                  {f.emPortugues && (
                    <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-lg font-semibold border border-emerald-100">PT</span>
                  )}
                  {f.destaque && (
                    <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-lg font-semibold border border-amber-100 flex items-center gap-1">
                      <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                      Destaque
                    </span>
                  )}
                </div>
                <Link href={`/categoria/${f.categoria.slug}`} className="text-sm text-slate-500 hover:text-emerald-700 transition-colors">
                  {f.categoria.icone} {f.categoria.nome}
                </Link>
              </div>
            </div>

            <p className="text-slate-600 leading-relaxed mb-5">{f.descricao}</p>

            {f.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-6">
                {f.tags.map(tag => (
                  <Link
                    key={tag}
                    href={`/pesquisa?q=${encodeURIComponent(tag)}`}
                    className="text-xs bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 px-2.5 py-1 rounded-lg transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <a
                href={linkExterno}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex items-center gap-2"
              >
                Visitar {f.nome}
                <svg className="w-3.5 h-3.5 opacity-70" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
              </a>
              <Link href={`/categoria/${f.categoria.slug}`} className="btn-outline">
                Ver ferramentas similares
              </Link>
            </div>

            {f.urlAfiliado && (
              <p className="text-xs text-slate-400 mt-3">* Link de afiliado — podemos receber comissao.</p>
            )}
          </div>

          {/* Info card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-7 mb-5">
            <h2 className="font-display font-600 text-slate-900 mb-5">Informacoes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center text-sm shrink-0">💰</div>
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Precificacao</p>
                  <span className={badgePreco(f.precificacao)}>{labelPreco(f.precificacao)}</span>
                </div>
              </div>
              {f.precoMensal != null && f.precoMensal > 0 && (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center text-sm shrink-0">🏷️</div>
                  <div>
                    <p className="text-xs text-slate-400 mb-0.5">Preco</p>
                    <p className="text-sm font-medium">{formatPreco(f.precificacao, f.precoMensal)}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center text-sm shrink-0">🌍</div>
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Portugues</p>
                  <p className="text-sm">{f.emPortugues ? 'Sim' : 'Apenas ingles'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center text-sm shrink-0">📂</div>
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Categoria</p>
                  <Link href={`/categoria/${f.categoria.slug}`} className="text-sm text-emerald-700 hover:underline">
                    {f.categoria.icone} {f.categoria.nome}
                  </Link>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center text-sm shrink-0">🔗</div>
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Website</p>
                  <a href={f.url} target="_blank" rel="noopener noreferrer" className="text-sm text-emerald-700 hover:underline truncate block">
                    {safeUrlHostname(f.url)}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="lg:w-72 shrink-0 space-y-5">
          {/* CTA card */}
          <div className="bg-slate-950 text-white rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(16,185,129,0.15),transparent_60%)]" />
            <div className="relative">
              <p className="font-display font-600 text-sm mb-1.5">Trabalhas nesta ferramenta?</p>
              <p className="text-xs text-slate-400 mb-5 leading-relaxed">
                Destaca-a e alcanca profissionais em todo o espaco lusofono (CPLP e diaspora)
              </p>
              <Link
                href={`/destaque?ferramentaId=${encodeURIComponent(f.id)}`}
                className="block text-center bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold px-4 py-3 rounded-xl transition-all shadow-sm shadow-emerald-500/20"
              >
                Destacar no diretorio &rarr;
              </Link>
            </div>
          </div>

          {/* Related tools */}
          {relacionadas.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Ferramentas similares</p>
              <div className="space-y-2.5">
                {relacionadas.map(rel => <ToolCard key={rel.id} ferramenta={rel as any} />)}
              </div>
              <Link href={`/categoria/${f.categoria.slug}`} className="block text-center text-sm text-emerald-700 mt-4 font-semibold hover:text-emerald-600 transition-colors">
                Ver todas &rarr;
              </Link>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
