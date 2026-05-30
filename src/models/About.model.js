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

  // ── Hero stats — animated counter on homepage ─────────────
  stats: [{
    value:  { type: Number, default: 0 },   // numeric value e.g. 100
    suffix: { type: String, default: "+" }, // e.g. "+" or "/7" or "%"
    label:  { type: String },               // e.g. "Projects Completed"
    icon:   { type: String, default: "🚀" },
  }],

  // ── Notification emails — all receive contact form emails ─
  // e.g. [ { email: "you@gmail.com", label: "Main" }, { email: "info@saleemiexpert.com", label: "Business" } ]
  notifyEmails: [{
    email: { type: String, required: true, lowercase: true, trim: true },
    label: { type: String, default: "Email" },
  }],

  // ── SMTP transporter config (stored encrypted-at-rest via env) ─
  // Supports: gmail, outlook, yahoo, custom SMTP, SendGrid, Mailgun
  smtpConfig: {
    service:  { type: String, default: "gmail" }, // gmail | outlook | yahoo | custom | sendgrid | mailgun
    host:     { type: String },    // for custom SMTP
    port:     { type: Number },    // for custom SMTP
    secure:   { type: Boolean, default: false },
    user:     { type: String },    // sender email / API user
    // ⚠ password/key stored in .env only — never in DB
  },

  // ── Dynamic social links ───────────────────────────────────
  socialLinks: [{
    label: { type: String, required: true },
    url:   { type: String, required: true },
    icon:  { type: String, default: "🔗" },
    color: { type: String, default: "#22d3ee" },
  }],

  skills: [{
    category: { type: String },
    items: [{ name: { type: String }, level: { type: Number, min: 0, max: 100 } }],
  }],

  timeline: [{
    year:    { type: String },
    role:    { type: String },
    company: { type: String },
    desc:    { type: String },
  }],

  certifications: [{
    name:   { type: String },
    issuer: { type: String },
    year:   { type: String },
  }],
}, { timestamps: true });

export default mongoose.model("About", aboutSchema);
