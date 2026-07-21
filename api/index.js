import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import analyzeRoute from "../server/routes/analyze.js";
import coachRoute from "../server/routes/coach.js";
import questionsRoute from "../server/routes/questions.js";
import resourcesRoute from "../server/routes/resources.js";
import roadmapRoute from "../server/routes/roadmap.js";
import insightsRoute from "../server/routes/insights.js";
import mockRoute from "../server/routes/mock.js";

dotenv.config();

const app = express();

const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:5000',
  'https://ai-job-tracker-mu-umber.vercel.app',
  'https://trackhire.vercel.app',
  process.env.CLIENT_URL,
  process.env.SITE_URL,
].filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
    console.log('Blocked by CORS:', origin);
    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { error: { message: 'Too many requests, please try again later.' } }
});

app.use('/api/', apiLimiter);

app.use((req, res, next) => {
  res.setTimeout(25000, () => {
    if (!res.headersSent) {
      res.status(504).json({
        error: {
          message: "Request timeout. The server took too long to respond."
        }
      });
    }
  });
  next();
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception caught:", err);
});

app.use("/api/analyze", analyzeRoute);
app.use("/api/coach", coachRoute);
app.use("/api/questions", questionsRoute);
app.use("/api/resources", resourcesRoute);
app.use("/api/roadmap", roadmapRoute);
app.use("/api/insights", insightsRoute);
app.use("/api/mock", mockRoute);

app.get("/api/health", (req, res) => {
  const checks = {
    server: "ok",
    openrouter: typeof process.env.OPENROUTER_API_KEY === "string" && process.env.OPENROUTER_API_KEY.length > 0 ? "configured" : "missing",
    firebase: process.env.FIREBASE_SERVICE_ACCOUNT_KEY ? "configured" : "missing (will use default credentials)",
  };

  const allOk = Object.values(checks).every((v) => v !== "error");

  res.status(allOk ? 200 : 503).json({
    status: allOk ? "healthy" : "degraded",
    timestamp: new Date().toISOString(),
    checks,
  });
});

app.use("/api/*", (req, res) => {
  res.status(404).json({
    error: {
      message: `API Route not found: ${req.originalUrl}`
    }
  });
});

app.use((err, req, res, _next) => {
  console.error("Global Error Handler caught:", {
    message: err.message,
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
    status: err.status || 500,
  });

  const cleanMessage = process.env.NODE_ENV === "production"
    ? "An internal server error occurred."
    : (err.message || "Internal Server Error");

  res.status(err.status || 500).json({
    error: {
      message: cleanMessage
    }
  });
});

export default app;
