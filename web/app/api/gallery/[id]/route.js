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
    // Next.js 15+ requires awaiting params (safe even if params is synchronous)
    const resolvedParams = params && typeof params.then === 'function' ? await params : params;
    const { id } = resolvedParams || {};
    
    if (!id) {
      return Response.json(
        { success: false, error: 'Gallery item ID is required', params: resolvedParams },
        { status: 400 }
      );
    }
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
    // Handle authentication/authorization errors
    if (error.status === 401 || error.status === 403) {
      return createErrorResponse(error.status, error.message || 'Authentication failed');
    }
    return Response.json(
      { 
        success: false, 
        error: error.message || 'Failed to update gallery item',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: error.status || 500 }
    );
  }
}

// DELETE /api/gallery/:id - admin only
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    await isAdmin(request);
    // Next.js 15+ requires awaiting params (safe even if params is synchronous)
    const resolvedParams = params && typeof params.then === 'function' ? await params : params;
    const { id } = resolvedParams || {};
    
    if (!id) {
      return Response.json(
        { success: false, error: 'Gallery item ID is required', params: resolvedParams },
        { status: 400 }
      );
    }

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
    // Handle authentication/authorization errors
    if (error.status === 401 || error.status === 403) {
      return createErrorResponse(error.status, error.message || 'Authentication failed');
    }
    return Response.json(
      { 
        success: false, 
        error: error.message || 'Failed to delete gallery item',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: error.status || 500 }
    );
  }
}

