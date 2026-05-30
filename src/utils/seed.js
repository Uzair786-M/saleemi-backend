import "dotenv/config";
import mongoose      from "mongoose";
import connectDB     from "../config/db.js";
import Admin         from "../models/Admin.model.js";
import Service       from "../models/Service.model.js";
import Portfolio     from "../models/Portfolio.model.js";
import Testimonial   from "../models/Testimonial.model.js";
import About         from "../models/About.model.js";
import Pricing       from "../models/Pricing.model.js";

// ── Seed Data ─────────────────────────────────────────────────

const adminData = {
  name:     process.env.ADMIN_NAME     || "Saleemi Admin",
  email:    process.env.ADMIN_EMAIL    || "admin@saleemiexpert.com",
  password: process.env.ADMIN_PASSWORD || "admin123",
  role:     "admin",
};

const servicesData = [
  { icon: "🌐", title: "Website Development",  shortDesc: "Modern responsive websites built with clean UI, performance and scalability in mind.",   fullDesc: "We build fast, modern, and responsive websites tailored to your business needs.",      features: ["Custom responsive design", "SEO-optimized structure", "Performance-first architecture", "CMS integration", "Cross-browser compatibility"], order: 1 },
  { icon: "⚡", title: "Digital Solutions",     shortDesc: "Professional digital services focused on business growth and online presence.",           fullDesc: "End-to-end digital solutions including e-commerce setup and CSV automation.",           features: ["Shopify & WooCommerce setup", "Bulk product uploads via CSV", "Variant & inventory mapping", "Automation workflows", "Platform migrations"],   order: 2 },
  { icon: "🎨", title: "Creative Design",       shortDesc: "Creative UI/UX design solutions with modern layouts and interactive experiences.",        fullDesc: "Visually compelling interfaces that convert visitors into customers.",                   features: ["UI/UX wireframing & prototyping", "Brand identity design", "Landing page design", "Figma deliverables"],                                     order: 3 },
  { icon: "📈", title: "Business Growth",       shortDesc: "Helping brands improve visibility, engagement and customer experience online.",           fullDesc: "Boost online visibility through targeted strategies and data-driven decisions.",         features: ["Conversion rate optimization", "Digital marketing strategy", "Analytics & reporting", "Competitive analysis"],                                order: 4 },
];

const portfolioData = [
  { title: "5000+ Shopify Products Upload",  category: "E-commerce",      description: "Managed and uploaded over 5,000 product listings to a Shopify store with images, variants, and SEO metadata.", tags: ["Shopify", "CSV", "Data Management"], result: "Saved client 120+ hours of manual work", duration: "4 days",  order: 1 },
  { title: "WooCommerce CSV Import System",  category: "Automation",       description: "Built a streamlined CSV import pipeline for WooCommerce handling complex attributes and inventory syncing.",    tags: ["WooCommerce", "PHP", "Automation"],  result: "Reduced import time by 85%",            duration: "6 days",  order: 2 },
  { title: "Variant Mapping Store",          category: "E-commerce",      description: "Custom variant mapping for a fashion brand across sizes, colors, and materials.",                               tags: ["Shopify", "Variant Mapping"],        result: "Zero inventory errors post-launch",     duration: "5 days",  order: 3 },
  { title: "Bulk Product Automation",        category: "Automation",       description: "Automated bulk product management syncing inventory, pricing across multiple platforms.",                       tags: ["Python", "API", "Automation"],       result: "Automated 10,000+ SKUs",                duration: "10 days", order: 4 },
  { title: "Custom Shopify Theme",           category: "Web Development", description: "Custom Shopify theme with unique animations, fast load times, and mobile-first design.",                       tags: ["Shopify", "Liquid", "CSS"],          result: "40% increase in conversion rate",        duration: "12 days", order: 5 },
  { title: "Multi-Vendor Marketplace",       category: "Web Development", description: "Multi-vendor marketplace with vendor onboarding, commission management, and order routing.",                   tags: ["WooCommerce", "PHP", "MySQL"],       result: "Launched with 15 vendors on day 1",     duration: "14 days", order: 6 },
];

const testimonialsData = [
  { name: "John Smith",   title: "Store Owner, USA",                rating: 5, review: "Excellent work on Shopify product uploads. Very professional and fast delivery.",                               order: 1 },
  { name: "Sarah Wilson", title: "E-commerce Manager, UK",          rating: 5, review: "Amazing communication and perfectly handled CSV variants for our store. Saved us days of manual work.",          order: 2 },
  { name: "David Lee",    title: "Entrepreneur, Canada",            rating: 5, review: "Highly recommended for WooCommerce bulk uploads and customization. Delivered beyond expectations.",               order: 3 },
  { name: "Emma Johnson", title: "Digital Agency Owner, Australia", rating: 5, review: "Outstanding web development skills. The website looks fantastic and loads super fast.",                          order: 4 },
  { name: "Ahmed Hassan", title: "Retail Brand, UAE",               rating: 5, review: "Professional, reliable and highly skilled. Managed our entire product catalog migration flawlessly.",            order: 5 },
  { name: "Maria Garcia", title: "Fashion Boutique, Spain",         rating: 5, review: "The variant mapping solution was exactly what we needed. Clean code, great communication, on time.",             order: 6 },
];

