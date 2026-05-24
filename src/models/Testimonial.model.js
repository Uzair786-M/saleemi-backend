import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    title: { type: String, trim: true },
    review: { type: String, required: true, trim: true },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    // ── Public submission fields ──────────────────────────────
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
    },
    // "approved" = manually added by admin (always show)
    // "pending"  = submitted by client (needs approval)
    // "rejected" = rejected by admin (never show)
    source: { type: String, enum: ["admin", "public"], default: "admin" },
    // Client info for public submissions
    email: { type: String, trim: true, lowercase: true },
    project: { type: String, trim: true }, // what project did they hire you for
  },
  { timestamps: true },
);

export default mongoose.model("Testimonial", testimonialSchema);
