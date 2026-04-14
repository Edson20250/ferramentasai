'use client'

type Plano = {
  id: string
  nome: string
  preco: number
  descricao: string
  features: string[]
  cta: string
  destaque: boolean
}

const PLANOS: Plano[] = [
  {
    id: 'basico',
    nome: 'Básico',
    preco: 49,
    descricao: 'Para começar a ganhar visibilidade',
    features: [
      'Listagem verificada com badge',
      'Posição destacada na categoria',
      'Link direto para o teu site',
      'Válido por 30 dias (renováveis)',
    ],
    cta: 'Começar com Básico',
    destaque: false,
  },
  {
    id: 'pro',
    nome: 'Pro',
    preco: 99,
    descricao: 'O mais escolhido por fundadores',
    features: [
      'Tudo do Básico',
      'Posição topo de categoria',
      'Badge "Destaque" dourado',
      'Aparece na homepage',
      'Válido por 60 dias (renováveis)',
    ],
    cta: 'Começar com Pro',
    destaque: true,
  },
  {
    id: 'destaque',
    nome: 'Premium',
    preco: 199,
    descricao: 'Máxima exposição garantida',
    features: [
      'Tudo do Pro',
      'Posição #1 garantida na categoria',
      'Menção na newsletter (12.000+ leitores)',
      'Post nas redes sociais',
      'Válido por 90 dias (renováveis)',
    ],
    cta: 'Começar com Premium',
    destaque: false,
  },
]

export function DestaquePlanCards({ ferramentaId }: { ferramentaId: string }) {
  const trimmed = ferramentaId.trim()
  const missing = !trimmed

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
      {PLANOS.map((p) => (
        <div
          key={p.id}
          className="relative rounded-2xl p-6 flex flex-col"
          style={
            p.destaque
              ? {
                  background: 'var(--surface)',
                  border: '2px solid var(--accent)',
                  boxShadow: 'var(--shadow-lg)',
                }
              : {
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                }
          }
        >
          {/* Most popular badge */}
          {p.destaque && (
            <div
              className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-white text-[11px] font-semibold px-3 py-1 rounded-full"
              style={{ background: 'var(--accent)' }}
            >
              Mais popular
            </div>
          )}

          {/* Plan name + description */}
          <p className="font-bold text-[var(--foreground)] text-base mb-0.5">{p.nome}</p>
          <p className="text-xs mb-5" style={{ color: 'var(--muted-foreground)' }}>{p.descricao}</p>

          {/* Price */}
          <div className="mb-6">
            <span className="font-extrabold text-[2rem] text-[var(--foreground)] tracking-tight leading-none">
              €{p.preco}
            </span>
            <span className="text-sm ml-1" style={{ color: 'var(--muted-foreground)' }}>/mês</span>
          </div>

          {/* Features */}
          <ul className="space-y-2.5 mb-7 flex-1">
            {p.features.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm" style={{ color: 'var(--muted)' }}>
                <svg
                  className="shrink-0 mt-0.5"
                  width="14" height="14" viewBox="0 0 14 14" fill="none"
                  style={{ color: 'var(--accent)' }}
                >
                  <path
                    d="M2.5 7l3.5 3.5 5.5-6"
                    stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
                  />
                </svg>
                {f}
              </li>
            ))}
          </ul>

          {/* CTA */}
          <a
            href={
              missing
                ? '#'
                : `/api/checkout?plano=${encodeURIComponent(p.id)}&ferramentaId=${encodeURIComponent(trimmed)}`
            }
            onClick={(e) => {
              if (missing) {
                e.preventDefault()
                alert(
                  'Indica primeiro a ferramenta: abre a página da tua ferramenta no diretório e usa o botão «Destacar», ou adiciona ?ferramentaId= ao URL desta página.',
                )
              }
            }}
            className={p.destaque ? 'btn-accent text-center' : 'btn-outline text-center'}
            style={{ opacity: missing ? 0.7 : 1 }}
          >
            {p.cta} →
          </a>
        </div>
      ))}
    </div>
  )
}
