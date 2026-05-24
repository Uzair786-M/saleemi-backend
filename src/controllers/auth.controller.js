import jwt from "jsonwebtoken";
import Admin from "../models/Admin.model.js";

const COOKIE_NAME = "se_token";
const COOKIE_OPTS = {
  httpOnly: true,
  secure: true, // always true — Vercel is always HTTPS
  sameSite: "none", // required for cross-domain (proxied requests)
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
};

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

// ── POST /api/auth/login ──────────────────────────────────────
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required." });
    }
    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password." });
    }
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password." });
    }
    const token = generateToken(admin._id);
    res.cookie(COOKIE_NAME, token, COOKIE_OPTS);
    res.json({
      success: true,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Login failed. Please try again." });
  }
};

// ── GET /api/auth/me ──────────────────────────────────────────
export const getMe = async (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.admin._id,
      name: req.admin.name,
      email: req.admin.email,
      role: req.admin.role,
    },
  });
};

// ── POST /api/auth/logout ─────────────────────────────────────
export const logout = async (req, res) => {
  res.clearCookie(COOKIE_NAME, { ...COOKIE_OPTS, maxAge: 0 });
  res.json({ success: true, message: "Logged out successfully." });
};

// ── PUT /api/auth/update-email ────────────────────────────────
export const updateEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return res
        .status(400)
        .json({ success: false, message: "A valid email is required." });
    }
    const existing = await Admin.findOne({ email: email.toLowerCase() });
    if (existing && existing._id.toString() !== req.admin._id.toString()) {
      return res
        .status(400)
        .json({ success: false, message: "Email is already in use." });
    }
    const admin = await Admin.findByIdAndUpdate(
      req.admin._id,
      { email: email.toLowerCase() },
      { new: true },
    );
    res.json({
      success: true,
      message: "Email updated successfully.",
      user: admin,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to update email." });
  }
};

// ── PUT /api/auth/change-password ─────────────────────────────
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Both passwords are required." });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters.",
      });
    }
    const admin = await Admin.findById(req.admin._id);
    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Current password is incorrect." });
    }
    admin.password = newPassword;
    await admin.save();
    res.json({ success: true, message: "Password changed successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to change password." });
  }
};
