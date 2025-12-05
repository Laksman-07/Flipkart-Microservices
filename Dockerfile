### 1. Install dependencies (cached)
FROM node:18-alpine AS deps

WORKDIR /app
COPY package*.json ./
RUN npm install

### 2. Build stage
FROM node:18-alpine AS builder

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package*.json ./

# Copy Next.js app folders
COPY app ./app
COPY components ./components
COPY hooks ./hooks
COPY lib ./lib
COPY data ./data

# Copy required config files
COPY next.config.js ./
COPY tsconfig.json ./
COPY tailwind.config.ts ./
COPY postcss.config.js ./
COPY app/globals.css ./app/globals.css

RUN npm run build

### 3. Production run stage
FROM node:18-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

CMD ["npm", "start"]
