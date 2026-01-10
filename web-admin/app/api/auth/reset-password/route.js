/**
 * Next.js API Route: Reset Password (Legacy - kept for backward compatibility)
 * The new flow uses /api/auth/reset-password/[token]/route.js
 * This route can be removed once frontend is updated
 */

// This route is deprecated - use /api/auth/reset-password/[token] instead
export async function POST(request) {
  return Response.json(
    { 
      success: false, 
      error: 'This endpoint is deprecated. Please use the token-based reset password flow.',
      hint: 'Use the reset link from your email: /admin/reset-password/:token'
    },
    { status: 400 }
  );
}
