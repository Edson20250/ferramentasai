import Link from 'next/link'
import { Metadata } from 'next'
import { LUSO_AUDIENCE_SHORT } from '@/lib/site-copy'

export const metadata: Metadata = {
  title: 'Newsletter — Novidades de IA em português | FerramentasAI',
  description:
    'Subscreve a newsletter gratuita do FerramentasAI: ferramentas novas, tutoriais e dicas de IA em português.',
}

export const dynamic = 'force-dynamic'

const TOPICS = [
  { icon: '🛠️', label: 'Ferramentas novas',  desc: 'As melhores adições ao diretório todas as semanas'     },
  { icon: '📖', label: 'Tutoriais práticos', desc: 'Como usar IA para trabalho, conteúdo e negócios'        },
  { icon: '💡', label: 'Dicas e atalhos',    desc: 'Prompts e workflows que realmente poupam tempo'         },
  { icon: '🌍', label: 'Mercado lusófono',   desc: 'Novidades de IA relevantes para Portugal, Brasil e CPLP' },
]

function NewsletterForm({ id, dark }: { id: string; dark?: boolean }) {
  return (
    <form
      id={id}
      action="/api/newsletter"
      method="POST"
      className="flex flex-col sm:flex-row gap-2.5"
    >
      {dark ? (
        <input
          name="email"
          type="email"
          required
          placeholder="o.teu@email.com"
          className="flex-1 rounded-lg px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500"
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.14)',
          }}
        />
      ) : (
        <input
          name="email"
          type="email"
          required
          placeholder="o.teu@email.com"
          className="input-premium flex-1"
        />
      )}
      <button
        type="submit"
        className="btn-accent whitespace-nowrap"
        style={{ padding: '12px 22px', fontSize: '14px' }}
      >
        Subscrever grátis
      </button>
    </form>
  )
}

export default function NewsletterPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--surface-subtle)' }}>

      {/* ── Hero ────────────────────────────────────── */}
      <div style={{ background: 'var(--primary)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-2xl mx-auto px-5 sm:px-8 py-16 text-center">
          <span className="section-eyebrow" style={{ color: '#4ade80' }}>
            Grátis · Sem spam
          </span>
          <h1
            className="font-extrabold text-white mt-3 mb-4 tracking-tight"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', letterSpacing: '-0.03em', lineHeight: 1.1 }}
          >
            IA em português,<br />todas as semanas
          </h1>
          <p className="leading-relaxed mb-10" style={{ color: '#8898aa', fontSize: '1rem' }}>
            As melhores ferramentas novas, recursos úteis e dicas para profissionais
            em {LUSO_AUDIENCE_SHORT}.
          </p>

          <div className="max-w-md mx-auto">
            <NewsletterForm id="nl-hero" dark />
            <p className="text-xs mt-3" style={{ color: 'rgba(255,255,255,0.22)' }}>
              Cancelas quando quiseres. Sem spam, prometido.
            </p>
          </div>
        </div>
      </div>

      {/* ── Topics ────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-14">
        <h2
          className="font-bold text-[var(--foreground)] text-center mb-10 tracking-tight"
          style={{ fontSize: '1.375rem', letterSpacing: '-0.02em' }}
        >
          O que recebes todas as semanas
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          {TOPICS.map(t => (
            <div
              key={t.label}
              className="flex items-start gap-4 rounded-xl p-5"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                style={{ background: 'var(--surface-muted)' }}
              >
                {t.icon}
              </div>
              <div>
                <p className="font-semibold text-sm text-[var(--foreground)] mb-1">{t.label}</p>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>{t.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Social proof + second form */}
        <div
          className="rounded-2xl p-8"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <div className="text-center mb-6">
            <p
              className="font-bold text-[var(--foreground)] mb-1"
              style={{ fontSize: '2rem', letterSpacing: '-0.03em' }}
            >
              12.000+
            </p>
            <p className="text-sm text-[var(--muted)]">profissionais lusófonos já subscreveram</p>
          </div>
          <div className="max-w-sm mx-auto">
            <NewsletterForm id="nl-bottom" />
          </div>
        </div>

        <div className="text-center mt-8">
          <Link href="/" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
            ← Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  )
}
