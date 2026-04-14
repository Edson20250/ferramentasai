import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { withDatabase } from '@/lib/with-database'
import { LUSO_AUDIENCE_LINE } from '@/lib/site-copy'
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
          include: {
            _count: { select: { ferramentas: { where: { aprovado: true } } } },
          },
        }),
        prisma.ferramenta.findMany({
          where: { aprovado: true },
          include: { categoria: true },
          orderBy: [{ destaque: 'desc' }, { visualizacoes: 'desc' }],
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
      <section className="hero-section text-white relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1 mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 text-xs font-medium">
                {totalFerramentas}+ ferramentas curadas
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-800 leading-tight mb-5 text-white">
              A melhor IA para <span className="text-emerald-400">cada tarefa</span>, em português
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-2xl">
              Descobre e compara as melhores ferramentas de inteligência artificial. Curadas para{' '}
              {LUSO_AUDIENCE_LINE}.
            </p>
            <form action="/pesquisa" method="GET" className="flex gap-2 max-w-xl">
              <div className="relative flex-1">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm">🔍</span>
                <input
                  name="q"
                  type="text"
                  placeholder="Pesquisa ferramentas de IA… ex: escrever textos"
                  className="w-full bg-white/10 border border-white/20 rounded-xl pl-9 pr-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-white px-5 py-3 rounded-xl text-sm font-medium transition-all"
              >
                Pesquisar
              </button>
            </form>
            <p className="mt-4 text-slate-600 text-xs">
              Popular:{' '}
              {['ChatGPT', 'Midjourney', 'GitHub Copilot', 'Perplexity'].map((t, i) => (
                <span key={t}>
                  <Link
                    href={`/pesquisa?q=${encodeURIComponent(t)}`}
                    className="text-slate-400 hover:text-emerald-400 transition-colors"
                  >
                    {t}
                  </Link>
                  {i < 3 && <span className="text-slate-700 mx-1">·</span>}
                </span>
              ))}
            </p>
            <div className="flex flex-wrap gap-6 mt-8 pt-8 border-t border-white/10">
              {[
                { icon: '🛠️', label: `${totalFerramentas}+ ferramentas` },
                { icon: '📂', label: `${categorias.length} categorias` },
                { icon: '🌍', label: '100% em português' },
                { icon: '✅', label: 'Curadas & atualizadas' },
              ].map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 text-slate-400 text-sm">
                  <span>{icon}</span>
                  <span>{label}</span>
                </div>
              ))}
            </div>
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
            <Link key={cat.id} href={`/categoria/${cat.slug}`} className="cat-card group">
              <div
                className="absolute top-0 left-0 right-0 h-1 rounded-t-xl"
                style={{ backgroundColor: cat.cor }}
              />
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-xl mb-3 mt-1"
                style={{ backgroundColor: `${cat.cor}20` }}
              >
                {cat.icone}
              </div>
              <p className="font-display font-600 text-slate-900 text-sm leading-snug group-hover:text-emerald-700 transition-colors">
                {cat.nome}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">{cat._count.ferramentas} ferramentas</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Ferramentas em destaque */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-xl font-700 text-slate-900">Ferramentas em destaque</h2>
            <p className="text-xs text-slate-400 mt-0.5">As mais populares da comunidade</p>
          </div>
          <Link href="/novidades" className="text-sm text-emerald-700 hover:text-emerald-800 font-medium">
            Ver todas →
          </Link>
        </div>
        {ferramentasDestaque.length === 0 ? (
          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
            <p className="text-3xl mb-3">🚀</p>
            <p className="font-display font-600 text-slate-700 mb-4">Em breve aqui</p>
            <Link href="/submeter" className="btn-primary text-xs px-4 py-2">
              Submeter →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {ferramentasDestaque.map((f) => (
              <ToolCard key={f.id} ferramenta={f as any} />
            ))}
          </div>
        )}
      </section>

      {/* CTA Newsletter */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="bg-slate-900 rounded-2xl p-8 md:p-12 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(16,185,129,0.15),transparent_70%)]" />
          <div className="relative">
            <p className="text-emerald-400 text-sm font-medium mb-3">Newsletter gratuita</p>
            <h2 className="font-display text-2xl md:text-3xl font-700 mb-3">Novidades de IA todas as semanas</h2>
            <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
              Recebe as melhores ferramentas novas, tutoriais e dicas de IA diretamente no teu email. Em português, sem
              spam.
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
        <div className="border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 hover:border-slate-300 hover:shadow-sm transition-all">
          <div>
            <p className="font-display font-600 text-slate-900 mb-1">Tens uma ferramenta de IA?</p>
            <p className="text-sm text-slate-500">
              Aparece em frente de milhares de profissionais em todo o espaço lusófono — CPLP e diáspora.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Link href="/submeter" className="btn-outline">
              Submeter grátis
            </Link>
            <Link href="/destaque" className="btn-primary">
              Destacar ↗
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
