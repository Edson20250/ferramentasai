import type { PlanoListagem } from '@prisma/client'

export const PLAN_DURATION_DAYS: Record<PlanoListagem, number> = {
  BASICO: 30,
  PRO: 60,
  DESTAQUE: 90,
}

const QUERY_TO_PLANO: Record<string, PlanoListagem> = {
  basico: 'BASICO',
  pro: 'PRO',
  destaque: 'DESTAQUE',
  BASICO: 'BASICO',
  PRO: 'PRO',
  DESTAQUE: 'DESTAQUE',
}

export function parsePlanoQueryParam(raw: string | null): PlanoListagem | null {
  if (!raw) return null
  return QUERY_TO_PLANO[raw] ?? null
}

export function getStripePriceId(plano: PlanoListagem): string | undefined {
  const map: Record<PlanoListagem, string | undefined> = {
    BASICO: process.env.STRIPE_PRICE_ID_BASICO,
    PRO: process.env.STRIPE_PRICE_ID_PRO,
    DESTAQUE: process.env.STRIPE_PRICE_ID_DESTAQUE,
  }
  const id = map[plano]?.trim()
  return id && id.length > 0 ? id : undefined
}

export const CHECKOUT_PRICE_DATA: Record<
  PlanoListagem,
  { nome: string; unitAmount: number; descricao: string }
> = {
  BASICO: {
    nome: 'Destaque Básico — FerramentasAI',
    unitAmount: 4900,
    descricao: 'Listagem verificada com badge — 30 dias',
  },
  PRO: {
    nome: 'Destaque Pro — FerramentasAI',
    unitAmount: 9900,
    descricao: 'Topo de categoria + homepage — 60 dias',
  },
  DESTAQUE: {
    nome: 'Destaque Premium — FerramentasAI',
    unitAmount: 19900,
    descricao: 'Máxima exposição — 90 dias',
  },
}

export function addDaysUtc(date: Date, days: number): Date {
  const d = new Date(date.getTime())
  d.setUTCDate(d.getUTCDate() + days)
  return d
}
