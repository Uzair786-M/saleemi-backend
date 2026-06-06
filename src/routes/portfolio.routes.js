import express from "express";
import {
  getPortfolio,
  getPortfolioItem,
  createPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
} from "../controllers/portfolio.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { requirePermission } from "../middleware/permission.middleware.js";

const router = express.Router();

router.get("/", getPortfolio);
router.get("/:id", getPortfolioItem);
router.post("/", protect, requirePermission("portfolio"), createPortfolioItem);
router.put(
  "/:id",
  protect,
  requirePermission("portfolio"),
  updatePortfolioItem,
);
router.delete(
  "/:id",
  protect,
  requirePermission("portfolio"),
  deletePortfolioItem,
);

export default router;
