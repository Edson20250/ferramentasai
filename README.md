# FerramentasAI 🇵🇹

> O maior diretório de ferramentas de IA em português — para o espaço lusófono (CPLP, Guiné Equatorial associada, Macau, diáspora).

## Stack

- **Next.js 15** (App Router, SSG + ISR)
- **Tailwind CSS** (design system próprio)
- **Prisma ORM** + **PostgreSQL** (Supabase)
- **Stripe** (pagamentos de listagens)
- **Vercel** (deploy e edge functions)

---

## Arrancar em 4 passos

### 1. Clonar e instalar

```bash
git clone https://github.com/teu-user/ferramentasai
cd ferramentasai
npm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env.local
```

Edita `.env.local` e preenche:

| Variável | Onde encontrar |
|---|---|
| `DATABASE_URL` | Supabase → Settings → Database → Connection string |
| `STRIPE_SECRET_KEY` | dashboard.stripe.com → Developers → API keys |
| `STRIPE_PUBLISHABLE_KEY` | dashboard.stripe.com → Developers → API keys |
| `NEXT_PUBLIC_BASE_URL` | `http://localhost:3000` em dev |

### 3. Preparar a base de dados

```bash
# Gera o cliente Prisma
npm run db:generate

# Cria as tabelas na base de dados
npm run db:push

# Popula com 50 ferramentas e 8 categorias iniciais
npm run db:seed
```

### 4. Arrancar o servidor

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) — o site está a correr.

---

## Estrutura do projeto

```
ferramentasai/
├── prisma/
│   ├── schema.prisma        # Modelos da BD (Ferramenta, Categoria, Listagem...)
│   └── seed.ts              # 50 ferramentas + 8 categorias iniciais
├── src/
│   ├── app/
│   │   ├── page.tsx                        # Página inicial (hero, categorias, destaque)
│   │   ├── layout.tsx                      # Layout raiz (Navbar + Footer)
│   │   ├── categorias/page.tsx             # Listagem de todas as categorias
│   │   ├── categoria/[slug]/page.tsx       # Página de categoria com filtros
│   │   ├── ferramenta/[slug]/page.tsx      # Página individual de ferramenta
│   │   ├── pesquisa/page.tsx               # Pesquisa full-text
│   │   ├── submeter/page.tsx               # Formulário de submissão gratuita
│   │   ├── destaque/page.tsx               # Página de preços / anunciar
│   │   ├── sitemap.ts                      # Sitemap automático para SEO
│   │   ├── robots.ts                       # robots.txt
│   │   └── api/
│   │       ├── ferramentas/route.ts        # GET /api/ferramentas
│   │       ├── ferramentas/[slug]/clique/  # POST — regista clique (afiliado)
│   │       ├── categorias/route.ts         # GET /api/categorias
│   │       ├── submissoes/route.ts         # POST — nova submissão
│   │       ├── newsletter/route.ts         # POST — novo subscritor (Beehiiv)
│   │       ├── checkout/route.ts           # GET — inicia sessão Stripe
│   │       └── webhook/stripe/route.ts     # POST — confirma pagamento
│   ├── components/
│   │   ├── Navbar.tsx       # Navegação responsiva
│   │   ├── Footer.tsx       # Rodapé com links e categorias
│   │   └── ToolCard.tsx     # Card de ferramenta (normal e destaque)
│   └── lib/
│       ├── prisma.ts        # Singleton do cliente Prisma
│       └── utils.ts         # Helpers (formatPreco, badgePreco, cn...)
└── .env.example             # Template de variáveis de ambiente
```

---

## Deploy no Vercel

```bash
# Instala a CLI do Vercel
npm i -g vercel

# Deploy (segue as instruções)
vercel

# Configura as variáveis de ambiente no dashboard do Vercel
# vercel.com → o teu projeto → Settings → Environment Variables
```

Variáveis a configurar no Vercel:
- `DATABASE_URL`
- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_BASE_URL` (o teu domínio real, ex: https://ferramentasai.pt)

### Webhook Stripe em produção

No dashboard do Stripe, cria um webhook apontando para:
```
https://ferramentasai.pt/api/webhook/stripe
```
Eventos a escutar: `checkout.session.completed`

---

## Como adicionar ferramentas

### Via formulário (recomendado para utilizadores)
Vai a `/submeter` — as submissões ficam pendentes e aparecem no Prisma Studio para aprovação.

### Via seed (programático)
Edita `prisma/seed.ts` e adiciona à array `ferramentasSeed`, depois corre:
```bash
npm run db:seed
```

### Via Prisma Studio (interface visual)
```bash
npm run db:studio
```
Abre uma interface web para gerir a base de dados diretamente.

---

## Monetização

### 1. Listagens pagas (Stripe)
Já integrado. Edita os preços em `src/app/api/checkout/route.ts`:
```ts
const PLANOS = {
  basico:   { preco: 4900,  ... },  // €49
  pro:      { preco: 9900,  ... },  // €99
  destaque: { preco: 19900, ... },  // €199
}
```

### 2. Afiliados
Em `prisma/seed.ts`, preenche o campo `urlAfiliado` com o teu link de afiliado:
```ts
{ nome: 'Notion', urlAfiliado: 'https://affiliate.notion.so/ferramentasai', ... }
```
Cada clique é registado em `/api/ferramentas/[slug]/clique`.

### 3. Newsletter
Liga o Beehiiv em `.env.local`:
```env
BEEHIIV_API_KEY="..."
BEEHIIV_PUBLICATION_ID="..."
```

---

## SEO automático

- Sitemap gerado automaticamente em `/sitemap.xml`
- Metadata dinâmica em cada página de ferramenta e categoria
- Structured data (Open Graph) para partilha em redes sociais
- ISR (Incremental Static Regeneration) — páginas regeneram a cada hora sem rebuild

---

## Próximos passos sugeridos

- [ ] Adicionar painel `/admin` para aprovar submissões
- [ ] Integrar autenticação (NextAuth com Google) para utilizadores
- [ ] Sistema de avaliações por utilizadores autenticados
- [ ] Página `/novidades` com ferramentas adicionadas esta semana
- [ ] Script Python de monitorização de novas ferramentas de IA
- [ ] Relatório mensal automatizado para a newsletter

---

Feito com Next.js 15 + Prisma + Tailwind. Deploy em Vercel. 🇵🇹
