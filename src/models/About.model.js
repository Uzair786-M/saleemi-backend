import mongoose from "mongoose";

const aboutSchema = new mongoose.Schema({
  name:      { type: String, default: "SaleemiExpert" },
  title:     { type: String, default: "Shopify & WooCommerce Specialist" },
  tagline:   { type: String },
  bio:       { type: String },
  bio2:      { type: String },
  email:     { type: String },
  whatsapp:  { type: String },
  location:  { type: String },
  photo:     { type: String },
  cvUrl:     { type: String },
  available: { type: Boolean, default: true },

  // ── Hero Stats ────────────────────────────────────────────
  stats: [{
    value:  { type: Number, default: 0 },
    suffix: { type: String, default: "+" },
    label:  { type: String },
    icon:   { type: String, default: "🚀" },
  }],

  // ── Pricing FAQs ──────────────────────────────────────────
  faqs: [{
    question: { type: String },
    answer:   { type: String },
  }],

  // ── Notification emails ───────────────────────────────────
  notifyEmails: [{
    email: { type: String, required: true, lowercase: true, trim: true },
    label: { type: String, default: "Email" },
  }],

  // ── SMTP config ───────────────────────────────────────────
  smtpConfig: {
    service: { type: String, default: "gmail" },
    host:    { type: String },
    port:    { type: Number },
    secure:  { type: Boolean, default: false },
    user:    { type: String },
  },

  // ── Social links ──────────────────────────────────────────
  socialLinks: [{
    label: { type: String, required: true },
    url:   { type: String, required: true },
    icon:  { type: String, default: "🔗" },
    color: { type: String, default: "#22d3ee" },
  }],

  // ── Skills ────────────────────────────────────────────────
  skills: [{
    category: { type: String },
    items: [{ name: { type: String }, level: { type: Number, min: 0, max: 100 } }],
  }],

  // ── Timeline ──────────────────────────────────────────────
  timeline: [{
    year:    { type: String },
    role:    { type: String },
    company: { type: String },
    desc:    { type: String },
  }],

  // ── Certifications ────────────────────────────────────────
  certifications: [{
    name:   { type: String },
    issuer: { type: String },
    year:   { type: String },
  }],

  // ── Footer Services ───────────────────────────────────────
  footerServices: [{
    label: { type: String },
    url:   { type: String, default: "/services" },
  }],

}, { timestamps: true });

export default mongoose.model("About", aboutSchema);
