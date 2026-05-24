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
import { validate } from "../middleware/validate.middleware.js";

const router = express.Router();

// ── Public routes ──────────────────────────────────────────────
router.get("/", getTestimonials); // get approved only

// Public review submission
router.post(
  "/submit",
  [
    body("name").notEmpty().withMessage("Name is required."),
    body("review")
      .isLength({ min: 20 })
      .withMessage("Review must be at least 20 characters."),
    body("rating")
      .optional()
      .isInt({ min: 1, max: 5 })
      .withMessage("Rating must be 1–5."),
    body("email").optional().isEmail().withMessage("Enter a valid email."),
  ],
  validate,
  submitReview,
);

// ── Admin routes ───────────────────────────────────────────────
router.get("/pending", protect, getPendingTestimonials);
router.put("/:id/approve", protect, approveTestimonial);
router.put("/:id/reject", protect, rejectTestimonial);
router.post("/", protect, createTestimonial);
router.put("/:id", protect, updateTestimonial);
router.delete("/:id", protect, deleteTestimonial);

export default router;
