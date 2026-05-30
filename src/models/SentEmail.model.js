import mongoose from "mongoose";

const sentEmailSchema = new mongoose.Schema({
  recipients: [{ type: String }],          // array of email addresses
  subject:    { type: String, required: true },
  body:       { type: String, required: true },
  status:     { type: String, enum: ["sent", "failed"], default: "sent" },
  error:      { type: String },            // error message if failed
  sentBy:     { type: String },            // admin name
  sentAt:     { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model("SentEmail", sentEmailSchema);
