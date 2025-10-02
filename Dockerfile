# Dockerfile for Next.js application (Node 20 LTS)
# Build image
FROM node:20-bullseye AS builder
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci --only=production || npm install

# Copy source
COPY . .

# Build the Next.js app
RUN npm run build

# Production image
FROM node:20-bullseye-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy package.json and install prod deps only
COPY package.json package-lock.json* ./
RUN npm ci --only=production || npm install --production

# Copy built assets from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

# Start the app
CMD ["npm", "start"]
