import Contact from "../models/Contact.model.js";
import About from "../models/About.model.js";
import nodemailer from "nodemailer";

// ─────────────────────────────────────────────────────────────
// TRANSPORTER FACTORY
// Supports: Gmail, Outlook, Yahoo, SendGrid, Mailgun, custom SMTP
// Password/API key always comes from .env — never stored in DB
// ─────────────────────────────────────────────────────────────

const buildTransporter = (smtpConfig) => {
  const service = (
    smtpConfig?.service ||
    process.env.EMAIL_SERVICE ||
    "gmail"
  ).toLowerCase();
  const user = smtpConfig?.user || process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  // ── Gmail ─────────────────────────────────────────────────
  if (service === "gmail") {
    return nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });
  }

  // ── Outlook / Hotmail ─────────────────────────────────────
  if (service === "outlook" || service === "hotmail") {
    return nodemailer.createTransport({
      host: "smtp-mail.outlook.com",
      port: 587,
      secure: false,
      auth: { user, pass },
    });
  }

  // ── Yahoo ──────────────────────────────────────────────────
  if (service === "yahoo") {
    return nodemailer.createTransport({
      service: "yahoo",
      auth: { user, pass },
    });
  }

  // ── SendGrid ───────────────────────────────────────────────
  if (service === "sendgrid") {
    return nodemailer.createTransport({
      host: "smtp.sendgrid.net",
      port: 587,
      secure: false,
      auth: { user: "apikey", pass },
    });
  }

  // ── Mailgun ────────────────────────────────────────────────
  if (service === "mailgun") {
    return nodemailer.createTransport({
      host: process.env.MAILGUN_HOST || "smtp.mailgun.org",
      port: 587,
      secure: false,
      auth: { user, pass },
    });
  }

  // ── Custom SMTP — info@saleemiexpert.com via cPanel/Namecheap ──
  // DB config takes priority, falls back to .env
  const host =
    smtpConfig?.host ||
    process.env.EMAIL_HOST ||
    `mail.${(user || "").split("@")[1] || "yourdomain.com"}`;
  const port = smtpConfig?.port || Number(process.env.EMAIL_PORT) || 587;
  const secure =
    smtpConfig?.secure || process.env.EMAIL_SECURE === "true" || port === 465;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    tls: { rejectUnauthorized: false }, // needed for shared hosting
  });
};

// ─────────────────────────────────────────────────────────────
// GET NOTIFICATION RECIPIENTS
// Returns all email addresses that should receive contact emails
// Falls back to .env values if nothing in DB
// ─────────────────────────────────────────────────────────────
const getNotifyEmails = async () => {
  try {
    const about = await About.findOne();

    // Use notifyEmails array from DB if configured
    if (about?.notifyEmails?.length > 0) {
      return about.notifyEmails.map((e) => e.email).filter(Boolean);
    }

    // Fall back to owner email from About doc
    if (about?.email) return [about.email];

    // Final fallback — .env values
    const envEmails = [process.env.EMAIL_TO, process.env.EMAIL_USER].filter(
      Boolean,
    );
    return envEmails;
  } catch {
    return [process.env.EMAIL_TO || process.env.EMAIL_USER].filter(Boolean);
  }
};

// ─────────────────────────────────────────────────────────────
// VERIFY EMAIL SETUP ON STARTUP
// ─────────────────────────────────────────────────────────────
export const verifyEmailSetup = async () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log(
      "⚠️  Email not configured — set EMAIL_USER and EMAIL_PASS in .env",
    );
    return false;
  }
  try {
    const about = await About.findOne().catch(() => null);
    const transporter = buildTransporter(about?.smtpConfig);
    await transporter.verify();
    const recipients = await getNotifyEmails();
    console.log(
      `✅ Email ready (${about?.smtpConfig?.service || process.env.EMAIL_SERVICE || "gmail"})`,
    );
    console.log(`📬 Notifications → ${recipients.join(", ")}`);
    return true;
  } catch (err) {
    console.error("❌ Email setup failed:", err.message);
    console.error("   Check EMAIL_USER and EMAIL_PASS in .env");
    return false;
  }
};

