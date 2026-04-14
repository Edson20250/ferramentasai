'use client'

import { useState } from 'react'
import Link from 'next/link'

const CATEGORIAS = [
  { value: 'escrita',       label: '✍️ Escrita e Texto'       },
  { value: 'imagem',        label: '🎨 Imagem e Design'        },
  { value: 'video',         label: '🎬 Vídeo e Áudio'          },
  { value: 'produtividade', label: '⚡ Produtividade'          },
  { value: 'codigo',        label: '💻 Código e Dev'           },
  { value: 'negocios',      label: '📈 Negócios e Marketing'   },
  { value: 'chatbots',      label: '🤖 Chatbots e Assistentes' },
  { value: 'educacao',      label: '📚 Educação'               },
]

const BENEFITS = [
  { icon: '🌍', text: 'Visibilidade em todo o espaço lusófono — CPLP e diáspora' },
  { icon: '⚡', text: 'Revisão e publicação em 24–48 horas' },
  { icon: '🔍', text: 'Aparecer nas pesquisas de milhares de profissionais' },
  { icon: '🆓', text: 'Listagem básica sempre gratuita' },
]

export default function SubmeterPage() {
  const [enviado, setEnviado] = useState(false)
  const [loading, setLoading]  = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))
    try {
      await fetch('/api/submissoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      setEnviado(true)
    } catch {
      alert('Erro ao enviar. Tenta novamente.')
    } finally {
      setLoading(false)
    }
  }

  /* ── Success state ─────────────────────────────────────── */
  if (enviado) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5" style={{ background: 'var(--surface-subtle)' }}>
        <div className="max-w-md w-full text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6"
            style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}
          >
            🎉
          </div>
          <h1
            className="font-bold text-[var(--foreground)] mb-3 tracking-tight"
            style={{ fontSize: '1.625rem', letterSpacing: '-0.025em' }}
          >
            Submetido com sucesso!
          </h1>
          <p className="text-[var(--muted)] leading-relaxed mb-8" style={{ fontSize: '15px' }}>
            Vamos analisar a tua ferramenta e adicioná-la ao diretório em 24–48 horas.
            Avisamos-te por email quando estiver publicada.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/" className="btn-primary">
              Voltar ao início
            </Link>
            <Link href="/destaque" className="btn-outline">
              Ver planos de destaque →
            </Link>
          </div>
        </div>
      </div>
    )
  }

  /* ── Form ───────────────────────────────────────────────── */
  return (
    <div className="min-h-screen" style={{ background: 'var(--surface-subtle)' }}>

      {/* ── Header ─────────────────────────────────────── */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-4xl mx-auto px-5 sm:px-8 py-10">
          <nav className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)] mb-5">
            <Link href="/" className="hover:text-[var(--foreground)] transition-colors">Início</Link>
            <span>/</span>
            <span className="text-[var(--foreground)]">Submeter ferramenta</span>
          </nav>
          <span className="section-eyebrow">Para criadores e empresas</span>
          <h1
            className="font-bold text-[var(--foreground)] mt-1 mb-2 tracking-tight"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', letterSpacing: '-0.025em' }}
          >
            Submete a tua ferramenta de IA
          </h1>
          <p className="text-[var(--muted)] text-sm max-w-xl">
            Aparece no maior diretório de IA em português, gratuitamente. Cada ferramenta aprovada
            alcança milhares de profissionais lusófonos.
          </p>
        </div>
      </div>

      {/* ── Two-column layout ─────────────────────────── */}
      <div className="max-w-4xl mx-auto px-5 sm:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Form ───────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl p-6 sm:p-8 space-y-5"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              {/* Nome */}
              <div>
                <label className="label-premium">
                  Nome da ferramenta
                  <span className="label-hint">*</span>
                </label>
                <input
                  name="nome"
                  required
                  placeholder="Ex: ChatGPT, Midjourney, Notion AI…"
                  className="input-premium"
                />
              </div>

              {/* Website */}
              <div>
                <label className="label-premium">
                  Website
                  <span className="label-hint">*</span>
                </label>
                <input
                  name="url"
                  type="url"
                  required
                  placeholder="https://…"
                  className="input-premium"
                />
              </div>

              {/* Descrição */}
              <div>
                <label className="label-premium">
                  Descrição
                  <span className="label-hint">* até 200 caracteres</span>
                </label>
                <textarea
                  name="descricao"
                  required
                  rows={3}
                  maxLength={200}
                  placeholder="O que faz esta ferramenta? Para quem é útil?"
                  className="input-premium resize-none"
                  style={{ lineHeight: 1.6 }}
                />
              </div>

              {/* Categoria */}
              <div>
                <label className="label-premium">Categoria</label>
                <select name="categoriaSlug" className="input-premium" style={{ cursor: 'pointer' }}>
                  <option value="">Seleciona uma categoria…</option>
                  {CATEGORIAS.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              {/* Email */}
              <div>
                <label className="label-premium">
                  O teu email
                  <span className="label-hint">* para te avisarmos quando for publicada</span>
                </label>
                <input
                  name="emailContato"
                  type="email"
                  required
                  placeholder="tu@empresa.com"
                  className="input-premium"
                />
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-accent w-full"
                  style={{ padding: '13px 0', fontSize: '14px', opacity: loading ? 0.7 : 1 }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin" width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3" />
                        <path d="M7 1.5A5.5 5.5 0 0 1 12.5 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                      A enviar…
                    </span>
                  ) : (
                    'Submeter gratuitamente →'
                  )}
                </button>

                <p className="text-xs text-center mt-3" style={{ color: 'var(--muted-foreground)' }}>
                  Quer aparecer em destaque imediatamente?{' '}
                  <Link href="/destaque" className="text-green-600 font-medium hover:text-green-700 transition-colors">
                    Ver planos de destaque →
                  </Link>
                </p>
              </div>
            </form>
          </div>

          {/* ── Value proposition sidebar ───────────────── */}
          <aside className="lg:w-72 shrink-0 space-y-5">

            {/* Benefits */}
            <div
              className="rounded-2xl p-6"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <p className="font-semibold text-[var(--foreground)] text-sm mb-4">
                Porquê submeter?
              </p>
              <ul className="space-y-3.5">
                {BENEFITS.map(b => (
                  <li key={b.text} className="flex items-start gap-3">
                    <span className="text-lg shrink-0 leading-none mt-0.5">{b.icon}</span>
                    <span className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                      {b.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Upgrade nudge */}
            <div
              className="rounded-2xl p-6"
              style={{ background: 'var(--primary)' }}
            >
              <p className="font-semibold text-white text-sm mb-1.5">
                Quer mais exposição?
              </p>
              <p className="text-xs leading-relaxed mb-4" style={{ color: '#8898aa' }}>
                Com um plano de destaque apareces no topo da categoria e na homepage, à frente de milhares de profissionais.
              </p>
              <Link
                href="/destaque"
                className="btn-accent w-full text-center"
                style={{ fontSize: '13px', padding: '9px 0' }}
              >
                Ver planos de destaque →
              </Link>
            </div>

          </aside>
        </div>
      </div>
    </div>
  )
}