const pricingData = [
  { name: "Basic",    price: "$49",  duration: "3–5 Days",   desc: "Perfect for small tasks and quick fixes.", popular: false, color: "#6b7280", features: ["Up to 100 product uploads", "Basic CSV formatting", "1 platform", "Image optimization", "1 revision", "Email support"], notIncluded: ["Variant mapping", "Automation scripts"], order: 1 },
  { name: "Standard", price: "$149", duration: "5–7 Days",   desc: "Most popular — ideal for growing stores.", popular: true,  color: "#06b6d4", features: ["Up to 1,000 product uploads", "Advanced CSV management", "Variant mapping", "2 platforms", "SEO metadata", "3 revisions", "Priority support"], notIncluded: ["Custom automation"], order: 2 },
  { name: "Premium",  price: "$349", duration: "7–14 Days",  desc: "Full-service for large stores.",           popular: false, color: "#8b5cf6", features: ["Unlimited product uploads", "Full CSV automation", "Complex variant mapping", "Multi-platform", "Custom scripts", "Website development", "Unlimited revisions", "24/7 WhatsApp support"], notIncluded: [], order: 3 },
];

const aboutData = {
  name:      "SaleemiExpert",
  title:     "Shopify & WooCommerce Specialist",
  tagline:   "E-commerce Expert | CSV & Bulk Product Automation | Web Developer",
  bio:       "I'm a freelance e-commerce specialist with 5+ years of experience helping businesses grow their online stores. I specialize in Shopify and WooCommerce product management, bulk CSV uploads, variant mapping, and modern web development.",
  bio2:      "I've worked with 50+ clients across USA, UK, UAE, Canada and Australia — delivering fast, accurate, and professional digital solutions.",
  email:     "info@saleemiexpert.com",
  whatsapp:  "+923001234567",
  location:  "Pakistan (Available Worldwide)",
  available: true,
  stats: [
    { value: 100, suffix: "+", label: "Projects Completed", icon: "🚀" },
    { value: 5,   suffix: "+", label: "Years Experience",   icon: "⭐" },
    { value: 24,  suffix: "/7",label: "Support Available",  icon: "🕐" },
    { value: 50,  suffix: "+", label: "Happy Clients",      icon: "🤝" },
  ],
  socialLinks: [
    { label: "Fiverr",   url: "https://fiverr.com/YOUR_USERNAME",              icon: "🟢", color: "#1dbf73" },
    { label: "Upwork",   url: "https://upwork.com/freelancers/YOUR_USERNAME",  icon: "🟩", color: "#14a800" },
    { label: "LinkedIn", url: "https://linkedin.com/in/YOUR_USERNAME",         icon: "💼", color: "#0a66c2" },
    { label: "GitHub",   url: "https://github.com/YOUR_USERNAME",              icon: "🐙", color: "#6e40c9" },
  ],
  skills: [
    { category: "E-commerce Platforms", items: [{ name: "Shopify", level: 95 }, { name: "WooCommerce", level: 92 }, { name: "WordPress", level: 85 }] },
    { category: "Data & Automation",    items: [{ name: "CSV Management", level: 98 }, { name: "Bulk Product Upload", level: 97 }, { name: "Variant Mapping", level: 93 }] },
    { category: "Web Development",      items: [{ name: "React.js", level: 82 }, { name: "HTML / CSS", level: 90 }, { name: "JavaScript", level: 85 }] },
  ],
  timeline: [
    { year: "2024 – Present", role: "Senior Freelance E-commerce Specialist", company: "SaleemiExpert (Global Clients)",    desc: "Managing Shopify & WooCommerce stores, bulk automation, and web development for global clients." },
    { year: "2022 – 2024",    role: "E-commerce Manager",                      company: "Digital Commerce Agency",           desc: "Led product data migrations, 50,000+ uploads, CSV automation for 20+ clients." },
    { year: "2020 – 2022",    role: "Shopify Developer & Data Analyst",         company: "Freelance (Fiverr & Upwork)",       desc: "Shopify store setup, variant mapping, WooCommerce customization for international clients." },
    { year: "2019 – 2020",    role: "Web Developer",                            company: "Local IT Company, Pakistan",        desc: "Built WordPress websites and developed e-commerce fundamentals." },
  ],
  certifications: [
    { name: "Shopify Partner Certified", issuer: "Shopify",      year: "2023" },
    { name: "Google Digital Marketing",  issuer: "Google",       year: "2022" },
    { name: "WooCommerce Developer",     issuer: "WooCommerce",  year: "2022" },
    { name: "JavaScript Algorithms",     issuer: "freeCodeCamp", year: "2021" },
  ],
};

// ── Run Seed ─────────────────────────────────────────────────
const seed = async () => {
  try {
    await connectDB();
    console.log("\n🌱 Starting database seed...\n");

    // Clear existing data
    await Promise.all([
      Admin.deleteMany({}),
      Service.deleteMany({}),
      Portfolio.deleteMany({}),
      Testimonial.deleteMany({}),
      About.deleteMany({}),
      Pricing.deleteMany({}),
    ]);
    console.log("🗑️  Cleared existing data");

    // Seed all collections
    const admin = await Admin.create(adminData);
    console.log(`✅ Admin created: ${admin.email}`);

    await Service.insertMany(servicesData);
    console.log(`✅ Services seeded: ${servicesData.length} items`);

    await Portfolio.insertMany(portfolioData);
    console.log(`✅ Portfolio seeded: ${portfolioData.length} items`);

    await Testimonial.insertMany(testimonialsData);
    console.log(`✅ Testimonials seeded: ${testimonialsData.length} items`);

    await Pricing.insertMany(pricingData);
    console.log(`✅ Pricing seeded: ${pricingData.length} packages`);

    await About.create(aboutData);
    console.log(`✅ About page seeded`);

    console.log("\n🎉 Database seeded successfully!\n");
    console.log("─────────────────────────────────");
    console.log(`📧 Admin Email:    ${adminData.email}`);
    console.log(`🔑 Admin Password: ${adminData.password}`);
    console.log("─────────────────────────────────\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error.message);
    process.exit(1);
  }
};

seed();
