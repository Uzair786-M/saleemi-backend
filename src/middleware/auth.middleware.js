import jwt from "jsonwebtoken";
import Admin from "../models/Admin.model.js";

const COOKIE_NAME = "se_token";

export const protect = async (req, res, next) => {
  try {
    // 1. Try HttpOnly cookie first (most secure)
    let token = req.cookies?.[COOKIE_NAME];

    // 2. Fall back to Authorization header (for API clients/testing)
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader?.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized. Please log in." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select("-password");

    if (!admin) {
      return res
        .status(401)
        .json({ success: false, message: "Account not found." });
    }

    req.admin = admin;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please log in again.",
      });
    }
    return res.status(401).json({ success: false, message: "Not authorized." });
  }
};
