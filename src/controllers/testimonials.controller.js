import Testimonial from "../models/Testimonial.model.js";

// ── GET /api/testimonials — public ────────────────────────────
// Returns only approved testimonials to the public site
export const getTestimonials = async (req, res) => {
  try {
    const filter = req.admin
      ? {} // admin sees all
      : { isActive: true, status: { $in: ["approved", undefined] } }; // public sees approved only

    const items = await Testimonial.find(filter).sort({
      order: 1,
      createdAt: -1,
    });
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── GET /api/testimonials/pending — admin only ─────────────────
// Returns pending reviews waiting for approval
export const getPendingTestimonials = async (req, res) => {
  try {
    const items = await Testimonial.find({ status: "pending" }).sort({
      createdAt: -1,
    });
    const count = await Testimonial.countDocuments({ status: "pending" });
    res.json({ success: true, data: items, pendingCount: count });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── POST /api/testimonials/submit — public ────────────────────
// Called from the public Leave a Review form
export const submitReview = async (req, res) => {
  try {
    const { name, title, email, project, review, rating } = req.body;

    if (!name?.trim() || !review?.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Name and review are required." });
    }
    if (review.trim().length < 20) {
      return res.status(400).json({
        success: false,
        message: "Review must be at least 20 characters.",
      });
    }

    const item = await Testimonial.create({
      name: name.trim(),
      title: title?.trim() || "",
      email: email?.trim()?.toLowerCase() || "",
      project: project?.trim() || "",
      review: review.trim(),
      rating: Math.min(5, Math.max(1, Number(rating) || 5)),
      status: "pending", // ← always pending until admin approves
      source: "public",
      isActive: false, // not shown until approved
    });

    res.status(201).json({
      success: true,
      message:
        "Thank you for your review! It will be published after approval.",
      data: { id: item._id },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to submit review. Please try again.",
    });
  }
};

// ── PUT /api/testimonials/:id/approve — admin ──────────────────
export const approveTestimonial = async (req, res) => {
  try {
    const item = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { status: "approved", isActive: true },
      { new: true },
    );
    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "Review not found." });
    res.json({
      success: true,
      data: item,
      message: "Review approved and published!",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── PUT /api/testimonials/:id/reject — admin ───────────────────
export const rejectTestimonial = async (req, res) => {
  try {
    const item = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { status: "rejected", isActive: false },
      { new: true },
    );
    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "Review not found." });
    res.json({ success: true, data: item, message: "Review rejected." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── POST /api/testimonials — admin add ─────────────────────────
export const createTestimonial = async (req, res) => {
  try {
    const item = await Testimonial.create({
      ...req.body,
      status: "approved", // admin-added always approved
      source: "admin",
      isActive: true,
    });
    res
      .status(201)
      .json({ success: true, data: item, message: "Testimonial created." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ── PUT /api/testimonials/:id — admin update ──────────────────
export const updateTestimonial = async (req, res) => {
  try {
    const item = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "Testimonial not found." });
    res.json({ success: true, data: item, message: "Testimonial updated." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ── DELETE /api/testimonials/:id — admin ──────────────────────
export const deleteTestimonial = async (req, res) => {
  try {
    const item = await Testimonial.findByIdAndDelete(req.params.id);
    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "Testimonial not found." });
    res.json({ success: true, message: "Testimonial deleted." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
