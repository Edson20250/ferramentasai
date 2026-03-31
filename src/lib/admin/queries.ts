import { prisma } from '@/lib/prisma'
import type { ListagemPaga, PlanoListagem, Prisma } from '@prisma/client'
import { computeListingHealth, daysRemaining, isTrulyActiveListing } from '@/lib/admin/listing-status'
import { flagsForListagem, flagsForProcessedSession, type InconsistencyFlag } from '@/lib/admin/audit-consistency'

const listingInclude = {
  ferramenta: { select: { id: true, nome: true, slug: true, destaque: true, aprovado: true } },
} as const

export type DashboardSummary = {
  activePaidListings: number
  expiredListings: number
  expiringIn7Days: number
  stripeProcessedTotal: number
  featuredTools: number
  recentPayments30d: number
  inconsistentRecords: number
}

export async function getDashboardSummary(now: Date = new Date()): Promise<DashboardSummary> {
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const sevenDaysAhead = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

  const [
    allListings,
    stripeProcessedTotal,
    featuredTools,
    recentPayments30d,
    processedSessions,
  ] = await Promise.all([
    prisma.listagemPaga.findMany({
      include: { ferramenta: { select: { id: true, destaque: true } } },
    }),
    prisma.stripeProcessedSession.count(),
    prisma.ferramenta.count({ where: { destaque: true } }),
    prisma.listagemPaga.count({
      where: { criadoEm: { gte: thirtyDaysAgo } },
    }),
    prisma.stripeProcessedSession.findMany(),
  ])

  let activePaidListings = 0
  let expiredListings = 0
  let expiringIn7Days = 0
  let inconsistentRecords = 0

  for (const l of allListings) {
    const truly = isTrulyActiveListing(l, now)
    if (truly) activePaidListings++
    if (l.fimEm && l.fimEm < now) expiredListings++
    if (l.ativa && l.fimEm && l.fimEm >= now && l.fimEm <= sevenDaysAhead) {
      expiringIn7Days++
    }
    if (flagsForListagem(l, l.ferramenta, now).length > 0) {
      inconsistentRecords++
    }
  }

  const listingByFerramenta = new Map(allListings.map((l) => [l.ferramentaId, l]))
  for (const s of processedSessions) {
    if (!listingByFerramenta.has(s.ferramentaId)) {
      inconsistentRecords++
    }
  }

  return {
    activePaidListings,
    expiredListings,
    expiringIn7Days,
    stripeProcessedTotal,
    featuredTools,
    recentPayments30d,
    inconsistentRecords,
  }
}

export async function getRecentPayments(limit = 10) {
  return prisma.listagemPaga.findMany({
    orderBy: { criadoEm: 'desc' },
    take: limit,
    include: listingInclude,
  })
}

export async function getRecentExpiring(limit = 10, now: Date = new Date()) {
  const sevenDaysAhead = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
  return prisma.listagemPaga.findMany({
    where: {
      ativa: true,
      fimEm: { gte: now, lte: sevenDaysAhead },
    },
    orderBy: { fimEm: 'asc' },
    take: limit,
    include: listingInclude,
  })
}

export async function getRecentStripeAudit(limit = 15) {
  const rows = await prisma.stripeProcessedSession.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
  })
  const enriched = await Promise.all(
    rows.map(async (s) => {
      const listing = await prisma.listagemPaga.findUnique({
        where: { ferramentaId: s.ferramentaId },
        include: { ferramenta: { select: { id: true, nome: true, slug: true, destaque: true } } },
      })
      const ferramenta = listing?.ferramenta ?? null
      return {
        session: s,
        listing,
        ferramenta,
        flags: flagsForProcessedSession(s, listing, ferramenta, new Date()),
      }
    }),
  )
  return enriched
}

export type PaymentsQuery = {
  page?: number
  limit?: number
  /** Server-only: raises row cap (UI default 50) for CSV export etc. */
  maxLimit?: number
  plano?: PlanoListagem | ''
  ativa?: 'all' | 'true' | 'false'
  dateFrom?: string
  dateTo?: string
  q?: string
  sort?: 'criadoEm_desc' | 'fimEm_asc' | 'inicioEm_desc'
}

