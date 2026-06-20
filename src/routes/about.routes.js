import express from "express";
import { getAbout, updateAbout, getFaqs, updateFaqs } from "../controllers/about.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { requirePermission } from "../middleware/permission.middleware.js";

const router = express.Router();

router.get("/",        getAbout);
router.put("/",        protect, requirePermission("about"), updateAbout);
router.get("/faqs",    getFaqs);
router.put("/faqs",    protect, requirePermission("pricing"), updateFaqs);

export default router;
