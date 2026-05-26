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

connectDB();

const app = express();

// ── Trust proxy — required for Vercel + rate limiting ──────────
app.set("trust proxy", 1);

// ── Security ───────────────────────────────────────────────────
app.use(helmet());

// ── CORS — allow www and non-www + vercel previews ─────────────
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow no-origin requests (mobile, Postman, curl)
      if (!origin) return callback(null, true);
      // Allow any vercel.app preview deployment
      if (origin.endsWith(".vercel.app")) return callback(null, true);
      // Allow localhost for development
      if (origin.includes("localhost")) return callback(null, true);
      // Allow exact CLIENT_URL match
      const clientUrl = process.env.CLIENT_URL || "";
      if (origin === clientUrl) return callback(null, true);
      // Allow both www and non-www versions automatically
      const withWww = clientUrl.replace("https://", "https://www.");
      const withoutWww = clientUrl.replace("https://www.", "https://");
      if (origin === withWww || origin === withoutWww)
        return callback(null, true);
      // Block everything else
      console.log("CORS blocked:", origin);
      callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// ── Body parsing ───────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── Logging ────────────────────────────────────────────────────
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
    standardHeaders: true,
    legacyHeaders: false,
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
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server: http://localhost:${PORT}`);
    verifyEmailSetup();
  });
}

// ── Export for Vercel serverless ───────────────────────────────
export default app;
