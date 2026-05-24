import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import servicesRoutes from "./routes/services.routes.js";
import portfolioRoutes from "./routes/portfolio.routes.js";
import testimonialsRoutes from "./routes/testimonials.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import aboutRoutes from "./routes/about.routes.js";
import pricingRoutes from "./routes/pricing.routes.js";
import { errorHandler, notFound } from "./middleware/error.middleware.js";
import { verifyEmailSetup } from "./controllers/contact.controller.js";

// ── Connect DB ─────────────────────────────────────────────────
connectDB();

const app = express();
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// ── CORS ───────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:3000",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      // Allow any vercel.app domain (covers all preview deployments)
      if (origin.endsWith(".vercel.app")) return callback(null, true);
      // Allow exact matches from env
      if (allowedOrigins.includes(origin)) return callback(null, true);
      // Block everything else
      callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// ── Parsing ────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── Logging (dev only) ─────────────────────────────────────────
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// ── Rate limiting ──────────────────────────────────────────────
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: {
      success: false,
      message: "Too many requests. Please slow down.",
    },
    standardHeaders: true,
    legacyHeaders: false,
  }),
);
app.use(
  "/api/auth/login",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
      success: false,
      message: "Too many login attempts. Try again in 15 minutes.",
    },
  }),
);

// ── Routes ─────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/testimonials", testimonialsRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/pricing", pricingRoutes);

// ── Health check ───────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "SaleemiExpert API is running 🚀",
    env: process.env.NODE_ENV,
    time: new Date().toISOString(),
  });
});

// ── Error handlers ─────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Local dev server ───────────────────────────────────────────
// On Vercel this block is skipped — Vercel uses the export below
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server: http://localhost:${PORT}`);
    console.log(`🌐 Client: ${CLIENT_URL}`);
    verifyEmailSetup();
  });
}

// ── Export for Vercel serverless ───────────────────────────────
export default app;
