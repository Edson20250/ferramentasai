'use client'

import { useState } from 'react'
import Link from 'next/link'

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
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="text-4xl mb-4">🎉</div>
        <h1 className="font-display text-2xl font-700 text-slate-900 mb-3">Submetido com sucesso!</h1>
        <p className="text-slate-500 mb-6">Vamos analisar a tua ferramenta e adicionar ao diretório em 24–48 horas. Obrigado!</p>
        <Link href="/" className="btn-primary">Voltar ao início →</Link>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-700 text-slate-900 mb-2">Submeter uma ferramenta</h1>
        <p className="text-slate-500 text-sm">
          Conheces uma boa ferramenta de IA? Submete gratuitamente e aparece no maior diretório de IA em português.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Nome da ferramenta *</label>
          <input name="nome" required placeholder="Ex: ChatGPT, Midjourney…" className="input-search" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Website *</label>
          <input name="url" type="url" required placeholder="https://…" className="input-search" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Descrição *</label>
          <textarea
            name="descricao"
            required
            rows={3}
            placeholder="O que faz esta ferramenta? Para quem é útil?"
            className="input-search resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Categoria</label>
          <select name="categoriaSlug" className="input-search">
            <option value="">Seleciona uma categoria</option>
            <option value="escrita">✍️ Escrita e Texto</option>
            <option value="imagem">🎨 Imagem e Design</option>
            <option value="video">🎬 Vídeo e Áudio</option>
            <option value="produtividade">⚡ Produtividade</option>
            <option value="codigo">💻 Código e Dev</option>
            <option value="negocios">📈 Negócios e Marketing</option>
            <option value="chatbots">🤖 Chatbots e Assistentes</option>
            <option value="educacao">📚 Educação</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">O teu email *</label>
          <input name="emailContato" type="email" required placeholder="para te avisarmos quando for publicada" className="input-search" />
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-sm">
          {loading ? 'A enviar…' : 'Submeter gratuitamente →'}
        </button>

        <p className="text-xs text-slate-400 text-center">
          Quer aparecer em destaque imediatamente?{' '}
          <Link href="/destaque" className="text-emerald-700 hover:underline">Ver planos de destaque →</Link>
        </p>
      </form>
    </div>
  )
}
