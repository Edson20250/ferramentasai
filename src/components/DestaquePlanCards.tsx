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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
      {PLANOS.map((p) => (
        <div
          key={p.id}
          className={`bg-white rounded-2xl p-6 ${
            p.destaque ? 'border-2 border-emerald-400 shadow-lg relative' : 'border border-slate-200'
          }`}
        >
          {p.destaque && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-xs font-medium px-3 py-1 rounded-full">
              Mais popular
            </div>
          )}

          <p className="font-display font-700 text-slate-900 mb-0.5">{p.nome}</p>
          <p className="text-xs text-slate-400 mb-4">{p.descricao}</p>

          <div className="mb-5">
            <span className="font-display text-3xl font-800 text-slate-900">€{p.preco}</span>
            <span className="text-slate-400 text-sm">/mês</span>
          </div>

          <ul className="space-y-2 mb-6">
            {p.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="text-emerald-500 mt-0.5 shrink-0">✓</span>
                {f}
              </li>
            ))}
          </ul>

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
            className={`block text-center py-2.5 rounded-xl text-sm font-medium transition-colors ${
              p.destaque
                ? 'bg-emerald-500 text-white hover:bg-emerald-400'
                : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
            } ${missing ? 'opacity-80' : ''}`}
          >
            {p.cta} →
          </a>
        </div>
      ))}
    </div>
  )
}
