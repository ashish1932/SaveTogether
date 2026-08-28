# Multi-stage production build for SaveTogether Backend API
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files & install dependencies
COPY backend/package*.json ./backend/
COPY backend/prisma ./backend/prisma/

WORKDIR /app/backend
RUN npm ci

# Copy backend source code & compile TypeScript
COPY backend/ ./
RUN npx prisma generate
RUN npm run build

# Stage 2: Production Runtime
FROM node:20-alpine AS runner

WORKDIR /app/backend

ENV NODE_ENV=production
ENV PORT=5000

COPY --from=builder /app/backend/package*.json ./
COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/backend/prisma ./prisma
COPY --from=builder /app/backend/node_modules ./node_modules

EXPOSE 5000

CMD ["node", "dist/index.js"]
