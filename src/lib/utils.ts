import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPreco(precificacao: string, precoMensal?: number | null): string {
  switch (precificacao) {
    case 'GRATUITO': return 'Gratuito'
    case 'FREEMIUM': return precoMensal ? `Grátis + a partir de $${precoMensal}/mês` : 'Freemium'
    case 'PAGO': return precoMensal ? `A partir de $${precoMensal}/mês` : 'Pago'
    case 'CONTACTO': return 'Contactar para preço'
    default: return 'Ver preço'
  }
}

export function badgePreco(precificacao: string): string {
  switch (precificacao) {
    case 'GRATUITO': return 'badge-preco badge-gratuito'
    case 'FREEMIUM': return 'badge-preco badge-freemium'
    case 'PAGO': return 'badge-preco badge-pago'
    default: return 'badge-preco badge-contacto'
  }
}

export function labelPreco(precificacao: string): string {
  switch (precificacao) {
    case 'GRATUITO': return 'Gratuito'
    case 'FREEMIUM': return 'Freemium'
    case 'PAGO': return 'Pago'
    case 'CONTACTO': return 'Contacto'
    default: return precificacao
  }
}

export function safeUrlHostname(href: string): string {
  try {
    return new URL(href).hostname
  } catch {
    try {
      return new URL(href.startsWith('http') ? href : `https://${href}`).hostname
    } catch {
      return href.replace(/^https?:\/\//i, '').split('/')[0] || href
    }
  }
}
