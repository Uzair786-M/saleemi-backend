import mongoose from "mongoose";

// Each reply in the conversation thread
const replySchema = new mongoose.Schema({
  text:        { type: String, required: true },
  sentBy:      { type: String },             // admin name
  sentByEmail: { type: String },             // admin email (the FROM address used)
  sentById:    { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  sentAt:      { type: Date, default: Date.now },
  direction:   { type: String, enum: ["outgoing", "incoming"], default: "outgoing" },
  // incoming = client replied back to the member's email
}, { _id: true });

const contactSchema = new mongoose.Schema({
  name:           { type: String, required: true, trim: true },
  email:          { type: String, required: true, lowercase: true, trim: true },
  subject:        { type: String, required: true, trim: true },
  message:        { type: String, required: true, trim: true },
  status:         { type: String, default: "unread", enum: ["unread", "read", "replied"] },

  // Legacy single reply field (kept for backward compat)
  reply:          { type: String },
  repliedAt:      { type: Date },

  // Full conversation thread
  replies:        [replySchema],

  // Assignment
  assignedTo:     { type: mongoose.Schema.Types.ObjectId, ref: "Admin", default: null },
  assignedToName: { type: String, default: null },
  assignedToEmail:{ type: String, default: null }, // member's smtpEmail - client replies go here
}, { timestamps: true });

export default mongoose.model("Contact", contactSchema);
