import mongoose from "mongoose";

const sentEmailSchema = new mongoose.Schema(
  {
    recipients: [{ type: String }],
    subject: { type: String, required: true },
    body: { type: String, required: true },
    status: { type: String, enum: ["sent", "failed"], default: "sent" },
    error: { type: String },
    sentBy: { type: String }, // admin name
    sentByEmail: { type: String }, // admin email — used for filtering
    sentById: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" }, // for exact match
  },
  { timestamps: true },
);

export default mongoose.model("SentEmail", sentEmailSchema);
