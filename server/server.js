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

process.on("unhandledRejection", (reason, promise) => {
  console.error("UNHANDLED REJECTION at:", promise, "reason:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
  console.error("Stack:", err.stack);
});

const app = express();

/* ==========================================
   CORS CONFIGURATION (PRODUCTION + LOCAL)
========================================== */

const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "http://localhost:5000",
  "https://ai-job-tracker-mu-umber.vercel.app",
  "https://trackhire.vercel.app",
  "https://track-hire-project.vercel.app",
  process.env.CLIENT_URL,
  process.env.SITE_URL,
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (ALLOWED_ORIGINS.includes(origin) || origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      console.error("[CORS] Blocked origin:", origin);
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));

/* ==========================================
   REQUEST TIMEOUT
========================================== */

app.use((req, res, next) => {
  res.setTimeout(60000, () => {
    if (!res.headersSent) {
      console.error(`[Timeout] Request timed out: ${req.method} ${req.originalUrl}`);
      res.status(504).json({
        error: {
          message: "Request timeout. The server took too long to respond.",
        },
      });
    }
  });
  next();
});

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
   HEALTH CHECK (with dependency status)
========================================== */

app.get("/api/health", (req, res) => {
  const checks = {
    server: "ok",
    groq: typeof process.env.GROQ_API_KEY === "string" && process.env.GROQ_API_KEY.length > 0 ? "configured" : "missing",
    openrouter: typeof process.env.OPENROUTER_API_KEY === "string" && process.env.OPENROUTER_API_KEY.length > 0 ? "configured" : "missing",
    gemini: typeof process.env.GEMINI_API_KEY === "string" && process.env.GEMINI_API_KEY.length > 0 ? "configured" : "missing",
    firebase: process.env.FIREBASE_SERVICE_ACCOUNT_KEY ? "configured" : "missing (will use default credentials)",
  };

  const allOk = Object.values(checks).every((v) => v !== "error");

  res.status(allOk ? 200 : 503).json({
    status: allOk ? "healthy" : "degraded",
    timestamp: new Date().toISOString(),
    checks,
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