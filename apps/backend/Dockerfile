# syntax=docker/dockerfile:1

# --- Stage 1: Install dependencies using pnpm ---
FROM oven/bun:latest AS workspace
WORKDIR /app

FROM node:22-slim AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.30.1 --activate
COPY package.json pnpm-lock.yaml ./

# The store is a cache mount rather than an image layer, so editing package.json
# still busts this step but pnpm re-downloads only the packages that changed.
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store,sharing=locked \
	pnpm install --store-dir=/pnpm/store


FROM workspace AS runtime
COPY --from=builder /app/node_modules ./node_modules
COPY pnpm-lock.yaml ./
COPY package.json ./
# Bun reads tsconfig.json for the @/* path aliases and emitDecoratorMetadata.
COPY tsconfig.json ./
COPY src ./src

CMD ["bun", "run", "dev"]
