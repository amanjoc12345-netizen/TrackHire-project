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

dotenv.config();

process.on('unhandledRejection', (reason, promise) => {
  console.error('UNHANDLED REJECTION at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
});

const app = express();

const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:5000',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? (process.env.CLIENT_URL || 'https://trackhire.vercel.app')
    : ALLOWED_ORIGINS
}));
app.use(express.json({ limit: '10mb' }));

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { error: { message: 'Too many requests, please try again later.' } }
});

app.use('/api/', apiLimiter);

app.use("/api/analyze", analyzeRoute);
app.use("/api/coach", coachRoute);
app.use("/api/questions", questionsRoute);
app.use("/api/resources", resourcesRoute);
app.use("/api/roadmap", roadmapRoute);
app.use("/api/insights", insightsRoute);

app.use((err, req, res, next) => {
  console.error('Unhandled Express Error:', err);
  if (!res.headersSent) {
    res.status(500).json({ error: { message: 'Internal server error' } });
  }
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  server.close(() => process.exit(0));
});