// ─────────────────────────────────────────────────────────────
// EMAIL TEMPLATE
// ─────────────────────────────────────────────────────────────
const buildContactEmailHtml = ({
  name,
  email,
  subject,
  message,
  recipientCount,
}) => `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
  <div style="background:#050816;padding:24px">
    <h2 style="color:#22d3ee;margin:0 0 4px">📩 New Contact Message</h2>
    <p style="color:#9ca3af;margin:0;font-size:13px">From SaleemiExpert website${recipientCount > 1 ? ` · ${recipientCount} recipients` : ""}</p>
  </div>
  <div style="padding:24px;background:#ffffff">
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
      <tr style="border-bottom:1px solid #f3f4f6">
        <td style="padding:10px 0;color:#6b7280;font-size:14px;width:80px">Name</td>
        <td style="padding:10px 0;font-weight:600;color:#111827">${name}</td>
      </tr>
      <tr style="border-bottom:1px solid #f3f4f6">
        <td style="padding:10px 0;color:#6b7280;font-size:14px">Email</td>
        <td style="padding:10px 0"><a href="mailto:${email}" style="color:#06b6d4;font-weight:600">${email}</a></td>
      </tr>
      <tr>
        <td style="padding:10px 0;color:#6b7280;font-size:14px">Subject</td>
        <td style="padding:10px 0;font-weight:600;color:#111827">${subject}</td>
      </tr>
    </table>
    <div style="background:#f9fafb;padding:16px;border-radius:8px;border-left:4px solid #22d3ee">
      <p style="color:#6b7280;font-size:13px;margin:0 0 8px">Message:</p>
      <p style="color:#111827;line-height:1.7;margin:0">${message.replace(/\n/g, "<br>")}</p>
    </div>
    <div style="margin-top:16px;padding:12px;background:#f0fdf4;border-radius:8px;border:1px solid #bbf7d0">
      <p style="color:#166534;font-size:13px;margin:0">💡 Reply directly to this email to respond to ${name}</p>
    </div>
    <p style="color:#9ca3af;font-size:12px;margin-top:20px;border-top:1px solid #f3f4f6;padding-top:16px">
      Received: ${new Date().toLocaleString()}
    </p>
  </div>
</div>`;

