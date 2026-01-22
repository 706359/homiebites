import connectDB from '../../../lib/db.js';
import Review from '../../../lib/models/Review.js';
import { isAdmin, createErrorResponse } from '../../../lib/middleware/auth.js';

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured') === 'true';
    const limit = parseInt(searchParams.get('limit') || '10');
    const all = searchParams.get('all') === 'true'; // Admin: get all reviews including unapproved
    const checkExisting = searchParams.get('checkExisting') === 'true';
    const userName = searchParams.get('userName');
    const userPhone = searchParams.get('userPhone');

    // Check if user wants to check for existing review
    if (checkExisting && userName && userPhone) {
      const normalizedPhone = normalizePhone(userPhone);
      if (normalizedPhone) {
        const reviews = await Review.find({
          userName: userName.trim(),
        }).lean();

        for (const review of reviews) {
          if (review.userPhone && normalizePhone(review.userPhone) === normalizedPhone) {
            return Response.json({
              success: true,
              exists: true,
              data: {
                rating: review.rating,
                comment: review.comment,
                createdAt: review.createdAt,
              },
            });
          }
        }
      }
      return Response.json({ success: true, exists: false });
    }

    // Check if admin (for getting all reviews)
    let isAdminUser = false;
    try {
      await isAdmin(request);
      isAdminUser = true;
    } catch {
      // Not admin, continue with public query
    }

    const query = {};
    if (!isAdminUser || !all) {
      // Public: only approved reviews
      query.isApproved = true;
    }
    if (featured) {
      query.featured = true;
    }

    let reviewsQuery = Review.find(query).sort({ createdAt: -1 });
    if (limit && limit > 0) {
      reviewsQuery = reviewsQuery.limit(limit);
    }
    const reviews = await reviewsQuery.lean();

    return Response.json({ success: true, data: reviews });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error.message || 'Failed to fetch reviews',
        details:
          process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: error.status || 500 }
    );
  }
}

// Helper function to normalize phone numbers for comparison
function normalizePhone(phone) {
  if (!phone) return '';
  // Remove all non-digit characters
  return phone.replace(/\D/g, '');
}

export async function POST(request) {
  try {
    await connectDB();
    const { userName, userEmail, userPhone, userLocation, rating, comment } =
      await request.json();

    if (!userName || !rating || !comment) {
      return Response.json(
        { success: false, error: 'Name, rating, and comment are required' },
        { status: 400 }
      );
    }

    // Convert rating to number to handle string inputs from JSON
    const ratingNum = Number(rating);
    
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return Response.json(
        { success: false, error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // For low ratings (1-2 stars), comment is mandatory and should be detailed
    if ((ratingNum === 1 || ratingNum === 2) && (!comment || comment.trim().length < 20)) {
      return Response.json(
        { 
          success: false, 
          error: 'For low ratings, please provide a detailed comment explaining your experience (minimum 20 characters).' 
        },
        { status: 400 }
      );
    }

    // Check if a review with the same name and phone number exists
    let existingReview = null;
    if (userName && userPhone) {
      const normalizedPhone = normalizePhone(userPhone);
      if (normalizedPhone) {
        // Find review with matching name and phone (normalized)
        const reviews = await Review.find({
          userName: userName.trim(),
        }).lean();

        // Check if any review has matching normalized phone
        for (const review of reviews) {
          if (review.userPhone && normalizePhone(review.userPhone) === normalizedPhone) {
            existingReview = review;
            break;
          }
        }
      }
    }

    let review;
    let isUpdate = false;

    if (existingReview) {
      // Update existing review
      review = await Review.findByIdAndUpdate(
        existingReview._id,
        {
          userName: userName.trim(),
          userEmail: userEmail?.trim() || existingReview.userEmail,
          userPhone: userPhone?.trim() || existingReview.userPhone,
          userLocation: userLocation?.trim() || existingReview.userLocation,
          rating: ratingNum,
          comment: comment.trim(),
          isApproved: false, // Reset approval status for updated review
          // Keep featured status if it was featured
          featured: existingReview.featured || false,
          // Update the updatedAt timestamp (createdAt stays the same)
        },
        { new: true, runValidators: true }
      );
      isUpdate = true;
    } else {
      // Create new review
      review = new Review({
        userName: userName.trim(),
        userEmail: userEmail?.trim(),
        userPhone: userPhone?.trim(),
        userLocation: userLocation?.trim(),
        rating: ratingNum,
        comment: comment.trim(),
        isApproved: false,
        featured: false,
      });

      await review.save();
    }

    return Response.json({
      success: true,
      message: isUpdate
        ? 'Your review has been updated successfully. It will be published after admin approval.'
        : 'Review submitted successfully. It will be published after admin approval.',
      data: review,
      isUpdate,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return Response.json(
        {
          success: false,
          error: 'Validation failed',
          details: Object.values(error.errors || {})
            .map((e) => e.message)
            .join(', '),
        },
        { status: 400 }
      );
    }
    return Response.json(
      {
        success: false,
        error: error.message || 'Failed to create review',
        details:
          process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: error.status || 500 }
    );
  }
}
