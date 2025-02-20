# Этап сборки
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --production
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder --chown=nextjs:nodejs /app ./
USER nextjs
# EXPOSE 3000
# ENV PORT 3000
# ниже если не используется output: export (пребилд в html)
# CMD ["npm", "run", "start"]
CMD ["npx", "serve@latest", "out", "-y"]