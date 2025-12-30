import express from 'express';
import { authenticate, isAdmin } from '../middleware/auth.js';
import Menu from '../models/Menu.js';

const router = express.Router();

// GET /api/menu - public
router.get('/', async (req, res) => {
  try {
    const doc = await Menu.findOne({ key: 'default' }).lean();
    if (!doc || !Array.isArray(doc.data) || doc.data.length === 0) {
      return res.json({ success: true, data: [] });
    }
    return res.json({ success: true, data: doc.data });
  } catch (error) {
    console.error('GET /api/menu error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch menu' });
  }
});

// PUT /api/menu - admin only
router.put('/', authenticate, isAdmin, async (req, res) => {
  try {
    const payload = req.body;
    // support { categories: [...] } or direct array payload
    const data = Array.isArray(payload)
      ? payload
      : Array.isArray(payload && payload.categories)
        ? payload.categories
        : null;

    if (!Array.isArray(data)) {
      return res.status(400).json({ success: false, error: 'Menu must be an array' });
    }

    const updated = await Menu.findOneAndUpdate(
      { key: 'default' },
      { data: data, updatedAt: new Date() },
      { upsert: true, new: true }
    ).lean();

    return res.json({ success: true, data: updated.data });
  } catch (error) {
    console.error('PUT /api/menu error:', error);
    return res.status(500).json({ success: false, error: 'Failed to update menu' });
  }
});

export default router;
