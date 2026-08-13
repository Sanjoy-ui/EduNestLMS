# =========================================================
# Stage 1: Build static assets using Node.js
# =========================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package manifests for caching layer
COPY package.json package-lock.json ./

# Install all dependencies (including devDependencies required for Vite)
RUN npm ci

# Copy application source code
COPY . .

# Build arguments for Vite environment variables
ARG VITE_RAZORPAY_KEY_ID
ARG VITE_FIREBASE_APIKEY
ARG VITE_FIREBASE_AUTH_DOMAIN
ARG VITE_FIREBASE_PROJECT_ID
ARG VITE_FIREBASE_STORAGE_BUCKET
ARG VITE_FIREBASE_MESSAGING_SENDER_ID
ARG VITE_FIREBASE_APP_ID

# Build static bundle
RUN npm run build

# =========================================================
# Stage 2: Production Nginx Runner
# =========================================================
FROM nginx:1.25-alpine AS runner

# Remove default Nginx HTML files
RUN rm -rf /usr/share/nginx/html/*

# Copy compiled static output from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose default HTTP port
EXPOSE 80

# Production Health Check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/healthz || exit 1

# Run Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
