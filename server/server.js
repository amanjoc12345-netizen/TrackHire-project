import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";

import analyzeRoute from "./routes/analyze.js";
import coachRoute from "./routes/coach.js";
import questionsRoute from "./routes/questions.js";
import resourcesRoute from "./routes/resources.js";
import roadmapRoute from "./routes/roadmap.js";
import insightsRoute from "./routes/insights.js";
import mockRoute from "./routes/mock.js";

dotenv.config();

process.on("unhandledRejection", (reason) => {
  console.error("UNHANDLED REJECTION:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
});

const app = express();

/* ==========================================
   CORS CONFIGURATION (LOCALHOST ONLY)
========================================== */

const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5000",
];

app.use(
  cors({
    origin(origin, callback) {
      // Allow Postman, curl, mobile apps, etc.
      if (!origin) {
        return callback(null, true);
      }

      if (ALLOWED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));

/* ==========================================
   RATE LIMITER
========================================== */

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: {
    error: {
      message: "Too many requests, please try again later.",
    },
  },
});

app.use("/api", apiLimiter);

/* ==========================================
   HEALTH CHECK
========================================== */

app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

/* ==========================================
   ROUTES
========================================== */

app.use("/api/analyze", analyzeRoute);
app.use("/api/coach", coachRoute);
app.use("/api/questions", questionsRoute);
app.use("/api/resources", resourcesRoute);
app.use("/api/roadmap", roadmapRoute);
app.use("/api/insights", insightsRoute);
app.use("/api/mock", mockRoute);

/* ==========================================
   ERROR HANDLER
========================================== */

app.use((err, req, res, next) => {
  console.error("Express Error:", err);

  if (!res.headersSent) {
    res.status(500).json({
      error: {
        message: err.message || "Internal Server Error",
      },
    });
  }
});

/* ==========================================
   START SERVER
========================================== */

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

/* ==========================================
   GRACEFUL SHUTDOWN
========================================== */

process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down...");
  server.close(() => process.exit(0));
});

process.on("SIGINT", () => {
  console.log("SIGINT received. Shutting down...");
  server.close(() => process.exit(0));
});