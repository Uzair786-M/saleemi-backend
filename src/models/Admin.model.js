import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export const ALL_PERMISSIONS = [
  "dashboard", "messages", "mailbox", "reviews", "testimonials",
  "portfolio", "services", "about", "stats", "pricing",
  "email_settings", "settings", "team",
];

const adminSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  email:       { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:    { type: String, required: true },
  role:        { type: String, default: "admin", enum: ["superadmin", "admin", "member"] },
  permissions: { type: [String], default: ["dashboard", "messages"] },
  isActive:    { type: Boolean, default: true },
  // Each member sends emails from their own address
  // Password stored in .env as EMAIL_PASS_<USERID> or falls back to global EMAIL_PASS
  smtpEmail:      { type: String, default: "" },
  smtpName:       { type: String, default: "" },
  smtpPassEnvKey: { type: String, default: "" }, // e.g. "EMAIL_PASS_ASIF" → process.env["EMAIL_PASS_ASIF"]
}, { timestamps: true });

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

adminSchema.methods.comparePassword = async function (pw) {
  return bcrypt.compare(pw, this.password);
};

export default mongoose.model("Admin", adminSchema);
