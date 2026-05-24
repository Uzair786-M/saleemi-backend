import Pricing from "../models/Pricing.model.js";

// ── GET /api/pricing ──────────────────────────────────────────
export const getPricing = async (req, res) => {
  try {
    const filter = req.admin ? {} : { isActive: true };
    const items  = await Pricing.find(filter).sort({ order: 1, createdAt: 1 });
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── POST /api/pricing ─────────────────────────────────────────
export const createPricing = async (req, res) => {
  try {
    // Only one package can be "popular"
    if (req.body.popular) {
      await Pricing.updateMany({}, { popular: false });
    }
    const item = await Pricing.create(req.body);
    res.status(201).json({ success: true, data: item, message: "Package created." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ── PUT /api/pricing/:id ──────────────────────────────────────
export const updatePricing = async (req, res) => {
  try {
    if (req.body.popular) {
      await Pricing.updateMany({ _id: { $ne: req.params.id } }, { popular: false });
    }
    const item = await Pricing.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ success: false, message: "Package not found." });
    res.json({ success: true, data: item, message: "Package updated." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ── DELETE /api/pricing/:id ───────────────────────────────────
export const deletePricing = async (req, res) => {
  try {
    const item = await Pricing.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Package not found." });
    res.json({ success: true, message: "Package deleted." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
