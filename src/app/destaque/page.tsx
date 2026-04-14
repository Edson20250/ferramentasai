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
  missing_ferramenta:    'Falta o identificador da ferramenta. Usa o botão «Destacar» na página da ferramenta.',
  invalid_plano:         'Plano inválido.',
  ferramenta_not_found:  'Ferramenta não encontrada.',
  ferramenta_not_approved: 'Esta ferramenta ainda não está aprovada no diretório.',
  config:                'Configuração do servidor incompleta. Contacta o suporte.',
  stripe:                'Erro ao iniciar o pagamento. Tenta de novo.',
}

const STATS = [
  { value: '12.000+', label: 'Visitantes mensais' },
  { value: '250M+',   label: 'Mercado lusófono' },
  { value: '3 dias',  label: 'Tempo médio p/ 1.º cliente' },
]

const FAQ = [
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
]

export default async function DestacarPage({ searchParams }: Props) {
  const sp = await searchParams
  const ferramentaId = sp.ferramentaId?.trim() ?? ''
  const erroKey = sp.erro?.trim()
  const erroMsg = erroKey ? ERROS[erroKey] ?? 'Não foi possível concluir o pedido.' : null

  return (
    <div className="min-h-screen" style={{ background: 'var(--surface-subtle)' }}>

      {/* ── Hero header ──────────────────────────────── */}
      <div style={{ background: 'var(--primary)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-4xl mx-auto px-5 sm:px-8 py-16 text-center">
          <span className="section-eyebrow" style={{ color: '#4ade80' }}>
            Publicidade no diretório
          </span>
          <h1
            className="font-extrabold text-white mt-3 mb-4 tracking-tight"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', letterSpacing: '-0.03em', lineHeight: 1.1 }}
          >
            Alcança profissionais em todo<br className="hidden sm:block" /> o mundo lusófono
          </h1>
          <p className="max-w-xl mx-auto leading-relaxed" style={{ color: '#8898aa', fontSize: '1rem' }}>
            O FerramentasAI é o maior diretório de ferramentas de IA em português para{' '}
            {LUSO_AUDIENCE_COUNTRIES}.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-12">

        {/* Error banner */}
        {erroMsg && (
          <div
            className="mb-8 rounded-xl px-5 py-4 text-sm text-center font-medium"
            style={{ background: '#fffbeb', border: '1px solid #fde68a', color: '#92400e' }}
          >
            {erroMsg}
          </div>
        )}

        {/* Context copy */}
        {ferramentaId ? (
          <p className="text-center text-sm text-[var(--muted-foreground)] mb-8">
            A pagar destaque para a ferramenta selecionada.{' '}
            <Link href="/categorias" className="text-green-600 font-medium hover:text-green-700 transition-colors">
              Escolher outra ferramenta
            </Link>
          </p>
        ) : (
          <div
            className="rounded-xl px-5 py-4 text-sm text-center mb-8"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            Para comprar um plano, vai à{' '}
            <Link href="/categorias" className="text-green-600 font-medium hover:text-green-700">
              página da tua ferramenta
            </Link>{' '}
            e clica em «Destacar no diretório», ou adiciona{' '}
            <code
              className="text-xs px-1.5 py-0.5 rounded font-mono"
              style={{ background: 'var(--surface-muted)', color: 'var(--muted)' }}
            >
              ?ferramentaId=…
            </code>{' '}
            ao URL desta página.
          </div>
        )}

        {/* ── Stats ─────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-xl p-5 text-center"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <p
                className="font-extrabold mb-1 tracking-tight"
                style={{ fontSize: '1.625rem', color: 'var(--foreground)', letterSpacing: '-0.025em' }}
              >
                {s.value}
              </p>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Plan cards ────────────────────────────── */}
        <DestaquePlanCards ferramentaId={ferramentaId} />

        {/* ── FAQ ───────────────────────────────────── */}
        <div className="max-w-2xl mx-auto">
          <h2
            className="font-bold text-[var(--foreground)] text-xl text-center mb-6 tracking-tight"
            style={{ letterSpacing: '-0.02em' }}
          >
            Perguntas frequentes
          </h2>
          <div className="space-y-3">
            {FAQ.map((item) => (
              <div
                key={item.q}
                className="rounded-xl p-5"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
              >
                <p className="font-semibold text-sm text-[var(--foreground)] mb-1.5">{item.q}</p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>{item.r}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-sm mt-8" style={{ color: 'var(--muted-foreground)' }}>
            Tens dúvidas? Fala connosco em{' '}
            <a
              href="mailto:ola@ferramentasai.pt"
              className="text-green-600 font-medium hover:text-green-700 transition-colors"
            >
              ola@ferramentasai.pt
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
