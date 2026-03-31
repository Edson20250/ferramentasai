'use client'

import { useState, useTransition } from 'react'
import {
  adminRunExpirationCleanup,
  adminSyncFeaturedFlags,
} from '@/lib/admin/actions'

export function AdminToolbar() {
  const [pending, start] = useTransition()
  const [msg, setMsg] = useState('')

  return (
    <div className="flex flex-wrap gap-2 items-center mb-6">
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          start(async () => {
            const r = await adminRunExpirationCleanup()
            setMsg(r.ok ? `Limpeza: ${r.deactivated} listagens desativadas` : r.error)
          })
        }}
        className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700 disabled:opacity-50"
      >
        Correr limpeza de expirados
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          start(async () => {
            const r = await adminSyncFeaturedFlags()
            setMsg(r.ok ? `Sincronizado: ${r.updated} ferramentas atualizadas` : r.error)
          })
        }}
        className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700 disabled:opacity-50"
      >
        Sincronizar destaques
      </button>
      {msg ? <span className="text-xs text-slate-400">{msg}</span> : null}
    </div>
  )
}
