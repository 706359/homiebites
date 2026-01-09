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
    console.log('[Menu API] Received payload:', {
      isArray: Array.isArray(payload),
      hasCategories: !!payload?.categories,
      payloadLength: Array.isArray(payload) ? payload.length : payload?.categories?.length || 0,
    });

    const data = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.categories)
        ? payload.categories
        : null;

    if (!Array.isArray(data)) {
      return Response.json({ success: false, error: 'Menu must be an array' }, { status: 400 });
    }

    console.log('[Menu API] Saving data:', {
      dataLength: data.length,
      firstCategory: data[0]?.category || 'N/A',
    });

    const updateResult = await Menu.findOneAndUpdate(
      { key: 'default' },
      { $set: { data: data, updatedAt: new Date() } },
      { upsert: true, new: true, runValidators: true }
    );

    if (!updateResult) {
      console.error('[Menu API] Failed to save - updateResult is null');
      throw new Error('Failed to save menu data to database');
    }

    const savedDoc = await Menu.findOne({ key: 'default' }).lean();
    console.log('[Menu API] Verification after save:', {
      savedLength: savedDoc?.data?.length || 0,
      hasData: !!savedDoc?.data,
      dataIsArray: Array.isArray(savedDoc?.data),
    });

    if (!savedDoc || !savedDoc.data) {
      console.error('[Menu API] Saved document verification failed - no data field');
      throw new Error('Menu data was not saved correctly - verification failed');
    }

    if (!Array.isArray(savedDoc.data)) {
      console.error('[Menu API] Saved data is not an array:', typeof savedDoc.data);
      throw new Error('Menu data format is invalid');
    }

    return Response.json({ success: true, data: savedDoc.data });
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
