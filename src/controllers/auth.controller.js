import jwt from "jsonwebtoken";
import Admin from "../models/Admin.model.js";

const COOKIE_NAME = "se_token";
const IS_PROD = process.env.NODE_ENV === "production";

const COOKIE_OPTS = {
  httpOnly: true,
  secure: IS_PROD,
  sameSite: IS_PROD ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
};

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
    const match = await admin.comparePassword(password);
    if (!match) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password." });
    }
    if (!admin.isActive) {
      return res
        .status(401)
        .json({ success: false, message: "Account is deactivated." });
    }
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie(COOKIE_NAME, token, COOKIE_OPTS);
    return res.json({
      success: true,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions,
        isActive: admin.isActive,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Server error during login." });
  }
};

export const getMe = async (req, res) => {
  return res.json({
    success: true,
    user: {
      id: req.admin._id,
      name: req.admin.name,
      email: req.admin.email,
      role: req.admin.role,
      permissions: req.admin.permissions,
      isActive: req.admin.isActive,
    },
  });
};

export const logout = async (req, res) => {
  res.clearCookie(COOKIE_NAME, COOKIE_OPTS);
  return res.json({ success: true, message: "Logged out." });
};

export const updateEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res
        .status(400)
        .json({ success: false, message: "Email required." });
    await Admin.findByIdAndUpdate(req.admin._id, {
      email: email.toLowerCase(),
    });
    return res.json({ success: true, message: "Email updated." });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Both passwords required." });
    }
    const admin = await Admin.findById(req.admin._id);
    const match = await admin.comparePassword(currentPassword);
    if (!match)
      return res
        .status(400)
        .json({ success: false, message: "Current password incorrect." });
    admin.password = newPassword;
    await admin.save();
    return res.json({ success: true, message: "Password changed." });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
