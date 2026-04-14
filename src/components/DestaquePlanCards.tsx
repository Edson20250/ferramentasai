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
    nome: 'Basico',
    preco: 49,
    descricao: 'Para comecar a ganhar visibilidade',
    features: [
      'Listagem verificada com badge',
      'Posicao destacada na categoria',
      'Link direto para o teu site',
      'Valido por 30 dias (renovaveis)',
    ],
    cta: 'Comecar com Basico',
    destaque: false,
  },
  {
    id: 'pro',
    nome: 'Pro',
    preco: 99,
    descricao: 'O mais escolhido por fundadores',
    features: [
      'Tudo do Basico',
      'Posicao topo de categoria',
      'Badge "Destaque" dourado',
      'Aparece na homepage',
      'Valido por 60 dias (renovaveis)',
    ],
    cta: 'Comecar com Pro',
    destaque: true,
  },
  {
    id: 'destaque',
    nome: 'Premium',
    preco: 199,
    descricao: 'Maxima exposicao garantida',
    features: [
      'Tudo do Pro',
      'Posicao #1 garantida na categoria',
      'Mencao na newsletter (12.000+ leitores)',
      'Post nas redes sociais',
      'Valido por 90 dias (renovaveis)',
    ],
    cta: 'Comecar com Premium',
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
          className={`relative rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 ${
            p.destaque
              ? 'bg-gradient-to-b from-white to-emerald-50/40 border-2 border-emerald-400 shadow-xl shadow-emerald-500/10'
              : 'bg-white border border-slate-200/80 hover:shadow-lg hover:shadow-emerald-500/5 hover:border-emerald-200'
          }`}
        >
          {p.destaque && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md shadow-emerald-500/30">
              Mais popular
            </div>
          )}

          <p className="font-display font-700 text-slate-900 text-lg mb-0.5">{p.nome}</p>
          <p className="text-xs text-slate-400 mb-5">{p.descricao}</p>

          <div className="mb-6">
            <span className="font-display text-4xl font-800 text-slate-900">&euro;{p.preco}</span>
            <span className="text-slate-400 text-sm ml-1">/mes</span>
          </div>

          <ul className="space-y-3 mb-7">
            {p.features.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600">
                <svg className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
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
                  'Indica primeiro a ferramenta: abre a pagina da tua ferramenta no diretorio e usa o botao "Destacar", ou adiciona ?ferramentaId= ao URL desta pagina.',
                )
              }
            }}
            className={`block text-center py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
              p.destaque
                ? 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm shadow-emerald-600/20'
                : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
            } ${missing ? 'opacity-70' : 'active:scale-[0.97]'}`}
          >
            {p.cta} &rarr;
          </a>
        </div>
      ))}
    </div>
  )
}
