// Centralized API configuration and utilities

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = {
  baseURL: API_BASE_URL,
  
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
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
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  },

  // Auth endpoints
  async login(email, password) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
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

  async getMyOrders() {
    return this.request('/api/orders/my-orders');
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
};

export default api;

