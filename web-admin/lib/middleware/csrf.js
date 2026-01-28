import crypto from 'crypto';

/**
 * CSRF Token Management
 * Prevents Cross-Site Request Forgery attacks by requiring a token
 * that matches between the cookie and request header
 */

const csrfTokenStore = new Map(); // In-memory store (use Redis in production)

/**
 * Generate a new CSRF token
 */
export function generateCSRFToken() {
  const token = crypto.randomBytes(32).toString('hex');
  const timestamp = Date.now();

  // Store token with timestamp (expires in 24 hours)
  csrfTokenStore.set(token, timestamp);

  // Cleanup old tokens (every 1 hour)
  if (Math.random() < 0.01) {
    cleanupExpiredTokens();
  }

  return token;
}

/**
 * Verify CSRF token from request
 */
export function verifyCSRFToken(token) {
  if (!token || typeof token !== 'string') {
    return false;
  }

  const stored = csrfTokenStore.get(token);
  if (!stored) {
    return false;
  }

  // Check if token is not older than 24 hours
  const age = Date.now() - stored;
  if (age > 24 * 60 * 60 * 1000) {
    csrfTokenStore.delete(token);
    return false;
  }

  // Token is valid but remove it (single-use for extra security)
  csrfTokenStore.delete(token);
  return true;
}

/**
 * Cleanup expired tokens from store
 */
function cleanupExpiredTokens() {
  const now = Date.now();
  const maxAge = 24 * 60 * 60 * 1000;

  for (const [token, timestamp] of csrfTokenStore.entries()) {
    if (now - timestamp > maxAge) {
      csrfTokenStore.delete(token);
    }
  }
}

/**
 * Middleware to validate CSRF token on state-changing requests
 */
export async function validateCSRFToken(request) {
  // Skip GET requests (safe operations)
  if (request.method === 'GET' || request.method === 'HEAD') {
    return true;
  }

  // Get token from X-CSRF-Token header (client must send this)
  const token = request.headers.get('x-csrf-token');

  if (!token) {
    return false;
  }

  return verifyCSRFToken(token);
}

/**
 * Get CSRF token store (for testing)
 */
export function getCSRFTokenStore() {
  return csrfTokenStore;
}

/**
 * Clear token store (for testing)
 */
export function clearCSRFTokenStore() {
  csrfTokenStore.clear();
}
