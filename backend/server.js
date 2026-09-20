import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import { apiLimiter } from "./middleware/rateLimiter.js";

import authRoutes from "./routes/authRoutes.js";
import domainRoutes from "./routes/domainRoutes.js";
import resourceRoutes from "./routes/resourceRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";

dotenv.config();

const app = express();

// ── Database Connection Middleware (ensures DB is connected on serverless invocations) ──
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("Database connection error:", err);
    res.status(500).json({ message: "Database connection failed. Please check MONGO_URI." });
  }
});

// ── Security ──────────────────────────────────────────────
app.use(helmet());                          // Security HTTP headers
app.use(mongoSanitize());                   // Prevent NoSQL injection in req.body/params/query

// ── Body / cookie parsing ──────────────────────────────────
app.use(express.json({ limit: "1mb" }));   // Limit request body size
app.use(cookieParser());

// ── CORS ───────────────────────────────────────────────────
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map((s) => s.trim())
  : ["http://localhost:5173", "http://localhost:5000"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or same-origin serverless)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app") ||
        origin.includes("localhost")
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true, // Allow cookies to be sent cross-origin
  })
);

// ── Global rate limiting ───────────────────────────────────
app.use("/api", apiLimiter);

// ── Routes ─────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "DevPath API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/domains", domainRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/progress", progressRoutes);

// ── Error handling ─────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (!process.env.VERCEL) {
  const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(`\n❌ Port ${PORT} is already in use by another running process.`);
      console.error(`To release the port, run: fuser -k ${PORT}/tcp (or npx kill-port ${PORT})\n`);
      process.exit(1);
    } else {
      console.error("Server error:", err);
    }
  });
}

export default app;
