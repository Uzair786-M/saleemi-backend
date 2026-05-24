import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  category:    { type: String, required: true, enum: ["E-commerce", "Automation", "Web Development"] },
  description: { type: String, required: true, trim: true },
  tags:        [{ type: String, trim: true }],
  result:      { type: String, trim: true },
  duration:    { type: String, trim: true },
  color:       { type: String, default: "from-cyan-500/30 to-blue-500/10" },
  image:       { type: String },
  order:       { type: Number, default: 0 },
  isActive:    { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model("Portfolio", portfolioSchema);
