# Базовый образ
FROM node:22-alpine AS base

# Установка зависимостей
FROM base AS dependencies
WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

# Копирование dev зависимостей для генерации Prisma
FROM base AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
RUN npx prisma generate

# Production образ
FROM base AS production
WORKDIR /app

# Копирование production зависимостей
COPY --from=dependencies /app/node_modules ./node_modules

# Копирование Prisma клиента
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/node_modules/@prisma ./node_modules/@prisma

# Копирование исходного кода
COPY . .

# Переменные окружения (будут переопределены при запуске)
ENV NODE_ENV=production
ENV PORT=3000

# Экспонируем порт
EXPOSE 3000

# Команда запуска с применением миграций
CMD ["sh", "-c", "npx prisma migrate deploy && node src/server.js"]