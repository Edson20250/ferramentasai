import type { Ferramenta, ListagemPaga, StripeProcessedSession } from '@prisma/client'
import { computeListingHealth, isTrulyActiveListing } from '@/lib/admin/listing-status'

export type InconsistencyFlag =
  | 'listing_active_but_end_past'
  | 'listing_active_but_tool_not_featured'
  | 'tool_featured_but_no_active_listing'
  | 'listing_marked_active_but_expired_window'
  | 'processed_session_no_listing_row'
  | 'listing_stripe_session_mismatch'

export function flagsForListagem(
  listing: ListagemPaga,
  ferramenta: Pick<Ferramenta, 'destaque' | 'id'>,
  now: Date = new Date(),
): InconsistencyFlag[] {
  const flags: InconsistencyFlag[] = []

  if (listing.ativa && listing.fimEm && listing.fimEm.getTime() < now.getTime()) {
    flags.push('listing_active_but_end_past')
    flags.push('listing_marked_active_but_expired_window')
  }

  const truly = isTrulyActiveListing(listing, now)
  if (truly && !ferramenta.destaque) {
    flags.push('listing_active_but_tool_not_featured')
  }

  if (!truly && ferramenta.destaque) {
    flags.push('tool_featured_but_no_active_listing')
  }

  return flags
}

export function flagsForProcessedSession(
  processed: StripeProcessedSession,
  listing: ListagemPaga | null,
  ferramenta: Pick<Ferramenta, 'destaque' | 'id'> | null,
  now: Date = new Date(),
): InconsistencyFlag[] {
  const flags: InconsistencyFlag[] = []

  if (!listing) {
    flags.push('processed_session_no_listing_row')
    return flags
  }

  if (listing.stripeSessionId && listing.stripeSessionId !== processed.stripeSessionId) {
    flags.push('listing_stripe_session_mismatch')
  }

  if (ferramenta) {
    flags.push(...flagsForListagem(listing, ferramenta, now))
  }

  return flags
}

export function countUniqueFlags(rows: { flags: InconsistencyFlag[] }[]): number {
  const set = new Set<InconsistencyFlag>()
  for (const r of rows) {
    for (const f of r.flags) set.add(f)
  }
  return set.size
}

const FLAG_LABELS: Record<InconsistencyFlag, string> = {
  listing_active_but_end_past: 'Listagem ativa com fim no passado',
  listing_active_but_tool_not_featured: 'Ativa mas ferramenta sem destaque',
  tool_featured_but_no_active_listing: 'Destaque sem listagem ativa',
  listing_marked_active_but_expired_window: 'Marcada ativa mas expirada',
  processed_session_no_listing_row: 'Stripe processado sem listagem',
  listing_stripe_session_mismatch: 'Session ID diferente do último pagamento',
}

export function flagLabel(f: InconsistencyFlag): string {
  return FLAG_LABELS[f] ?? f
}

export function healthLabel(health: ReturnType<typeof computeListingHealth>): string {
  switch (health) {
    case 'healthy':
      return 'Ativa'
    case 'expiring_soon':
      return 'A expirar (≤7d)'
    case 'expired':
      return 'Expirada'
    case 'inactive':
      return 'Inativa'
    case 'inconsistent':
      return 'Inconsistente'
    default:
      return health
  }
}
