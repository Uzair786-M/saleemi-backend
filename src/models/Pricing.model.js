import mongoose from "mongoose";

const pricingSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  price:       { type: String, required: true },
  duration:    { type: String },
  desc:        { type: String },
  popular:     { type: Boolean, default: false },
  color:       { type: String, default: "#06b6d4" },
  features:    [{ type: String }],
  notIncluded: [{ type: String }],
  order:       { type: Number, default: 0 },
  isActive:    { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model("Pricing", pricingSchema);
