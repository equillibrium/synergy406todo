# Todo API Backend

Backend API для приложения управления задачами с JWT авторизацией.

## 🚀 Технологии

- Node.js + Express
- PostgreSQL + Prisma ORM
- JWT Authentication
- Bcrypt для хеширования паролей
- Zod для валидации

## 📦 Установка

# Установка зависимостей
npm install

# Настройка переменных окружения
cp .env.example .env
# Отредактируйте .env файл

# Генерация Prisma клиента
npm run prisma:generate

# Применение миграций
npm run prisma:migrate

# Запуск в режиме разработки
npm run dev## 🗄️ База данных

### Локальная PostgreSQL

# Создайте базу данных
createdb todo_db

# Примените миграции
npm run prisma:migrate### Docker PostgreSQL

docker run --name todo-postgres \
  -e POSTGRES_DB=todo_db \
  -e POSTGRES_USER=todouser \
  -e POSTGRES_PASSWORD=todopass \
  -p 5432:5432 \
  -d postgres:16-alpine## 🔌 API Endpoints

### Авторизация
