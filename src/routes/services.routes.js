import express from "express";
import {
  getServices,
  createService,
  updateService,
  deleteService,
} from "../controllers/services.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { requirePermission } from "../middleware/permission.middleware.js";

const router = express.Router();

router.get("/", getServices);
router.post("/", protect, requirePermission("services"), createService);
router.put("/:id", protect, requirePermission("services"), updateService);
router.delete("/:id", protect, requirePermission("services"), deleteService);

export default router;
