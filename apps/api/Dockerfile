FROM node:18-alpine AS builder

# Instala pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copia arquivos de lock e config do workspace
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json tsconfig.json ./
COPY packages/db/package.json ./packages/db/
COPY packages/types/package.json ./packages/types/
COPY apps/api/package.json ./apps/api/

# Instala dependências filtrando apenas o escopo da API
RUN pnpm install --filter api...

# Copia o código fonte dos pacotes compartilhados e da API
COPY packages/db ./packages/db
COPY packages/types ./packages/types
COPY apps/api ./apps/api

# Gera o client do Prisma e faz o build da API via turbo
RUN pnpm --filter @imob-saas/db generate
RUN pnpm turbo run build --filter api

# Runner
FROM node:18-alpine AS runner
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

# Copia os arquivos de build necessários
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/pnpm-workspace.yaml ./

COPY --from=builder /app/packages/db/package.json ./packages/db/
COPY --from=builder /app/packages/db/dist ./packages/db/dist
COPY --from=builder /app/packages/db/prisma ./packages/db/prisma

COPY --from=builder /app/packages/types/package.json ./packages/types/
COPY --from=builder /app/packages/types/dist ./packages/types/dist

COPY --from=builder /app/apps/api/package.json ./apps/api/
COPY --from=builder /app/apps/api/dist ./apps/api/dist

# Instala apenas dependências de produção
RUN pnpm install --prod --filter api...
RUN pnpm --filter @imob-saas/db generate

ENV NODE_ENV=production
EXPOSE 3001

CMD ["node", "apps/api/dist/index.js"]