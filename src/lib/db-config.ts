export function isDatabaseConfigured(): boolean {
  const raw = process.env.DATABASE_URL?.trim()
  if (!raw) return false
  // postgresql / postgres / prisma+postgres (Accelerate)
  return /^(postgresql|postgres|prisma\+postgres):\/\//i.test(raw)
}
