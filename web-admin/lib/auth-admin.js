
const ADMIN_KEY = "homiebites_admin";

/** Session expires after this many ms of inactivity / absolute time. Browser closed = no refresh, so login expires. */
export const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export const getSessionExpiresAt = () =>
  new Date(Date.now() + SESSION_TTL_MS).toISOString();

/** Removes token, admin, user, and token_meta from localStorage. */
export const clearAuthStorage = () => {
  try {
    localStorage.removeItem(ADMIN_KEY);
    localStorage.removeItem("homiebites_admin");
    localStorage.removeItem("homiebites_user");
    localStorage.removeItem("homiebites_token");
    localStorage.removeItem("homiebites_token_meta");
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
    const raw = localStorage.getItem("homiebites_token_meta");
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
  console.warn('login() from auth-admin.js is deprecated. Use API authentication instead.');
  return { success: false, error: "Please use API authentication" };
};

export const logout = async () => {
  try {
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
  return localStorage.getItem(ADMIN_KEY) === "true";
};

export const requireAuth = () => {
  if (!isAuthenticated()) {
    return false;
  }
  return true;
};


