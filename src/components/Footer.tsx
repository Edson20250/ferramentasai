import Link from 'next/link'
import { LUSO_AUDIENCE_LINE } from '@/lib/site-copy'

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-md bg-emerald-500 flex items-center justify-center text-white text-xs font-bold">IA</div>
              <span className="text-white font-display font-600 text-sm">ferramentasai.pt</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-500">
              O melhor diretório de ferramentas de IA em português. Curado para {LUSO_AUDIENCE_LINE}.
            </p>
          </div>

          <div>
            <p className="text-white text-xs font-medium mb-3 uppercase tracking-wider">Explorar</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/categorias" className="hover:text-white transition-colors text-xs">Todas as categorias</Link></li>
              <li><Link href="/novidades" className="hover:text-white transition-colors text-xs">Novidades</Link></li>
              <li><Link href="/destaque" className="hover:text-white transition-colors text-xs">Ferramentas em destaque</Link></li>
              <li><Link href="/gratuitas" className="hover:text-white transition-colors text-xs">Ferramentas gratuitas</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-white text-xs font-medium mb-3 uppercase tracking-wider">Categorias</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/categoria/escrita" className="hover:text-white transition-colors text-xs">✍️ Escrita e Texto</Link></li>
              <li><Link href="/categoria/imagem" className="hover:text-white transition-colors text-xs">🎨 Imagem e Design</Link></li>
              <li><Link href="/categoria/codigo" className="hover:text-white transition-colors text-xs">💻 Código e Dev</Link></li>
              <li><Link href="/categoria/negocios" className="hover:text-white transition-colors text-xs">📈 Negócios</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-white text-xs font-medium mb-3 uppercase tracking-wider">Site</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/submeter" className="hover:text-white transition-colors text-xs">Submeter ferramenta</Link></li>
              <li><Link href="/destaque" className="hover:text-white transition-colors text-xs">Anunciar / Destacar</Link></li>
              <li><Link href="/newsletter" className="hover:text-white transition-colors text-xs">Newsletter</Link></li>
              <li><Link href="/sobre" className="hover:text-white transition-colors text-xs">Sobre nós</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} FerramentasAI. Feito em Portugal 🇵🇹 · Para quem fala português em todo o mundo
          </p>
          <div className="flex gap-4 text-xs text-slate-600">
            <Link href="/privacidade" className="hover:text-slate-400">Privacidade</Link>
            <Link href="/termos" className="hover:text-slate-400">Termos</Link>
            <Link href="/afiliados" className="hover:text-slate-400">Afiliados</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
