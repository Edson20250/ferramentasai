import type { PrismaClient } from '@prisma/client'
import { stripeLog } from '@/lib/stripe-log'

export async function deactivateExpiredListings(db: PrismaClient): Promise<{ deactivated: number }> {
  const now = new Date()

  const expired = await db.listagemPaga.findMany({
    where: {
      ativa: true,
      fimEm: { lt: now },
    },
    select: { id: true, ferramentaId: true },
  })

  if (expired.length === 0) {
    return { deactivated: 0 }
  }

  const ferramentaIds = expired.map((e) => e.ferramentaId)

  await db.$transaction([
    db.listagemPaga.updateMany({
      where: { id: { in: expired.map((e) => e.id) } },
      data: { ativa: false },
    }),
    db.ferramenta.updateMany({
      where: { id: { in: ferramentaIds } },
      data: { destaque: false },
    }),
  ])

  stripeLog('info', 'listings_expired_deactivated', {
    count: expired.length,
    ferramentaIds,
  })

  return { deactivated: expired.length }
}
