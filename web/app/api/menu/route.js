/**
 * Next.js API Route: Menu
 * Migrated from Express backend
 */
import connectDB from '../../../lib/db.js';
import { createErrorResponse, isAdmin } from '../../../lib/middleware/auth.js';
import Menu from '../../../lib/models/Menu.js';

// GET /api/menu - public
export async function GET() {
  try {
    await connectDB();
    const doc = await Menu.findOne({ key: 'default' }).lean();
    if (!doc || !Array.isArray(doc.data) || doc.data.length === 0) {
      return Response.json({ success: true, data: [] });
    }
    return Response.json({ success: true, data: doc.data });
  } catch (error) {
    // Handle authentication/authorization errors
    if (error.status === 401 || error.status === 403) {
      return createErrorResponse(error.status, error.message || 'Authentication failed');
    }
    return Response.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch menu',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: error.status || 500 }
    );
  }
}

// PUT /api/menu - admin only
export async function PUT(request) {
  try {
    await connectDB();
    await isAdmin(request);
    const payload = await request.json();

    const data = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.categories)
        ? payload.categories
        : null;

    if (!Array.isArray(data)) {
      return Response.json({ success: false, error: 'Menu must be an array' }, { status: 400 });
    }

    const updated = await Menu.findOneAndUpdate(
      { key: 'default' },
      { data: data, updatedAt: new Date() },
      { upsert: true, new: true }
    ).lean();

    return Response.json({ success: true, data: updated.data });
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
        error: error.message || 'Failed to update menu',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: error.status || 500 }
    );
  }
}
