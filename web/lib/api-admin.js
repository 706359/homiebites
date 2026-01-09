// Centralized API configuration and utilities

// Determine API base URL
// All APIs are now in Next.js - use relative URLs for both development and production
// Next.js API routes run on the same server as the frontend
// Endpoints already include '/api/' prefix, so base URL should be empty
let resolvedApiUrl = '';

// API URL configuration
if (typeof window !== 'undefined') {
  // Backend URL configured - no debug logging
}

export const api = {
  baseURL: resolvedApiUrl,

  async request(endpoint, options = {}) {
    const url = `${resolvedApiUrl}${endpoint}`;
    const token = typeof window !== 'undefined' ? localStorage.getItem('homiebites_token') : null;

    // Don't set Content-Type for FormData - browser will set it with boundary
    const isFormData = options.body instanceof FormData;
    const defaultHeaders = isFormData ? {} : { 'Content-Type': 'application/json' };

    // Support AbortController for request cancellation
    const signal = options.signal || options.abortController?.signal;

    const config = {
      ...options,
      signal, // Add abort signal
      headers: {
        ...defaultHeaders,
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      // No credentials needed - we use JWT tokens in Authorization header, not cookies
    };

    // Remove signal from options to avoid passing it twice
    delete config.abortController;

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
        // Handle 404 for optional endpoints gracefully
        if (response.status === 404) {
          const isOptionalEndpoint = endpoint.includes('/auth/users');
          if (isOptionalEndpoint) {
            // Return a response object that indicates the endpoint doesn't exist
            // This prevents throwing an error and allows graceful fallback
            return {
              success: false,
              error: 'Route not found',
              data: null,
              _isOptional: true, // Flag to indicate this is an optional endpoint
            };
          }
        }

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
            if (window.location.pathname.startsWith('/admin') || window.location.pathname === '/') {
              console.warn('[API] Authentication failed. Redirecting to login...');
              window.location.href = '/';
            }
          }

          // For login requests, return the error message from the API
          if (isLoginRequest && data && data.error) {
            throw new Error(data.error);
          }

          throw new Error(
            isLoginRequest
              ? 'Invalid credentials. Please check your username and password.'
              : 'Authentication failed. Please login again.'
          );
        }
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      // Don't log errors for optional endpoints that return 404
      const isOptionalEndpoint = endpoint.includes('/auth/users');
      if (!isOptionalEndpoint) {
        console.error(`[API] Request failed for ${url}:`, error.message);
      }
      // Re-throw with more context
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error(
          `Network error: Unable to connect to the server. Please check your internet connection and try again.`
        );
      }
      // Provide user-friendly error messages
      if (error instanceof Error) {
        // Preserve original error but ensure message is user-friendly
        const userMessage = error.message || 'An error occurred';
        throw new Error(userMessage);
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
      password: password?.trim() || password,
    };
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
    const result = await this.request('/api/menu');
    return result;
  },

  async updateMenu(menuData) {
    // Backend accepts either array directly or { categories: [...] }
    // Send array directly to match backend expectation
    return this.request('/api/menu', {
      method: 'PUT',
      body: JSON.stringify(menuData),
    });
  },

  // Order endpoints
  async createOrder(orderData) {
    return this.request('/api/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  // Manual order creation (uses new OrderID format: HB-Jan'25-15-000079)
  async createManualOrder(orderData) {
    return this.request('/api/orders/manual', {
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
    // Backend expects the request body to be directly an array, not wrapped in an object
    if (!Array.isArray(orders)) {
      throw new Error('Orders must be an array');
    }
    return this.request('/api/orders/bulk-import', {
      method: 'POST',
      body: JSON.stringify(orders),
    });
  },

  async cleanupDuplicates() {
    return this.request('/api/orders/cleanup-duplicates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },

  // Upload Excel/CSV file
  async uploadExcelFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    return this.request('/api/orders/upload-excel', {
      method: 'POST',
      body: formData,
    });
  },

  // Clear all orders
  async clearAllOrders() {
    return this.request('/api/orders/clear-all', {
      method: 'DELETE',
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

  // Gallery endpoints
  async getGallery() {
    return this.request('/api/gallery');
  },

  async createGalleryItem(itemData) {
    return this.request('/api/gallery', {
      method: 'POST',
      body: JSON.stringify(itemData),
    });
  },

  async updateGalleryItem(id, itemData) {
    return this.request(`/api/gallery/${id}`, {
      method: 'PUT',
      body: JSON.stringify(itemData),
    });
  },

  async deleteGalleryItem(id) {
    return this.request(`/api/gallery/${id}`, {
      method: 'DELETE',
    });
  },

  // Settings endpoints
  async getSettings() {
    return this.request('/api/settings');
  },

  async getFullSettings() {
    return this.request('/api/settings/full');
  },

  async updateSettings(settingsData) {
    return this.request('/api/settings', {
      method: 'PUT',
      body: JSON.stringify(settingsData),
    });
  },
};

export default api;
