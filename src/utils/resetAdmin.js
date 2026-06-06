import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected");

  // Get the Admin collection directly — bypass model to avoid any pre-save issues
  const db = mongoose.connection.db;
  const col = db.collection("admins");

  // Delete all admins
  await col.deleteMany({});
  console.log("🗑️  Deleted all admins");

  // Hash password manually
  const hash = await bcrypt.hash("Admin@123", 10);

  // Insert directly
  await col.insertOne({
    name: "Haroon Saleem",
    email: "admin@saleemiexpert.com",
    password: hash,
    role: "superadmin",
    permissions: [
      "dashboard",
      "messages",
      "mailbox",
      "reviews",
      "testimonials",
      "portfolio",
      "services",
      "about",
      "stats",
      "pricing",
      "email_settings",
      "settings",
      "team",
    ],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  console.log("\n✅ Admin created successfully!");
  console.log("📧 Email:    admin@saleemiexpert.com");
  console.log("🔑 Password: Admin@123");

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error("❌", err.message);
  process.exit(1);
});
