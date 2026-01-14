




const API_BASE_URL =
  (typeof window !== 'undefined' ? process.env.NEXT_PUBLIC_API_URL : null) ||
  process.env.API_URL ||
  process.env.VITE_API_URL ||
  '';


let resolvedApiUrl = API_BASE_URL;

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
      
    };

    try {
      const response = await fetch(url, config);

      
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
        
        if (response.status === 401 || response.status === 403) {
          
          const isLoginRequest = endpoint.includes('/auth/login');

          
          if (typeof window !== 'undefined' && !isLoginRequest) {
            localStorage.removeItem('homiebites_token');
            localStorage.removeItem('homiebites_admin');
            localStorage.removeItem('homiebites_user');

            
            if (window.location.pathname.startsWith('/admin')) {
              console.warn('[API] Authentication failed. Redirecting to login...');
              window.location.href = '/admin';
            }
          }

          
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
      console.error(`[API] Request failed for ${url}:`, error.message);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error(
          `Network error: Unable to connect to backend server at ${resolvedApiUrl}. Please check if the backend is running.`
        );
      }
      throw error;
    }
  },

  
  async login(emailOrUsername, password) {
    
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

  
  async getMenu() {
    return this.request('/api/menu');
  },

  async updateMenu(menuData) {
    return this.request('/api/menu', {
      method: 'PUT',
      body: JSON.stringify({ categories: menuData }),
    });
  },

  
  async createOrder(orderData) {
    return this.request('/api/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  
  async createManualOrder(orderData) {
    return this.request('/api/orders/manual', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  
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

  
  async getOffers() {
    return this.request('/api/offers');
  },

  async updateOffers(offersData) {
    return this.request('/api/offers', {
      method: 'PUT',
      body: JSON.stringify({ offers: offersData }),
    });
  },

  
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

  
  async getAllUsers() {
    return this.request('/api/auth/users');
  },

  
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
};

export default api;
