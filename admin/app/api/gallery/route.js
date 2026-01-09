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
    return Response.json(
      { success: false, error: 'Failed to fetch gallery items' },
      { status: 500 }
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
    if (error.status) {
      return createErrorResponse(error.status, error.message);
    }
    return Response.json(
      { success: false, error: 'Failed to create gallery item' },
      { status: 500 }
    );
  }
}

