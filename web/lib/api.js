// Centralized API configuration and utilities

// Force backend API URL to port 3001 (backend server port)
// Frontend runs on 3000, backend API runs on 3001
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Ensure we're using the correct backend port
const resolvedApiUrl = API_BASE_URL.includes(':3000') 
  ? API_BASE_URL.replace(':3000', ':3001')
  : API_BASE_URL;

// Debug log to verify API URL (remove in production if needed)
if (typeof window !== 'undefined') {
  console.log('[API] Using backend URL:', resolvedApiUrl, '(from env:', import.meta.env.VITE_API_URL || 'default', ')');
}

export const api = {
  baseURL: resolvedApiUrl,

  async request(endpoint, options = {}) {
    const url = `${resolvedApiUrl}${endpoint}`;
    const token = typeof window !== 'undefined' ? localStorage.getItem('homiebites_token') : null;

    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      // No credentials needed - we use JWT tokens in Authorization header, not cookies
    };

    try {
      const response = await fetch(url, config);

      // Handle non-JSON responses
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        try {
          data = await response.json();
        } catch (jsonError) {
          throw new Error(`Invalid JSON response: ${jsonError.message}`);
        }
      } else {
        const text = await response.text();
        // If we get HTML, it means we're hitting the wrong server (frontend instead of backend)
        if (text.trim().startsWith('<!doctype') || text.trim().startsWith('<!DOCTYPE')) {
          console.error(
            `[API] Got HTML instead of JSON from ${url}. Backend server may not be running or API URL is incorrect.`
          );
          throw new Error(
            `Backend API not available. Please ensure the backend server is running on ${resolvedApiUrl}. Received HTML instead of JSON.`
          );
        }
        throw new Error(`Expected JSON but got: ${text.substring(0, 100)}`);
      }

      if (!response.ok) {
        // Handle authentication errors
        if (response.status === 401 || response.status === 403) {
          // Don't redirect if this is a login request (login endpoint can return 401 for wrong credentials)
          const isLoginRequest = endpoint.includes('/auth/login');
          
          // Clear invalid token and admin state (except for login requests)
          if (typeof window !== 'undefined' && !isLoginRequest) {
            localStorage.removeItem('homiebites_token');
            localStorage.removeItem('homiebites_admin');
            localStorage.removeItem('homiebites_user');
            
            // Redirect to login if on admin route
            if (window.location.pathname.startsWith('/admin')) {
              console.warn('[API] Authentication failed. Redirecting to login...');
              window.location.href = '/admin';
            }
          }
          
          // For login requests, return the error message from the API
          if (isLoginRequest && data && data.error) {
            throw new Error(data.error);
          }
          
          throw new Error(isLoginRequest 
            ? 'Invalid credentials. Please check your username and password.' 
            : 'Authentication failed. Please login again.');
        }
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`[API] Request failed for ${url}:`, error.message);
      // Re-throw with more context
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error(
          `Network error: Unable to connect to backend server at ${resolvedApiUrl}. Please check if the backend is running.`
        );
      }
      throw error;
    }
  },

  // Auth endpoints
  async login(emailOrUsername, password) {
    // Support both email and username for login - trim whitespace
    const loginData = { 
      email: emailOrUsername?.trim() || emailOrUsername, 
      username: emailOrUsername?.trim() || emailOrUsername, 
      password: password?.trim() || password 
    };
    console.log('[API] Sending login request:', {
      username: loginData.username,
      hasPassword: !!loginData.password,
    });
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(loginData),
    });
  },

  async register(userData) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Menu endpoints
  async getMenu() {
    return this.request('/api/menu');
  },

  async updateMenu(menuData) {
    return this.request('/api/menu', {
      method: 'PUT',
      body: JSON.stringify({ categories: menuData }),
    });
  },

  // Order endpoints
  async createOrder(orderData) {
    return this.request('/api/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  // Admin order endpoints
  async getAllOrders(filters = {}) {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);
    if (filters.search) params.append('search', filters.search);
    const queryString = params.toString();
    return this.request(`/api/orders${queryString ? '?' + queryString : ''}`);
  },

  async updateOrder(orderId, orderData) {
    return this.request(`/api/orders/${orderId}`, {
      method: 'PUT',
      body: JSON.stringify(orderData),
    });
  },

  async deleteOrder(orderId) {
    return this.request(`/api/orders/${orderId}`, {
      method: 'DELETE',
    });
  },

  async bulkImportOrders(orders) {
    return this.request('/api/orders/bulk-import', {
      method: 'POST',
      body: JSON.stringify({ orders }),
    });
  },

  // Review endpoints
  async createReview(reviewData) {
    return this.request('/api/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  },

  async getReviews(featured = false, limit = 10) {
    const params = new URLSearchParams();
    if (featured) params.append('featured', 'true');
    if (limit) params.append('limit', limit.toString());
    return this.request(`/api/reviews?${params.toString()}`);
  },

  // Offers endpoints
  async getOffers() {
    return this.request('/api/offers');
  },

  async updateOffers(offersData) {
    return this.request('/api/offers', {
      method: 'PUT',
      body: JSON.stringify({ offers: offersData }),
    });
  },

  // Password recovery endpoints
  async forgotPassword(email) {
    return this.request('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async verifyOTP(email, otp) {
    return this.request('/api/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  },

  async verifyIdentity(email, verificationToken, panCard, adminId) {
    return this.request('/api/auth/verify-identity', {
      method: 'POST',
      body: JSON.stringify({ email, verificationToken, panCard, adminId }),
    });
  },

  async resetPassword(email, resetToken, newPassword) {
    return this.request('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, resetToken, newPassword }),
    });
  },

  // Admin user endpoints
  async getAllUsers() {
    return this.request('/api/auth/users');
  },
};

export default api;
