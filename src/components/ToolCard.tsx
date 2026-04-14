import Link from 'next/link'
import Image from 'next/image'
import { labelPreco } from '@/lib/utils'

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

function badgeClass(precificacao: string): string {
  switch (precificacao) {
    case 'GRATUITO': return 'badge-free'
    case 'FREEMIUM': return 'badge-freemium'
    case 'PAGO':     return 'badge-paid'
    default:         return 'badge-freemium'
  }
}

export function ToolCard({ ferramenta: f }: Props) {
  const linkExterno = f.urlAfiliado || f.url
  const initials = f.nome.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
  const avatarColor = getAvatarColor(f.nome)

  return (
    <article className="tool-card-premium group">

      {/* Destaque accent line */}
      {f.destaque && (
        <div
          className="absolute top-0 left-0 right-0 h-[2px] rounded-t-[16px]"
          style={{ background: 'linear-gradient(90deg, #10b981, #34d399)' }}
        />
      )}

      {/* Header */}
      <div className="flex items-start gap-3.5">
        {/* Avatar */}
        <div
          className="tool-avatar"
          style={{
            background: f.logoUrl ? 'var(--surface-muted)' : `${avatarColor}16`,
            border: `1.5px solid ${avatarColor}28`,
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
            <span style={{ color: avatarColor }}>{initials}</span>
          )}
        </div>

        <div className="flex-1 min-w-0 pt-0.5">
          <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
            <Link
              href={`/ferramenta/${f.slug}`}
              className="font-semibold text-sm text-[var(--foreground)] hover:text-green-700 transition-colors leading-snug"
            >
              {f.nome}
            </Link>
            {f.emPortugues && (
              <span className="text-[10px] font-semibold bg-green-50 text-green-700 border border-green-200 px-1.5 py-0.5 rounded-full">
                🇵🇹 PT
              </span>
            )}
            {f.destaque && (
              <span className="badge-featured">⭐ Destaque</span>
            )}
          </div>
          <Link
            href={`/categoria/${f.categoria.slug}`}
            className="text-xs text-[var(--muted-foreground)] hover:text-green-600 transition-colors"
          >
            {f.categoria.icone} {f.categoria.nome}
          </Link>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm leading-relaxed line-clamp-2" style={{ color: 'var(--muted)' }}>
        {f.descricao}
      </p>

      {/* Footer */}
      <div
        className="flex items-center justify-between pt-3"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        <span className={badgeClass(f.precificacao)}>
          {labelPreco(f.precificacao)}
        </span>
        <a
          href={linkExterno}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold text-green-600 hover:text-green-700 transition-colors flex items-center gap-1"
        >
          Visitar
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <path d="M2 9L9 2M9 2H5M9 2v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </article>
  )
}
