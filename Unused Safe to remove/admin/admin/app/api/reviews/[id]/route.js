/**
 * Next.js API Route: Review by ID
 * Migrated from Express backend
 */
import connectDB from '../../../../lib/db.js';
import Review from '../../../../lib/models/Review.js';
import { isAdmin, createErrorResponse } from '../../../../lib/middleware/auth.js';

// PUT /api/reviews/:id - admin only
export async function PUT(request, { params }) {
  try {
    await connectDB();
    await isAdmin(request);
    const { id } = params;
    const updates = await request.json();

    const review = await Review.findByIdAndUpdate(id, updates, {
      new: true,
    }).lean();

    if (!review) {
      return Response.json(
        { success: false, error: 'Review not found' },
        { status: 404 }
      );
    }

    return Response.json({ success: true, data: review });
  } catch (error) {
    if (error.status) {
      return createErrorResponse(error.status, error.message);
    }
    return Response.json(
      { success: false, error: 'Failed to update review' },
      { status: 500 }
    );
  }
}

// DELETE /api/reviews/:id - admin only
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    await isAdmin(request);
    const { id } = params;

    const review = await Review.findByIdAndDelete(id);

    if (!review) {
      return Response.json(
        { success: false, error: 'Review not found' },
        { status: 404 }
      );
    }

    return Response.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    if (error.status) {
      return createErrorResponse(error.status, error.message);
    }
    return Response.json(
      { success: false, error: 'Failed to delete review' },
      { status: 500 }
    );
  }
}

