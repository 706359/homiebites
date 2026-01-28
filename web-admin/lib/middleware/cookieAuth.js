import { cookies } from 'next/headers';

/**
 * Set secure admin authentication cookie
 * HttpOnly: Cannot be accessed by JavaScript (prevents XSS token theft)
 * Secure: Only sent over HTTPS
 * SameSite: Prevents CSRF attacks
 */
export async function setAdminCookie(token, expiresAt = null) {
  const cookieStore = await cookies();
  const maxAge = expiresAt
    ? Math.floor((new Date(expiresAt) - Date.now()) / 1000)
    : 24 * 60 * 60;

  cookieStore.set('homiebites_admin_token', token, {
    httpOnly: true, // Critical: Cannot be accessed via JavaScript
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: 'strict', // CSRF protection
    path: '/',
    maxAge: Math.max(maxAge, 1), // Ensure positive value
  });

  // Set admin flag for server-side checks (can be non-httpOnly for convenience)
  cookieStore.set('homiebites_admin', 'true', {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: Math.max(maxAge, 1),
  });
}

/**
 * Get admin token from secure cookie (server-side only)
 */
export async function getAdminToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get('homiebites_admin_token');
  return token?.value || null;
}

/**
 * Get admin status from cookie
 */
export async function getAdminStatus() {
  const cookieStore = await cookies();
  const admin = cookieStore.get('homiebites_admin');
  return admin?.value === 'true';
}

/**
 * Clear admin authentication cookies
 */
export async function clearAdminCookies() {
  const cookieStore = await cookies();
  cookieStore.delete('homiebites_admin_token');
  cookieStore.delete('homiebites_admin');
  cookieStore.delete('homiebites_csrf_token');
}

/**
 * Set CSRF token in non-HttpOnly cookie (must be sent back by client)
 */
export async function setCSRFToken(token) {
  const cookieStore = await cookies();

  cookieStore.set('homiebites_csrf_token', token, {
    httpOnly: false, // Must be readable by JS to send in X-CSRF-Token header
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 24 * 60 * 60,
  });
}

/**
 * Get CSRF token from cookie (client-side can access this)
 */
export async function getCSRFToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get('homiebites_csrf_token');
  return token?.value || null;
}

/**
 * Middleware to verify admin cookie exists and is valid
 */
export async function requireAdminCookie(request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('homiebites_admin_token');
  const isAdmin = cookieStore.get('homiebites_admin');

  if (!token?.value || isAdmin?.value !== 'true') {
    return {
      success: false,
      error: 'Admin authentication required',
    };
  }

  return {
    success: true,
    token: token.value,
  };
}
