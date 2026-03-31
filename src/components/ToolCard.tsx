import Link from 'next/link'
import Image from 'next/image'
import { badgePreco, labelPreco } from '@/lib/utils'

type Props = {
  ferramenta: {
    id: string
    nome: string
    slug: string
    descricao: string
    url: string
    urlAfiliado?: string | null
    logoUrl?: string | null
    precificacao: string
    precoMensal?: number | null
    emPortugues: boolean
    destaque: boolean
    tags: string[]
    visualizacoes: number
    categoria: {
      nome: string
      slug: string
      icone: string
    }
  }
}

export function ToolCard({ ferramenta: f }: Props) {
  const linkExterno = f.urlAfiliado || f.url
  const initials = f.nome.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()

  return (
    <div className={f.destaque ? 'card-ferramenta-destaque' : 'card-ferramenta'}>
      {f.destaque && (
        <div className="absolute -top-px left-4 right-4 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full" />
      )}

      <div className="flex items-start gap-3">
        {/* Logo / Avatar */}
        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 text-xs font-bold text-slate-500 overflow-hidden">
          {f.logoUrl ? (
            <Image src={f.logoUrl} alt={f.nome} width={40} height={40} className="w-full h-full object-contain p-1" />
          ) : (
            <span className="font-display">{initials}</span>
          )}
        </div>

        {/* Conteúdo */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <Link
              href={`/ferramenta/${f.slug}`}
              className="font-display font-600 text-slate-900 hover:text-emerald-700 transition-colors text-sm leading-snug"
            >
              {f.nome}
            </Link>
            {f.emPortugues && (
              <span className="text-xs bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-medium">🇵🇹 PT</span>
            )}
            {f.destaque && (
              <span className="text-xs bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded font-medium">Destaque</span>
            )}
          </div>

          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-2">
            {f.descricao}
          </p>

          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={badgePreco(f.precificacao)}>
                {labelPreco(f.precificacao)}
              </span>
              <Link
                href={`/categoria/${f.categoria.slug}`}
                className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
              >
                {f.categoria.icone} {f.categoria.nome}
              </Link>
            </div>

            <a
              href={linkExterno}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5 transition-colors"
            >
              Visitar →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
