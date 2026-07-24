import express from "express";
import cors from "cors";
import dotenv from "dotenv";
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
  'http://localhost:5174',
  'http://localhost:3000',
  'http://localhost:5000',
  'https://ai-job-tracker-mu-umber.vercel.app',
  'https://trackhire.vercel.app',
  'https://track-hire-project.vercel.app',
  process.env.CLIENT_URL,
  process.env.SITE_URL,
].filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    if (ALLOWED_ORIGINS.includes(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    console.log('Blocked by CORS:', origin);
    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception caught:", err);
});

// Support both /api/* and /* routes for Vercel serverless rewrites
app.use(["/analyze", "/api/analyze"], analyzeRoute);
app.use(["/coach", "/api/coach"], coachRoute);
app.use(["/questions", "/api/questions"], questionsRoute);
app.use(["/resources", "/api/resources"], resourcesRoute);
app.use(["/roadmap", "/api/roadmap"], roadmapRoute);
app.use(["/insights", "/api/insights"], insightsRoute);
app.use(["/mock", "/api/mock"], mockRoute);

app.get(["/health", "/api/health"], (req, res) => {
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

app.use((err, req, res, _next) => {
  console.error("Global Error Handler caught:", {
    message: err.message,
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
    status: err.status || 500,
  });

  const cleanMessage = err.message || "Internal Server Error";

  res.status(err.status || 500).json({
    error: {
      message: cleanMessage
    }
  });
});

export default function handler(req, res) {
  return app(req, res);
}
