'use client'

import { useTransition } from 'react'
import { adminDeactivateListing, adminReactivateListing } from '@/lib/admin/actions'

export function ListingActions({
  listingId,
  canReactivate,
}: {
  listingId: string
  canReactivate: boolean
}) {
  const [pending, start] = useTransition()

  return (
    <div className="flex gap-1 flex-wrap">
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (!confirm('Desativar esta listagem e remover destaque da ferramenta?')) return
          start(async () => {
            await adminDeactivateListing(listingId)
            window.location.reload()
          })
        }}
        className="text-[10px] px-2 py-1 rounded bg-red-950/50 text-red-300 border border-red-900/50 hover:bg-red-900/30"
      >
        Desativar
      </button>
      {canReactivate ? (
        <button
          type="button"
          disabled={pending}
          onClick={() => {
            start(async () => {
              await adminReactivateListing(listingId)
              window.location.reload()
            })
          }}
          className="text-[10px] px-2 py-1 rounded bg-emerald-950/50 text-emerald-300 border border-emerald-900/50 hover:bg-emerald-900/30"
        >
          Reativar
        </button>
      ) : null}
    </div>
  )
}
