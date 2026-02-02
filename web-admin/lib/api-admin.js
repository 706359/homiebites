// Use NEXT_PUBLIC_API_URL when backend is on another origin. Empty = same-origin /api.
const resolvedApiUrl =
  typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL
    ? String(process.env.NEXT_PUBLIC_API_URL).replace(/\/$/, '')
    : '';

export const retryAsync = async (
  fn,
  maxAttempts = 3,
  initialDelayMs = 1000
) => {
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry on authentication errors or validation errors
      if (
        error.message?.includes('Authentication failed') ||
        error.message?.includes('Invalid credentials') ||
        error.message?.includes('401') ||
        error.message?.includes('403') ||
        attempt === maxAttempts
      ) {
        break;
      }

      // Exponential backoff: 1s, 2s, 4s
      const delayMs = initialDelayMs * Math.pow(2, attempt - 1);
      if (process.env.NODE_ENV === 'development') {
        console.log(
          `[API Retry] Attempt ${attempt}/${maxAttempts} failed. Retrying in ${delayMs}ms...`,
          error.message
        );
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  throw lastError;
};

export const api = {
  baseURL: resolvedApiUrl,

  async request(endpoint, options = {}) {
    const url = `${resolvedApiUrl}${endpoint}`;
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('homiebites_token')
        : null;

    const isFormData = options.body instanceof FormData;
    const defaultHeaders = isFormData
      ? {}
      : { 'Content-Type': 'application/json' };

    const signal = options.signal || options.abortController?.signal;

    const config = {
      ...options,
      signal,
      headers: {
        ...defaultHeaders,
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },

      cache: options.hardRefresh ? 'no-store' : options.cache || 'default',
    };

    delete config.abortController;

    const startTime =
      typeof performance !== 'undefined' ? performance.now() : Date.now();

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

        if (
          text.trim().startsWith('<!doctype') ||
          text.trim().startsWith('<!DOCTYPE')
        ) {
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
        if (response.status === 404) {
          const isOptionalEndpoint = endpoint.includes('/auth/users');
          if (isOptionalEndpoint) {
            return {
              success: false,
              error: 'Route not found',
              data: null,
              _isOptional: true,
            };
          }
        }

        if (response.status === 401 || response.status === 403) {
          const isLoginRequest = endpoint.includes('/auth/login');

          if (typeof window !== 'undefined' && !isLoginRequest) {
            localStorage.removeItem('homiebites_token');
            localStorage.removeItem('homiebites_admin');
            localStorage.removeItem('homiebites_user');

            if (window.location.pathname.startsWith('/admin')) {
              console.warn(
                '[API] Authentication failed. Redirecting to admin login...'
              );
              window.location.href = '/admin';
            } else if (window.location.pathname === '/') {
              console.warn(
                '[API] Authentication failed but already on home page'
              );
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

      // Track API performance
      if (typeof window !== 'undefined') {
        const duration =
          (typeof performance !== 'undefined'
            ? performance.now()
            : Date.now()) - startTime;
        try {
          const { default: monitoringService } =
            await import('../lib/monitoring.js');
          monitoringService.trackAPI(
            endpoint,
            options.method || 'GET',
            duration,
            response.status
          );
        } catch (trackError) {
          // Silently fail if monitoring not available
        }
      }

      return data;
    } catch (error) {
      // Track API error performance
      if (typeof window !== 'undefined') {
        const duration =
          (typeof performance !== 'undefined'
            ? performance.now()
            : Date.now()) - startTime;
        try {
          const { default: monitoringService } =
            await import('../lib/monitoring.js');
          monitoringService.trackAPI(
            endpoint,
            options.method || 'GET',
            duration,
            0,
            error
          );
        } catch (trackError) {
          // Silently fail if monitoring not available
        }
      }

      const isOptionalEndpoint = endpoint.includes('/auth/users');
      if (!isOptionalEndpoint) {
        console.error(`[API] Request failed for ${url}:`, error.message);
      }

      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error(
          `Network error: Unable to connect to the server. Please check your internet connection and try again.`
        );
      }

      if (error instanceof Error) {
        const userMessage = error.message || 'An error occurred';
        throw new Error(userMessage);
      }
      throw error;
    }
  },

  async login(email, password) {
    const loginData = {
      email: email?.trim() || email,
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
    return retryAsync(() => this.request('/api/menu'), 3, 1000);
  },

  async updateMenu(menuData) {
    return retryAsync(
      () =>
        this.request('/api/menu', {
          method: 'PUT',
          body: JSON.stringify(menuData),
        }),
      3,
      1000
    );
  },

  async deleteMenu() {
    return retryAsync(
      () => this.request('/api/menu', { method: 'DELETE' }),
      3,
      1000
    );
  },

  async createOrder(orderData) {
    return retryAsync(
      () =>
        this.request('/api/orders', {
          method: 'POST',
          body: JSON.stringify(orderData),
        }),
      3,
      1000
    );
  },

  async createManualOrder(orderData) {
    return retryAsync(
      () =>
        this.request('/api/orders/manual', {
          method: 'POST',
          body: JSON.stringify(orderData),
        }),
      3,
      1000
    );
  },

  async getAllOrders(filters = {}, options = {}) {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);
    if (filters.search) params.append('search', filters.search);

    if (options.hardRefresh) {
      params.append('_t', Date.now().toString());
    }
    const queryString = params.toString();
    return retryAsync(
      () =>
        this.request(`/api/orders${queryString ? '?' + queryString : ''}`, {
          ...options,
          hardRefresh: options.hardRefresh,
        }),
      3,
      1000
    );
  },

  async updateOrder(orderId, orderData) {
    return retryAsync(
      () =>
        this.request(`/api/orders/${orderId}`, {
          method: 'PUT',
          body: JSON.stringify(orderData),
        }),
      3,
      1000
    );
  },

  async deleteOrder(orderId) {
    return retryAsync(
      () =>
        this.request(`/api/orders/${orderId}`, {
          method: 'DELETE',
        }),
      3,
      1000
    );
  },

  async bulkImportOrders(orders) {
    if (!Array.isArray(orders)) {
      throw new Error('Orders must be an array');
    }
    return retryAsync(
      () =>
        this.request('/api/orders/bulk-import', {
          method: 'POST',
          body: JSON.stringify(orders),
        }),
      3,
      1000
    );
  },

  async cleanupDuplicates() {
    return this.request('/api/orders/cleanup-duplicates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },

  async uploadExcelFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    return retryAsync(
      () =>
        this.request('/api/orders/upload-excel', {
          method: 'POST',
          body: formData,
        }),
      3,
      1000
    );
  },

  async syncGoogleSheet() {
    return retryAsync(
      () =>
        this.request('/api/orders/sync-google-sheet', {
          method: 'POST',
          body: JSON.stringify({}),
        }),
      2,
      1000
    );
  },

  async clearAllOrders() {
    return retryAsync(
      () =>
        this.request('/api/orders/clear-all', {
          method: 'DELETE',
        }),
      3,
      1000
    );
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

  async getAllReviews() {
    // Get all reviews (including unapproved) for admin
    return retryAsync(() => this.request('/api/reviews?all=true&limit=1000'), 3, 1000);
  },

  async updateReview(reviewId, updates) {
    return retryAsync(
      () =>
        this.request(`/api/reviews/${reviewId}`, {
          method: 'PUT',
          body: JSON.stringify(updates),
        }),
      3,
      1000
    );
  },

  async deleteReview(reviewId) {
    return retryAsync(
      () =>
        this.request(`/api/reviews/${reviewId}`, {
          method: 'DELETE',
        }),
      3,
      1000
    );
  },

  async getOffers() {
    return retryAsync(() => this.request('/api/offers'), 3, 1000);
  },

  async updateOffers(offersData) {
    return retryAsync(
      () =>
        this.request('/api/offers', {
          method: 'PUT',
          body: JSON.stringify({ offers: offersData }),
        }),
      3,
      1000
    );
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
    return retryAsync(() => this.request('/api/gallery'), 3, 1000);
  },

  async createGalleryItem(itemData) {
    return retryAsync(
      () =>
        this.request('/api/gallery', {
          method: 'POST',
          body: JSON.stringify(itemData),
        }),
      3,
      1000
    );
  },

  async updateGalleryItem(id, itemData) {
    return retryAsync(
      () =>
        this.request(`/api/gallery/${id}`, {
          method: 'PUT',
          body: JSON.stringify(itemData),
        }),
      3,
      1000
    );
  },

  async deleteGalleryItem(id) {
    return retryAsync(
      () => this.request(`/api/gallery/${id}`, { method: 'DELETE' }),
      3,
      1000
    );
  },

  async getSettings() {
    return retryAsync(() => this.request('/api/settings'), 3, 1000);
  },

  async getFullSettings() {
    return retryAsync(() => this.request('/api/settings/full'), 3, 1000);
  },

  async updateSettings(settingsData) {
    return retryAsync(
      () =>
        this.request('/api/settings', {
          method: 'PUT',
          body: JSON.stringify(settingsData),
        }),
      3,
      1000
    );
  },
};

export default api;
