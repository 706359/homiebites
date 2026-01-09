import express from "express";
import { authenticate, isAdmin } from "../middleware/auth.js";
import Review from "../models/Review.js";

const router = express.Router();

// GET /api/reviews - public
// Query params: featured (boolean), limit (number)
router.get("/", async (req, res) => {
  try {
    const featured = req.query.featured === "true";
    const limit = parseInt(req.query.limit || "10");

    // Build query - only show approved reviews
    const query = { isApproved: true };
    if (featured) {
      query.featured = true;
    }

    const reviews = await Review.find(query)
      .sort({ createdAt: -1 }) // Most recent first
      .limit(limit)
      .lean();

    return res.json({ success: true, data: reviews });
  } catch (error) {
    console.error("GET /api/reviews error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to fetch reviews" });
  }
});

// POST /api/reviews - public (create review, requires admin approval)
router.post("/", async (req, res) => {
  try {
    const { userName, userEmail, userPhone, userLocation, rating, comment } =
      req.body;

    // Validation
    if (!userName || !rating || !comment) {
      return res.status(400).json({
        success: false,
        error: "Name, rating, and comment are required",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: "Rating must be between 1 and 5",
      });
    }

    // Create review (not approved by default)
    const review = new Review({
      userName,
      userEmail,
      userPhone,
      userLocation,
      rating: parseInt(rating),
      comment,
      isApproved: false, // Requires admin approval
      featured: false,
    });

    await review.save();

    return res.json({
      success: true,
      message: "Review submitted successfully. It will be published after admin approval.",
      data: review,
    });
  } catch (error) {
    console.error("POST /api/reviews error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to create review" });
  }
});

// PUT /api/reviews/:id - admin only (update review, approve, feature)
router.put("/:id", authenticate, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const review = await Review.findByIdAndUpdate(id, updates, {
      new: true,
    }).lean();

    if (!review) {
      return res
        .status(404)
        .json({ success: false, error: "Review not found" });
    }

    return res.json({ success: true, data: review });
  } catch (error) {
    console.error("PUT /api/reviews/:id error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to update review" });
  }
});

// DELETE /api/reviews/:id - admin only
router.delete("/:id", authenticate, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findByIdAndDelete(id);

    if (!review) {
      return res
        .status(404)
        .json({ success: false, error: "Review not found" });
    }

    return res.json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/reviews/:id error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to delete review" });
  }
});

export default router;
