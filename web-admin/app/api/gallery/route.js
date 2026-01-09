/**
 * Next.js API Route: Gallery
 * Migrated from Express backend
 */
import connectDB from '../../../lib/db.js';
import Gallery from '../../../lib/models/Gallery.js';
import { isAdmin, createErrorResponse } from '../../../lib/middleware/auth.js';

// GET /api/gallery - public
export async function GET() {
  try {
    await connectDB();
    const galleryItems = await Gallery.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();

    return Response.json({ success: true, data: galleryItems });
  } catch (error) {
    // Handle authentication/authorization errors (shouldn't happen for GET, but just in case)
    if (error.status === 401 || error.status === 403) {
      return createErrorResponse(error.status, error.message || 'Authentication failed');
    }
    return Response.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch gallery items',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: error.status || 500 }
    );
  }
}

// POST /api/gallery - admin only
export async function POST(request) {
  try {
    await connectDB();
    await isAdmin(request);
    const { name, imageUrl, alt, caption, price, category, order, isActive } = await request.json();

    if (!name || !imageUrl) {
      return Response.json(
        { success: false, error: 'Name and imageUrl are required' },
        { status: 400 }
      );
    }

    const galleryItem = new Gallery({
      name,
      imageUrl,
      alt: alt || name,
      caption: caption || '',
      price: price || null,
      category: category || null,
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true,
    });

    await galleryItem.save();

    return Response.json({
      success: true,
      message: 'Gallery item created successfully',
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
    // Handle duplicate key errors
    if (error.code === 11000 || error.message?.includes('duplicate')) {
      return Response.json(
        { 
          success: false, 
          error: `Gallery item with name "${name || 'unknown'}" already exists`
        },
        { status: 409 }
      );
    }
    // Handle authentication/authorization errors
    if (error.status === 401 || error.status === 403) {
      return createErrorResponse(error.status, error.message || 'Authentication failed');
    }
    return Response.json(
      { 
        success: false, 
        error: error.message || 'Failed to create gallery item',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: error.status || 500 }
    );
  }
}

