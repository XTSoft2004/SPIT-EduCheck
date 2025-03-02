# Stage 1: Base image
FROM node:18-alpine as base
RUN apk add --no-cache g++ make py3-pip libc6-compat
WORKDIR /app
COPY package*.json ./
EXPOSE 3000

# Stage 2: Builder image
FROM base as builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Stage 3: Production image
FROM base as production
WORKDIR /app

ENV NODE_ENV=production
RUN npm ci --only=production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

CMD ["npm", "start"]

# Stage 4: Development image
FROM base as dev
ENV NODE_ENV=development
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]