import express from "express";
import { body } from "express-validator";
import {
  login,
  getMe,
  logout,
  changePassword,
  updateEmail,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

const router = express.Router();

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required."),
    body("password").notEmpty().withMessage("Password is required."),
  ],
  validate,
  login,
);

router.post("/logout", logout);
router.get("/me", protect, getMe);
router.put("/update-email", protect, updateEmail);
router.put(
  "/change-password",
  protect,
  [
    body("currentPassword")
      .notEmpty()
      .withMessage("Current password is required."),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("New password must be at least 6 characters."),
  ],
  validate,
  changePassword,
);

export default router;
