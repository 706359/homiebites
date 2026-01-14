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
      if (process.env.NODE_ENV === 'development') {
        console.error('Error loading menu:', error);
      }
      const data = getMenuDataSync();
      setMenuData(data);
    }
  }, []);

  const loadOffersData = useCallback(async () => {
    try {
      const data = await getOffersData();
      setOffersData(data);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error loading offers:', error);
      }
      const data = getOffersDataSync();
      setOffersData(data);
    }
  }, []);

  const loadOrders = useCallback(async (filters = {}, hardRefresh = false) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[useAdminData] loadOrders called', { filters, hardRefresh });
    }
    try {
      const token = localStorage.getItem('homiebites_token');
      const isAdmin = localStorage.getItem('homiebites_admin') === 'true';

      if (process.env.NODE_ENV === 'development') {
        console.log('[useAdminData] Auth check:', { hasToken: !!token, isAdmin });
      }

      if (!token || !isAdmin) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[useAdminData] Cannot load orders: missing token or admin status', {
            hasToken: !!token,
            isAdmin,
          });
        }
        setOrders([]);
        return;
      }

      try {
        if (process.env.NODE_ENV === 'development') {
          console.log('[useAdminData] Calling api.getAllOrders...');
        }

        const response = await api.getAllOrders({}, { hardRefresh });

        if (process.env.NODE_ENV === 'development') {
          console.log('[useAdminData] API response:', {
            success: response?.success,
            dataLength: response?.data?.length,
            hasData: !!response?.data,
            error: response?.error,
          });
        }

        if (response.success && response.data) {
          let nextOrders = Array.isArray(response.data) ? response.data : [];
          if (process.env.NODE_ENV === 'development') {
            console.log('[useAdminData] Orders received:', nextOrders.length);
          }
          if (nextOrders.length > 0) {
            nextOrders = sortOrdersByOrderId(nextOrders);
            if (process.env.NODE_ENV === 'development') {
              console.log('[useAdminData] Orders sorted, first order:', nextOrders[0]?.orderId);
            }
          }
          setOrders((prev) => {
            const prevArr = Array.isArray(prev) ? prev : [];
            if (prevArr.length === 0 && nextOrders.length === 0) {
              if (process.env.NODE_ENV === 'development') {
                console.warn('[useAdminData] Both prev and next orders are empty, keeping prev');
              }
              return prevArr;
            }
            if (process.env.NODE_ENV === 'development') {
              console.log('[useAdminData] Setting orders:', nextOrders.length);
            }
            return nextOrders;
          });
        } else {
          if (process.env.NODE_ENV === 'development') {
            console.warn('[useAdminData] API returned unsuccessful response:', response);
          }

          if (response && response.error) {
            if (process.env.NODE_ENV === 'development') {
              console.error('[useAdminData] API error, clearing orders');
            }
            setOrders([]);
          }
        }
      } catch (apiError) {
        if (process.env.NODE_ENV === 'development') {
          console.error('[useAdminData] Failed to load orders from API:', apiError.message);
        }

        if (apiError.message && apiError.message.includes('Authentication failed')) {
          if (process.env.NODE_ENV === 'development') {
            console.warn('[useAdminData] Authentication failed. Stopping data load.');
          }
          setOrders([]);
          return;
        }

        if (
          apiError.message &&
          (apiError.message.includes('HTML') ||
            apiError.message.includes('not available') ||
            apiError.message.includes('connect'))
        ) {
          if (process.env.NODE_ENV === 'development') {
            console.error(
              '[useAdminData] Backend server appears to be offline. Please ensure the backend server is running on',
              api.baseURL
            );
          }
        }

        throw apiError;
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[useAdminData] Error loading orders:', error);
      }

      throw error;
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

          if (response.error && response.error.includes('Route not found')) {
          }
        } catch (apiError) {
          if (!apiError.message.includes('Route not found') && !apiError.message.includes('404')) {
            if (process.env.NODE_ENV === 'development') {
              console.warn('Failed to load users from API, using cached data:', apiError.message);
            }
          }
        }
      }
      const stored =
        localStorage.getItem('homiebites_users') || localStorage.getItem('homiebites_users_data');
      if (stored) {
        try {
          setUsers(JSON.parse(stored));
        } catch (parseError) {
          if (process.env.NODE_ENV === 'development') {
            console.error('Error parsing stored users:', parseError);
          }
        }
      }
    } catch (error) {
      if (!error.message.includes('Route not found') && !error.message.includes('404')) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error loading users:', error);
        }
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
      if (process.env.NODE_ENV === 'development') {
        console.error('Error loading settings:', e);
      }
    }
  }, []);

  const loadNotifications = useCallback(() => {
    try {
      const stored = localStorage.getItem('homiebites_notifications');
      if (stored) {
        setNotifications(JSON.parse(stored));
      }
    } catch (e) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error loading notifications:', e);
      }
    }
  }, []);

  const loadNewsletterSubscriptions = useCallback(() => {
    try {
      const stored = localStorage.getItem('homiebites_newsletter');
      if (stored) {
        setNewsletterSubscriptions(JSON.parse(stored));
      }
    } catch (e) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error loading newsletter subscriptions:', e);
      }
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
      if (process.env.NODE_ENV === 'development') {
        console.error('Error loading current user:', error);
      }
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('homiebites_token');
    const isAdmin = localStorage.getItem('homiebites_admin') === 'true';

    if (!token || !isAdmin) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[useAdminData] Skipping data load: user not authenticated');
      }
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
        if (process.env.NODE_ENV === 'development') {
          console.error('Critical error loading dashboard data:', error);
        }
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
    menuData,
    offersData,
    orders,
    users,
    newsletterSubscriptions,
    settings,
    notifications,
    currentUser,
    loading,

    setMenuData,
    setOffersData,
    setOrders,
    setUsers,
    setNewsletterSubscriptions,
    setSettings,
    setNotifications,
    setCurrentUser,

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
