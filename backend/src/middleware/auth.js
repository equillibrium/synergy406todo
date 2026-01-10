import jwt from "jsonwebtoken";
import prisma from "../config/database.js";
import { config } from "../config/env.js";

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: "Токен не предоставлен" });
    }

    const decoded = jwt.verify(token, config.jwt.accessSecret);

    // Проверяем существование пользователя
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(401).json({ error: "Пользователь не найден" });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "Токен истек",
        code: "TOKEN_EXPIRED",
      });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(403).json({ error: "Невалидный токен" });
    }
    console.error("Auth middleware error:", error);
    return res.status(500).json({ error: "Ошибка авторизации" });
  }
};
