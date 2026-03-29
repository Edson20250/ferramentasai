import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

export const metadata: Metadata = {
  title: {
    default: 'FerramentasAI — Diretório de Ferramentas de IA em Português',
    template: '%s | FerramentasAI',
  },
  description: 'Descobre as melhores ferramentas de inteligência artificial em português. Curadas e organizadas por categoria para profissionais e empresas portuguesas e brasileiras.',
  keywords: ['ferramentas de IA', 'inteligência artificial', 'IA em português', 'tools IA', 'AI português', 'ferramentas inteligência artificial'],
  authors: [{ name: 'FerramentasAI' }],
  creator: 'FerramentasAI',
  openGraph: {
    type: 'website',
    locale: 'pt_PT',
    url: 'https://ferramentasai.pt',
    siteName: 'FerramentasAI',
    title: 'FerramentasAI — Diretório de Ferramentas de IA em Português',
    description: 'Descobre as melhores ferramentas de inteligência artificial em português.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FerramentasAI',
    description: 'Descobre as melhores ferramentas de inteligência artificial em português.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-PT">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
