import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  icon:      { type: String, default: "⚡" },
  title:     { type: String, required: true, trim: true },
  shortDesc: { type: String, required: true, trim: true },
  fullDesc:  { type: String, trim: true },
  features:  [{ type: String, trim: true }],
  order:     { type: Number, default: 0 },
  isActive:  { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model("Service", serviceSchema);
