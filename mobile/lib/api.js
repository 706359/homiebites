import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'homiebites_token';

function getBaseUrl() {
  const url = Constants.expoConfig?.extra?.apiUrl || process.env.EXPO_PUBLIC_API_URL || '';
  return String(url).replace(/\/$/, '');
}

async function getToken() {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export async function request(endpoint, options = {}) {
  const base = getBaseUrl();
  if (!base) {
    throw new Error('API URL not configured. Set EXPO_PUBLIC_API_URL (e.g. https://your-homiebites.vercel.app or http://localhost:5050).');
  }
  const url = `${base}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const token = await getToken();
  const isFormData = options.body instanceof FormData;
  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  const config = { ...options, headers };
  const res = await fetch(url, config);
  let data;
  const ct = res.headers.get('content-type');
  if (ct && ct.includes('application/json')) {
    try {
      data = await res.json();
    } catch (e) {
      throw new Error(`Invalid JSON: ${e.message}`);
    }
  } else {
    const text = await res.text();
    if (res.ok) return { success: true, data: text };
    throw new Error(text || `HTTP ${res.status}`);
  }
  if (res.status === 401 || res.status === 403) {
    await AsyncStorage.multiRemove([TOKEN_KEY, 'homiebites_admin', 'homiebites_user']);
    throw new Error(data?.error || 'Authentication failed. Please login again.');
  }
  if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
  return data;
}

export const api = {
  async login(emailOrUsername, password) {
    const input = (emailOrUsername || '').trim();
    const d = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: input,
        username: input,
        password: (password || '').trim(),
      }),
    });
    if (!d?.success || !d.token) throw new Error(d?.error || 'Login failed');
    return d;
  },

  async getOrders(opts = {}) {
    const params = new URLSearchParams();
    if (opts.status) params.append('status', opts.status);
    if (opts.dateFrom) params.append('dateFrom', opts.dateFrom);
    if (opts.dateTo) params.append('dateTo', opts.dateTo);
    const q = params.toString();
    return request(`/api/orders${q ? `?${q}` : ''}`);
  },

  async createOrder(data) {
    return request('/api/orders/manual', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateOrder(id, data) {
    return request(`/api/orders/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  },

  async deleteOrder(id) {
    return request(`/api/orders/${id}`, { method: 'DELETE' });
  },

  async getSettings() {
    return request('/api/settings');
  },

  async getFullSettings() {
    return request('/api/settings/full');
  },

  async getMenu() {
    return request('/api/menu');
  },

  async changePassword(currentPassword, newPassword) {
    return request('/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },
};

export { getBaseUrl, getToken };
