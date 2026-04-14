'use client'

import { useState } from 'react'
import Link from 'next/link'

const CATEGORIAS = [
  { value: 'escrita', label: 'Escrita e Texto', icon: '✍️' },
  { value: 'imagem', label: 'Imagem e Design', icon: '🎨' },
  { value: 'video', label: 'Video e Audio', icon: '🎬' },
  { value: 'produtividade', label: 'Produtividade', icon: '⚡' },
  { value: 'codigo', label: 'Codigo e Dev', icon: '💻' },
  { value: 'negocios', label: 'Negocios e Marketing', icon: '📈' },
  { value: 'chatbots', label: 'Chatbots e Assistentes', icon: '🤖' },
  { value: 'educacao', label: 'Educacao', icon: '📚' },
]

export default function SubmeterPage() {
  const [enviado, setEnviado] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))
    try {
      await fetch('/api/submissoes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      setEnviado(true)
    } catch {
      alert('Erro ao enviar. Tenta novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (enviado) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-3xl mx-auto mb-5">
          🎉
        </div>
        <h1 className="font-display text-2xl font-700 text-slate-900 mb-3">Submetido com sucesso!</h1>
        <p className="text-slate-500 mb-7">Vamos analisar a tua ferramenta e adicionar ao diretorio em 24-48 horas. Obrigado!</p>
        <Link href="/" className="btn-primary">Voltar ao inicio &rarr;</Link>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-9">
        <span className="section-label">Submeter</span>
        <h1 className="font-display text-2xl font-700 text-slate-900 mb-2">Submeter uma ferramenta</h1>
        <p className="text-slate-500 text-sm">
          Conheces uma boa ferramenta de IA? Submete gratuitamente e aparece no maior diretorio de IA em portugues.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Nome da ferramenta *</label>
          <input name="nome" required placeholder="Ex: ChatGPT, Midjourney..." className="input-search" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Website *</label>
          <input name="url" type="url" required placeholder="https://..." className="input-search" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Descricao *</label>
          <textarea
            name="descricao"
            required
            rows={3}
            placeholder="O que faz esta ferramenta? Para quem e util?"
            className="input-search resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Categoria</label>
          <select name="categoriaSlug" className="input-search">
            <option value="">Seleciona uma categoria</option>
            {CATEGORIAS.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.icon} {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">O teu email *</label>
          <input name="emailContato" type="email" required placeholder="para te avisarmos quando for publicada" className="input-search" />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full !py-3.5 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
              A enviar...
            </span>
          ) : (
            'Submeter gratuitamente →'
          )}
        </button>

        <p className="text-xs text-slate-400 text-center">
          Quer aparecer em destaque imediatamente?{' '}
          <Link href="/destaque" className="text-emerald-700 hover:underline font-medium">Ver planos de destaque &rarr;</Link>
        </p>
      </form>
    </div>
  )
}
