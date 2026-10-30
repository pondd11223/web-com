import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import authRouter from "./routes/auth";
import publicRouter from "./routes/public";
import adminRouter from "./routes/admin";
import { errorHandler } from "./middleware/errorHandler";

const app = new Hono();

// Logger
app.use("*", logger());

// CORS configuration for React frontend with credentials
const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
app.use(
  "*",
  cors({
    origin: (origin) => {
      // Allow localhost and local dev ports
      if (!origin || origin.includes("localhost") || origin.includes("127.0.0.1") || origin === clientUrl) {
        return origin || clientUrl;
      }
      return clientUrl;
    },
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Set-Cookie"],
  })
);

// Health check
app.get("/api/health", (c) => {
  return c.json({
    status: "ok",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

// Mount routes
app.route("/api/auth", authRouter);
app.route("/api/public", publicRouter);
app.route("/api/admin", adminRouter);

// Global Error Handler
app.onError(errorHandler);

// 404 Handler for undefined API routes
app.notFound((c) => {
  return c.json({ success: false, message: "Route not found" }, 404);
});

const PORT = parseInt(process.env.PORT || "5000", 10);
console.log(`🚀 Server starting on http://localhost:${PORT}`);

export default {
  port: PORT,
  fetch: app.fetch,
};
