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

dotenv.config();

const app = express();

app.use(cors());
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

app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

app.use("/api/*", (req, res) => {
  res.status(404).json({
    error: {
      message: `API Route not found: ${req.originalUrl}`
    }
  });
});

app.use((err, req, res, _next) => {
  console.error("Global Error Handler caught:", err);

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
