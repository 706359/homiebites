import connectDB from '../../../../lib/db.js';
import { authenticate } from '../../../../lib/middleware/auth.js';

/**
 * POST /api/auth/logout
 * Logout endpoint for server-side session cleanup
 * 
 * This endpoint allows the server to:
 * - Invalidate tokens server-side (if using token blacklist)
 * - Log logout events
 * - Clean up server-side session data
 */
export async function POST(request) {
  try {
    // Authenticate the request to get user info
    const authResult = authenticate(request);
    
    if (!authResult.success) {
      // If not authenticated, still return success (client-side cleanup is sufficient)
      return Response.json(
        { success: true, message: 'Logout completed' },
        { status: 200 }
      );
    }

    const { userId } = authResult;

    try {
      await connectDB();
      
      // Here you could:
      // 1. Add token to blacklist (if implementing token blacklisting)
      // 2. Update user's last logout time
      // 3. Log logout event
      // 4. Clean up server-side session data

      // For now, we'll just log the logout event
      if (process.env.NODE_ENV === 'development') {
        console.log('[Logout API] User logged out:', {
          userId,
          timestamp: new Date().toISOString(),
        });
      }

      return Response.json(
        {
          success: true,
          message: 'Logout completed successfully',
          timestamp: new Date().toISOString(),
        },
        { status: 200 }
      );
    } catch (dbError) {
      // Even if DB operations fail, return success
      // Client-side cleanup is the primary mechanism
      if (process.env.NODE_ENV === 'development') {
        console.warn('[Logout API] Database error (non-critical):', dbError);
      }

      return Response.json(
        {
          success: true,
          message: 'Logout completed (client-side cleanup)',
          timestamp: new Date().toISOString(),
        },
        { status: 200 }
      );
    }
  } catch (error) {
    // Always return success - client-side cleanup is sufficient
    if (process.env.NODE_ENV === 'development') {
      console.warn('[Logout API] Error (non-critical):', error);
    }

    return Response.json(
      {
        success: true,
        message: 'Logout completed',
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  }
}
