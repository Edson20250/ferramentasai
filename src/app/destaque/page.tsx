import Link from 'next/link'
import { Metadata } from 'next'
import { DestaquePlanCards } from '@/components/DestaquePlanCards'
import { LUSO_AUDIENCE_COUNTRIES, LUSO_PROFESSIONALS } from '@/lib/site-copy'

export const metadata: Metadata = {
  title: 'Destaque a sua ferramenta de IA em português | FerramentasAI',
  description: `Alcança profissionais em ${LUSO_AUDIENCE_COUNTRIES}. Destaca a tua ferramenta de IA no maior diretório lusófono.`,
}

export const dynamic = 'force-dynamic'

type Props = { searchParams: Promise<{ ferramentaId?: string; erro?: string }> }

const ERROS: Record<string, string> = {
  missing_ferramenta: 'Falta o identificador da ferramenta. Usa o botão «Destacar» na página da ferramenta.',
  invalid_plano: 'Plano inválido.',
  ferramenta_not_found: 'Ferramenta não encontrada.',
  ferramenta_not_approved: 'Esta ferramenta ainda não está aprovada no diretório.',
  config: 'Configuração do servidor incompleta. Contacta o suporte.',
  stripe: 'Erro ao iniciar o pagamento. Tenta de novo.',
}

export default async function DestacarPage({ searchParams }: Props) {
  const sp = await searchParams
  const ferramentaId = sp.ferramentaId?.trim() ?? ''
  const erroKey = sp.erro?.trim()
  const erroMsg = erroKey ? ERROS[erroKey] ?? 'Não foi possível concluir o pedido.' : null

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-12">
        <p className="text-emerald-700 text-sm font-medium mb-3">Publicidade no diretório</p>
        <h1 className="font-display text-3xl md:text-4xl font-800 text-slate-900 mb-4">
          Alcança profissionais em todo o mundo lusófono
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed">
          O FerramentasAI é o maior diretório de ferramentas de IA em português para {LUSO_AUDIENCE_COUNTRIES}. Coloca a tua ferramenta à frente de quem decide.
        </p>
      </div>

      {erroMsg && (
        <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 text-center">
          {erroMsg}
        </div>
      )}

      {ferramentaId ? (
        <p className="text-center text-xs text-slate-500 mb-6">
          A pagar destaque para a ferramenta selecionada.{' '}
          <Link href="/categorias" className="text-emerald-700 hover:underline">
            Escolher outra
          </Link>
        </p>
      ) : (
        <p className="text-center text-sm text-slate-600 mb-8 max-w-lg mx-auto">
          Para comprar um plano, vai à{' '}
          <Link href="/categorias" className="text-emerald-700 font-medium hover:underline">
            página da tua ferramenta
          </Link>{' '}
          e clica em «Destacar no diretório», ou cola o ID da ferramenta no URL:{' '}
          <code className="text-xs bg-slate-100 px-1 rounded">?ferramentaId=…</code>
        </p>
      )}

      <div className="grid grid-cols-3 gap-4 mb-12">
        {[
          { valor: '12.000+', desc: 'Visitantes mensais' },
          { valor: '250M+', desc: 'Mercado lusófono' },
          { valor: '3 dias', desc: 'Tempo médio para 1.º cliente' },
        ].map((s) => (
          <div key={s.desc} className="bg-white border border-slate-200 rounded-xl p-5 text-center">
            <p className="font-display text-2xl font-700 text-slate-900 mb-1">{s.valor}</p>
            <p className="text-xs text-slate-400">{s.desc}</p>
          </div>
        ))}
      </div>

      <DestaquePlanCards ferramentaId={ferramentaId} />

      <div className="max-w-2xl mx-auto">
        <h2 className="font-display text-xl font-700 text-slate-900 mb-6 text-center">Perguntas frequentes</h2>
        <div className="space-y-4">
          {[
            {
              q: 'Quando fica ativo o destaque?',
              r: 'Após o pagamento confirmado (segundos). O webhook da Stripe ativa automaticamente o destaque na ferramenta.',
            },
            {
              q: 'Posso submeter a ferramenta gratuitamente?',
              r: 'Sim! A listagem básica é sempre gratuita. O destaque pago coloca-te no topo das categorias e na homepage.',
            },
            {
              q: 'Quem visita o FerramentasAI?',
              r: `${LUSO_PROFESSIONALS} — marketing, developers, empreendedores e PMEs que procuram ferramentas de IA.`,
            },
            {
              q: 'Posso cancelar a qualquer momento?',
              r: 'Sim. O destaque é por período pago; quando expira, o destaque é removido automaticamente salvo renovação.',
            },
          ].map((f) => (
            <div key={f.q} className="bg-white border border-slate-100 rounded-xl p-5">
              <p className="font-medium text-slate-900 text-sm mb-1.5">{f.q}</p>
              <p className="text-sm text-slate-500 leading-relaxed">{f.r}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-slate-400 mt-8">
          Tens dúvidas? Fala connosco em{' '}
          <a href="mailto:ola@ferramentasai.pt" className="text-emerald-700 hover:underline">
            ola@ferramentasai.pt
          </a>
        </p>
      </div>
    </div>
  )
}
