import express from "express";
import { body } from "express-validator";
import {
  submitContact,
  getMessages,
  assignMessage,
  updateMessageStatus,
  replyToMessage,
  deleteMessage,
  sendTestEmail,
  sendCustomEmail,
  getSentEmails,
  deleteSentEmail,
} from "../controllers/contact.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { requirePermission } from "../middleware/permission.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

const router = express.Router();

// Public
router.post(
  "/",
  [
    body("name").notEmpty().withMessage("Name is required."),
    body("email").isEmail().withMessage("Valid email is required."),
    body("subject").notEmpty().withMessage("Subject is required."),
    body("message")
      .isLength({ min: 10 })
      .withMessage("Message must be at least 10 characters."),
  ],
  validate,
  submitContact,
);

// Messages permission
router.get("/", protect, requirePermission("messages"), getMessages);
router.put(
  "/:id/assign",
  protect,
  requirePermission("messages"),
  assignMessage,
);
router.put(
  "/:id/status",
  protect,
  requirePermission("messages"),
  updateMessageStatus,
);
router.post(
  "/:id/reply",
  protect,
  requirePermission("messages"),
  replyToMessage,
);
router.delete("/:id", protect, requirePermission("messages"), deleteMessage);

// Mailbox permission
router.post(
  "/send-email",
  protect,
  requirePermission("mailbox"),
  sendCustomEmail,
);
router.get(
  "/sent-emails",
  protect,
  requirePermission("mailbox"),
  getSentEmails,
);
router.delete(
  "/sent-emails/:id",
  protect,
  requirePermission("mailbox"),
  deleteSentEmail,
);

// Email settings permission
router.post(
  "/test-email",
  protect,
  requirePermission("email_settings"),
  sendTestEmail,
);

export default router;
