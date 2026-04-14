import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { withDatabase } from '@/lib/with-database'
import { ToolCard } from '@/components/ToolCard'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

type Props = { searchParams: Promise<{ q?: string }> }

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams
  return {
    title: q
      ? `"${q}" — Pesquisa de Ferramentas de IA | FerramentasAI`
      : 'Pesquisa — FerramentasAI',
  }
}

async function pesquisar(q: string) {
  if (!q || q.length < 2) return []
  return withDatabase([], () =>
    prisma.ferramenta.findMany({
      where: {
        aprovado: true,
        OR: [
          { nome: { contains: q, mode: 'insensitive' } },
          { descricao: { contains: q, mode: 'insensitive' } },
          { tags: { has: q.toLowerCase() } },
        ],
      },
      include: { categoria: true },
      orderBy: [{ destaque: 'desc' }, { visualizacoes: 'desc' }],
      take: 30,
    }),
  )
}

const SUGESTOES = ['ChatGPT', 'Midjourney', 'Copilot', 'Perplexity', 'Gamma', 'Notion AI']

export default async function PesquisaPage({ searchParams }: Props) {
  const { q = '' } = await searchParams
  const resultados = await pesquisar(q)

  return (
    <div className="min-h-screen" style={{ background: 'var(--surface-subtle)' }}>

      {/* ── Search header ──────────────────────────── */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-10">
          {q ? (
            <>
              <nav className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)] mb-5">
                <Link href="/" className="hover:text-[var(--foreground)] transition-colors">Início</Link>
                <span>/</span>
                <Link href="/pesquisa" className="hover:text-[var(--foreground)] transition-colors">Pesquisa</Link>
                <span>/</span>
                <span className="text-[var(--foreground)] truncate max-w-[200px]">{q}</span>
              </nav>
              <h1
                className="font-bold text-[var(--foreground)] mb-5 tracking-tight"
                style={{ fontSize: 'clamp(1.375rem, 3vw, 1.875rem)', letterSpacing: '-0.025em' }}
              >
                Resultados para{' '}
                <span className="text-green-600">&ldquo;{q}&rdquo;</span>
              </h1>
            </>
          ) : (
            <>
              <span className="section-eyebrow">Descoberta</span>
              <h1
                className="font-bold text-[var(--foreground)] mt-1 mb-5 tracking-tight"
                style={{ fontSize: 'clamp(1.375rem, 3vw, 1.875rem)', letterSpacing: '-0.025em' }}
              >
                Pesquisar ferramentas de IA
              </h1>
            </>
          )}

          <form method="GET" className="search-premium">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-[var(--muted-foreground)] shrink-0">
              <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M10.5 10.5L13.5 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              name="q"
              type="text"
              defaultValue={q}
              placeholder="Pesquisa ferramentas de IA…"
              autoFocus={!q}
              autoComplete="off"
            />
            <button type="submit" className="btn-accent" style={{ padding: '9px 18px', fontSize: '13px', borderRadius: '8px' }}>
              Pesquisar
            </button>
          </form>
        </div>
      </div>

      {/* ── Results ──────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-8">
        {resultados.length > 0 ? (
          <>
            <p className="text-xs text-[var(--muted-foreground)] mb-5">
              {resultados.length} resultado{resultados.length !== 1 ? 's' : ''} para{' '}
              <strong className="text-[var(--foreground)]">&ldquo;{q}&rdquo;</strong>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resultados.map(f => <ToolCard key={f.id} ferramenta={f as any} />)}
            </div>
          </>
        ) : q ? (
          /* No results */
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🔍</p>
            <p className="font-semibold text-[var(--foreground)] text-lg mb-2">
              Nenhum resultado para &ldquo;{q}&rdquo;
            </p>
            <p className="text-sm text-[var(--muted-foreground)] mb-8 max-w-sm mx-auto">
              Tenta uma pesquisa diferente ou explora por categoria.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/categorias" className="btn-primary" style={{ fontSize: '13.5px' }}>
                Explorar categorias →
              </Link>
              <Link href="/pesquisa" className="btn-outline" style={{ fontSize: '13.5px' }}>
                Limpar pesquisa
              </Link>
            </div>
          </div>
        ) : (
          /* Empty — show suggestions */
          <div className="text-center py-20">
            <p className="text-4xl mb-4">✨</p>
            <p className="font-semibold text-[var(--foreground)] mb-2">O que procuras?</p>
            <p className="text-sm text-[var(--muted-foreground)] mb-8">
              Começa a escrever para encontrar a ferramenta perfeita.
            </p>
            <div className="flex flex-wrap gap-2 justify-center max-w-xs mx-auto">
              {SUGESTOES.map(t => (
                <Link
                  key={t}
                  href={`/pesquisa?q=${encodeURIComponent(t)}`}
                  className="text-xs font-medium px-3 py-1.5 rounded-full transition-colors"
                  style={{
                    background: 'var(--surface)',
                    color: 'var(--muted-foreground)',
                    border: '1px solid var(--border)',
                  }}
                >
                  {t}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
