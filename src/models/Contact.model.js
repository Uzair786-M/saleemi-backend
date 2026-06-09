import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    status: {
      type: String,
      default: "unread",
      enum: ["unread", "read", "replied"],
    },
    reply: { type: String },
    repliedAt: { type: Date },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
    assignedToName: { type: String, default: null },
    repliedAt: { type: Date },
  },
  { timestamps: true },
);

export default mongoose.model("Contact", contactSchema);
