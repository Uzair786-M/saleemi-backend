import express from "express";
import { getAbout, updateAbout } from "../controllers/about.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/",  getAbout);            // Public
router.put("/",  protect, updateAbout); // Admin only

export default router;
