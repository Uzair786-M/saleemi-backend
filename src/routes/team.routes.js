import express from "express";
import {
  getTeam,
  createMember,
  updateMember,
  deleteMember,
  // getPermissions,
} from "../controllers/team.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// router.get("/permissions", protect, getPermissions);
router.get("/", protect, getTeam);
router.post("/", protect, createMember);
router.put("/:id", protect, updateMember);
router.delete("/:id", protect, deleteMember);

export default router;
