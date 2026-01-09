/**
 * Next.js API Route: Clear All Orders
 * Migrated from Express backend
 */
import connectDB from '../../../../lib/db.js';
import Order from '../../../../lib/models/Order.js';
import { isAdmin, createErrorResponse } from '../../../../lib/middleware/auth.js';

export async function DELETE(request) {
  try {
    await connectDB();
    await isAdmin(request);

    const beforeCount = await Order.countDocuments({});

    if (beforeCount === 0) {
      return Response.json({
        success: true,
        message: 'No orders to delete',
        deletedCount: 0,
        beforeCount: 0,
        afterCount: 0,
      });
    }

    const deleteResult = await Order.deleteMany({});
    const deletedCount = deleteResult.deletedCount || 0;
    const afterCount = await Order.countDocuments({});

    if (afterCount > 0) {
      const secondDelete = await Order.deleteMany({});
      const secondDeletedCount = secondDelete.deletedCount || 0;
      const finalCount = await Order.countDocuments({});

      return Response.json({
        success: finalCount === 0,
        message: finalCount === 0
          ? `Successfully deleted ${deletedCount + secondDeletedCount} orders (required 2 attempts)`
          : `Deleted ${deletedCount + secondDeletedCount} orders, but ${finalCount} orders still remain`,
        deletedCount: deletedCount + secondDeletedCount,
        beforeCount,
        afterCount: finalCount,
        warning: finalCount > 0 ? `${finalCount} orders could not be deleted` : undefined,
      });
    }

    return Response.json({
      success: true,
      message: `Successfully deleted ${deletedCount} orders`,
      deletedCount,
      beforeCount,
      afterCount: 0,
    });
  } catch (error) {
    // Handle authentication/authorization errors
    if (error.status === 401 || error.status === 403) {
      return createErrorResponse(error.status, error.message || 'Authentication failed');
    }
    // Handle database connection errors
    if (error.message && (error.message.includes('connect') || error.message.includes('ECONNREFUSED'))) {
      return Response.json(
        { 
          success: false, 
          error: 'Database connection failed. Please check your database configuration.'
        },
        { status: 503 }
      );
    }
    return Response.json(
      { 
        success: false, 
        error: error.message || 'Failed to clear orders',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: error.status || 500 }
    );
  }
}

