import { useCallback, useEffect, useState } from 'react';
import api from '../../../lib/api-admin.js';
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
    announcement: 'Home delivery on orders over ₹200',
  });
  const [notifications, setNotifications] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const loadMenuData = useCallback(async () => {
    try {
      // Always fetch fresh from backend API directly - no localStorage fallback
      const response = await api.getMenu();
      if (response?.success && Array.isArray(response.data)) {
        // Smart update: Only update if data actually changed
        setMenuData((prev) => {
          const prevArr = Array.isArray(prev) ? prev : [];
          const nextMenu = response.data;
          
          if (prevArr.length === nextMenu.length) {
            const hasChanges = nextMenu.some((nextItem, index) => {
              const prevItem = prevArr[index];
              if (!prevItem) return true;
              const nextId = nextItem._id || nextItem.id;
              const prevId = prevItem._id || prevItem.id;
              if (nextId !== prevId) return true;
              
              // Compare key fields
              return (
                nextItem.name !== prevItem.name ||
                nextItem.price !== prevItem.price ||
                nextItem.isActive !== prevItem.isActive ||
                nextItem.category !== prevItem.category
              );
            });
            
            if (!hasChanges) {
              return prevArr; // No changes, keep prev to prevent re-render
            }
          }
          
          return nextMenu;
        });
      } else {
        setMenuData([]);
      }
    } catch (error) {
      console.error('[useAdminData] Error loading menu:', error);
      // Set empty array on error - no localStorage fallback
      setMenuData([]);
    }
  }, []);

  const loadOffersData = useCallback(async () => {
    try {
      // Always fetch fresh from backend API directly - no localStorage fallback
      const response = await api.getOffers();
      if (response?.success && Array.isArray(response.data)) {
        // Filter active offers
        const activeOffers = response.data.filter((offer) => {
          if (!offer.isActive) return false;
          if (offer.endDate && new Date(offer.endDate) < new Date()) return false;
          if (
            !offer.title ||
            offer.title.trim() === '' ||
            offer.title.toLowerCase().includes('test') ||
            offer.title.toLowerCase().includes('saved via')
          ) {
            return false;
          }
          return true;
        });
        
        // Smart update: Only update if data actually changed
        setOffersData((prev) => {
          const prevArr = Array.isArray(prev) ? prev : [];
          
          if (prevArr.length === activeOffers.length) {
            const hasChanges = activeOffers.some((nextOffer, index) => {
              const prevOffer = prevArr[index];
              if (!prevOffer) return true;
              const nextId = nextOffer._id || nextOffer.id;
              const prevId = prevOffer._id || prevOffer.id;
              if (nextId !== prevId) return true;
              
              // Compare key fields
              return (
                nextOffer.title !== prevOffer.title ||
                nextOffer.description !== prevOffer.description ||
                nextOffer.isActive !== prevOffer.isActive ||
                nextOffer.startDate !== prevOffer.startDate ||
                nextOffer.endDate !== prevOffer.endDate
              );
            });
            
            if (!hasChanges) {
              return prevArr; // No changes, keep prev to prevent re-render
            }
          }
          
          return activeOffers;
        });
      } else {
        setOffersData([]);
      }
    } catch (error) {
      console.error('[useAdminData] Error loading offers:', error);
      // Set empty array on error - no localStorage fallback
      setOffersData([]);
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
        console.log('[useAdminData] Auth check:', {
          hasToken: !!token,
          isAdmin,
        });
      }

      if (!token || !isAdmin) {
        if (process.env.NODE_ENV === 'development') {
          console.warn(
            '[useAdminData] Cannot load orders: missing token or admin status',
            {
              hasToken: !!token,
              isAdmin,
            }
          );
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
              console.log(
                '[useAdminData] Orders sorted, first order:',
                nextOrders[0]?.orderId
              );
            }
          }
          setOrders((prev) => {
            const prevArr = Array.isArray(prev) ? prev : [];
            
            // If both are empty, keep prev to avoid unnecessary re-render
            if (prevArr.length === 0 && nextOrders.length === 0) {
              if (process.env.NODE_ENV === 'development') {
                console.warn(
                  '[useAdminData] Both prev and next orders are empty, keeping prev'
                );
              }
              return prevArr;
            }

            // Smart diffing: Only update if data actually changed
            // This prevents flickering and unnecessary re-renders
            if (prevArr.length === nextOrders.length) {
              // Check if orders are actually different
              const hasChanges = nextOrders.some((nextOrder, index) => {
                const prevOrder = prevArr[index];
                if (!prevOrder) return true;
                
                // Compare by ID first
                const nextId = nextOrder._id || nextOrder.orderId || nextOrder.id;
                const prevId = prevOrder._id || prevOrder.orderId || prevOrder.id;
                if (nextId !== prevId) return true;
                
                // Deep compare key fields that might change
                const fieldsToCompare = [
                  'status',
                  'paymentStatus',
                  'quantity',
                  'unitPrice',
                  'total',
                  'totalAmount',
                  'date',
                  'order_date',
                  'mode',
                  'deliveryAddress',
                  'customerAddress',
                  'address',
                ];
                
                return fieldsToCompare.some((field) => {
                  const nextVal = nextOrder[field];
                  const prevVal = prevOrder[field];
                  // Handle date comparison
                  if (field === 'date' || field === 'order_date') {
                    return String(nextVal || '') !== String(prevVal || '');
                  }
                  return nextVal !== prevVal;
                });
              });
              
              // If no changes detected, keep previous array reference to prevent re-render
              if (!hasChanges) {
                if (process.env.NODE_ENV === 'development') {
                  console.log('[useAdminData] No changes detected, keeping prev to prevent flicker');
                }
                return prevArr;
              }
            }
            
            if (process.env.NODE_ENV === 'development') {
              console.log('[useAdminData] Changes detected, updating orders:', nextOrders.length);
            }
            return nextOrders;
          });
        } else {
          if (process.env.NODE_ENV === 'development') {
            console.warn(
              '[useAdminData] API returned unsuccessful response:',
              response
            );
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
        console.error(
          '[useAdminData] Failed to load orders from API:',
          apiError
        );

        if (
          apiError.message &&
          apiError.message.includes('Authentication failed')
        ) {
          if (process.env.NODE_ENV === 'development') {
            console.warn(
              '[useAdminData] Authentication failed. Stopping data load.'
            );
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
          console.error(
            '[useAdminData] Backend server appears to be offline. Ensure backend is running on',
            api.baseURL,
            apiError
          );
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
      if (!token) {
        setUsers([]);
        return;
      }

      // Always fetch fresh from backend - no localStorage fallback
      const response = await api.getAllUsers();
      if (response?.success && Array.isArray(response.data)) {
        // Smart update: Only update if data actually changed
        setUsers((prev) => {
          const prevArr = Array.isArray(prev) ? prev : [];
          const nextUsers = response.data;
          
          // If same length, check if content changed
          if (prevArr.length === nextUsers.length) {
            const hasChanges = nextUsers.some((nextUser, index) => {
              const prevUser = prevArr[index];
              if (!prevUser) return true;
              const nextId = nextUser._id || nextUser.id;
              const prevId = prevUser._id || prevUser.id;
              if (nextId !== prevId) return true;
              
              // Compare key fields
              return (
                nextUser.name !== prevUser.name ||
                nextUser.email !== prevUser.email ||
                nextUser.phone !== prevUser.phone ||
                nextUser.role !== prevUser.role
              );
            });
            
            if (!hasChanges) {
              return prevArr; // No changes, keep prev to prevent re-render
            }
          }
          
          return nextUsers;
        });
      } else {
        setUsers([]);
      }
    } catch (error) {
      const msg = error?.message || '';
      // Only log non-404 errors
      if (!msg.includes('Route not found') && !msg.includes('404')) {
        console.error('[useAdminData] Error loading users:', error);
      }
      // Set empty array on error - no localStorage fallback
      setUsers([]);
    }
  }, []);

  const loadSettings = useCallback(async () => {
    try {
      // Always fetch fresh from backend - no localStorage fallback
      const res = await api.getFullSettings();
      if (
        res?.success &&
        res.data &&
        typeof res.data === 'object' &&
        !Array.isArray(res.data)
      ) {
        // Smart update: Only update if settings actually changed
        setSettings((prev) => {
          // Deep compare settings to prevent unnecessary re-renders
          const prevStr = JSON.stringify(prev);
          const nextStr = JSON.stringify(res.data);
          
          if (prevStr === nextStr) {
            // No changes, keep prev to prevent re-render
            return prev;
          }
          
          return res.data;
        });
      } else {
        // Keep default settings if API fails
        console.warn('[useAdminData] Settings API returned invalid data, using defaults');
      }
    } catch (e) {
      console.error('[useAdminData] Error loading settings from API:', e);
      // Keep default settings on error - no localStorage fallback
    }
  }, []);

  const loadNotifications = useCallback(async () => {
    try {
      // Always fetch fresh from backend - no localStorage fallback
      // If API method doesn't exist, set empty array
      if (typeof api.getNotifications !== 'function') {
        setNotifications([]);
        return;
      }
      const response = await api.getNotifications();
      if (response?.success && Array.isArray(response.data)) {
        // Smart update: Only update if notifications actually changed
        setNotifications((prev) => {
          const prevArr = Array.isArray(prev) ? prev : [];
          const nextNotifs = response.data;
          
          if (prevArr.length === nextNotifs.length) {
            const hasChanges = nextNotifs.some((nextNotif, index) => {
              const prevNotif = prevArr[index];
              if (!prevNotif) return true;
              const nextId = nextNotif._id || nextNotif.id;
              const prevId = prevNotif._id || prevNotif.id;
              if (nextId !== prevId) return true;
              
              // Compare key fields
              return (
                nextNotif.message !== prevNotif.message ||
                nextNotif.read !== prevNotif.read ||
                nextNotif.type !== prevNotif.type
              );
            });
            
            if (!hasChanges) {
              return prevArr; // No changes, keep prev to prevent re-render
            }
          }
          
          return nextNotifs;
        });
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error('[useAdminData] Error loading notifications:', error);
      // Set empty array on error - no localStorage fallback
      setNotifications([]);
    }
  }, []);

  const loadNewsletterSubscriptions = useCallback(async () => {
    try {
      // Always fetch fresh from backend - no localStorage fallback
      // If API method doesn't exist, set empty array
      if (typeof api.getNewsletterSubscriptions !== 'function') {
        setNewsletterSubscriptions([]);
        return;
      }
      const response = await api.getNewsletterSubscriptions();
      if (response?.success && Array.isArray(response.data)) {
        setNewsletterSubscriptions(response.data);
      } else {
        setNewsletterSubscriptions([]);
      }
    } catch (error) {
      console.error('[useAdminData] Error loading newsletter subscriptions:', error);
      // Set empty array on error - no localStorage fallback
      setNewsletterSubscriptions([]);
    }
  }, []);

  const loadCurrentUser = useCallback(async () => {
    try {
      const token = localStorage.getItem('homiebites_token');
      if (!token) {
        setCurrentUser(null);
        return;
      }

      // Always fetch fresh from backend - no localStorage fallback
      // If API method doesn't exist, use localStorage as fallback (for auth token)
      if (typeof api.getCurrentUser !== 'function') {
        // Fallback: get from localStorage only for user info (not data)
        try {
          const userStr = localStorage.getItem('homiebites_user');
          if (userStr && typeof userStr === 'string') {
            const parsed = JSON.parse(userStr);
            if (parsed && typeof parsed === 'object') {
              setCurrentUser(parsed);
            } else {
              setCurrentUser(null);
            }
          } else {
            setCurrentUser(null);
          }
        } catch {
          setCurrentUser(null);
        }
        return;
      }

      const response = await api.getCurrentUser();
      if (response?.success && response.data && typeof response.data === 'object') {
        setCurrentUser(response.data);
      } else {
        setCurrentUser(null);
      }
    } catch (error) {
      console.error('[useAdminData] Error loading current user:', error);
      setCurrentUser(null);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('homiebites_token');
    const isAdmin = localStorage.getItem('homiebites_admin') === 'true';

    if (!token || !isAdmin) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          '[useAdminData] Skipping data load: user not authenticated'
        );
      }
      return;
    }

    const loadOpId = errorTracker.addToQueue(
      'load-all-data',
      'Load All Dashboard Data',
      {
        component: 'AdminDashboard',
        phase: 'initialization',
      }
    );

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

    // Auto-refresh intervals - only when tab is visible
    // Different intervals for different data types based on update frequency
    const intervals = {
      orders: null,      // Most critical - refreshed via useFastDataSync
      users: null,       // Less frequent changes
      settings: null,    // Rarely changes
      notifications: null, // Real-time updates needed
      menu: null,        // Changes occasionally
      offers: null,      // Changes occasionally
    };

    const setupIntervals = () => {
      // Clear existing intervals
      Object.values(intervals).forEach((interval) => {
        if (interval) clearInterval(interval);
      });

      // Only setup intervals if tab is visible
      if (document.hidden) return;

      // Orders: Refresh every 30 seconds (most critical data)
      intervals.orders = setInterval(() => {
        if (!document.hidden) {
          loadOrders({}, true).catch((err) => {
            if (process.env.NODE_ENV === 'development') {
              console.warn('[useAdminData] Auto-refresh orders failed:', err);
            }
          });
        }
      }, 30000);

      // Users: Refresh every 2 minutes (less frequent changes)
      intervals.users = setInterval(() => {
        if (!document.hidden) {
          loadUsers().catch((err) => {
            if (process.env.NODE_ENV === 'development') {
              console.warn('[useAdminData] Auto-refresh users failed:', err);
            }
          });
        }
      }, 120000);

      // Settings: Refresh every 5 minutes (rarely changes)
      intervals.settings = setInterval(() => {
        if (!document.hidden) {
          loadSettings().catch((err) => {
            if (process.env.NODE_ENV === 'development') {
              console.warn('[useAdminData] Auto-refresh settings failed:', err);
            }
          });
        }
      }, 300000);

      // Notifications: Refresh every 20 seconds (real-time updates)
      intervals.notifications = setInterval(() => {
        if (!document.hidden) {
          loadNotifications().catch((err) => {
            if (process.env.NODE_ENV === 'development') {
              console.warn('[useAdminData] Auto-refresh notifications failed:', err);
            }
          });
        }
      }, 20000);

      // Menu: Refresh every 3 minutes
      intervals.menu = setInterval(() => {
        if (!document.hidden) {
          loadMenuData().catch((err) => {
            if (process.env.NODE_ENV === 'development') {
              console.warn('[useAdminData] Auto-refresh menu failed:', err);
            }
          });
        }
      }, 180000);

      // Offers: Refresh every 3 minutes
      intervals.offers = setInterval(() => {
        if (!document.hidden) {
          loadOffersData().catch((err) => {
            if (process.env.NODE_ENV === 'development') {
              console.warn('[useAdminData] Auto-refresh offers failed:', err);
            }
          });
        }
      }, 180000);
    };

    // Setup intervals on mount
    setupIntervals();

    // Handle visibility changes - pause/resume intervals
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab hidden - clear all intervals to save resources
        Object.values(intervals).forEach((interval) => {
          if (interval) clearInterval(interval);
        });
      } else {
        // Tab visible - setup intervals again
        setupIntervals();
        // Also do an immediate refresh of critical data
        loadOrders({}, true).catch(() => {});
        loadNotifications().catch(() => {});
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup on unmount
    return () => {
      Object.values(intervals).forEach((interval) => {
        if (interval) clearInterval(interval);
      });
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
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
