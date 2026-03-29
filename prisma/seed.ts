import { PrismaClient, Precificacao } from '@prisma/client'

const prisma = new PrismaClient()

const categorias = [
  { nome: 'Escrita e Texto', slug: 'escrita', descricao: 'Ferramentas de IA para escrever, editar e melhorar textos em português', icone: '✍️', cor: '#6366f1' },
  { nome: 'Imagem e Design', slug: 'imagem', descricao: 'Geração e edição de imagens com inteligência artificial', icone: '🎨', cor: '#ec4899' },
  { nome: 'Vídeo e Áudio', slug: 'video', descricao: 'Criação e edição de vídeo e áudio com IA', icone: '🎬', cor: '#f59e0b' },
  { nome: 'Produtividade', slug: 'produtividade', descricao: 'Automatiza tarefas e poupa tempo no trabalho', icone: '⚡', cor: '#10b981' },
  { nome: 'Código e Dev', slug: 'codigo', descricao: 'Ferramentas de IA para programadores e desenvolvedores', icone: '💻', cor: '#3b82f6' },
  { nome: 'Negócios e Marketing', slug: 'negocios', descricao: 'IA para vendas, marketing e gestão de negócios', icone: '📈', cor: '#8b5cf6' },
  { nome: 'Chatbots e Assistentes', slug: 'chatbots', descricao: 'Assistentes virtuais e chatbots com IA', icone: '🤖', cor: '#06b6d4' },
  { nome: 'Educação', slug: 'educacao', descricao: 'Aprendizagem e formação potenciadas por IA', icone: '📚', cor: '#f97316' },
]

