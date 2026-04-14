import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { isDatabaseConfigured } from '@/lib/db-config'
import { withDatabase } from '@/lib/with-database'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Todas as Categorias de Ferramentas de IA em Portugues',
  description: 'Explora todas as categorias de ferramentas de inteligencia artificial em portugues.',
}

export default async function CategoriasPage() {
  const categorias = await withDatabase([], () =>
    prisma.categoria.findMany({
      orderBy: { nome: 'asc' },
      include: {
        _count: { select: { ferramentas: { where: { aprovado: true } } } },
        ferramentas: {
          where: { aprovado: true, destaque: true },
          orderBy: { visualizacoes: 'desc' },
          take: 3,
          select: { nome: true, slug: true },
        },
      },
    }),
  )

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-10">
        <span className="section-label">Explorar</span>
        <h1 className="font-display text-3xl font-700 text-slate-900 mb-2">Todas as categorias</h1>
        <p className="text-slate-500 text-sm">{categorias.length} categorias &middot; Ferramentas de IA organizadas por area</p>
      </div>

      {categorias.length === 0 ? (
        <div className="text-center py-16 text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
          <p className="text-sm">
            {isDatabaseConfigured()
              ? 'Ainda nao ha categorias na base de dados.'
              : 'Configura DATABASE_URL e corre o seed para carregar as categorias.'}
          </p>
        </div>
      ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {categorias.map(cat => (
          <Link
            key={cat.id}
            href={`/categoria/${cat.slug}`}
            className="bg-white border border-slate-200/80 rounded-2xl p-6 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300 group hover:-translate-y-0.5"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 transition-transform duration-300 group-hover:scale-110" style={{ backgroundColor: `${cat.cor || '#f1f5f9'}15` }}>
                {cat.icone}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <h2 className="font-display font-600 text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {cat.nome}
                  </h2>
                  <span className="text-xs text-slate-400 shrink-0 bg-slate-50 px-2 py-0.5 rounded-full">
                    {cat._count.ferramentas}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed mb-3">{cat.descricao}</p>
                {cat.ferramentas.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {cat.ferramentas.map(f => (
                      <span
                        key={f.slug}
                        className="text-xs bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full"
                      >
                        {f.nome}
                      </span>
                    ))}
                    <span className="text-xs text-emerald-600 px-1 py-0.5 font-medium">e mais &rarr;</span>
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
      )}
    </div>
  )
}
