import express from "express";
import { body } from "express-validator";
import {
  getTestimonials,
  getPendingTestimonials,
  submitReview,
  approveTestimonial,
  rejectTestimonial,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "../controllers/testimonials.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { requirePermission } from "../middleware/permission.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

const router = express.Router();

// Public
router.get("/", getTestimonials);
router.post(
  "/submit",
  [
    body("name").notEmpty().withMessage("Name is required."),
    body("review")
      .isLength({ min: 20 })
      .withMessage("Review must be at least 20 characters."),
    body("rating").optional().isInt({ min: 1, max: 5 }),
    body("email").optional().isEmail(),
  ],
  validate,
  submitReview,
);

// Admin — reviews permission
router.get(
  "/pending",
  protect,
  requirePermission("reviews"),
  getPendingTestimonials,
);
router.put(
  "/:id/approve",
  protect,
  requirePermission("reviews"),
  approveTestimonial,
);
router.put(
  "/:id/reject",
  protect,
  requirePermission("reviews"),
  rejectTestimonial,
);

// Admin — testimonials permission
router.post("/", protect, requirePermission("testimonials"), createTestimonial);
router.put(
  "/:id",
  protect,
  requirePermission("testimonials"),
  updateTestimonial,
);
router.delete(
  "/:id",
  protect,
  requirePermission("testimonials"),
  deleteTestimonial,
);

export default router;
