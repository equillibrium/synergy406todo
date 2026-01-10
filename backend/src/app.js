import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { config } from "./config/env.js";
import authRoutes from "./routes/auth.js";
import todoRoutes from "./routes/todos.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

const app = express();

// Security middleware
app.use(helmet());

// CORS
app.use(
  cors({
    origin: config.cors.origin,
    credentials: config.cors.credentials,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Logging
if (config.nodeEnv === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);

// 404 handler
app.use(notFound);

// Error handler (должен быть последним)
app.use(errorHandler);

export default app;
