FROM node:18-alpine

# Instala pnpm na mesma versão do projeto
RUN corepack enable && corepack prepare pnpm@8.15.6 --activate

WORKDIR /app

# Copia arquivos de lock e config do workspace
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./
COPY packages/db/package.json ./packages/db/
COPY packages/types/package.json ./packages/types/
COPY apps/api/package.json ./apps/api/

# Instala todas as dependências
RUN pnpm install

# Copia o código fonte
COPY packages/db ./packages/db
COPY packages/types ./packages/types
COPY apps/api ./apps/api

# Gera o client do Prisma
RUN pnpm --filter @imob-saas/db generate

ENV NODE_ENV=production
EXPOSE 3001

CMD ["node_modules/.bin/tsx", "apps/api/src/index.ts"]
