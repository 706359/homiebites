import express from 'express';
import Review from '../models/Review.js';
import { authenticate as authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all approved reviews (public)
router.get('/', async (req, res) => {
  try {
    const { featured, limit = 50 } = req.query;
    
    const query = { status: 'approved' };
    if (featured === 'true') {
      query.isFeatured = true;
    }

    const reviews = await Review.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .select('-userEmail -userPhone'); // Don't expose sensitive data

    res.json({
      success: true,
      reviews,
      count: reviews.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Submit a new review (authenticated or guest)
router.post('/', async (req, res) => {
  try {
    const { userName, userEmail, userPhone, userLocation, rating, comment, orderId } = req.body;

    // Validation
    if (!userName || !rating || !comment) {
      return res.status(400).json({
        success: false,
        error: 'Name, rating, and comment are required',
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: 'Rating must be between 1 and 5',
      });
    }

    // Get userId from token if authenticated
    const userId = req.user?.id || null;

    const review = new Review({
      userId,
      userName,
      userEmail: userEmail || null,
      userPhone: userPhone || null,
      userLocation: userLocation || null,
      rating: parseInt(rating),
      comment: comment.trim(),
      orderId: orderId || null,
      status: 'pending', // Admin approval required
    });

    await review.save();

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully. It will be published after admin approval.',
      review: {
        id: review._id,
        userName: review.userName,
        rating: review.rating,
        comment: review.comment,
        status: review.status,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get user's own reviews (authenticated)
router.get('/my-reviews', authenticateToken, async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Admin: Get all reviews (including pending)
router.get('/admin/all', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { status, limit = 100 } = req.query;
    
    const query = {};
    if (status) {
      query.status = status;
    }

    const reviews = await Review.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      reviews,
      count: reviews.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Admin: Update review status
router.put('/admin/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { status, isFeatured } = req.body;

    const updateData = {};
    if (status) {
      updateData.status = status;
    }
    if (typeof isFeatured === 'boolean') {
      updateData.isFeatured = isFeatured;
    }

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found',
      });
    }

    res.json({
      success: true,
      review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Admin: Delete review
router.delete('/admin/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found',
      });
    }

    res.json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;

