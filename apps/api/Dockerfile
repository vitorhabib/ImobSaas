FROM node:18-alpine AS builder

# Instala pnpm na mesma versão do projeto
RUN corepack enable && corepack prepare pnpm@8.15.6 --activate

WORKDIR /app

# Copia arquivos de lock e config do workspace
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./
COPY packages/types/package.json ./packages/types/
COPY apps/api/package.json ./apps/api/

# Instala todas as dependências
RUN pnpm install

# Copia o código fonte
COPY packages/types ./packages/types
COPY apps/api ./apps/api

# Build do TypeScript
RUN pnpm --filter api build

# Runner Stage
FROM node:18-alpine AS runner
WORKDIR /app

# Instala pnpm no runner também (opcional, se usar scripts pnpm)
RUN corepack enable && corepack prepare pnpm@8.15.6 --activate

COPY --from=builder /app ./

ENV NODE_ENV=production
EXPOSE 3001

# Inicia a API
CMD ["pnpm", "--filter", "api", "start"]
