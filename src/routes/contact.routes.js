import express   from "express";
import { body }  from "express-validator";
import { submitContact, getMessages, updateMessageStatus, replyToMessage, deleteMessage, sendTestEmail, sendCustomEmail } from "../controllers/contact.controller.js";
import { protect }  from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

const router = express.Router();

// Public
router.post("/",
  [ body("name").notEmpty().withMessage("Name is required."), body("email").isEmail().withMessage("Valid email is required."), body("subject").notEmpty().withMessage("Subject is required."), body("message").isLength({ min: 10 }).withMessage("Message must be at least 10 characters.") ],
  validate, submitContact
);

// Admin only
router.get("/",                  protect, getMessages);
router.post("/test-email",       protect, sendTestEmail);
router.post("/send-email",       protect, sendCustomEmail);
router.put("/:id/status",        protect, updateMessageStatus);
router.post("/:id/reply",        protect, replyToMessage);
router.delete("/:id",            protect, deleteMessage);

export default router;
