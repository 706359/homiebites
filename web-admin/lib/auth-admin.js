



const ADMIN_KEY = "homiebites_admin";


export const login = (username, password) => {
  
  console.warn('login() from auth-admin.js is deprecated. Use API authentication instead.');
  return { success: false, error: "Please use API authentication" };
};

export const logout = () => {
  localStorage.removeItem(ADMIN_KEY);
  localStorage.removeItem("homiebites_admin");
  localStorage.removeItem("homiebites_user");
  localStorage.removeItem("homiebites_token");
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


