'use client'

import { useState } from 'react'

export default function AdminLoginPage() {
  const [secret, setSecret] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret }),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        setError(j.error === 'invalid_credentials' ? 'Segredo inválido' : 'Erro ao entrar')
        setLoading(false)
        return
      }
      window.location.href = '/admin'
    } catch {
      setError('Erro de rede')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-sm border border-slate-800 rounded-2xl bg-slate-900/60 p-8">
        <h1 className="font-display text-xl font-700 text-white text-center mb-1">Admin</h1>
        <p className="text-xs text-slate-500 text-center mb-6">FerramentasAI — acesso interno</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="secret" className="block text-xs text-slate-400 mb-1.5">
              ADMIN_SECRET
            </label>
            <input
              id="secret"
              type="password"
              autoComplete="off"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              placeholder="••••••••"
            />
          </div>
          {error ? <p className="text-xs text-red-400">{error}</p> : null}
          <button
            type="submit"
            disabled={loading || !secret.trim()}
            className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-medium"
          >
            {loading ? 'A entrar…' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
