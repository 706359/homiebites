import express from "express";
import { authenticate, isAdmin } from "../middleware/auth.js";
import Offer from "../models/Offers.js";

const router = express.Router();

// GET /api/offers - public (only active offers returned)
router.get("/", async (req, res) => {
  try {
    const now = new Date();
    const offers = await Offer.find({ isActive: true }).lean();
    const active = offers.filter(
      (o) => !o.endDate || new Date(o.endDate) >= now,
    );
    // Format dates to DD-MMM-YYYY (e.g., 09-Jul-2027)
    const fmt = (d) => {
      if (!d) return null;
      const date = new Date(d);
      if (isNaN(date.getTime())) return String(d);
      const dd = String(date.getDate()).padStart(2, "0");
      const mNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const m = mNames[date.getMonth()];
      const yyyy = date.getFullYear();
      return `${dd}-${m}-${yyyy}`;
    };

    const formatted = active.map((o) => ({
      ...o,
      startDate: fmt(o.startDate),
      endDate: fmt(o.endDate),
    }));

    return res.json({ success: true, data: formatted });
  } catch (error) {
    console.error("GET /api/offers error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to fetch offers" });
  }
});

// PUT /api/offers - admin only: replace all offers (payload: array of offers)
router.put("/", authenticate, isAdmin, async (req, res) => {
  try {
    const payload = req.body;
    // support { offers: [...] } or direct array payload
    const data = Array.isArray(payload)
      ? payload
      : Array.isArray(payload && payload.offers)
        ? payload.offers
        : null;

    if (!Array.isArray(data)) {
      return res
        .status(400)
        .json({ success: false, error: "Offers must be an array" });
    }

    // Simple approach: remove all existing offers and insert new ones
    await Offer.deleteMany({});
    const created = await Offer.insertMany(data || []);

    return res.json({ success: true, data: created });
  } catch (error) {
    console.error("PUT /api/offers error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to update offers" });
  }
});

export default router;
