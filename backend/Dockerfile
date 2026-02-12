# ============================================================================
# Dockerfile - NestJS Production Build
# Propósito: Crear imagen Docker optimizada para producción
# ============================================================================

# Stage 1: Builder
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar solo package files
COPY package*.json ./
COPY tsconfig.json ./
COPY tsconfig.build.json ./

# Instalar todas las dependencias (incluidas devDependencies para build)
RUN npm install --legacy-peer-deps

# Copiar código fuente
COPY prisma ./prisma
COPY src ./src

# Generar Prisma Client
RUN npx prisma generate

# Compilar TypeScript
RUN npm run build

# ============================================================================
# Stage 2: Production
FROM node:18-alpine

WORKDIR /app

# Instalar dependencias de runtime
RUN apk add --no-cache \
    curl \
    postgresql-client \
    dumb-init

# Copiar solo node_modules necesarios del builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package*.json ./

# Generar Prisma Client nuevamente en producción
RUN npx prisma generate

# Crear usuario no-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Crear directorio de uploads
RUN mkdir -p /app/uploads && \
    chown -R nodejs:nodejs /app

USER nodejs

# Exponer puerto
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:3000/api/v1/health || exit 1

# Usar dumb-init para manejar signals correctamente
ENTRYPOINT ["/sbin/dumb-init", "--"]

# Comando de inicio
CMD ["node", "dist/main.js"]
