import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { withDatabase } from '@/lib/with-database'
import { ToolCard } from '@/components/ToolCard'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'FerramentasAI — Diretório de Ferramentas de IA em Português',
}

async function getDados() {
  return withDatabase(
    { categorias: [], ferramentasDestaque: [], totalFerramentas: 0 },
    async () => {
      const [categorias, ferramentasDestaque, totalFerramentas] = await Promise.all([
        prisma.categoria.findMany({
          orderBy: { nome: 'asc' },
          include: { _count: { select: { ferramentas: { where: { aprovado: true } } } } },
        }),
        prisma.ferramenta.findMany({
          where: { destaque: true, aprovado: true },
          include: { categoria: true },
          orderBy: { visualizacoes: 'desc' },
          take: 6,
        }),
        prisma.ferramenta.count({ where: { aprovado: true } }),
      ])
      return { categorias, ferramentasDestaque, totalFerramentas }
    },
  )
}

export default async function HomePage() {
  const { categorias, ferramentasDestaque, totalFerramentas } = await getDados()

  return (
    <div>
      {/* Hero */}
      <section className="bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(16,185,129,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(99,102,241,0.1),transparent_60%)]" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1 mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 text-xs font-medium">{totalFerramentas}+ ferramentas curadas</span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-800 leading-tight mb-5 text-white">
              A melhor IA para{' '}
              <span className="text-emerald-400">cada tarefa</span>,
              em português
            </h1>

            <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-2xl">
              Descobre e compara as melhores ferramentas de inteligência artificial. Curadas para profissionais e empresas de Portugal e Brasil.
            </p>

            {/* Search bar */}
            <form action="/pesquisa" method="GET" className="flex gap-2 max-w-xl">
              <input
                name="q"
                type="text"
                placeholder="Pesquisa ferramentas de IA… ex: &quot;escrever textos&quot;"
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-400 text-white px-5 py-3 rounded-xl text-sm font-medium transition-colors"
              >
                Pesquisar
              </button>
            </form>

            <p className="mt-4 text-slate-600 text-xs">
              Popular: {' '}
              {['ChatGPT', 'Midjourney', 'GitHub Copilot', 'Perplexity'].map((t, i) => (
                <span key={t}>
                  <Link href={`/pesquisa?q=${encodeURIComponent(t)}`} className="text-slate-400 hover:text-emerald-400 transition-colors">
                    {t}
                  </Link>
                  {i < 3 && <span className="text-slate-700 mx-1">·</span>}
                </span>
              ))}
            </p>
          </div>
        </div>
      </section>

      {/* Categorias */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-700 text-slate-900">Explorar por categoria</h2>
          <Link href="/categorias" className="text-sm text-emerald-700 hover:text-emerald-800 font-medium">
            Ver todas →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {categorias.map((cat) => (
            <Link
              key={cat.id}
              href={`/categoria/${cat.slug}`}
              className="bg-white border border-slate-200 rounded-xl p-4 hover:border-emerald-300 hover:shadow-sm transition-all group"
            >
              <div className="text-2xl mb-2">{cat.icone}</div>
              <p className="font-display font-600 text-slate-900 text-sm leading-snug group-hover:text-emerald-700 transition-colors">
                {cat.nome}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {cat._count.ferramentas} ferramentas
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Ferramentas em destaque */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-xl font-700 text-slate-900">Ferramentas em destaque</h2>
            <p className="text-xs text-slate-400 mt-0.5">As mais populares da semana</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ferramentasDestaque.map((f) => (
            <ToolCard key={f.id} ferramenta={f as any} />
          ))}
        </div>
      </section>

      {/* CTA newsletter */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="bg-slate-900 rounded-2xl p-8 md:p-12 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(16,185,129,0.15),transparent_70%)]" />
          <div className="relative">
            <p className="text-emerald-400 text-sm font-medium mb-3">Newsletter gratuita</p>
            <h2 className="font-display text-2xl md:text-3xl font-700 mb-3">
              Novidades de IA todas as semanas
            </h2>
            <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
              Recebe as melhores ferramentas novas, tutoriais e dicas de IA diretamente no teu email. Em português, sem spam.
            </p>
            <form action="/api/newsletter" method="POST" className="flex gap-2 max-w-sm mx-auto">
              <input
                name="email"
                type="email"
                required
                placeholder="o.teu@email.com"
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap"
              >
                Subscrever →
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* CTA Destaque */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-display font-600 text-slate-900 mb-1">Tens uma ferramenta de IA?</p>
            <p className="text-sm text-slate-500">Aparece em frente de milhares de profissionais portugueses e brasileiros.</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Link href="/submeter" className="btn-outline">Submeter grátis</Link>
            <Link href="/destaque" className="btn-primary">Destacar ↗</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
