/**
 * Next.js API Route: Gallery Item by ID
 * Migrated from Express backend
 */
import connectDB from '../../../../lib/db.js';
import Gallery from '../../../../lib/models/Gallery.js';
import { isAdmin, createErrorResponse } from '../../../../lib/middleware/auth.js';

// PUT /api/gallery/:id - admin only
export async function PUT(request, { params }) {
  try {
    await connectDB();
    await isAdmin(request);
    const { id } = params;
    const updates = await request.json();

    const galleryItem = await Gallery.findByIdAndUpdate(id, updates, {
      new: true,
    }).lean();

    if (!galleryItem) {
      return Response.json(
        { success: false, error: 'Gallery item not found' },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: 'Gallery item updated successfully',
      data: galleryItem,
    });
  } catch (error) {
    if (error.status) {
      return createErrorResponse(error.status, error.message);
    }
    return Response.json(
      { success: false, error: 'Failed to update gallery item' },
      { status: 500 }
    );
  }
}

// DELETE /api/gallery/:id - admin only
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    await isAdmin(request);
    const { id } = params;

    const galleryItem = await Gallery.findByIdAndDelete(id);

    if (!galleryItem) {
      return Response.json(
        { success: false, error: 'Gallery item not found' },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: 'Gallery item deleted successfully',
    });
  } catch (error) {
    if (error.status) {
      return createErrorResponse(error.status, error.message);
    }
    return Response.json(
      { success: false, error: 'Failed to delete gallery item' },
      { status: 500 }
    );
  }
}

