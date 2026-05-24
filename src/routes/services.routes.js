import express from "express";
import { getServices, getService, createService, updateService, deleteService } from "../controllers/services.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/",       getServices);           // Public
router.get("/:id",    getService);            // Public
router.post("/",      protect, createService);  // Admin only
router.put("/:id",    protect, updateService);  // Admin only
router.delete("/:id", protect, deleteService);  // Admin only

export default router;
