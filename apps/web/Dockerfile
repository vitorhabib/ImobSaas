FROM node:18-alpine AS builder

# Instala pnpm na mesma versão do projeto
RUN corepack enable && corepack prepare pnpm@8.15.6 --activate

WORKDIR /app

# Copia configurações do monorepo e arquivos de package.json
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./
COPY packages/ui/package.json ./packages/ui/
COPY packages/types/package.json ./packages/types/
COPY apps/web/package.json ./apps/web/

# Instala todas as dependências
RUN pnpm install

# Copia código fonte
COPY packages/ui ./packages/ui
COPY packages/types ./packages/types
COPY apps/web ./apps/web

# Variáveis de build (necessárias no tempo de build do Next.js)
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY

# Build do Next.js usando Turbo
RUN pnpm --filter web build

# Runner Stage
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Next.js otimização standalone
# Copia o servidor standalone e as dependências estáticas
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public

EXPOSE 3000

# No modo standalone, o ponto de entrada é server.js dentro da pasta da app
CMD ["node", "apps/web/server.js"]
