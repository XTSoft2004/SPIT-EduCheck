# Stage 1: Base
FROM node:18-bullseye as base
WORKDIR /app

# Cài g++ make python3-pip bằng apt (Debian)
RUN apt-get update && \
    apt-get install -y g++ make python3-pip && \
    rm -rf /var/lib/apt/lists/*

COPY package*.json ./

# Stage 2: Builder
FROM base as builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Stage 3: Production
FROM node:18-bullseye as prod
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Tạo user không quyền root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs --ingroup nodejs
USER nextjs

EXPOSE 2222
CMD ["npx", "next", "start"]

# Stage 4: Development
FROM base as dev
WORKDIR /app
ENV NODE_ENV=development
COPY . .
RUN npm install
EXPOSE 2222
CMD ["npm", "run", "dev"]
