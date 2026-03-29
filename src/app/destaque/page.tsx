import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Destaque a sua ferramenta de IA em português | FerramentasAI',
  description: 'Alcança milhares de profissionais e empresas de Portugal e Brasil. Destaca a tua ferramenta de IA no maior diretório lusófono.',
}

const PLANOS = [
  {
    id: 'basico',
    nome: 'Básico',
    preco: 49,
    descricao: 'Para começar a ganhar visibilidade',
    features: [
      'Listagem verificada com badge',
      'Posição destacada na categoria',
      'Link direto para o teu site',
      'Válido por 30 dias',
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
      'Válido por 30 dias',
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
      'Válido por 30 dias',
    ],
    cta: 'Começar com Premium',
    destaque: false,
  },
]

export default function DestacarPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">

      {/* Header */}
      <div className="text-center mb-12">
        <p className="text-emerald-700 text-sm font-medium mb-3">Publicidade no diretório</p>
        <h1 className="font-display text-3xl md:text-4xl font-800 text-slate-900 mb-4">
          Alcança profissionais de Portugal e Brasil
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed">
          O FerramentasAI é o maior diretório de ferramentas de IA em português. Coloca a tua ferramenta à frente de quem decide.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-12">
        {[
          { valor: '12.000+', desc: 'Visitantes mensais' },
          { valor: '250M+', desc: 'Mercado lusófono' },
          { valor: '3 dias', desc: 'Tempo médio para 1.º cliente' },
        ].map(s => (
          <div key={s.desc} className="bg-white border border-slate-200 rounded-xl p-5 text-center">
            <p className="font-display text-2xl font-700 text-slate-900 mb-1">{s.valor}</p>
            <p className="text-xs text-slate-400">{s.desc}</p>
          </div>
        ))}
      </div>

      {/* Planos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
        {PLANOS.map(p => (
          <div
            key={p.id}
            className={`bg-white rounded-2xl p-6 ${
              p.destaque
                ? 'border-2 border-emerald-400 shadow-lg relative'
                : 'border border-slate-200'
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
              {p.features.map(f => (
                <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="text-emerald-500 mt-0.5 shrink-0">✓</span>
                  {f}
                </li>
              ))}
            </ul>

            <a
              href={`/api/checkout?plano=${p.id}`}
              className={`block text-center py-2.5 rounded-xl text-sm font-medium transition-colors ${
                p.destaque
                  ? 'bg-emerald-500 text-white hover:bg-emerald-400'
                  : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
              }`}
            >
              {p.cta} →
            </a>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="max-w-2xl mx-auto">
        <h2 className="font-display text-xl font-700 text-slate-900 mb-6 text-center">Perguntas frequentes</h2>
        <div className="space-y-4">
          {[
            { q: 'Quanto tempo demora a ativar?', r: 'A tua ferramenta aparece em destaque dentro de 24 horas após o pagamento.' },
            { q: 'Posso submeter a ferramenta gratuitamente?', r: 'Sim! A listagem básica é sempre gratuita. O destaque pago coloca-te no topo das categorias e na homepage.' },
            { q: 'Quem visita o FerramentasAI?', r: 'Profissionais de marketing, developers, empreendedores e PMEs de Portugal e Brasil que procuram ferramentas de IA para o trabalho.' },
            { q: 'Posso cancelar a qualquer momento?', r: 'Sim. O destaque é mensal sem contratos. Podes cancelar sem penalizações.' },
          ].map(f => (
            <div key={f.q} className="bg-white border border-slate-100 rounded-xl p-5">
              <p className="font-medium text-slate-900 text-sm mb-1.5">{f.q}</p>
              <p className="text-sm text-slate-500 leading-relaxed">{f.r}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-slate-400 mt-8">
          Tens dúvidas? Fala connosco em{' '}
          <a href="mailto:ola@ferramentasai.pt" className="text-emerald-700 hover:underline">ola@ferramentasai.pt</a>
        </p>
      </div>
    </div>
  )
}
