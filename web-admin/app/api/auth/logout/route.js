/**
 * POST /api/auth/logout
 * Logout endpoint that clears secure authentication cookies
 */
export async function POST(request) {
  try {
    // Create response with cleared cookies
    const response = new Response(
      JSON.stringify({
        success: true,
        message: 'Logged out successfully',
      }),
      { status: 200 }
    );

    // Clear all auth-related cookies
    // HttpOnly token cookie
    response.headers.set(
      'Set-Cookie',
      'homiebites_admin_token=; Path=/; HttpOnly; Secure; SameSite=Strict; Expires=Thu, 01 Jan 1970 00:00:00 UTC'
    );

    // Admin flag cookie
    response.headers.append(
      'Set-Cookie',
      'homiebites_admin=; Path=/; SameSite=Strict; Expires=Thu, 01 Jan 1970 00:00:00 UTC'
    );

    // CSRF token cookie
    response.headers.append(
      'Set-Cookie',
      'homiebites_csrf_token=; Path=/; SameSite=Strict; Expires=Thu, 01 Jan 1970 00:00:00 UTC'
    );

    if (process.env.NODE_ENV === 'development') {
      console.log('[Logout API] User logged out, secure cookies cleared');
    }

    return response;
  } catch (error) {
    console.error('[Logout API] Error:', error);

    // Still clear cookies even if error occurs
    const response = new Response(
      JSON.stringify({
        success: true,
        message: 'Logout completed',
      }),
      { status: 200 }
    );

    response.headers.set(
      'Set-Cookie',
      'homiebites_admin_token=; Path=/; HttpOnly; Secure; SameSite=Strict; Expires=Thu, 01 Jan 1970 00:00:00 UTC'
    );

    return response;
  }
}
