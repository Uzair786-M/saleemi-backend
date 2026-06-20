import About from "../models/About.model.js";

// ── GET /api/about ────────────────────────────────────────────
export const getAbout = async (req, res) => {
  try {
    // Always get the first (and only) document
    let about = await About.findOne();
    if (!about) {
      // Create default if doesn't exist
      about = await About.create({
        name:     "SaleemiExpert",
        title:    "Shopify & WooCommerce Specialist",
        available: true,
      });
    }
    res.json({ success: true, data: about });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── PUT /api/about ────────────────────────────────────────────
export const updateAbout = async (req, res) => {
  try {
    let about = await About.findOne();
    if (!about) {
      about = await About.create(req.body);
    } else {
      about = await About.findByIdAndUpdate(about._id, req.body, { new: true, runValidators: false });
    }
    res.json({ success: true, data: about, message: "About page updated successfully." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ── GET /api/about/faqs ───────────────────────────────────────
export const getFaqs = async (req, res) => {
  try {
    const about = await About.findOne().select("faqs");
    res.json({ success: true, data: about?.faqs || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── PUT /api/about/faqs ───────────────────────────────────────
export const updateFaqs = async (req, res) => {
  try {
    const { faqs } = req.body;
    if (!Array.isArray(faqs)) {
      return res.status(400).json({ success: false, message: "faqs must be an array." });
    }
    let about = await About.findOne();
    if (!about) about = await About.create({ faqs });
    else {
      about.faqs = faqs;
      await about.save();
    }
    res.json({ success: true, data: about.faqs, message: "FAQs updated successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
