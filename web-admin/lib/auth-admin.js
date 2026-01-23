const ADMIN_KEY = 'homiebites_admin';

/** Session expires after this many ms of inactivity / absolute time. Browser closed = no refresh, so login expires. */
export const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

/** Inactivity timeout - session expires after this many ms of no user activity */
export const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

export const getSessionExpiresAt = () =>
  new Date(Date.now() + SESSION_TTL_MS).toISOString();

/**
 * Refresh session expiration time
 */
export const refreshSession = () => {
  if (typeof window === 'undefined') return false;
  
  try {
    const tokenMeta = localStorage.getItem('homiebites_token_meta');
    if (!tokenMeta) return false;

    const meta = JSON.parse(tokenMeta);
    if (!meta) return false;

    // Update expiration time
    const newExpiresAt = getSessionExpiresAt();
    localStorage.setItem(
      'homiebites_token_meta',
      JSON.stringify({ ...meta, expiresAt: newExpiresAt })
    );

    // Update last activity timestamp
    localStorage.setItem(
      'homiebites_last_activity',
      Date.now().toString()
    );

    return true;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[Auth] refreshSession error:', e);
    }
    return false;
  }
};

/**
 * Get last activity timestamp
 */
export const getLastActivity = () => {
  if (typeof window === 'undefined') return null;
  
  try {
    const lastActivity = localStorage.getItem('homiebites_last_activity');
    return lastActivity ? parseInt(lastActivity, 10) : null;
  } catch {
    return null;
  }
};

/**
 * Update last activity timestamp
 */
export const updateLastActivity = () => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('homiebites_last_activity', Date.now().toString());
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

/** Removes token, admin, user, token_meta, and last_activity from localStorage. */
export const clearAuthStorage = () => {
  try {
    localStorage.removeItem(ADMIN_KEY);
    localStorage.removeItem('homiebites_admin');
    localStorage.removeItem('homiebites_user');
    localStorage.removeItem('homiebites_token');
    localStorage.removeItem('homiebites_token_meta');
    localStorage.removeItem('homiebites_last_activity');
  } catch (e) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[Auth] clearAuthStorage error:', e);
    }
  }
};

/**
 * If homiebites_token_meta.expiresAt exists and is in the past, clears auth storage and returns true.
 * Use to force re-login when the session has expired (e.g. browser was closed for too long).
 */
export const checkSessionAndClearIfExpired = () => {
  if (typeof window === 'undefined') return false;
  try {
    const raw = localStorage.getItem('homiebites_token_meta');
    if (!raw) return false;
    const meta = JSON.parse(raw);
    if (!meta || !meta.expiresAt) return false;
    if (new Date(meta.expiresAt) >= new Date()) return false;
    clearAuthStorage();
    return true;
  } catch {
    return false;
  }
};

export const login = (username, password) => {
  console.warn(
    'login() from auth-admin.js is deprecated. Use API authentication instead.'
  );
  return { success: false, error: 'Please use API authentication' };
};

export const logout = async () => {
  try {
    // Try to call logout API endpoint if available
    try {
      const token = typeof window !== 'undefined' 
        ? localStorage.getItem('homiebites_token') 
        : null;
      
      if (token) {
        const apiUrl = typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL
          ? String(process.env.NEXT_PUBLIC_API_URL).replace(/\/$/, '')
          : '';
        
        // Call logout endpoint (fire and forget - don't wait for response)
        fetch(`${apiUrl}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }).catch(() => {
          // Ignore errors - we'll clear local storage anyway
        });
      }
    } catch (apiError) {
      // Ignore API errors - we'll clear local storage anyway
      if (process.env.NODE_ENV === 'development') {
        console.warn('[Auth] Logout API call failed (non-critical):', apiError);
      }
    }

    // Clear local storage
    clearAuthStorage();
    
    if (process.env.NODE_ENV === 'development') {
      console.log('[Auth] Logout completed, localStorage cleared');
    }
  } catch (error) {
    console.error('[Auth] Error during logout:', error);
    try {
      clearAuthStorage();
    } catch (clearError) {
      console.error('[Auth] Error clearing localStorage:', clearError);
    }
  }
};

export const isAuthenticated = () => {
  return localStorage.getItem(ADMIN_KEY) === 'true';
};

export const requireAuth = () => {
  if (!isAuthenticated()) {
    return false;
  }
  return true;
};
