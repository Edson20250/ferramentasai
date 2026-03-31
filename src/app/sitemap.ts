import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'
import { isDatabaseConfigured } from '@/lib/db-config'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://ferramentasai.pt'

  const rotasEstaticas: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${base}/categorias`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/novidades`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${base}/submeter`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/destaque`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/newsletter`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ]

  if (!isDatabaseConfigured()) {
    return rotasEstaticas
  }

  try {
    const [ferramentas, categorias] = await Promise.all([
      prisma.ferramenta.findMany({
        where: { aprovado: true },
        select: { slug: true, atualizadoEm: true },
      }),
      prisma.categoria.findMany({
        select: { slug: true },
      }),
    ])

    const rotasCategorias: MetadataRoute.Sitemap = categorias.map(c => ({
      url: `${base}/categoria/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }))

    const rotasFerramentas: MetadataRoute.Sitemap = ferramentas.map(f => ({
      url: `${base}/ferramenta/${f.slug}`,
      lastModified: f.atualizadoEm,
      changeFrequency: 'monthly',
      priority: 0.7,
    }))

    return [...rotasEstaticas, ...rotasCategorias, ...rotasFerramentas]
  } catch {
    return rotasEstaticas
  }
}
