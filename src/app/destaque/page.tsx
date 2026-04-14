import Link from 'next/link'
import { Metadata } from 'next'
import { DestaquePlanCards } from '@/components/DestaquePlanCards'
import { LUSO_AUDIENCE_COUNTRIES, LUSO_PROFESSIONALS } from '@/lib/site-copy'

export const metadata: Metadata = {
  title: 'Destaque a sua ferramenta de IA em portugues | FerramentasAI',
  description: `Alcanca profissionais em ${LUSO_AUDIENCE_COUNTRIES}. Destaca a tua ferramenta de IA no maior diretorio lusofono.`,
}

export const dynamic = 'force-dynamic'

type Props = { searchParams: Promise<{ ferramentaId?: string; erro?: string }> }

const ERROS: Record<string, string> = {
  missing_ferramenta: 'Falta o identificador da ferramenta. Usa o botao "Destacar" na pagina da ferramenta.',
  invalid_plano: 'Plano invalido.',
  ferramenta_not_found: 'Ferramenta nao encontrada.',
  ferramenta_not_approved: 'Esta ferramenta ainda nao esta aprovada no diretorio.',
  config: 'Configuracao do servidor incompleta. Contacta o suporte.',
  stripe: 'Erro ao iniciar o pagamento. Tenta de novo.',
}

export default async function DestacarPage({ searchParams }: Props) {
  const sp = await searchParams
  const ferramentaId = sp.ferramentaId?.trim() ?? ''
  const erroKey = sp.erro?.trim()
  const erroMsg = erroKey ? ERROS[erroKey] ?? 'Nao foi possivel concluir o pedido.' : null

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
      {/* Header */}
      <div className="text-center mb-14">
        <span className="section-label mx-auto">Publicidade no diretorio</span>
        <h1 className="font-display text-3xl md:text-4xl font-800 text-slate-900 mb-4">
          Alcanca profissionais em todo o mundo lusofono
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed">
          O FerramentasAI e o maior diretorio de ferramentas de IA em portugues para {LUSO_AUDIENCE_COUNTRIES}. Coloca a tua ferramenta a frente de quem decide.
        </p>
      </div>

      {/* Error */}
      {erroMsg && (
        <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 px-5 py-3.5 text-sm text-amber-900 text-center flex items-center justify-center gap-2">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
          {erroMsg}
        </div>
      )}

      {/* Context message */}
      {ferramentaId ? (
        <p className="text-center text-xs text-slate-500 mb-6">
          A pagar destaque para a ferramenta selecionada.{' '}
          <Link href="/categorias" className="text-emerald-700 hover:underline font-medium">
            Escolher outra
          </Link>
        </p>
      ) : (
        <p className="text-center text-sm text-slate-600 mb-8 max-w-lg mx-auto">
          Para comprar um plano, vai a{' '}
          <Link href="/categorias" className="text-emerald-700 font-medium hover:underline">
            pagina da tua ferramenta
          </Link>{' '}
          e clica em &laquo;Destacar no diretorio&raquo;, ou cola o ID da ferramenta no URL:{' '}
          <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded-md">?ferramentaId=...</code>
        </p>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-14">
        {[
          { valor: '12.000+', desc: 'Visitantes mensais' },
          { valor: '250M+', desc: 'Mercado lusofono' },
          { valor: '3 dias', desc: 'Tempo medio para 1.o cliente' },
        ].map((s) => (
          <div key={s.desc} className="bg-white border border-slate-200/80 rounded-2xl p-6 text-center hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300">
            <p className="font-display text-2xl md:text-3xl font-800 text-slate-900 mb-1">{s.valor}</p>
            <p className="text-xs text-slate-400">{s.desc}</p>
          </div>
        ))}
      </div>

      {/* Plans */}
      <DestaquePlanCards ferramentaId={ferramentaId} />

      {/* FAQ */}
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <span className="section-label mx-auto">FAQ</span>
          <h2 className="font-display text-xl font-700 text-slate-900">Perguntas frequentes</h2>
        </div>
        <div className="space-y-3">
          {[
            {
              q: 'Quando fica ativo o destaque?',
              r: 'Apos o pagamento confirmado (segundos). O webhook da Stripe ativa automaticamente o destaque na ferramenta.',
            },
            {
              q: 'Posso submeter a ferramenta gratuitamente?',
              r: 'Sim! A listagem basica e sempre gratuita. O destaque pago coloca-te no topo das categorias e na homepage.',
            },
            {
              q: 'Quem visita o FerramentasAI?',
              r: `${LUSO_PROFESSIONALS} — marketing, developers, empreendedores e PMEs que procuram ferramentas de IA.`,
            },
            {
              q: 'Posso cancelar a qualquer momento?',
              r: 'Sim. O destaque e por periodo pago; quando expira, o destaque e removido automaticamente salvo renovacao.',
            },
          ].map((f) => (
            <div key={f.q} className="bg-white border border-slate-200/80 rounded-2xl p-6 hover:border-emerald-200 transition-colors">
              <p className="font-display font-600 text-slate-900 text-sm mb-2">{f.q}</p>
              <p className="text-sm text-slate-500 leading-relaxed">{f.r}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-slate-400 mt-10">
          Tens duvidas? Fala connosco em{' '}
          <a href="mailto:ola@ferramentasai.pt" className="text-emerald-700 hover:underline font-medium">
            ola@ferramentasai.pt
          </a>
        </p>
      </div>
    </div>
  )
}
