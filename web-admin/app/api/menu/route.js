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

    // Log full payload for debugging
    console.log('[Menu API] Full payload received:', JSON.stringify(data, null, 2));
    console.log('[Menu API] Saving data:', {
      dataLength: data.length,
      firstCategory: data[0]?.category || 'N/A',
      firstCategoryItemsCount: data[0]?.items?.length || 0,
    });

    // Validate that data is not empty
    if (data.length === 0) {
      console.warn('[Menu API] Warning: Attempting to save empty menu data');
      return Response.json(
        { 
          success: false, 
          error: 'Cannot save empty menu. Please add at least one menu item with a category.' 
        },
        { status: 400 }
      );
    }

    // Validate each category has items
    const categoriesWithItems = data.filter((cat) => cat.items && Array.isArray(cat.items) && cat.items.length > 0);
    const totalItems = categoriesWithItems.reduce((sum, cat) => sum + (cat.items?.length || 0), 0);
    
    console.log('[Menu API] Categories with items:', {
      totalCategories: data.length,
      categoriesWithItems: categoriesWithItems.length,
      totalItems: totalItems,
    });

    // Validate that we have at least one item to save
    if (totalItems === 0) {
      console.error('[Menu API] Error: No items found in any category');
      return Response.json(
        { 
          success: false, 
          error: 'Cannot save menu with no items. Please ensure each category has at least one menu item.' 
        },
        { status: 400 }
      );
    }

    // Validate data structure - each category should have required fields
    for (const category of data) {
      if (!category.category) {
        console.error('[Menu API] Error: Category missing name field:', category);
        return Response.json(
          { 
            success: false, 
            error: `Invalid category structure: missing 'category' field` 
          },
          { status: 400 }
        );
      }
      if (!Array.isArray(category.items)) {
        console.error('[Menu API] Error: Category items is not an array:', category);
        return Response.json(
          { 
            success: false, 
            error: `Invalid category structure: 'items' must be an array for category '${category.category}'` 
          },
          { status: 400 }
        );
      }
    }

    // Check if document exists first - don't auto-create empty records
    const existingDoc = await Menu.findOne({ key: 'default' }).lean();
    
    let updateResult;
    if (existingDoc) {
      // Update existing document only
      updateResult = await Menu.findOneAndUpdate(
        { key: 'default' },
        { $set: { data: data, updatedAt: new Date() } },
        { new: true, runValidators: true }
      );
      console.log('[Menu API] Updated existing menu document');
    } else {
      // Only create if we have valid data with items
      if (totalItems > 0) {
        updateResult = await Menu.create({
          key: 'default',
          data: data,
          updatedAt: new Date(),
        });
        console.log('[Menu API] Created new menu document with', totalItems, 'items');
      } else {
        console.error('[Menu API] Cannot create new menu document with no items');
        return Response.json(
          { 
            success: false, 
            error: 'Cannot create menu with no items. Please add at least one menu item before saving.' 
          },
          { status: 400 }
        );
      }
    }

    if (!updateResult) {
      console.error('[Menu API] Failed to save - updateResult is null');
      throw new Error('Failed to save menu data to database');
    }

    const savedDoc = await Menu.findOne({ key: 'default' }).lean();
    const savedCategoriesWithItems = savedDoc?.data?.filter((cat) => cat.items && Array.isArray(cat.items) && cat.items.length > 0) || [];
    const savedTotalItems = savedDoc?.data?.reduce((sum, cat) => sum + (cat.items?.length || 0), 0) || 0;
    
    console.log('[Menu API] Full saved document:', JSON.stringify(savedDoc, null, 2));
    console.log('[Menu API] Verification after save:', {
      savedLength: savedDoc?.data?.length || 0,
      hasData: !!savedDoc?.data,
      dataIsArray: Array.isArray(savedDoc?.data),
      categoriesWithItems: savedCategoriesWithItems.length,
      totalItems: savedTotalItems,
      categoriesDetail: savedDoc?.data?.map((cat) => ({
        category: cat.category,
        itemsCount: cat.items?.length || 0,
        itemNames: cat.items?.map((i) => i.name) || [],
      })) || [],
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

// DELETE /api/menu - admin only - Delete the default menu record
export async function DELETE(request) {
  try {
    await connectDB();
    await isAdmin(request);
    
    const deleteResult = await Menu.findOneAndDelete({ key: 'default' });
    
    if (!deleteResult) {
      return Response.json(
        { 
          success: false, 
          error: 'Menu record not found' 
        },
        { status: 404 }
      );
    }
    
    console.log('[Menu API] Deleted default menu record');
    return Response.json({ 
      success: true, 
      message: 'Menu record deleted successfully' 
    });
  } catch (error) {
    // Handle authentication/authorization errors
    if (error.status === 401 || error.status === 403) {
      return createErrorResponse(error.status, error.message || 'Authentication failed');
    }
    return Response.json(
      { 
        success: false, 
        error: error.message || 'Failed to delete menu',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: error.status || 500 }
    );
  }
}
