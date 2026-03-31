import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { LUSO_META_DESCRIPTION } from '@/lib/site-copy'

export const metadata: Metadata = {
  title: {
    default: 'FerramentasAI — Diretório de Ferramentas de IA em Português',
    template: '%s | FerramentasAI',
  },
  description: `Descobre as melhores ferramentas de inteligência artificial em português. ${LUSO_META_DESCRIPTION}`,
  keywords: [
    'ferramentas de IA',
    'inteligência artificial',
    'IA em português',
    'CPLP',
    'lusófono',
    'Angola',
    'Cabo Verde',
    'Brasil',
    'Moçambique',
    'Timor-Leste',
    'Macau',
    'Portugal',
    'ferramentas inteligência artificial',
  ],
  authors: [{ name: 'FerramentasAI' }],
  creator: 'FerramentasAI',
  openGraph: {
    type: 'website',
    locale: 'pt_PT',
    url: 'https://ferramentasai.pt',
    siteName: 'FerramentasAI',
    title: 'FerramentasAI — Diretório de Ferramentas de IA em Português',
    description: LUSO_META_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FerramentasAI',
    description: LUSO_META_DESCRIPTION,
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
