import type { ListagemPaga } from '@prisma/client'

export type ListingHealth = 'healthy' | 'expiring_soon' | 'expired' | 'inactive' | 'inconsistent'

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000

export function computeListingHealth(
  listing: Pick<ListagemPaga, 'ativa' | 'inicioEm' | 'fimEm'>,
  now: Date = new Date(),
): ListingHealth {
  const { ativa, fimEm } = listing

  if (!ativa) {
    return 'inactive'
  }

  if (!fimEm) {
    return 'inconsistent'
  }

  if (fimEm.getTime() < now.getTime()) {
    return 'expired'
  }

  if (fimEm.getTime() - now.getTime() <= SEVEN_DAYS_MS) {
    return 'expiring_soon'
  }

  return 'healthy'
}

export function daysRemaining(fimEm: Date | null, now: Date = new Date()): number | null {
  if (!fimEm) return null
  const diff = fimEm.getTime() - now.getTime()
  if (diff <= 0) return 0
  return Math.ceil(diff / (24 * 60 * 60 * 1000))
}

export function isTrulyActiveListing(
  listing: Pick<ListagemPaga, 'ativa' | 'fimEm'>,
  now: Date = new Date(),
): boolean {
  return Boolean(listing.ativa && listing.fimEm && listing.fimEm.getTime() >= now.getTime())
}
