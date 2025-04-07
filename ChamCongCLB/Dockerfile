# Stage 1: Base
FROM node:18-alpine as base
WORKDIR /app
RUN apk add --no-cache g++ make py3-pip libc6-compat
COPY package*.json ./

# Stage 2: Builder
FROM base as builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Stage 3: Production
FROM node:18-alpine as prod
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001
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
