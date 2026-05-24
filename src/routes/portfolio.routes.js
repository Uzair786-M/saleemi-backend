import express from "express";
import { getPortfolio, getPortfolioItem, createPortfolioItem, updatePortfolioItem, deletePortfolioItem } from "../controllers/portfolio.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/",       getPortfolio);                    // Public
router.get("/:id",    getPortfolioItem);                // Public
router.post("/",      protect, createPortfolioItem);    // Admin only
router.put("/:id",    protect, updatePortfolioItem);    // Admin only
router.delete("/:id", protect, deletePortfolioItem);    // Admin only

export default router;
