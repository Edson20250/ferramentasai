import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { withDatabase } from '@/lib/with-database'
import { LUSO_AUDIENCE_LINE } from '@/lib/site-copy'
import { ToolCard } from '@/components/ToolCard'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
    title: 'FerramentasAI — Diretorio de Ferramentas de IA em Portugues',
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
      {/* ══════════ HERO ══════════ */}
      <section className="hero-section text-white relative overflow-hidden">
        {/* Grid pattern */}
        <div className="absolute inset-0 hero-grid-overlay" />

        {/* Floating orbs */}
        <div className="absolute top-20 right-[15%] w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 left-[10%] w-56 h-56 bg-indigo-500/8 rounded-full blur-3xl animate-float-delay" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 md:py-28">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-7 backdrop-blur-sm">
              <span className="glow-dot animate-pulse" />
              <span className="text-emerald-300 text-xs font-semibold tracking-wide">
                {totalFerramentas}+ ferramentas curadas
              </span>
            </div>

            {/* Heading */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-800 leading-[1.1] mb-6 text-white">
              A melhor IA para{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                cada tarefa
              </span>
              , em portugues
            </h1>

            {/* Subtitle */}
            <p className="text-slate-400 text-lg leading-relaxed mb-9 max-w-2xl">
              Descobre e compara as melhores ferramentas de inteligencia artificial.
              Curadas para {LUSO_AUDIENCE_LINE}.
            </p>

            {/* Search */}
            <form action="/pesquisa" method="GET" className="flex gap-2.5 max-w-xl">
              <div className="relative flex-1">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input
                  name="q"
                  type="text"
                  placeholder="Pesquisa ferramentas de IA... ex: escrever textos"
                  className="w-full bg-white/8 border border-white/15 rounded-xl pl-10 pr-4 py-3.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/30 focus:bg-white/10 transition-all"
                />
              </div>
              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-400 active:scale-[0.97] text-white px-6 py-3.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-emerald-500/20"
              >
                Pesquisar
              </button>
            </form>

            {/* Popular tags */}
            <div className="mt-4 flex items-center gap-2 flex-wrap">
              <span className="text-slate-600 text-xs">Popular:</span>
              {['ChatGPT', 'Midjourney', 'GitHub Copilot', 'Perplexity'].map((t) => (
                <Link
                  key={t}
                  href={`/pesquisa?q=${encodeURIComponent(t)}`}
                  className="text-xs text-slate-500 hover:text-emerald-400 bg-white/5 hover:bg-white/10 border border-white/5 px-2.5 py-1 rounded-lg transition-all"
                >
                  {t}
                </Link>
              ))}
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap gap-8 mt-10 pt-8 border-t border-white/8">
              {[
                { value: `${totalFerramentas}+`, label: 'Ferramentas' },
                { value: `${categorias.length}`, label: 'Categorias' },
                { value: '100%', label: 'Em portugues' },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="font-display text-2xl font-800 text-white">{value}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ CATEGORIAS ══════════ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="section-label">Categorias</span>
            <h2 className="font-display text-2xl font-700 text-slate-900">Explorar por area</h2>
          </div>
          <Link href="/categorias" className="text-sm text-emerald-700 hover:text-emerald-600 font-semibold transition-colors hidden sm:block">
            Ver todas &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {categorias.map((cat) => (
            <Link key={cat.id} href={`/categoria/${cat.slug}`} className="cat-card group">
              <div
                className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl transition-all duration-300 group-hover:h-1.5"
                style={{ backgroundColor: cat.cor }}
              />
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-3 mt-1 transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: `${cat.cor}15` }}
              >
                {cat.icone}
              </div>
              <p className="font-display font-600 text-slate-900 text-sm leading-snug group-hover:text-emerald-700 transition-colors">
                {cat.nome}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {cat._count.ferramentas} ferramentas
              </p>
            </Link>
          ))}
        </div>

        <Link href="/categorias" className="block text-center text-sm text-emerald-700 font-semibold mt-6 sm:hidden">
          Ver todas as categorias &rarr;
        </Link>
      </section>

      {/* ══════════ FERRAMENTAS EM DESTAQUE ══════════ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-14">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="section-label">Populares</span>
            <h2 className="font-display text-2xl font-700 text-slate-900">Ferramentas em destaque</h2>
            <p className="text-sm text-slate-500 mt-1">As mais populares da comunidade</p>
          </div>
          <Link href="/novidades" className="text-sm text-emerald-700 hover:text-emerald-600 font-semibold transition-colors hidden sm:block">
            Ver todas &rarr;
          </Link>
        </div>

        {ferramentasDestaque.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {ferramentasDestaque.map((f) => (
              <ToolCard key={f.id} ferramenta={f as any} />
            ))}
          </div>
        ) : (
          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-14 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-2xl mx-auto mb-4">
              🚀
            </div>
            <p className="font-display font-600 text-slate-700 mb-1">Em breve aqui</p>
            <p className="text-sm text-slate-400 mb-5">Ainda a curar as primeiras ferramentas em destaque.</p>
            <Link href="/submeter" className="btn-primary text-sm">
              Submeter a tua ferramenta &rarr;
            </Link>
          </div>
        )}

        <Link href="/novidades" className="block text-center text-sm text-emerald-700 font-semibold mt-6 sm:hidden">
          Ver todas as ferramentas &rarr;
        </Link>
      </section>

      {/* ══════════ COMO FUNCIONA ══════════ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-14">
        <div className="text-center mb-10">
          <span className="section-label">Simples</span>
          <h2 className="font-display text-2xl font-700 text-slate-900">Como funciona</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              step: '01',
              icon: '🔍',
              title: 'Pesquisa',
              desc: 'Procura por nome, categoria ou funcionalidade. Filtra por preco e popularidade.',
            },
            {
              step: '02',
              icon: '⚡',
              title: 'Compara',
              desc: 'Ve detalhes, precos e funcionalidades lado a lado. Tudo em portugues.',
            },
            {
              step: '03',
              icon: '🚀',
              title: 'Escolhe',
              desc: 'Acede diretamente a ferramenta ideal para o teu projeto ou equipa.',
            },
          ].map((item) => (
            <div key={item.step} className="relative bg-white border border-slate-200/80 rounded-2xl p-6 text-center hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300 hover:-translate-y-1 group">
              <span className="absolute top-4 right-4 text-xs font-display font-700 text-slate-200 group-hover:text-emerald-200 transition-colors">
                {item.step}
              </span>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-2xl mx-auto mb-4">
                {item.icon}
              </div>
              <h3 className="font-display font-600 text-slate-900 mb-2">{item.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════ CTA NEWSLETTER ══════════ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="bg-slate-950 rounded-3xl p-8 md:p-14 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(16,185,129,0.12),transparent_70%)]" />
          <div className="absolute inset-0 hero-grid-overlay opacity-50" />
          <div className="relative">
            <span className="inline-flex items-center gap-2 text-emerald-400 text-xs font-semibold mb-4 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
              Newsletter gratuita
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-700 mb-3">
              Novidades de IA todas as semanas
            </h2>
            <p className="text-slate-400 text-sm mb-7 max-w-md mx-auto">
              Recebe as melhores ferramentas novas, tutoriais e dicas de IA diretamente no teu email. Em portugues, sem spam.
            </p>
            <form action="/api/newsletter" method="POST" className="flex gap-2.5 max-w-sm mx-auto">
              <input
                name="email"
                type="email"
                required
                placeholder="o.teu@email.com"
                className="flex-1 bg-white/8 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              />
              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-400 text-white px-5 py-3 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-emerald-500/20 whitespace-nowrap"
              >
                Subscrever &rarr;
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ══════════ CTA DESTAQUE ══════════ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-7 flex flex-col sm:flex-row items-center justify-between gap-5 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center text-2xl shrink-0">
              💡
            </div>
            <div>
              <p className="font-display font-600 text-slate-900 mb-0.5">Tens uma ferramenta de IA?</p>
              <p className="text-sm text-slate-500">
                Aparece em frente de milhares de profissionais em todo o espaco lusofono.
              </p>
            </div>
          </div>
          <div className="flex gap-2.5 shrink-0">
            <Link href="/submeter" className="btn-outline">Submeter gratis</Link>
            <Link href="/destaque" className="btn-primary">Destacar &rarr;</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
