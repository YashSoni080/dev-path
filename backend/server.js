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

dotenv.config();
connectDB();

const app = express();

// ── Security ──────────────────────────────────────────────
app.use(helmet());                          // Security HTTP headers
app.use(mongoSanitize());                   // Prevent NoSQL injection in req.body/params/query

// ── Body / cookie parsing ──────────────────────────────────
app.use(express.json({ limit: "1mb" }));   // Limit request body size
app.use(cookieParser());

// ── CORS ───────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
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

// ── Error handling ─────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
