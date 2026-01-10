import app from "./app.js";
import { config } from "./config/env.js";
import prisma from "./config/database.js";

const PORT = config.port;

// Проверка подключения к БД
async function checkDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log("✅ Подключение к базе данных установлено");
  } catch (error) {
    console.error("❌ Ошибка подключения к базе данных:", error);
    process.exit(1);
  }
}

// Запуск сервера
async function startServer() {
  await checkDatabaseConnection();

  const server = app.listen(PORT, () => {
    console.log("🚀 Сервер запущен");
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`🌍 Environment: ${config.nodeEnv}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
  });

  // Graceful shutdown
  process.on("SIGTERM", async () => {
    console.log("👋 SIGTERM получен, завершение работы...");
    server.close(async () => {
      await prisma.$disconnect();
      console.log("✅ Сервер остановлен");
      process.exit(0);
    });
  });

  process.on("SIGINT", async () => {
    console.log("\n👋 SIGINT получен, завершение работы...");
    server.close(async () => {
      await prisma.$disconnect();
      console.log("✅ Сервер остановлен");
      process.exit(0);
    });
  });
}

startServer().catch((error) => {
  console.error("❌ Ошибка запуска сервера:", error);
  process.exit(1);
});
