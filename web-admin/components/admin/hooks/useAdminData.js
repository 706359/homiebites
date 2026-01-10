/**
 * Custom hook for loading admin dashboard data
 */
import { useCallback, useEffect, useState } from 'react';
import api from '../../../lib/api-admin.js';
import { getMenuData, getMenuDataSync } from '../../../lib/menuData.js';
import { getOffersData, getOffersDataSync } from '../../../lib/offersData.js';
import errorTracker from '../utils/errorTracker.js';
import { sortOrdersByOrderId } from '../utils/orderUtils.js';

export const useAdminData = () => {
  const [menuData, setMenuData] = useState([]);
  const [offersData, setOffersData] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [newsletterSubscriptions, setNewsletterSubscriptions] = useState([]);
  const [settings, setSettings] = useState({
    whatsappNumber: '919958983578',
    deliveryTimings: '7:30 PM - 8:30 PM',
    minOrderValue: 100,
    deliveryCharge: 0,
    announcement: 'Free delivery on orders over ₹200',
  });
  const [notifications, setNotifications] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadMenuData = useCallback(async () => {
    try {
      const data = await getMenuData();
      setMenuData(data);
    } catch (error) {
      console.error('Error loading menu:', error);
      const data = getMenuDataSync();
      setMenuData(data);
    }
  }, []);

  const loadOffersData = useCallback(async () => {
    try {
      const data = await getOffersData();
      setOffersData(data);
    } catch (error) {
      console.error('Error loading offers:', error);
      const data = getOffersDataSync();
      setOffersData(data);
    }
  }, []);

  const loadOrders = useCallback(async (filters = {}, hardRefresh = false) => {
    try {
      const token = localStorage.getItem('homiebites_token');
      const isAdmin = localStorage.getItem('homiebites_admin') === 'true';

      // Don't attempt API calls without authentication
      if (!token || !isAdmin) {
        console.warn('[useAdminData] Cannot load orders: missing token or admin status', {
          hasToken: !!token,
          isAdmin,
        });
        setOrders([]);
        return;
      }

      try {
        // Load ALL orders from backend (filters are applied in UI)
        // Pass hardRefresh flag to bypass cache
        const response = await api.getAllOrders({}, { hardRefresh });

        if (response.success && response.data) {
          let nextOrders = Array.isArray(response.data) ? response.data : [];
          if (nextOrders.length > 0) {
            nextOrders = sortOrdersByOrderId(nextOrders);
          }
          setOrders((prev) => {
            const prevArr = Array.isArray(prev) ? prev : [];
            if (prevArr.length === 0 && nextOrders.length === 0) return prevArr;
            return nextOrders;
          });
        } else {
          console.warn('[useAdminData] API returned unsuccessful response:', response);
          // Only clear orders if we got a clear error response, not on HTML errors
          if (response && response.error) {
            setOrders([]);
          }
        }
      } catch (apiError) {
        console.error('[useAdminData] Failed to load orders from API:', apiError.message);

        // Don't retry on auth errors - API client will handle redirect
        if (apiError.message && apiError.message.includes('Authentication failed')) {
          console.warn('[useAdminData] Authentication failed. Stopping data load.');
          setOrders([]);
          return; // Don't throw, just return empty
        }

        // Check if it's a backend not available error
        if (
          apiError.message &&
          (apiError.message.includes('HTML') ||
            apiError.message.includes('not available') ||
            apiError.message.includes('connect'))
        ) {
          console.error(
            '[useAdminData] Backend server appears to be offline. Please ensure the backend server is running on',
            api.baseURL
          );
        }

        // Don't clear orders on error - keep existing data (might be stale but better than empty)
        // setOrders([]);
        throw apiError; // Re-throw to let caller handle
      }
    } catch (error) {
      console.error('[useAdminData] Error loading orders:', error);
      // Don't clear orders on error - keep existing data
      // setOrders([]);
      throw error; // Re-throw to let caller handle
    }
  }, []);

  const loadUsers = useCallback(async () => {
    try {
      const token = localStorage.getItem('homiebites_token');
      if (token) {
        try {
          const response = await api.getAllUsers();
          if (response.success && response.data) {
            setUsers(response.data);
            localStorage.setItem('homiebites_users', JSON.stringify(response.data));
            return;
          }
          // If endpoint doesn't exist (404), silently fall back to cache
          if (response.error && response.error.includes('Route not found')) {
            // Silently fall through to localStorage fallback
          }
        } catch (apiError) {
          // Only log non-404 errors
          if (!apiError.message.includes('Route not found') && !apiError.message.includes('404')) {
            console.warn('Failed to load users from API, using cached data:', apiError.message);
          }
        }
      }
      const stored =
        localStorage.getItem('homiebites_users') || localStorage.getItem('homiebites_users_data');
      if (stored) {
        try {
          setUsers(JSON.parse(stored));
        } catch (parseError) {
          console.error('Error parsing stored users:', parseError);
        }
      }
    } catch (error) {
      // Silently handle errors for optional endpoint
      if (!error.message.includes('Route not found') && !error.message.includes('404')) {
        console.error('Error loading users:', error);
      }
    }
  }, []);

  const loadSettings = useCallback(() => {
    try {
      const stored = localStorage.getItem('homiebites_settings');
      if (stored) {
        setSettings(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error loading settings:', e);
    }
  }, []);

  const loadNotifications = useCallback(() => {
    try {
      const stored = localStorage.getItem('homiebites_notifications');
      if (stored) {
        setNotifications(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error loading notifications:', e);
    }
  }, []);

  const loadNewsletterSubscriptions = useCallback(() => {
    try {
      const stored = localStorage.getItem('homiebites_newsletter');
      if (stored) {
        setNewsletterSubscriptions(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error loading newsletter subscriptions:', e);
    }
  }, []);

  const loadCurrentUser = useCallback(() => {
    try {
      const userStr = localStorage.getItem('homiebites_user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
      }
    } catch (error) {
      console.error('Error loading current user:', error);
    }
  }, []);

  // Load all data on mount - ONLY if authenticated
  useEffect(() => {
    // Check authentication before loading
    const token = localStorage.getItem('homiebites_token');
    const isAdmin = localStorage.getItem('homiebites_admin') === 'true';

    if (!token || !isAdmin) {
      console.warn('[useAdminData] Skipping data load: user not authenticated');
      return;
    }

    const loadOpId = errorTracker.addToQueue('load-all-data', 'Load All Dashboard Data', {
      component: 'AdminDashboard',
      phase: 'initialization',
    });

    const loadAllData = async () => {
      try {
        const results = await Promise.allSettled([
          loadMenuData().catch((err) => {
            errorTracker.captureError({
              type: 'data_load_failed',
              operation: 'loadMenuData',
              error: err,
            });
            return null;
          }),
          loadOffersData().catch((err) => {
            errorTracker.captureError({
              type: 'data_load_failed',
              operation: 'loadOffersData',
              error: err,
            });
            return null;
          }),
          loadOrders().catch((err) => {
            errorTracker.captureError({
              type: 'data_load_failed',
              operation: 'loadOrders',
              error: err,
            });
            return null;
          }),
          loadUsers().catch((err) => {
            errorTracker.captureError({
              type: 'data_load_failed',
              operation: 'loadUsers',
              error: err,
            });
            return null;
          }),
        ]);

        // Load synchronous data
        try {
          loadSettings();
        } catch (err) {
          errorTracker.captureError({
            type: 'data_load_failed',
            operation: 'loadSettings',
            error: err,
          });
        }

        try {
          loadNotifications();
        } catch (err) {
          errorTracker.captureError({
            type: 'data_load_failed',
            operation: 'loadNotifications',
            error: err,
          });
        }

        try {
          loadNewsletterSubscriptions();
        } catch (err) {
          errorTracker.captureError({
            type: 'data_load_failed',
            operation: 'loadNewsletterSubscriptions',
            error: err,
          });
        }

        try {
          loadCurrentUser();
        } catch (err) {
          errorTracker.captureError({
            type: 'data_load_failed',
            operation: 'loadCurrentUser',
            error: err,
          });
        }

        errorTracker.completeOperation(loadOpId, { success: true });
        setLoading(false);
      } catch (error) {
        errorTracker.failOperation(loadOpId, error);
        console.error('Critical error loading dashboard data:', error);
        setLoading(false);
      }
    };

    try {
      loadAllData().catch((err) => {
        errorTracker.captureError({
          type: 'unhandled_promise_rejection',
          operation: 'loadAllData',
          error: err,
        });
      });
    } catch (err) {
      errorTracker.captureError({
        type: 'synchronous_error',
        operation: 'loadAllData',
        error: err,
      });
    }
  }, [
    loadMenuData,
    loadOffersData,
    loadOrders,
    loadUsers,
    loadSettings,
    loadNotifications,
    loadNewsletterSubscriptions,
    loadCurrentUser,
  ]);

  return {
    // Data
    menuData,
    offersData,
    orders,
    users,
    newsletterSubscriptions,
    settings,
    notifications,
    currentUser,
    loading,
    // Setters
    setMenuData,
    setOffersData,
    setOrders,
    setUsers,
    setNewsletterSubscriptions,
    setSettings,
    setNotifications,
    setCurrentUser,
    // Loaders
    loadMenuData,
    loadOffersData,
    loadOrders,
    loadUsers,
    loadSettings,
    loadNotifications,
    loadNewsletterSubscriptions,
    loadCurrentUser,
  };
};