export async function queryPayments(input: PaymentsQuery) {
  const page = Math.max(1, input.page ?? 1)
  const cap = Math.min(10_000, Math.max(1, input.maxLimit ?? 50))
  const limit = Math.min(cap, Math.max(1, input.limit ?? 20))
  const skip = (page - 1) * limit

  const where: Prisma.ListagemPagaWhereInput = {}

  if (input.plano) {
    where.plano = input.plano
  }

  if (input.ativa === 'true') {
    where.ativa = true
  } else if (input.ativa === 'false') {
    where.ativa = false
  }

  if (input.dateFrom || input.dateTo) {
    const range: Prisma.DateTimeFilter = {}
    if (input.dateFrom) {
      const d = new Date(input.dateFrom)
      if (!Number.isNaN(d.getTime())) range.gte = d
    }
    if (input.dateTo) {
      const d = new Date(input.dateTo)
      if (!Number.isNaN(d.getTime())) {
        d.setHours(23, 59, 59, 999)
        range.lte = d
      }
    }
    if (Object.keys(range).length > 0) where.criadoEm = range
  }

  const q = input.q?.trim()
  if (q) {
    where.OR = [
      { stripeSessionId: { contains: q, mode: 'insensitive' } },
      { ferramenta: { nome: { contains: q, mode: 'insensitive' } } },
      { ferramenta: { slug: { contains: q, mode: 'insensitive' } } },
    ]
  }

  let orderBy: Prisma.ListagemPagaOrderByWithRelationInput[] = [{ criadoEm: 'desc' }]
  if (input.sort === 'fimEm_asc') {
    orderBy = [{ fimEm: 'asc' }]
  } else if (input.sort === 'inicioEm_desc') {
    orderBy = [{ inicioEm: 'desc' }]
  }

  const [items, total] = await Promise.all([
    prisma.listagemPaga.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: listingInclude,
    }),
    prisma.listagemPaga.count({ where }),
  ])

  return {
    items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  }
}

export type ListingsFilter = 'active' | 'all' | 'expired' | 'expiring'

export async function queryListings(
  filter: ListingsFilter,
  now: Date = new Date(),
) {
  const sevenDaysAhead = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

  const base: Prisma.ListagemPagaWhereInput = {}

  let where: Prisma.ListagemPagaWhereInput = base

  if (filter === 'active') {
    where = {
      ativa: true,
      fimEm: { gte: now },
    }
  } else if (filter === 'expired') {
    where = {
      OR: [{ fimEm: { lt: now } }, { ativa: false }],
    }
  } else if (filter === 'expiring') {
    where = {
      ativa: true,
      fimEm: { gte: now, lte: sevenDaysAhead },
    }
  }

  const items = await prisma.listagemPaga.findMany({
    where,
    orderBy: [{ fimEm: 'asc' }],
    include: listingInclude,
  })

  return items.map((row) => ({
    ...row,
    health: computeListingHealth(row, now),
    daysLeft: daysRemaining(row.fimEm, now),
    flags: flagsForListagem(row, row.ferramenta, now),
  }))
}

export type StripeAuditRow = {
  session: {
    stripeSessionId: string
    ferramentaId: string
    plano: PlanoListagem
    createdAt: Date
  }
  listing: (ListagemPaga & {
    ferramenta: { id: string; nome: string; slug: string; destaque: boolean }
  }) | null
  flags: InconsistencyFlag[]
}

export async function queryStripeAuditFull(): Promise<StripeAuditRow[]> {
  const sessions = await prisma.stripeProcessedSession.findMany({
    orderBy: { createdAt: 'desc' },
  })

  const rows: StripeAuditRow[] = []

  for (const s of sessions) {
    const listing = await prisma.listagemPaga.findUnique({
      where: { ferramentaId: s.ferramentaId },
      include: { ferramenta: { select: { id: true, nome: true, slug: true, destaque: true } } },
    })
    const ferramenta = listing?.ferramenta ?? null
    rows.push({
      session: {
        stripeSessionId: s.stripeSessionId,
        ferramentaId: s.ferramentaId,
        plano: s.plano,
        createdAt: s.createdAt,
      },
      listing,
      flags: flagsForProcessedSession(s, listing, ferramenta, new Date()),
    })
  }

  return rows
}
