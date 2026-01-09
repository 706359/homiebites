/**
 * Next.js API Route: Gallery Bulk Update
 * Migrated from Express backend
 */
import connectDB from '../../../../lib/db.js';
import Gallery from '../../../../lib/models/Gallery.js';
import { isAdmin, createErrorResponse } from '../../../../lib/middleware/auth.js';

// PUT /api/gallery/bulk-update - admin only
export async function PUT(request) {
  try {
    await connectDB();
    await isAdmin(request);
    const { items } = await request.json();

    if (!Array.isArray(items)) {
      return Response.json(
        { success: false, error: 'Items must be an array' },
        { status: 400 }
      );
    }

    const updatePromises = items.map((item) =>
      Gallery.findByIdAndUpdate(item.id, { ...item }, { new: true })
    );

    await Promise.all(updatePromises);

    return Response.json({
      success: true,
      message: 'Gallery items updated successfully',
    });
  } catch (error) {
    if (error.status) {
      return createErrorResponse(error.status, error.message);
    }
    return Response.json(
      { success: false, error: 'Failed to update gallery items' },
      { status: 500 }
    );
  }
}

