import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../config/database.js";
import { config } from "../config/env.js";

const SALT_ROUNDS = 10;

// Генерация токенов
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessExpiry,
  });

  const refreshToken = jwt.sign({ userId }, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiry,
  });

  return { accessToken, refreshToken };
};

export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Проверка на существование
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: email.toLowerCase() }, { username }],
      },
    });

    if (existingUser) {
      return res.status(400).json({
        error:
          existingUser.email === email.toLowerCase()
            ? "Пользователь с таким email уже существует"
            : "Пользователь с таким username уже существует",
      });
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Создание пользователя
    const user = await prisma.user.create({
      data: {
        username,
        email: email.toLowerCase(),
        password: hashedPassword,
      },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
      },
    });

    // Генерация токенов
    const { accessToken, refreshToken } = generateTokens(user.id);

    // Сохранение refresh token в БД
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt,
      },
    });

    res.status(201).json({
      message: "Регистрация успешна",
      user,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Поиск пользователя
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return res.status(401).json({
        error: "Неверный email или пароль",
      });
    }

    // Проверка пароля
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Неверный email или пароль",
      });
    }

    // Генерация токенов
    const { accessToken, refreshToken } = generateTokens(user.id);

    // Сохранение refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt,
      },
    });

    // Не возвращаем пароль
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: "Вход выполнен успешно",
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        error: "Refresh token не предоставлен",
      });
    }

    // Проверка токена в БД
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      return res.status(401).json({
        error: "Невалидный или истекший refresh token",
      });
    }

    // Верификация JWT
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, config.jwt.refreshSecret);
    } catch (error) {
      // Удаляем невалидный токен
      await prisma.refreshToken.delete({
        where: { token: refreshToken },
      });
      return res.status(401).json({
        error: "Невалидный refresh token",
      });
    }

    // Генерация новых токенов
    const tokens = generateTokens(decoded.userId);

    // Удаление старого refresh token
    await prisma.refreshToken.delete({
      where: { token: refreshToken },
    });

    // Сохранение нового
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        token: tokens.refreshToken,
        userId: decoded.userId,
        expiresAt,
      },
    });

    res.json({
      message: "Токены обновлены",
      ...tokens,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      // Удаляем refresh token из БД
      await prisma.refreshToken.deleteMany({
        where: { token: refreshToken },
      });
    }

    res.json({ message: "Выход выполнен успешно" });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    // req.user уже установлен middleware authenticateToken
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    res.json({ user });
  } catch (error) {
    next(error);
  }
};
