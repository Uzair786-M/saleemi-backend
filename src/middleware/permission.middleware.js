// Permission middleware — checks if the logged-in admin has the required permission
// Usage: router.put("/", protect, requirePermission("portfolio"), handler)

export const requirePermission = (permission) => (req, res, next) => {
  const admin = req.admin;
  if (!admin)
    return res.status(401).json({ success: false, message: "Not authorized." });

  // Superadmin always has access
  if (admin.role === "superadmin") return next();

  // Check permissions array
  if (!admin.permissions?.includes(permission)) {
    return res.status(403).json({
      success: false,
      message: `Access denied. You don't have permission for: ${permission}`,
    });
  }
  next();
};
