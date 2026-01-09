/**
 * Next.js API Route: Reviews
 * Migrated from Express backend
 */
import connectDB from '../../../lib/db.js';
import Review from '../../../lib/models/Review.js';
import { isAdmin, createErrorResponse } from '../../../lib/middleware/auth.js';

// GET /api/reviews - public
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured') === 'true';
    const limit = parseInt(searchParams.get('limit') || '10');

    const query = { isApproved: true };
    if (featured) {
      query.featured = true;
    }

    const reviews = await Review.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return Response.json({ success: true, data: reviews });
  } catch (error) {
    return Response.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch reviews',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: error.status || 500 }
    );
  }
}

// POST /api/reviews - public
export async function POST(request) {
  try {
    await connectDB();
    const { userName, userEmail, userPhone, userLocation, rating, comment } = await request.json();

    if (!userName || !rating || !comment) {
      return Response.json(
        { success: false, error: 'Name, rating, and comment are required' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return Response.json(
        { success: false, error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    const review = new Review({
      userName,
      userEmail,
      userPhone,
      userLocation,
      rating: parseInt(rating),
      comment,
      isApproved: false,
      featured: false,
    });

    await review.save();

    return Response.json({
      success: true,
      message: 'Review submitted successfully. It will be published after admin approval.',
      data: review,
    });
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return Response.json(
        { 
          success: false, 
          error: 'Validation failed',
          details: Object.values(error.errors || {}).map(e => e.message).join(', ')
        },
        { status: 400 }
      );
    }
    return Response.json(
      { 
        success: false, 
        error: error.message || 'Failed to create review',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: error.status || 500 }
    );
  }
}

