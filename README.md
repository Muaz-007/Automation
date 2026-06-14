# WhatsappAutomate

AI-powered WhatsApp assistant for SMBs — captures leads 24/7, qualifies them, and surfaces them in a clean dashboard. Built for **Real Estate**, **E-commerce**, and **Healthcare** verticals.

## Stack

- **Next.js 16** (App Router) + Tailwind v4 + TypeScript
- **Supabase** (Postgres + Auth, `@supabase/ssr`)
- **Prisma 6** (ORM, schema source of truth)
- **Google Gemini 2.0 Flash** (free tier — structured output)
- **Meta WhatsApp Cloud API** (per-tenant credentials)

## Project structure

```
dashboard/                  Next.js app
├── prisma/
│   ├── schema.prisma       Source of truth (8 tables + enums)
│   └── seed.ts             3 industry templates
├── src/
│   ├── app/                Pages + route handlers
│   │   ├── (auth)/         login, signup
│   │   ├── (dashboard)/    overview, leads, conversations, playground, settings, inventory
│   │   ├── actions/        Server actions (auth, tenant, playground)
│   │   └── api/webhook/whatsapp/[tenantId]/  Meta webhook
│   ├── components/
│   │   ├── ui/             Button, Card, Input, Badge, Skeleton, ...
│   │   ├── dashboard/      Sidebar, Topbar, settings-form, etc.
│   │   ├── landing/        Dashboard preview, FAQ
│   │   ├── theme-provider.tsx
│   │   └── toaster.tsx
│   ├── lib/
│   │   ├── ai.ts                 Gemini client + structured-output Zod schema
│   │   ├── whatsapp.ts           Meta Cloud API client
│   │   ├── ai/process-message.ts Inbound message orchestrator
│   │   ├── prisma.ts             Singleton Prisma client
│   │   ├── supabase/             Browser/server/middleware clients
│   │   └── dal.ts                Data Access Layer (requireTenant, ensureTenantForUser)
│   ├── proxy.ts            Next 16 proxy (auth middleware)
│   └── ...
├── scripts/
│   └── smoke-ai.ts         Quick Gemini API key smoke test
└── .env.local.example
```

## Setup

### 1. Install dependencies

```bash
cd dashboard
npm install
```

### 2. Configure environment

Copy `.env.local.example` → `.env.local` and fill in:

- `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` from Supabase project
- `DATABASE_URL` + `DIRECT_URL` from Supabase → Connect → Prisma
- `GEMINI_API_KEY` from https://aistudio.google.com/apikey (free)
- `NEXT_PUBLIC_APP_URL` — your public URL (or `http://localhost:3000` for dev)

### 3. Push schema to Supabase

```bash
npm run db:push
npm run db:seed   # seeds the 3 industry templates
```

### 4. Run

```bash
npm run dev
```

App live at http://localhost:3000.

## Available scripts

| Script | What it does |
|---|---|
| `npm run dev` | Start Next.js dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run db:push` | Sync Prisma schema → Supabase |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:studio` | Open Prisma Studio (visual DB browser) |
| `npm run db:seed` | Seed industry templates |

## Smoke test the AI integration

```bash
npx dotenv -e .env.local -- tsx scripts/smoke-ai.ts
```

If Gemini responds with a Roman Urdu greeting, you're good to go.

## Try the AI without WhatsApp

1. Sign up at `/signup` (turn off email confirmation in Supabase for fastest testing)
2. Land on `/playground`
3. Type a customer message and watch the AI extract lead data into `/leads`

## Connect WhatsApp (production)

1. Add your Meta WhatsApp Cloud API credentials in `/settings`:
   - Phone number ID
   - Permanent system-user access token
2. Copy the Webhook URL and Verify Token shown on the same page
3. Paste them in Meta Developer Console → WhatsApp → Configuration → Webhook
4. Subscribe to the `messages` field

For local dev, expose your `localhost:3000` to the public internet via [ngrok](https://ngrok.com) and update `NEXT_PUBLIC_APP_URL` to the ngrok URL.

## License

Proprietary.
