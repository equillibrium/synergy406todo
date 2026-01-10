import { z } from "zod";

export const validate = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: "Ошибка валидации",
          details: error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        });
      }
      next(error);
    }
  };
};

// Схемы валидации
export const schemas = {
  register: z.object({
    username: z
      .string()
      .min(3, "Username должен быть не менее 3 символов")
      .max(50, "Username должен быть не более 50 символов")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username может содержать только буквы, цифры и подчеркивание"
      ),

    email: z.string().email("Невалидный email адрес"),

    password: z
      .string()
      .min(8, "Пароль должен быть не менее 8 символов")
      .regex(/[A-Z]/, "Пароль должен содержать хотя бы одну заглавную букву")
      .regex(/[a-z]/, "Пароль должен содержать хотя бы одну строчную букву")
      .regex(/[0-9]/, "Пароль должен содержать хотя бы одну цифру"),
  }),

  login: z.object({
    email: z.string().email("Невалидный email адрес"),
    password: z.string().min(1, "Пароль обязателен"),
  }),

  createTodo: z.object({
    title: z
      .string()
      .min(1, "Название задачи обязательно")
      .max(500, "Название задачи слишком длинное"),
    priority: z.enum(["low", "medium", "high"]).optional(),
  }),

  updateTodo: z
    .object({
      title: z.string().min(1).max(500).optional(),
      completed: z.boolean().optional(),
      priority: z.enum(["low", "medium", "high"]).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "Необходимо указать хотя бы одно поле для обновления",
    }),
};
