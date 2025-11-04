export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Prisma errors
  if (err.code === "P2002") {
    return res.status(400).json({
      error: "Запись с такими данными уже существует",
    });
  }

  if (err.code === "P2025") {
    return res.status(404).json({
      error: "Запись не найдена",
    });
  }

  // Validation errors
  if (err.name === "ZodError") {
    return res.status(400).json({
      error: "Ошибка валидации",
      details: err.errors,
    });
  }

  // Default error
  res.status(err.status || 500).json({
    error: err.message || "Внутренняя ошибка сервера",
  });
};

export const notFound = (req, res) => {
  res.status(404).json({
    error: "Маршрут не найден",
    path: req.originalUrl,
  });
};
