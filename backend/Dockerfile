# =========================================================
# Stage 1: Dependencies Installation
# =========================================================
FROM node:20-alpine AS dependencies

WORKDIR /app

# Copy package manifests to leverage layer caching
COPY package.json package-lock.json ./

# Install only production dependencies cleanly
RUN npm ci --omit=dev && npm cache clean --force

# =========================================================
# Stage 2: Production Runner
# =========================================================
FROM node:20-alpine AS runner

WORKDIR /app

# Set environment defaults
ENV NODE_ENV=production
ENV PORT=5000

# Install lightweight utilities for health checks
RUN apk add --no-cache wget

# Copy production node_modules from dependencies stage with correct ownership
COPY --chown=node:node --from=dependencies /app/node_modules ./node_modules

# Copy application code
COPY --chown=node:node . .

# Run container as unprivileged non-root node user
USER node

# Expose default backend application port
EXPOSE 5000

# Container Health Check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:${PORT}/ || exit 1

# Start production server
CMD ["node", "index.js"]
