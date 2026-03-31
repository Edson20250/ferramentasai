import Link from 'next/link'
import { Metadata } from 'next'
import { LUSO_AUDIENCE_SHORT } from '@/lib/site-copy'

export const metadata: Metadata = {
  title: 'Newsletter — Novidades de IA em português | FerramentasAI',
  description: 'Subscreve a newsletter gratuita do FerramentasAI: ferramentas novas, tutoriais e dicas de IA em português.',
}

export const dynamic = 'force-dynamic'

export default function NewsletterPage() {
  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-12 text-center">
      <p className="text-emerald-600 text-sm font-medium mb-3">Grátis · Sem spam</p>
      <h1 className="font-display text-3xl font-800 text-slate-900 mb-4">
        Newsletter FerramentasAI
      </h1>
      <p className="text-slate-500 text-sm leading-relaxed mb-8">
        Recebe todas as semanas as melhores ferramentas de IA novas, recursos úteis e dicas para profissionais em {LUSO_AUDIENCE_SHORT}.
      </p>
      <form action="/api/newsletter" method="POST" className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto mb-10">
        <input
          name="email"
          type="email"
          required
          placeholder="o.teu@email.com"
          className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <button
          type="submit"
          className="bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-3 rounded-xl text-sm font-medium transition-colors whitespace-nowrap"
        >
          Subscrever
        </button>
      </form>
      <Link href="/" className="text-sm text-slate-500 hover:text-emerald-700">
        ← Voltar ao início
      </Link>
    </div>
  )
}
