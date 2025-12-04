import express from "express";
import {
  register,
  login,
  refresh,
  logout,
  getCurrentUser,
} from "../controllers/authController.js";
import { authenticateToken } from "../middleware/auth.js";
import { validate, schemas } from "../middleware/validation.js";

const router = express.Router();

// Публичные роуты
router.post("/register", validate(schemas.register), register);
router.post("/login", validate(schemas.login), login);
router.post("/refresh", refresh);
router.post("/logout", logout);

// Защищенные роуты
router.get("/me", authenticateToken, getCurrentUser);

export default router;