const ferramentasSeed = [
  // Escrita
  { nome: 'ChatGPT', slug: 'chatgpt', descricao: 'O assistente de IA mais popular do mundo. Escreve, responde perguntas, analisa documentos e muito mais.', url: 'https://chat.openai.com', categoriaSlug: 'chatbots', precificacao: Precificacao.FREEMIUM, precoMensal: 20, emPortugues: true, destaque: true, aprovado: true, tags: ['escrita', 'chat', 'gpt', 'openai'] },
  { nome: 'Claude', slug: 'claude', descricao: 'Assistente de IA da Anthropic. Excelente para análise, escrita longa e raciocínio complexo.', url: 'https://claude.ai', categoriaSlug: 'chatbots', precificacao: Precificacao.FREEMIUM, precoMensal: 20, emPortugues: true, destaque: true, aprovado: true, tags: ['chat', 'escrita', 'análise', 'anthropic'] },
  { nome: 'Gemini', slug: 'gemini', descricao: 'Assistente de IA da Google com acesso a pesquisa em tempo real e integração com Google Workspace.', url: 'https://gemini.google.com', categoriaSlug: 'chatbots', precificacao: Precificacao.FREEMIUM, precoMensal: 20, emPortugues: true, aprovado: true, tags: ['google', 'chat', 'pesquisa'] },
  { nome: 'Jasper', slug: 'jasper', descricao: 'Plataforma de escrita com IA para marketing. Gera posts, anúncios, emails e conteúdo de marca em minutos.', url: 'https://jasper.ai', urlAfiliado: 'https://jasper.ai?ref=ferramentasai', categoriaSlug: 'escrita', precificacao: Precificacao.PAGO, precoMensal: 39, emPortugues: true, aprovado: true, tags: ['marketing', 'copywriting', 'blog'] },
  { nome: 'Copy.ai', slug: 'copyai', descricao: 'Cria copy de vendas, posts de redes sociais e emails de marketing com IA. Tem plano gratuito generoso.', url: 'https://copy.ai', categoriaSlug: 'escrita', precificacao: Precificacao.FREEMIUM, precoMensal: 36, emPortugues: true, aprovado: true, tags: ['copywriting', 'marketing', 'redes sociais'] },
  { nome: 'Notion AI', slug: 'notion-ai', descricao: 'IA integrada no Notion. Resume notas, gera texto, traduz e melhora a tua escrita dentro do teu workspace.', url: 'https://notion.so', urlAfiliado: 'https://affiliate.notion.so/ferramentasai', categoriaSlug: 'produtividade', precificacao: Precificacao.FREEMIUM, precoMensal: 10, emPortugues: true, aprovado: true, tags: ['notas', 'produtividade', 'workspace'] },
  { nome: 'Writesonic', slug: 'writesonic', descricao: 'Geração de conteúdo SEO, artigos longos e landing pages. Integra com SurferSEO para otimização.', url: 'https://writesonic.com', categoriaSlug: 'escrita', precificacao: Precificacao.FREEMIUM, precoMensal: 16, emPortugues: false, aprovado: true, tags: ['seo', 'blog', 'landing page'] },
  { nome: 'Grammarly', slug: 'grammarly', descricao: 'Corrige gramática, estilo e tom de escrita. Funciona em qualquer site e tem suporte básico para português.', url: 'https://grammarly.com', categoriaSlug: 'escrita', precificacao: Precificacao.FREEMIUM, precoMensal: 12, emPortugues: false, aprovado: true, tags: ['gramática', 'correção', 'inglês'] },

  // Imagem
  { nome: 'Midjourney', slug: 'midjourney', descricao: 'Gerador de imagens artísticas com IA. Cria imagens fotorrealistas e ilustrações de qualidade profissional.', url: 'https://midjourney.com', categoriaSlug: 'imagem', precificacao: Precificacao.PAGO, precoMensal: 10, emPortugues: false, destaque: true, aprovado: true, tags: ['imagens', 'arte', 'ilustração', 'design'] },
  { nome: 'DALL-E 3', slug: 'dall-e-3', descricao: 'Gerador de imagens da OpenAI integrado no ChatGPT. Aceita prompts em português naturalmente.', url: 'https://openai.com/dall-e-3', categoriaSlug: 'imagem', precificacao: Precificacao.FREEMIUM, emPortugues: true, aprovado: true, tags: ['imagens', 'openai', 'arte'] },
  { nome: 'Canva AI', slug: 'canva-ai', descricao: 'O Canva com superpoderes de IA. Gera imagens, remove fundos, redimensiona e cria designs completos.', url: 'https://canva.com', urlAfiliado: 'https://partner.canva.com/ferramentasai', categoriaSlug: 'imagem', precificacao: Precificacao.FREEMIUM, precoMensal: 13, emPortugues: true, aprovado: true, tags: ['design', 'templates', 'marketing'] },
  { nome: 'Adobe Firefly', slug: 'adobe-firefly', descricao: 'IA generativa da Adobe integrada no Photoshop e Illustrator. Edita e gera imagens de forma segura comercialmente.', url: 'https://firefly.adobe.com', categoriaSlug: 'imagem', precificacao: Precificacao.FREEMIUM, precoMensal: 5, emPortugues: true, aprovado: true, tags: ['adobe', 'photoshop', 'design'] },
  { nome: 'Stable Diffusion', slug: 'stable-diffusion', descricao: 'Modelo open-source de geração de imagens. Gratuito para instalar localmente, com controlo total sobre os resultados.', url: 'https://stability.ai', categoriaSlug: 'imagem', precificacao: Precificacao.GRATUITO, emPortugues: false, aprovado: true, tags: ['open-source', 'grátis', 'local'] },
  { nome: 'Remove.bg', slug: 'removebg', descricao: 'Remove o fundo de qualquer imagem em segundos com IA. Resultado perfeito sem precisar de Photoshop.', url: 'https://remove.bg', categoriaSlug: 'imagem', precificacao: Precificacao.FREEMIUM, emPortugues: true, aprovado: true, tags: ['fundo', 'recorte', 'foto'] },

  // Vídeo e Áudio
  { nome: 'Runway ML', slug: 'runway', descricao: 'Plataforma profissional de edição de vídeo com IA. Gera vídeos, remove fundos e aplica efeitos cinematográficos.', url: 'https://runwayml.com', categoriaSlug: 'video', precificacao: Precificacao.FREEMIUM, precoMensal: 15, emPortugues: false, aprovado: true, tags: ['vídeo', 'edição', 'efeitos'] },
  { nome: 'ElevenLabs', slug: 'elevenlabs', descricao: 'Síntese de voz com IA extremamente realista. Clona vozes e gera narração em português perfeito.', url: 'https://elevenlabs.io', categoriaSlug: 'video', precificacao: Precificacao.FREEMIUM, precoMensal: 5, emPortugues: true, aprovado: true, tags: ['voz', 'narração', 'podcast', 'áudio'] },
  { nome: 'Descript', slug: 'descript', descricao: 'Edita vídeos e podcasts como se fossem documentos de texto. Remove "ums", silêncios e erros automaticamente.', url: 'https://descript.com', categoriaSlug: 'video', precificacao: Precificacao.FREEMIUM, precoMensal: 12, emPortugues: false, aprovado: true, tags: ['podcast', 'vídeo', 'transcrição'] },
  { nome: 'Udio', slug: 'udio', descricao: 'Gera músicas completas com letra a partir de um prompt de texto. Estilos musicais variados em segundos.', url: 'https://udio.com', categoriaSlug: 'video', precificacao: Precificacao.FREEMIUM, emPortugues: true, aprovado: true, tags: ['música', 'áudio', 'geração'] },

  // Produtividade
  { nome: 'Zapier AI', slug: 'zapier-ai', descricao: 'Automatiza fluxos de trabalho entre 6.000+ aplicações com IA. Liga todas as tuas ferramentas sem código.', url: 'https://zapier.com', categoriaSlug: 'produtividade', precificacao: Precificacao.FREEMIUM, precoMensal: 20, emPortugues: true, aprovado: true, tags: ['automação', 'integração', 'workflow'] },
  { nome: 'Reclaim AI', slug: 'reclaim', descricao: 'Agenda automaticamente as tuas tarefas, hábitos e reuniões no Google Calendar de forma inteligente.', url: 'https://reclaim.ai', categoriaSlug: 'produtividade', precificacao: Precificacao.FREEMIUM, precoMensal: 8, emPortugues: false, aprovado: true, tags: ['calendário', 'agenda', 'tempo'] },
  { nome: 'Otter.ai', slug: 'otter-ai', descricao: 'Transcrição automática de reuniões em tempo real. Resume e destaca pontos de ação automaticamente.', url: 'https://otter.ai', categoriaSlug: 'produtividade', precificacao: Precificacao.FREEMIUM, precoMensal: 10, emPortugues: false, aprovado: true, tags: ['reuniões', 'transcrição', 'resumo'] },
  { nome: 'Make (Integromat)', slug: 'make', descricao: 'Automação visual de workflows. Mais poderoso que o Zapier para fluxos complexos, com plano gratuito generoso.', url: 'https://make.com', categoriaSlug: 'produtividade', precificacao: Precificacao.FREEMIUM, precoMensal: 9, emPortugues: true, aprovado: true, tags: ['automação', 'no-code', 'integração'] },

  // Código
  { nome: 'GitHub Copilot', slug: 'github-copilot', descricao: 'IA de programação integrada no VS Code e outros editores. Sugere código, completa funções e explica erros.', url: 'https://github.com/features/copilot', categoriaSlug: 'codigo', precificacao: Precificacao.PAGO, precoMensal: 10, emPortugues: false, destaque: true, aprovado: true, tags: ['programação', 'vs code', 'autocomplete'] },
  { nome: 'Cursor', slug: 'cursor', descricao: 'Editor de código com IA. Escreve código completo a partir de instruções em linguagem natural, incluindo português.', url: 'https://cursor.sh', categoriaSlug: 'codigo', precificacao: Precificacao.FREEMIUM, precoMensal: 20, emPortugues: true, aprovado: true, tags: ['editor', 'programação', 'ia nativa'] },
  { nome: 'Replit AI', slug: 'replit', descricao: 'Ambiente de desenvolvimento na cloud com IA. Gera, executa e deploya projetos diretamente no browser.', url: 'https://replit.com', categoriaSlug: 'codigo', precificacao: Precificacao.FREEMIUM, precoMensal: 7, emPortugues: false, aprovado: true, tags: ['cloud', 'execução', 'deploy'] },
  { nome: 'v0 by Vercel', slug: 'v0-vercel', descricao: 'Gera componentes React e UI completo a partir de descrições em texto. Exporta código pronto para produção.', url: 'https://v0.dev', categoriaSlug: 'codigo', precificacao: Precificacao.FREEMIUM, emPortugues: true, aprovado: true, tags: ['react', 'ui', 'componentes', 'vercel'] },
  { nome: 'Tabnine', slug: 'tabnine', descricao: 'Autocomplete de código com IA que aprende o teu estilo de programação. Funciona offline para privacidade total.', url: 'https://tabnine.com', categoriaSlug: 'codigo', precificacao: Precificacao.FREEMIUM, precoMensal: 12, emPortugues: false, aprovado: true, tags: ['autocomplete', 'privacidade', 'offline'] },

  // Negócios
  { nome: 'HubSpot AI', slug: 'hubspot-ai', descricao: 'CRM com IA integrada. Escreve emails, analisa dados de vendas e sugere próximas ações automaticamente.', url: 'https://hubspot.com', categoriaSlug: 'negocios', precificacao: Precificacao.FREEMIUM, precoMensal: 20, emPortugues: true, aprovado: true, tags: ['crm', 'vendas', 'marketing', 'email'] },
  { nome: 'Tome', slug: 'tome', descricao: 'Cria apresentações profissionais com IA em minutos. Gera slides completos com texto e imagens relevantes.', url: 'https://tome.app', categoriaSlug: 'negocios', precificacao: Precificacao.FREEMIUM, precoMensal: 16, emPortugues: true, aprovado: true, tags: ['apresentações', 'slides', 'pitch'] },
  { nome: 'Beautiful.ai', slug: 'beautiful-ai', descricao: 'Apresentações inteligentes que se formatam automaticamente. Design profissional sem esforço.', url: 'https://beautiful.ai', categoriaSlug: 'negocios', precificacao: Precificacao.FREEMIUM, precoMensal: 12, emPortugues: false, aprovado: true, tags: ['apresentações', 'design', 'slides'] },
  { nome: 'Surfer SEO', slug: 'surfer-seo', descricao: 'Otimização de conteúdo para SEO com IA. Analisa os melhores resultados e guia-te para escrever conteúdo que rankeia.', url: 'https://surferseo.com', categoriaSlug: 'negocios', precificacao: Precificacao.PAGO, precoMensal: 59, emPortugues: true, aprovado: true, tags: ['seo', 'conteúdo', 'google', 'ranking'] },
  { nome: 'Semrush AI', slug: 'semrush', descricao: 'Suite completa de SEO e marketing digital com IA. Pesquisa de palavras-chave, análise de concorrência e auditorias.', url: 'https://semrush.com', categoriaSlug: 'negocios', precificacao: Precificacao.PAGO, precoMensal: 120, emPortugues: true, aprovado: true, tags: ['seo', 'marketing', 'análise', 'concorrência'] },
  { nome: 'Tidio', slug: 'tidio', descricao: 'Chatbot e live chat para lojas online. Responde clientes automaticamente em português e aumenta conversões.', url: 'https://tidio.com', categoriaSlug: 'negocios', precificacao: Precificacao.FREEMIUM, precoMensal: 19, emPortugues: true, aprovado: true, tags: ['chatbot', 'ecommerce', 'suporte', 'chat'] },

  // Educação
  { nome: 'Khanmigo', slug: 'khanmigo', descricao: 'Tutor de IA da Khan Academy. Ensina matemática, ciências e mais com paciência infinita, em português.', url: 'https://khanacademy.org/khan-labs', categoriaSlug: 'educacao', precificacao: Precificacao.FREEMIUM, emPortugues: true, aprovado: true, tags: ['educação', 'matemática', 'tutor'] },
  { nome: 'Duolingo Max', slug: 'duolingo-max', descricao: 'Aprende idiomas com IA. Tem conversação com personagens e explicação de erros com GPT-4.', url: 'https://duolingo.com', categoriaSlug: 'educacao', precificacao: Precificacao.FREEMIUM, precoMensal: 14, emPortugues: true, aprovado: true, tags: ['idiomas', 'aprendizagem', 'conversação'] },
  { nome: 'Quizlet AI', slug: 'quizlet', descricao: 'Cria flashcards e quizzes automaticamente a partir de qualquer texto ou PDF. Excelente para estudar.', url: 'https://quizlet.com', categoriaSlug: 'educacao', precificacao: Precificacao.FREEMIUM, precoMensal: 8, emPortugues: true, aprovado: true, tags: ['flashcards', 'estudo', 'memorização'] },
  { nome: 'Explainpaper', slug: 'explainpaper', descricao: 'Faz upload de papers académicos e faz perguntas sobre eles. Torna artigos científicos acessíveis a qualquer pessoa.', url: 'https://explainpaper.com', categoriaSlug: 'educacao', precificacao: Precificacao.FREEMIUM, emPortugues: false, aprovado: true, tags: ['papers', 'ciência', 'investigação'] },

  // Chatbots extra
  { nome: 'Perplexity AI', slug: 'perplexity', descricao: 'Motor de pesquisa com IA que cita as fontes. Responde perguntas com informação atual da internet.', url: 'https://perplexity.ai', categoriaSlug: 'chatbots', precificacao: Precificacao.FREEMIUM, precoMensal: 20, emPortugues: true, destaque: true, aprovado: true, tags: ['pesquisa', 'fontes', 'internet', 'atual'] },
  { nome: 'Poe', slug: 'poe', descricao: 'Acede a Claude, ChatGPT, Gemini e mais de 100 modelos numa única plataforma. Plano gratuito diário.', url: 'https://poe.com', categoriaSlug: 'chatbots', precificacao: Precificacao.FREEMIUM, precoMensal: 20, emPortugues: true, aprovado: true, tags: ['multi-modelo', 'claude', 'gpt', 'gemini'] },
  { nome: 'Mistral AI', slug: 'mistral', descricao: 'Modelos de IA europeus, rápidos e eficientes. Excelente para usar via API com custos muito baixos.', url: 'https://mistral.ai', categoriaSlug: 'chatbots', precificacao: Precificacao.FREEMIUM, emPortugues: true, aprovado: true, tags: ['europeu', 'api', 'open-source', 'rápido'] },
  { nome: 'Character.AI', slug: 'character-ai', descricao: 'Conversa com personagens de IA criados pela comunidade. Entretenimento, prática de idiomas e criatividade.', url: 'https://character.ai', categoriaSlug: 'chatbots', precificacao: Precificacao.FREEMIUM, precoMensal: 10, emPortugues: true, aprovado: true, tags: ['personagens', 'entretenimento', 'roleplay'] },
]

async function main() {
  console.log('🌱 A popular a base de dados...')

  await prisma.categoria.deleteMany()
  await prisma.ferramenta.deleteMany()

  const categoriasCreadas: Record<string, string> = {}

  for (const cat of categorias) {
    const criada = await prisma.categoria.create({ data: cat })
    categoriasCreadas[cat.slug] = criada.id
    console.log(`✅ Categoria: ${cat.nome}`)
  }

  for (const f of ferramentasSeed) {
    const { categoriaSlug, ...resto } = f
    await prisma.ferramenta.create({
      data: {
        ...resto,
        categoriaId: categoriasCreadas[categoriaSlug],
      }
    })
    console.log(`  🔧 Ferramenta: ${f.nome}`)
  }

  console.log(`\n✨ Seed completo! ${categorias.length} categorias, ${ferramentasSeed.length} ferramentas.`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
