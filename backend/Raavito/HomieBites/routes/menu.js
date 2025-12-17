import express from 'express';
import Menu from '../models/Menu.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get menu (public)
router.get('/', async (req, res) => {
  try {
    const menu = await Menu.getMenu();
    res.json({ success: true, data: menu.categories });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update menu (admin only)
router.put('/', authenticate, isAdmin, async (req, res) => {
  try {
    let menu = await Menu.findOne();
    if (!menu) {
      menu = await Menu.create({ categories: req.body });
    } else {
      menu.categories = req.body;
      await menu.save();
    }

    res.json({ success: true, data: menu.categories });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

