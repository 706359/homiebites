import connectDB from '../../../../lib/db.js';
import Review from '../../../../lib/models/Review.js';
import {
  isAdmin,
  createErrorResponse,
} from '../../../../lib/middleware/auth.js';

export async function PUT(request, { params }) {
  try {
    await connectDB();
    await isAdmin(request);

    const resolvedParams =
      params && typeof params.then === 'function' ? await params : params;
    const { id } = resolvedParams || {};

    if (!id) {
      return Response.json(
        {
          success: false,
          error: 'Review ID is required',
          params: resolvedParams,
        },
        { status: 400 }
      );
    }
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

    if (error.status === 401 || error.status === 403) {
      return createErrorResponse(
        error.status,
        error.message || 'Authentication failed'
      );
    }
    return Response.json(
      {
        success: false,
        error: error.message || 'Failed to update review',
        details:
          process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: error.status || 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    await isAdmin(request);

    const resolvedParams =
      params && typeof params.then === 'function' ? await params : params;
    const { id } = resolvedParams || {};

    if (!id) {
      return Response.json(
        {
          success: false,
          error: 'Review ID is required',
          params: resolvedParams,
        },
        { status: 400 }
      );
    }

    const review = await Review.findByIdAndDelete(id);

    if (!review) {
      return Response.json(
        { success: false, error: 'Review not found' },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    if (error.status === 401 || error.status === 403) {
      return createErrorResponse(
        error.status,
        error.message || 'Authentication failed'
      );
    }
    return Response.json(
      {
        success: false,
        error: error.message || 'Failed to delete review',
        details:
          process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: error.status || 500 }
    );
  }
}
