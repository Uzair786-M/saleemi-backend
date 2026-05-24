import express from "express";
import { getPricing, createPricing, updatePricing, deletePricing } from "../controllers/pricing.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/",       getPricing);                // Public
router.post("/",      protect, createPricing);    // Admin only
router.put("/:id",    protect, updatePricing);    // Admin only
router.delete("/:id", protect, deletePricing);    // Admin only

export default router;
