import express from "express";
import {
  getPricing,
  createPricing,
  updatePricing,
  deletePricing,
} from "../controllers/pricing.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { requirePermission } from "../middleware/permission.middleware.js";

const router = express.Router();

router.get("/", getPricing);
router.post("/", protect, requirePermission("pricing"), createPricing);
router.put("/:id", protect, requirePermission("pricing"), updatePricing);
router.delete("/:id", protect, requirePermission("pricing"), deletePricing);

export default router;
