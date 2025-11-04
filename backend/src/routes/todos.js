import express from "express";
import {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  deleteCompleted,
  getStats,
} from "../controllers/todoController.js";
import { authenticateToken } from "../middleware/auth.js";
import { validate, schemas } from "../middleware/validation.js";

const router = express.Router();

// Все роуты требуют авторизации
router.use(authenticateToken);

// GET routes
router.get("/", getAllTodos);
router.get("/stats", getStats);
router.get("/:id", getTodoById);

// POST routes
router.post("/", validate(schemas.createTodo), createTodo);

// PUT routes
router.put("/:id", validate(schemas.updateTodo), updateTodo);

// DELETE routes
router.delete("/completed", deleteCompleted);
router.delete("/:id", deleteTodo);

export default router;
