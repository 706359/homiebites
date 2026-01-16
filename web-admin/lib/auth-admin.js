



const ADMIN_KEY = "homiebites_admin";


export const login = (username, password) => {
  
  console.warn('login() from auth-admin.js is deprecated. Use API authentication instead.');
  return { success: false, error: "Please use API authentication" };
};

export const logout = async () => {
  try {
    // Clear all authentication-related items
    localStorage.removeItem(ADMIN_KEY);
    localStorage.removeItem("homiebites_admin");
    localStorage.removeItem("homiebites_user");
    localStorage.removeItem("homiebites_token");
    localStorage.removeItem("homiebites_token_meta");
    
    // Clear any other session-related data if needed
    // Note: We keep user preferences like theme, font settings, etc.
    
    if (process.env.NODE_ENV === 'development') {
      console.log('[Auth] Logout completed, localStorage cleared');
    }
  } catch (error) {
    console.error('[Auth] Error during logout:', error);
    // Still clear items even if there's an error
    try {
      localStorage.removeItem(ADMIN_KEY);
      localStorage.removeItem("homiebites_admin");
      localStorage.removeItem("homiebites_user");
      localStorage.removeItem("homiebites_token");
      localStorage.removeItem("homiebites_token_meta");
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


