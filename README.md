# Cartão da Gestante (Backend Mobile-First)

API REST versionada para gestão do Cartão da Gestante com Next.js App Router + Supabase Postgres + RLS.

## Stack

- Next.js 16 (App Router)
- TypeScript
- Supabase (Auth, Postgres, Storage)
- Zod (validação)
- Playwright (geração de PDF)
- Vitest (testes unitários)

## Requisitos

- Node.js 20+
- Projeto Supabase configurado
- Supabase CLI (para migrations/seed)

## Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
APP_BASE_URL=http://localhost:3000
```

## Banco de dados (Supabase)

### 1. Aplicar migrations

```bash
supabase db push
```

### 2. Executar seed

```bash
supabase db seed
```

Arquivos relevantes:

- `supabase/migrations/202603010001_init.sql`
- `supabase/seed.sql`

## Rodando localmente

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev` - ambiente local
- `npm run lint` - lint
- `npm run typecheck` - checagem TypeScript
- `npm run test` - testes unitários
- `npm run build` - build de produção

## Endpoints

Veja `docs/API.md` para lista completa de rotas e payloads.

Base path: `/api/v1`

## Segurança

- Auth obrigatória em todas as rotas
- Controle de acesso por papel (`admin`, `doctor`, `secretary`, `patient`)
- RLS habilitado nas tabelas clínicas
- Upload privado em bucket `clinical-attachments` com signed URL
- Auditoria de alterações críticas em `audit_logs`

## PDF do Cartão

- Endpoint: `GET /api/v1/pregnancies/:id/card.pdf`
- Renderização HTML/CSS e exportação em A4 via Playwright

## Observações

- Paciente pode possuir múltiplas gestações.
- Consultas são ilimitadas; o PDF projeta as 12 primeiras no formato do cartão.
- V1 não possui modo offline.
