// Direct SMTP test - bypasses the whole app
// Run: node src/utils/testSmtp.js
import "dotenv/config";
import nodemailer from "nodemailer";

const run = async () => {
  console.log("Testing SMTP with:");
  console.log("  HOST:", process.env.EMAIL_HOST);
  console.log("  PORT:", process.env.EMAIL_PORT);
  console.log("  USER:", process.env.EMAIL_USER);
  console.log("  PASS length:", process.env.EMAIL_PASS?.length, "chars");
  console.log("  SECURE:", process.env.EMAIL_SECURE);
  console.log("");

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    debug: true,
    logger: true,
  });

  try {
    await transporter.verify();
    console.log("\n✅ SMTP CONNECTION SUCCESSFUL");

    // Try sending a test email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "SMTP Test",
      text: "This is a test email from SaleemiExpert backend.",
    });
    console.log("✅ EMAIL SENT:", info.messageId);
  } catch (err) {
    console.log("\n❌ ERROR:", err.message);
    console.log("Full error:", JSON.stringify(err, null, 2));
  }
};

run();
