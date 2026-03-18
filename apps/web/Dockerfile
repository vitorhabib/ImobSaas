FROM node:18-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# Copia configurações do monorepo
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./
COPY packages/ui/package.json ./packages/ui/
COPY packages/types/package.json ./packages/types/
COPY apps/web/package.json ./apps/web/

# Instala dependências do frontend
RUN pnpm install --filter web...

# Copia código fonte
COPY packages/ui ./packages/ui
COPY packages/types ./packages/types
COPY apps/web ./apps/web

# Variáveis de build
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY

# Build do Next.js
RUN pnpm turbo run build --filter web

# Runner
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Next.js otimização standalone
COPY --from=builder /app/apps/web/next.config.js ./
COPY --from=builder /app/apps/web/public ./public
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]