'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { verifyAdminCookie, ADMIN_COOKIE_NAME } from '@/lib/admin/auth'
import { deactivateExpiredListings } from '@/lib/listings-expiration'
import { isTrulyActiveListing } from '@/lib/admin/listing-status'
import { stripeLog } from '@/lib/stripe-log'

async function assertAdmin(): Promise<void> {
  const secret = process.env.ADMIN_SECRET?.trim()
  if (!secret) throw new Error('Admin não configurado')
  const token = (await cookies()).get(ADMIN_COOKIE_NAME)?.value
  if (!verifyAdminCookie(token, secret)) throw new Error('Não autorizado')
}

function revalidateAdmin() {
  revalidatePath('/admin')
  revalidatePath('/admin/payments')
  revalidatePath('/admin/listings')
  revalidatePath('/admin/stripe-audit')
}

export async function adminDeactivateListing(listingId: string): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await assertAdmin()
    const listing = await prisma.listagemPaga.findUnique({
      where: { id: listingId },
      select: { id: true, ferramentaId: true },
    })
    if (!listing) return { ok: false, error: 'Listagem não encontrada' }

    await prisma.$transaction([
      prisma.listagemPaga.update({
        where: { id: listingId },
        data: { ativa: false },
      }),
      prisma.ferramenta.update({
        where: { id: listing.ferramentaId },
        data: { destaque: false },
      }),
    ])

    stripeLog('info', 'admin_listing_deactivated', { listingId, ferramentaId: listing.ferramentaId })
    revalidateAdmin()
    return { ok: true }
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Erro'
    return { ok: false, error: msg }
  }
}

export async function adminReactivateListing(listingId: string): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await assertAdmin()
    const now = new Date()
    const listing = await prisma.listagemPaga.findUnique({
      where: { id: listingId },
      select: { id: true, ferramentaId: true, fimEm: true },
    })
    if (!listing) return { ok: false, error: 'Listagem não encontrada' }
    if (!listing.fimEm || listing.fimEm.getTime() < now.getTime()) {
      return { ok: false, error: 'Data de fim já passou — renova com novo pagamento' }
    }

    await prisma.$transaction([
      prisma.listagemPaga.update({
        where: { id: listingId },
        data: { ativa: true },
      }),
      prisma.ferramenta.update({
        where: { id: listing.ferramentaId },
        data: { destaque: true },
      }),
    ])

    stripeLog('info', 'admin_listing_reactivated', { listingId })
    revalidateAdmin()
    return { ok: true }
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Erro'
    return { ok: false, error: msg }
  }
}

export async function adminSyncFeaturedFlags(): Promise<{ ok: true; updated: number } | { ok: false; error: string }> {
  try {
    await assertAdmin()
    const now = new Date()
    const listings = await prisma.listagemPaga.findMany({
      include: { ferramenta: { select: { id: true, destaque: true } } },
    })

    let updated = 0
    for (const l of listings) {
      const should = isTrulyActiveListing(l, now)
      if (l.ferramenta.destaque !== should) {
        await prisma.ferramenta.update({
          where: { id: l.ferramentaId },
          data: { destaque: should },
        })
        updated++
      }
    }

    stripeLog('info', 'admin_sync_featured', { updated })
    revalidateAdmin()
    return { ok: true, updated }
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Erro'
    return { ok: false, error: msg }
  }
}

export async function adminRunExpirationCleanup(): Promise<
  { ok: true; deactivated: number } | { ok: false; error: string }
> {
  try {
    await assertAdmin()
    const result = await deactivateExpiredListings(prisma)
    stripeLog('info', 'admin_manual_expiration_cleanup', result)
    revalidateAdmin()
    return { ok: true, deactivated: result.deactivated }
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Erro'
    return { ok: false, error: msg }
  }
}