// ─────────────────────────────────────────────────────────────
// POST /api/contact — Submit contact form
// ─────────────────────────────────────────────────────────────
export const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // 1. Save to DB first — message safe even if email fails
    const contact = await Contact.create({ name, email, subject, message });

    // 2. Send emails in background — don't block the response
    setImmediate(async () => {
      try {
        const about = await About.findOne();
        const transporter = buildTransporter(about?.smtpConfig);
        const recipients = await getNotifyEmails();

        if (!recipients.length) {
          console.warn("⚠️  No recipient emails configured");
          return;
        }

        const senderEmail = about?.smtpConfig?.user || process.env.EMAIL_USER;

        await transporter.sendMail({
          from: `"SaleemiExpert Website" <${senderEmail}>`,
          to: recipients, // ← array — all recipients get it at once
          replyTo: email, // ← reply goes directly to client
          subject: `📩 New Message: ${subject}`,
          html: buildContactEmailHtml({
            name,
            email,
            subject,
            message,
            recipientCount: recipients.length,
          }),
        });

        console.log(`✅ Contact email sent to: ${recipients.join(", ")}`);
      } catch (err) {
        console.error("❌ Failed to send contact email:", err.message);
      }
    });

    res.status(201).json({
      success: true,
      message:
        "Message sent successfully! I'll get back to you within 24 hours.",
      data: { id: contact._id },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to send message. Please try again.",
    });
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/contact — Get all messages (admin)
// ─────────────────────────────────────────────────────────────
export const getMessages = async (req, res) => {
  try {
    const { status } = req.query;
    let filter = status && status !== "all" ? { status } : {};

    // Superadmin sees ALL messages including unassigned
    // Others ONLY see messages explicitly assigned to them
    if (req.admin.role !== "superadmin") {
      filter = {
        ...filter,
        assignedTo: req.admin._id, // ONLY assigned to this specific user
      };
    }

    const messages = await Contact.find(filter).sort({ createdAt: -1 });
    const unreadCount = await Contact.countDocuments(
      req.admin.role === "superadmin"
        ? { status: "unread" }
        : { status: "unread", assignedTo: req.admin._id },
    );
    res.json({
      success: true,
      data: messages,
      unreadCount,
      isFiltered: req.admin.role !== "superadmin",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to load messages." });
  }
};

// ─────────────────────────────────────────────────────────────
// PUT /api/contact/:id/assign — Assign message to a team member (superadmin only)
// ─────────────────────────────────────────────────────────────
export const assignMessage = async (req, res) => {
  try {
    if (req.admin.role !== "superadmin") {
      return res.status(403).json({
        success: false,
        message: "Only super admin can assign messages.",
      });
    }
    const { assignedTo, assignedToName } = req.body;
    const msg = await Contact.findByIdAndUpdate(
      req.params.id,
      {
        assignedTo: assignedTo || null,
        assignedToName: assignedToName || null,
      },
      { new: true },
    );
    if (!msg)
      return res
        .status(404)
        .json({ success: false, message: "Message not found." });
    res.json({
      success: true,
      data: msg,
      message: assignedTo ? `Assigned to ${assignedToName}` : "Unassigned",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const updateMessageStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const msg = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );
    if (!msg)
      return res
        .status(404)
        .json({ success: false, message: "Message not found." });
    res.json({ success: true, data: msg });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to update status." });
  }
};

// ─────────────────────────────────────────────────────────────
// POST /api/contact/:id/reply — Reply to a message
// ─────────────────────────────────────────────────────────────
export const replyToMessage = async (req, res) => {
  try {
    const { replyText } = req.body;
    const msg = await Contact.findById(req.params.id);
    if (!msg)
      return res
        .status(404)
        .json({ success: false, message: "Message not found." });

    const about = await About.findOne();
    const transporter = buildTransporter(about?.smtpConfig);
    const senderEmail =
      req.admin?.smtpEmail || about?.smtpConfig?.user || process.env.EMAIL_USER;
    const senderName =
      req.admin?.smtpName || req.admin?.name || about?.name || "SaleemiExpert";

    await transporter.sendMail({
      from: `"${senderName}" <${senderEmail}>`,
      to: msg.email,
      subject: `Re: ${msg.subject}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
          <div style="background:#050816;padding:24px">
            <h2 style="color:#22d3ee;margin:0">${senderName}</h2>
          </div>
          <div style="padding:24px;background:#ffffff">
            <p style="color:#374151">Hi ${msg.name},</p>
            <div style="background:#f9fafb;padding:16px;border-radius:8px;border-left:4px solid #22d3ee;margin:16px 0">
              <p style="color:#111827;line-height:1.7;margin:0">${replyText.replace(/\n/g, "<br>")}</p>
            </div>
            <p style="color:#374151">Best regards,<br><strong>${senderName}</strong></p>
          </div>
        </div>`,
    });

    msg.reply = replyText;
    msg.status = "replied";
    msg.repliedAt = new Date();
    await msg.save();

    res.json({ success: true, data: msg, message: "Reply sent successfully." });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to send reply: " + error.message,
    });
  }
};

// ─────────────────────────────────────────────────────────────
// DELETE /api/contact/:id
// ─────────────────────────────────────────────────────────────
export const deleteMessage = async (req, res) => {
  try {
    const msg = await Contact.findByIdAndDelete(req.params.id);
    if (!msg)
      return res
        .status(404)
        .json({ success: false, message: "Message not found." });
    res.json({ success: true, message: "Message deleted." });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to delete message." });
  }
};

// ─────────────────────────────────────────────────────────────
// POST /api/contact/test-email — Send a test email (admin)
// ─────────────────────────────────────────────────────────────
export const sendTestEmail = async (req, res) => {
  try {
    const about = await About.findOne();
    const transporter = buildTransporter(about?.smtpConfig);
    const recipients = await getNotifyEmails();
    const senderEmail = about?.smtpConfig?.user || process.env.EMAIL_USER;

    if (!recipients.length) {
      return res.status(400).json({
        success: false,
        message:
          "No recipient emails configured. Add at least one email in Email Settings.",
      });
    }

    await transporter.sendMail({
      from: `"SaleemiExpert" <${senderEmail}>`,
      to: recipients,
      subject: "✅ Test Email — SaleemiExpert Email Setup Working",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
          <div style="background:#050816;padding:24px">
            <h2 style="color:#22d3ee;margin:0">✅ Email Setup Working!</h2>
          </div>
          <div style="padding:24px;background:#ffffff">
            <p style="color:#374151">Your SaleemiExpert email notifications are configured correctly.</p>
            <p style="color:#374151"><strong>Service:</strong> ${about?.smtpConfig?.service || "gmail"}</p>
            <p style="color:#374151"><strong>Sender:</strong> ${senderEmail}</p>
            <p style="color:#374151"><strong>Recipients (${recipients.length}):</strong> ${recipients.join(", ")}</p>
            <p style="color:#9ca3af;font-size:13px;margin-top:20px">Sent at ${new Date().toLocaleString()}</p>
          </div>
        </div>`,
    });

    res.json({ success: true, message: "Test email sent!", recipients });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Test failed: " + error.message });
  }
};

// ─────────────────────────────────────────────────────────────
// POST /api/contact/send-email — Send custom email to clients (admin)
// ─────────────────────────────────────────────────────────────
export const sendCustomEmail = async (req, res) => {
  try {
    const { recipients, subject, body } = req.body;

    if (!recipients?.length || !subject || !body) {
      return res.status(400).json({
        success: false,
        message: "Recipients, subject and body are required.",
      });
    }

    const about = await About.findOne();
    const transporter = buildTransporter(about?.smtpConfig);

    // Use sender's own email address if configured, else fall back to global
    const senderEmail =
      req.admin?.smtpEmail || about?.smtpConfig?.user || process.env.EMAIL_USER;
    const senderName =
      req.admin?.smtpName || req.admin?.name || about?.name || "SaleemiExpert";

    if (!senderEmail || !process.env.EMAIL_PASS) {
      return res.status(400).json({
        success: false,
        message: "Email not configured. Go to Email Settings first.",
      });
    }

    let status = "sent";
    let errorMsg = null;

    try {
      await transporter.sendMail({
        from: `"${senderName}" <${senderEmail}>`,
        to: recipients,
        subject: subject,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
            <div style="background:#050816;padding:24px">
              <h2 style="color:#22d3ee;margin:0">${senderName}</h2>
            </div>
            <div style="padding:28px;background:#ffffff">
              ${body.replace(/\n/g, "<br>")}
            </div>
            <div style="padding:16px 28px;background:#f9fafb;border-top:1px solid #e5e7eb">
              <p style="color:#9ca3af;font-size:12px;margin:0">Sent from ${senderName} · saleemiexpert.com</p>
            </div>
          </div>
        `,
      });
    } catch (mailErr) {
      status = "failed";
      errorMsg = mailErr.message;
    }

    // Always save record to database regardless of success/failure
    const SentEmail = (await import("../models/SentEmail.model.js")).default;
    const record = await SentEmail.create({
      recipients,
      subject,
      body,
      status,
      error: errorMsg,
      sentBy: req.admin?.name || "Admin",
      sentByEmail: req.admin?.email || "",
      sentById: req.admin?._id || null,
    });

    if (status === "failed") {
      return res.status(500).json({
        success: false,
        message: "Failed to send: " + errorMsg,
        record,
      });
    }

    res.json({
      success: true,
      message: `Email sent to ${recipients.length} recipient${recipients.length > 1 ? "s" : ""}!`,
      recipients,
      record,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error: " + error.message });
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/contact/sent-emails — Get sent email history (admin)
// ─────────────────────────────────────────────────────────────
export const getSentEmails = async (req, res) => {
  try {
    const SentEmail = (await import("../models/SentEmail.model.js")).default;

    // Superadmin sees ALL sent emails
    // Other users only see emails THEY sent
    const filter =
      req.admin.role === "superadmin" ? {} : { sentById: req.admin._id };

    const emails = await SentEmail.find(filter)
      .sort({ createdAt: -1 })
      .limit(100);
    res.json({
      success: true,
      data: emails,
      isFiltered: req.admin.role !== "superadmin",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────────────────────
// DELETE /api/contact/sent-emails/:id — Delete a sent email record
// ─────────────────────────────────────────────────────────────
export const deleteSentEmail = async (req, res) => {
  try {
    const SentEmail = (await import("../models/SentEmail.model.js")).default;
    const email = await SentEmail.findById(req.params.id);
    if (!email)
      return res
        .status(404)
        .json({ success: false, message: "Record not found." });

    // Only superadmin or the sender can delete
    const isSuperAdmin = req.admin.role === "superadmin";
    const isOwner = email.sentById?.toString() === req.admin._id.toString();

    if (!isSuperAdmin && !isOwner) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own email records.",
      });
    }

    await SentEmail.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Record deleted." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
