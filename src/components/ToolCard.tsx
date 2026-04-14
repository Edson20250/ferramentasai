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
            cor?: string
          }
    }
}

function getAvatarColor(name: string): string {
    const colors = [
          '#6366f1', '#ec4899', '#f59e0b', '#10b981',
          '#3b82f6', '#8b5cf6', '#ef4444', '#06b6d4',
          '#84cc16', '#f97316',
        ]
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return colors[hash % colors.length]
}

export function ToolCard({ ferramenta: f }: Props) {
    const linkExterno = f.urlAfiliado || f.url
    const initials = f.nome.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    const avatarColor = getAvatarColor(f.nome)

  return (
    <div className={`group ${f.destaque ? 'card-ferramenta-destaque' : 'card-ferramenta'}`}>
      {f.destaque && (
        <div className="absolute -top-px left-6 right-6 h-0.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 rounded-full" />
      )}

      <div className="flex items-start gap-3.5">
        {/* Avatar */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden ring-1 ring-black/5 transition-transform duration-300 group-hover:scale-105"
          style={{
            backgroundColor: f.logoUrl ? '#f8fafc' : `${avatarColor}12`,
          }}
        >
          {f.logoUrl ? (
            <Image
              src={f.logoUrl}
              alt={f.nome}
              width={48}
              height={48}
              className="w-full h-full object-contain p-1.5"
            />
          ) : (
            <span className="font-display text-sm font-700" style={{ color: avatarColor }}>
              {initials}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Name + badges */}
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <Link
              href={`/ferramenta/${f.slug}`}
              className="font-display font-600 text-slate-900 hover:text-emerald-700 transition-colors text-[0.9rem] leading-snug"
            >
              {f.nome}
            </Link>
            {f.emPortugues && (
              <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-md font-semibold border border-emerald-100">
                PT
              </span>
            )}
            {f.destaque && (
              <span className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded-md font-semibold border border-amber-100 flex items-center gap-0.5">
                <svg className="w-2.5 h-2.5" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                Destaque
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-2.5">
            {f.descricao}
          </p>

          {/* Bottom row */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={badgePreco(f.precificacao)}>
                {labelPreco(f.precificacao)}
              </span>
              <Link
                href={`/categoria/${f.categoria.slug}`}
                className="text-xs text-slate-400 hover:text-emerald-600 transition-colors flex items-center gap-1"
              >
                <span>{f.categoria.icone}</span>
                <span>{f.categoria.nome}</span>
              </Link>
            </div>
            <a
              href={linkExterno}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-600 flex items-center gap-1 transition-colors group/link opacity-80 group-hover:opacity-100"
            >
              Visitar
              <svg className="w-3 h-3 transition-transform duration-200 group-hover/link:translate-x-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
