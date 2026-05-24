import Service from "../models/Service.model.js";

// ── GET /api/services ─────────────────────────────────────────
export const getServices = async (req, res) => {
  try {
    const filter = req.admin ? {} : { isActive: true }; // admin sees all
    const services = await Service.find(filter).sort({ order: 1, createdAt: 1 });
    res.json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── GET /api/services/:id ─────────────────────────────────────
export const getService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: "Service not found." });
    res.json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── POST /api/services ────────────────────────────────────────
export const createService = async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json({ success: true, data: service, message: "Service created successfully." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ── PUT /api/services/:id ─────────────────────────────────────
export const updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!service) return res.status(404).json({ success: false, message: "Service not found." });
    res.json({ success: true, data: service, message: "Service updated successfully." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ── DELETE /api/services/:id ──────────────────────────────────
export const deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: "Service not found." });
    res.json({ success: true, message: "Service deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
