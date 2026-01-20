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
  const [loadError, setLoadError] = useState(null);

  const loadMenuData = useCallback(async () => {
    try {
      const data = await getMenuData();
      setMenuData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading menu:', error);
      try {
        const fallback = getMenuDataSync();
        setMenuData(Array.isArray(fallback) ? fallback : []);
      } catch {
        setMenuData([]);
      }
    }
  }, []);

  const loadOffersData = useCallback(async () => {
    try {
      const data = await getOffersData();
      setOffersData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading offers:', error);
      try {
        const fallback = getOffersDataSync();
        setOffersData(Array.isArray(fallback) ? fallback : []);
      } catch {
        setOffersData([]);
      }
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
          setLoadError(null);
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
        setLoadError(apiError?.message || 'Failed to load orders');
        console.error('[useAdminData] Failed to load orders from API:', apiError);

        if (apiError.message && apiError.message.includes('Authentication failed')) {
          if (process.env.NODE_ENV === 'development') {
            console.warn('[useAdminData] Authentication failed. Stopping data load.');
          }
          setLoadError(null);
          setOrders([]);
          return;
        }

        if (
          apiError.message &&
          (apiError.message.includes('HTML') ||
            apiError.message.includes('not available') ||
            apiError.message.includes('connect'))
        ) {
          console.error('[useAdminData] Backend server appears to be offline. Ensure backend is running on', api.baseURL, apiError);
        }

        throw apiError;
      }
    } catch (error) {
      console.error('[useAdminData] Error loading orders:', error);

      throw error;
    }
  }, []);

  const loadUsers = useCallback(async () => {
    try {
      const token = localStorage.getItem('homiebites_token');
      if (token) {
        try {
          const response = await api.getAllUsers();
          if (response?.success && Array.isArray(response.data)) {
            setUsers(response.data);
            try {
              localStorage.setItem('homiebites_users', JSON.stringify(response.data));
            } catch (e) { /* quota or disabled */ }
            return;
          }
        } catch (apiError) {
          const msg = apiError?.message || '';
          if (!msg.includes('Route not found') && !msg.includes('404')) {
            if (process.env.NODE_ENV === 'development') {
              console.warn('Failed to load users from API, using cached data:', msg);
            }
          }
        }
      }
      const stored =
        localStorage.getItem('homiebites_users') || localStorage.getItem('homiebites_users_data');
      if (stored && typeof stored === 'string') {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) setUsers(parsed);
        } catch {
          /* ignore corrupt */
        }
      }
    } catch (error) {
      if (!error.message?.includes('Route not found') && !error.message?.includes('404')) {
        console.error('Error loading users:', error);
      }
    }
  }, []);

  const loadSettings = useCallback(async () => {
    try {
      const res = await api.getFullSettings();
      if (res?.success && res.data && typeof res.data === 'object' && !Array.isArray(res.data)) {
        setSettings(res.data);
        return;
      }
    } catch (e) {
      console.error('Error loading settings from API:', e);
    }
    try {
      const stored = localStorage.getItem('homiebites_settings');
      if (stored && typeof stored === 'string') {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          setSettings(parsed);
        }
      }
    } catch {
      /* ignore corrupt or non-JSON */
    }
  }, []);

  const loadNotifications = useCallback(() => {
    try {
      const stored = localStorage.getItem('homiebites_notifications');
      if (stored && typeof stored === 'string') {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setNotifications(parsed);
      }
    } catch {
      /* ignore corrupt */
    }
  }, []);

  const loadNewsletterSubscriptions = useCallback(() => {
    try {
      const stored = localStorage.getItem('homiebites_newsletter');
      if (stored && typeof stored === 'string') {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setNewsletterSubscriptions(parsed);
      }
    } catch {
      /* ignore corrupt */
    }
  }, []);

  const loadCurrentUser = useCallback(() => {
    try {
      const userStr = localStorage.getItem('homiebites_user');
      if (userStr && typeof userStr === 'string') {
        const parsed = JSON.parse(userStr);
        if (parsed && typeof parsed === 'object') setCurrentUser(parsed);
      }
    } catch {
      /* ignore corrupt */
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
    menuData,
    offersData,
    orders,
    users,
    newsletterSubscriptions,
    settings,
    notifications,
    currentUser,
    loading,
    loadError,

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
