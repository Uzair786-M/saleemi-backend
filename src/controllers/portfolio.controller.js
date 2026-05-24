import Portfolio from "../models/Portfolio.model.js";

// ── GET /api/portfolio ────────────────────────────────────────
export const getPortfolio = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = req.admin ? {} : { isActive: true };
    if (category && category !== "All") filter.category = category;
    const items = await Portfolio.find(filter).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── GET /api/portfolio/:id ────────────────────────────────────
export const getPortfolioItem = async (req, res) => {
  try {
    const item = await Portfolio.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Project not found." });
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── POST /api/portfolio ───────────────────────────────────────
export const createPortfolioItem = async (req, res) => {
  try {
    const item = await Portfolio.create(req.body);
    res.status(201).json({ success: true, data: item, message: "Project created successfully." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ── PUT /api/portfolio/:id ────────────────────────────────────
export const updatePortfolioItem = async (req, res) => {
  try {
    const item = await Portfolio.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ success: false, message: "Project not found." });
    res.json({ success: true, data: item, message: "Project updated successfully." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ── DELETE /api/portfolio/:id ─────────────────────────────────
export const deletePortfolioItem = async (req, res) => {
  try {
    const item = await Portfolio.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Project not found." });
    res.json({ success: true, message: "Project deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
