const ADMIN_KEY = 'homiebites_admin';

/** Session expires after this many ms of inactivity / absolute time. Browser closed = no refresh, so login expires. */
export const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

/** Inactivity timeout - session expires after this many ms of no user activity */
export const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

export const getSessionExpiresAt = () =>
  new Date(Date.now() + SESSION_TTL_MS).toISOString();

/**
 * Client-side auth check (reads from non-HttpOnly cookie)
 * For checking if user is logged in (does not have access to token)
 */
export const isAuthenticated = () => {
  if (typeof document === 'undefined') return false;

  try {
    // Try to get from cookie (non-HttpOnly flag readable by JS)
    const cookies = document.cookie.split(';');
    return cookies.some((cookie) =>
      cookie.trim().startsWith('homiebites_admin=true')
    );
  } catch {
    return false;
  }
};

/**
 * Refresh session by calling API endpoint
 * Server will refresh the secure httpOnly token
 */
export const refreshSession = async () => {
  if (typeof window === 'undefined') return false;

  try {
    const apiUrl =
      typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL
        ? String(process.env.NEXT_PUBLIC_API_URL).replace(/\/$/, '')
        : '';

    const response = await fetch(`${apiUrl}/api/auth/refresh-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies automatically
    });

    if (response.ok) {
      updateLastActivity();
      return true;
    }
    return false;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[Auth] refreshSession error:', error);
    }
    return false;
  }
};

/**
 * Get last activity timestamp from sessionStorage
 * sessionStorage is cleared when tab closes (more secure than localStorage)
 */
export const getLastActivity = () => {
  if (typeof window === 'undefined') return null;

  try {
    const lastActivity = sessionStorage.getItem('homiebites_last_activity');
    return lastActivity ? parseInt(lastActivity, 10) : null;
  } catch {
    return null;
  }
};

/**
 * Update last activity timestamp
 * Uses sessionStorage instead of localStorage for security
 */
export const updateLastActivity = () => {
  if (typeof window === 'undefined') return;

  try {
    sessionStorage.setItem('homiebites_last_activity', Date.now().toString());
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[Auth] updateLastActivity error:', error);
    }
  }
};

/**
 * Check if session is inactive (no activity for INACTIVITY_TIMEOUT_MS)
 */
export const isSessionInactive = () => {
  if (typeof window === 'undefined') return false;

  try {
    const lastActivity = getLastActivity();
    if (!lastActivity) return false;

    const timeSinceActivity = Date.now() - lastActivity;
    return timeSinceActivity >= INACTIVITY_TIMEOUT_MS;
  } catch {
    return false;
  }
};

/**
 * Logout user - call API to clear server-side session
 * Client-side cookies will be cleared by Set-Cookie headers
 */
export const logout = async () => {
  try {
    const apiUrl =
      typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL
        ? String(process.env.NEXT_PUBLIC_API_URL).replace(/\/$/, '')
        : '';

    // Call logout endpoint
    fetch(`${apiUrl}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies
    }).catch(() => {
      // Ignore errors - user will be logged out anyway
    });

    // Clear client-side session storage
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.clear();
      } catch (e) {
        // Ignore errors
      }
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('[Auth] Logout completed, session cleared');
    }
  } catch (error) {
    console.error('[Auth] Error during logout:', error);
  }
};

/**
 * Check session validity (verify with server)
 */
export const checkSessionAndClearIfExpired = async () => {
  if (typeof window === 'undefined') return false;

  try {
    const apiUrl =
      typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL
        ? String(process.env.NEXT_PUBLIC_API_URL).replace(/\/$/, '')
        : '';

    const response = await fetch(`${apiUrl}/api/auth/verify`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies
    });

    if (!response.ok) {
      // Session invalid or expired
      await logout();
      return true;
    }

    return false;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[Auth] Session check error:', error);
    }
    return false;
  }
};

/**
 * Deprecated - Use API authentication instead
 */
export const login = (username, password) => {
  console.warn(
    'login() from auth-admin.js is deprecated. Use API authentication instead.'
  );
  return { success: false, error: 'Please use API authentication' };
};

/**
 * Deprecated - Use requireAuth middleware instead
 */
export const requireAuth = () => {
  if (!isAuthenticated()) {
    return false;
  }
  return true;
};
