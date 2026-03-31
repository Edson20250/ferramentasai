import { isDatabaseConfigured } from '@/lib/db-config'

export async function withDatabase<T>(fallback: T, query: () => Promise<T>): Promise<T> {
  if (!isDatabaseConfigured()) return fallback
  try {
    return await query()
  } catch (err) {
    console.error('[database]', err)
    return fallback
  }
}
