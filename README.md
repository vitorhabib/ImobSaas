# Imob SaaS

Plataforma multi-tenant para gestão de imobiliárias.

## Stack

- **Web:** Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Mobile:** Expo + React Native + TypeScript
- **Backend:** Node.js + Fastify + TypeScript
- **Banco de Dados:** Supabase (PostgreSQL + Auth + Storage + RLS)
- **Monorepo:** Turborepo, pnpm

## Estrutura

- `apps/web`: Aplicação frontend principal (Next.js)
- `apps/api`: Backend principal (Fastify)
- `apps/mobile`: Aplicativo mobile (Expo)
- `packages/types`: DTOs e tipos compartilhados
- `packages/ui`: Componentes de UI compartilhados (shadcn)

## Como rodar localmente

1. **Instale as dependências**
   Recomendamos usar o pnpm:

   ```bash
   pnpm install
   ```

2. **Configure as variáveis de ambiente**
   Copie os arquivos `.env.example` para `.env` nos respectivos pacotes:

   ```bash
   cp apps/api/.env.example apps/api/.env
   cp apps/web/.env.example apps/web/.env
   ```

3. **Inicie o ambiente de desenvolvimento**
   Na raiz do projeto, rode:
   ```bash
   pnpm dev
   ```

## Regras e Convenções

- Todo código deve usar TypeScript estrito (`strict: true`).
- A API Fastify utiliza validação com Zod.
- Os endpoints de API e DTOs estão compartilhados no pacote `packages/types`.
