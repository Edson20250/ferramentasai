import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pagamento confirmado | FerramentasAI',
  description: 'Obrigado pela tua compra. Vamos ativar o teu destaque em breve.',
}

export default function DestaqueSucessoPage() {
  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-20 text-center">
      <div className="text-4xl mb-4">✅</div>
      <h1 className="font-display text-2xl font-700 text-slate-900 mb-3">Pagamento recebido</h1>
      <p className="text-slate-500 text-sm leading-relaxed mb-8">
        Obrigado! A tua listagem em destaque será ativada em até 24 horas. Se precisares de algo urgente, escreve para{' '}
        <a href="mailto:ola@ferramentasai.pt" className="text-emerald-700 hover:underline">ola@ferramentasai.pt</a>.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/" className="btn-primary text-center">Voltar ao início</Link>
        <Link href="/destaque" className="btn-outline text-center">Ver planos</Link>
      </div>
    </div>
  )
}
