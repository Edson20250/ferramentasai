import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pagamento confirmado — FerramentasAI',
  description: 'Obrigado pela tua compra. Vamos ativar o teu destaque em breve.',
}

export const dynamic = 'force-dynamic'

const NEXT_STEPS = [
  { step: '1', title: 'Verificação', desc: 'O teu pagamento foi processado pela Stripe com segurança.' },
  { step: '2', title: 'Ativação',    desc: 'O destaque fica ativo em até 24 horas após confirmação.' },
  { step: '3', title: 'Exposição',   desc: 'A tua ferramenta aparece no topo da categoria e na homepage.' },
]

export default function DestaqueSucessoPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-16" style={{ background: 'var(--surface-subtle)' }}>

      {/* Success card */}
      <div
        className="w-full max-w-lg rounded-2xl p-8 sm:p-10 text-center mb-6"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}
      >
        {/* Icon */}
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6"
          style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}
        >
          ✅
        </div>

        <span className="section-eyebrow mb-2 block">Pagamento confirmado</span>
        <h1
          className="font-bold text-[var(--foreground)] mb-3 tracking-tight"
          style={{ fontSize: 'clamp(1.4rem, 3vw, 1.875rem)', letterSpacing: '-0.025em' }}
        >
          Obrigado pela tua confiança!
        </h1>
        <p className="text-[var(--muted)] leading-relaxed mb-8" style={{ fontSize: '15px' }}>
          A tua listagem em destaque será ativada em até 24 horas. Se precisares de algo
          urgente, escreve para{' '}
          <a
            href="mailto:ola@ferramentasai.pt"
            className="text-green-600 font-medium hover:text-green-700 transition-colors"
          >
            ola@ferramentasai.pt
          </a>
          .
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-primary">
            Voltar ao início
          </Link>
          <Link href="/destaque" className="btn-outline">
            Ver planos de destaque
          </Link>
        </div>
      </div>

      {/* Next steps */}
      <div className="w-full max-w-lg">
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)] text-center mb-4">
          O que acontece a seguir
        </p>
        <div className="grid grid-cols-3 gap-3">
          {NEXT_STEPS.map(s => (
            <div
              key={s.step}
              className="rounded-xl p-4 text-center"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white mx-auto mb-2.5"
                style={{ background: 'var(--accent)' }}
              >
                {s.step}
              </div>
              <p className="text-xs font-semibold text-[var(--foreground)] mb-1">{s.title}</p>
              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
