import Link from 'next/link'
import { Metadata } from 'next'
import { LUSO_AUDIENCE_SHORT } from '@/lib/site-copy'

export const metadata: Metadata = {
  title: 'Newsletter — Novidades de IA em portugues | FerramentasAI',
  description: 'Subscreve a newsletter gratuita do FerramentasAI: ferramentas novas, tutoriais e dicas de IA em portugues.',
}

export const dynamic = 'force-dynamic'

export default function NewsletterPage() {
  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-16 text-center">
      <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-2xl mx-auto mb-5">
        📬
      </div>
      <span className="section-label mx-auto">Gratis &middot; Sem spam</span>
      <h1 className="font-display text-3xl font-800 text-slate-900 mb-4">
        Newsletter FerramentasAI
      </h1>
      <p className="text-slate-500 text-sm leading-relaxed mb-9 max-w-md mx-auto">
        Recebe todas as semanas as melhores ferramentas de IA novas, recursos uteis e dicas para profissionais em {LUSO_AUDIENCE_SHORT}.
      </p>

      <form action="/api/newsletter" method="POST" className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto mb-6">
        <input
          name="email"
          type="email"
          required
          placeholder="o.teu@email.com"
          className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 transition-all"
        />
        <button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3.5 rounded-xl text-sm font-semibold transition-all shadow-sm shadow-emerald-600/20 whitespace-nowrap"
        >
          Subscrever &rarr;
        </button>
      </form>

      <div className="flex items-center justify-center gap-4 text-xs text-slate-400 mb-10">
        {['12.000+ leitores', 'Semanal', '100% gratuita'].map((item) => (
          <span key={item} className="flex items-center gap-1.5">
            <svg className="w-3 h-3 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            {item}
          </span>
        ))}
      </div>

      <Link href="/" className="text-sm text-slate-500 hover:text-emerald-700 transition-colors">
        &larr; Voltar ao inicio
      </Link>
    </div>
  )
}
