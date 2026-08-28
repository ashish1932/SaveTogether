# SaveTogether Backend Multi-Stage Production Dockerfile (Step 43.14)

# Stage 1: Build dependencies & compile TypeScript
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production runtime image
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Security: Run as non-root node user (Step 37.56)
USER node

COPY --chown=node:node package*.json ./
RUN npm ci --only=production

COPY --chown=node:node --from=builder /app/dist ./dist

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/health || exit 1

CMD ["node", "dist/index.js"]
