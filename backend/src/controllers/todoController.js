import prisma from "../config/database.js";

export const getAllTodos = async (req, res, next) => {
  try {
    const todos = await prisma.todo.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      todos,
      count: todos.length,
    });
  } catch (error) {
    next(error);
  }
};

export const getTodoById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const todo = await prisma.todo.findFirst({
      where: {
        id: parseInt(id),
        userId: req.user.id,
      },
    });

    if (!todo) {
      return res.status(404).json({
        error: "Задача не найдена",
      });
    }

    res.json({ todo });
  } catch (error) {
    next(error);
  }
};

export const createTodo = async (req, res, next) => {
  try {
    const { title, priority = "medium" } = req.body;

    const todo = await prisma.todo.create({
      data: {
        title: title.trim(),
        priority,
        userId: req.user.id,
      },
    });

    res.status(201).json({
      message: "Задача создана",
      todo,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, completed, priority } = req.body;

    // Проверка принадлежности задачи пользователю
    const existingTodo = await prisma.todo.findFirst({
      where: {
        id: parseInt(id),
        userId: req.user.id,
      },
    });

    if (!existingTodo) {
      return res.status(404).json({
        error: "Задача не найдена",
      });
    }

    // Обновление
    const updatedTodo = await prisma.todo.update({
      where: { id: parseInt(id) },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(completed !== undefined && { completed }),
        ...(priority !== undefined && { priority }),
      },
    });

    res.json({
      message: "Задача обновлена",
      todo: updatedTodo,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTodo = async (req, res, next) => {
  try {
    const { id } = req.params;

    const todo = await prisma.todo.findFirst({
      where: {
        id: parseInt(id),
        userId: req.user.id,
      },
    });

    if (!todo) {
      return res.status(404).json({
        error: "Задача не найдена",
      });
    }

    await prisma.todo.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      message: "Задача удалена",
      id: parseInt(id),
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCompleted = async (req, res, next) => {
  try {
    const result = await prisma.todo.deleteMany({
      where: {
        userId: req.user.id,
        completed: true,
      },
    });

    res.json({
      message: "Завершенные задачи удалены",
      count: result.count,
    });
  } catch (error) {
    next(error);
  }
};

export const getStats = async (req, res, next) => {
  try {
    const [total, completed, active] = await Promise.all([
      prisma.todo.count({
        where: { userId: req.user.id },
      }),
      prisma.todo.count({
        where: {
          userId: req.user.id,
          completed: true,
        },
      }),
      prisma.todo.count({
        where: {
          userId: req.user.id,
          completed: false,
        },
      }),
    ]);

    res.json({
      stats: {
        total,
        completed,
        active,
        completionRate: total > 0 ? ((completed / total) * 100).toFixed(1) : 0,
      },
    });
  } catch (error) {
    next(error);
  }
};
