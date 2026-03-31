import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { ToolCard } from '@/components/ToolCard'
import { badgePreco, formatPreco, labelPreco } from '@/lib/utils'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

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

export default async function FerramentaPage({ params }: Props) {
  const { slug } = await params
  const f = await prisma.ferramenta.findUnique({ where: { slug, aprovado: true }, include: { categoria: true } })
  if (!f) notFound()

  prisma.ferramenta.update({ where: { id: f.id }, data: { visualizacoes: { increment: 1 } } }).catch(() => {})

  const relacionadas = await prisma.ferramenta.findMany({
    where: { categoriaId: f.categoriaId, aprovado: true, id: { not: f.id } },
    include: { categoria: true },
    orderBy: { destaque: 'desc' },
    take: 4,
  })

  const linkExterno = f.urlAfiliado || f.url
  const initials = f.nome.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <nav className="text-xs text-slate-400 mb-6 flex items-center gap-1.5">
        <Link href="/" className="hover:text-slate-600">Início</Link>
        <span>/</span>
        <Link href={`/categoria/${f.categoria.slug}`} className="hover:text-slate-600">{f.categoria.nome}</Link>
        <span>/</span>
        <span className="text-slate-600">{f.nome}</span>
      </nav>
      <div className="flex gap-8 flex-col lg:flex-row">
        <article className="flex-1 min-w-0">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-500 shrink-0 overflow-hidden">
                {f.logoUrl ? (
                  <Image src={f.logoUrl} alt={f.nome} width={56} height={56} className="w-full h-full object-contain p-1.5" />
                ) : (
                  <span className="font-display text-lg">{initials}</span>
                )}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="font-display text-2xl font-700 text-slate-900">{f.nome}</h1>
                  {f.emPortugues && <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium">🇵🇹 PT</span>}
                  {f.destaque && <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-medium">⭐ Destaque</span>}
                </div>
                <Link href={`/categoria/${f.categoria.slug}`} className="text-sm text-slate-500 hover:text-emerald-700">{f.categoria.icone} {f.categoria.nome}</Link>
              </div>
