import Admin, { ALL_PERMISSIONS } from "../models/Admin.model.js";
import jwt from "jsonwebtoken";

// ── GET /api/team — get all team members ─────────────────────
export const getTeam = async (req, res) => {
  try {
    const members = await Admin.find({ _id: { $ne: req.admin._id } })
      .select("-password")
      .sort({ createdAt: 1 });
    res.json({ success: true, data: members });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── POST /api/team — create new team member ───────────────────
export const createMember = async (req, res) => {
  try {
    // Only superadmin can create members
    if (req.admin.role !== "superadmin") {
      return res.status(403).json({
        success: false,
        message: "Only the super admin can add team members.",
      });
    }
    const { name, email, password, role, permissions } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required.",
      });
    }
    const exists = await Admin.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }
    const member = await Admin.create({
      name,
      email,
      password,
      role: role || "member",
      permissions: permissions || ["dashboard", "messages"],
      invitedBy: req.admin._id,
    });
    res.status(201).json({
      success: true,
      data: member,
      message: `${member.name} added to your team!`,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── PUT /api/team/:id — update permissions / role ─────────────
export const updateMember = async (req, res) => {
  try {
    if (req.admin.role !== "superadmin") {
      return res.status(403).json({
        success: false,
        message: "Only the super admin can update team members.",
      });
    }
    const { name, permissions, role, isActive } = req.body;
    const member = await Admin.findById(req.params.id);
    if (!member)
      return res
        .status(404)
        .json({ success: false, message: "Member not found." });
    // Prevent modifying superadmin accounts
    if (member.role === "superadmin") {
      return res.status(403).json({
        success: false,
        message: "Cannot modify another super admin account.",
      });
    }
    if (name !== undefined) member.name = name;
    if (role !== undefined) member.role = role;
    if (isActive !== undefined) member.isActive = isActive;
    if (permissions !== undefined) member.permissions = permissions;
    await member.save();
    res.json({
      success: true,
      data: member,
      message: "Member updated successfully.",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── DELETE /api/team/:id — remove team member ─────────────────
export const deleteMember = async (req, res) => {
  try {
    if (req.admin.role !== "superadmin") {
      return res.status(403).json({
        success: false,
        message: "Only the super admin can remove team members.",
      });
    }
    const member = await Admin.findById(req.params.id);
    if (!member)
      return res
        .status(404)
        .json({ success: false, message: "Member not found." });
    if (member.role === "superadmin") {
      return res.status(403).json({
        success: false,
        message: "Cannot remove a super admin account.",
      });
    }
    await Admin.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: `${member.name} removed from team.` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/team/permissions — get all available permissions ─
export const getPermissions = async (req, res) => {
  res.json({ success: true, data: ALL_PERMISSIONS });
};
