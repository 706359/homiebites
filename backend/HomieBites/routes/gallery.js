import express from "express";
import { authenticate, isAdmin } from "../middleware/auth.js";
import Gallery from "../models/Gallery.js";

const router = express.Router();

// GET /api/gallery - public (get all active gallery items)
router.get("/", async (req, res) => {
  try {
    const galleryItems = await Gallery.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 }) // Sort by order, then by creation date
      .lean();

    return res.json({ success: true, data: galleryItems });
  } catch (error) {
    console.error("GET /api/gallery error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to fetch gallery items" });
  }
});

// POST /api/gallery - admin only (create gallery item)
router.post("/", authenticate, isAdmin, async (req, res) => {
  try {
    const { name, imageUrl, alt, caption, price, category, order, isActive } =
      req.body;

    // Validation
    if (!name || !imageUrl) {
      return res.status(400).json({
        success: false,
        error: "Name and imageUrl are required",
      });
    }

    const galleryItem = new Gallery({
      name,
      imageUrl,
      alt: alt || name,
      caption: caption || "",
      price: price || null,
      category: category || null,
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true,
    });

    await galleryItem.save();

    return res.json({
      success: true,
      message: "Gallery item created successfully",
      data: galleryItem,
    });
  } catch (error) {
    console.error("POST /api/gallery error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to create gallery item" });
  }
});

// PUT /api/gallery/:id - admin only (update gallery item)
router.put("/:id", authenticate, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const galleryItem = await Gallery.findByIdAndUpdate(id, updates, {
      new: true,
    }).lean();

    if (!galleryItem) {
      return res
        .status(404)
        .json({ success: false, error: "Gallery item not found" });
    }

    return res.json({
      success: true,
      message: "Gallery item updated successfully",
      data: galleryItem,
    });
  } catch (error) {
    console.error("PUT /api/gallery/:id error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to update gallery item" });
  }
});

// DELETE /api/gallery/:id - admin only (delete gallery item)
router.delete("/:id", authenticate, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const galleryItem = await Gallery.findByIdAndDelete(id);

    if (!galleryItem) {
      return res
        .status(404)
        .json({ success: false, error: "Gallery item not found" });
    }

    return res.json({
      success: true,
      message: "Gallery item deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /api/gallery/:id error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to delete gallery item" });
  }
});

// PUT /api/gallery/bulk-update - admin only (update multiple items, e.g., reordering)
router.put("/bulk-update", authenticate, isAdmin, async (req, res) => {
  try {
    const { items } = req.body; // Array of { id, order, isActive, ... }

    if (!Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        error: "Items must be an array",
      });
    }

    const updatePromises = items.map((item) =>
      Gallery.findByIdAndUpdate(item.id, { ...item }, { new: true })
    );

    await Promise.all(updatePromises);

    return res.json({
      success: true,
      message: "Gallery items updated successfully",
    });
  } catch (error) {
    console.error("PUT /api/gallery/bulk-update error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to update gallery items" });
  }
});

export default router;

