# ---- Base dependencies ----
FROM node:18-alpine AS deps
WORKDIR /app

# Only copy package files first (Docker cache optimization)
COPY package*.json ./

# Install clean & reproducible dependencies
RUN npm install


# ---- Build Stage ----
FROM node:18-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# If your services need build step (TS or Babel), add:
# RUN npm run build
# For your current JS services, nothing to build.

# ---- Production Runner ----
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy application
COPY --from=builder /app ./

EXPOSE 3002

# Start production server
CMD ["node", "server.js"]
