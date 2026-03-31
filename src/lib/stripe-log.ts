type LogLevel = 'error' | 'warn' | 'info'

export function stripeLog(level: LogLevel, message: string, data?: Record<string, unknown>): void {
  const payload = {
    ts: new Date().toISOString(),
    scope: 'stripe',
    level,
    message,
    ...data,
  }
  const line = JSON.stringify(payload)
  if (level === 'error') console.error(line)
  else if (level === 'warn') console.warn(line)
  else console.info(line)
}
