'use client';

import { useRouter } from 'next/navigation';
import { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import api from '../../lib/api-admin.js';
import { logout } from '../../lib/auth-admin.js';
import { setupGlobalErrorHandlers } from '../../lib/globalErrorHandler.js';
import monitoringService from '../../lib/monitoring.js';
import { FullPageLoader, InlineLoader } from '../loaders/LoaderComponents';
import { useNotification } from './contexts/NotificationContext.jsx';
import ErrorBoundary from './ErrorBoundary.jsx';
import { useFastDataSync } from './hooks/useFastDataSync.js';
import { useSessionManager } from './hooks/useSessionManager.js';
import SessionTimeoutModal from './SessionTimeoutModal.jsx';
import Sidebar from './Sidebar.jsx';
import TopNav from './TopNav.jsx';
import dataSyncManager from './utils/dataSyncManager.js';
import { parseOrderDate } from './utils/dateUtils.js';
import {
  applyAdminFontSize,
  parseFontSize,
  roundToStep,
} from './utils/fontSize.js';
import {
  getNotificationDuration,
  getNotificationMessage,
} from './utils/notificationMessages.js';
import { isPendingStatus } from './utils/orderUtils.js';
import './utils/sidebarFontSizeFix.js';
import { autoFixThemeOnLoad } from './utils/themeFixer.js';

// Lazy load heavy admin components for better performance
const AllAddressesTab = lazy(() => import('./AllAddressesTab.jsx'));
const AllOrdersDataTab = lazy(() => import('./AllOrdersDataTab.jsx'));
const AnalyticsTab = lazy(() => import('./AnalyticsTab.jsx'));
const CSVUploadModal = lazy(() => import('./CSVUploadModal.jsx'));
const ConfirmationModal = lazy(() => import('./ConfirmationModal.jsx'));
const CurrentMonthOrdersTab = lazy(() => import('./CurrentMonthOrdersTab.jsx'));
const DashboardTab = lazy(() => import('./DashboardTab.jsx'));
const ImportantNotificationsBanner = lazy(
  () => import('./ImportantNotificationsBanner.jsx')
);
const OfflineBanner = lazy(() => import('./OfflineBanner.jsx'));
const InstallPrompt = lazy(() => import('./InstallPrompt.jsx'));
const MenuPriceTab = lazy(() => import('./MenuPriceTab.jsx'));
const TodayOrderTab = lazy(() => import('./TodayOrderTab.jsx'));
const OffersTab = lazy(() => import('./OffersTab.jsx'));
const OrderModal = lazy(() => import('./OrderModal.jsx'));
const PendingAmountsTab = lazy(() => import('./PendingAmountsTab.jsx'));
const ReportsTab = lazy(() => import('./ReportsTab.jsx'));
const ReviewsTab = lazy(() => import('./ReviewsTab.jsx'));
const FinancialSummaryTab = lazy(() => import('./FinancialSummaryTab.jsx'));
const SettingsTab = lazy(() => import('./SettingsTab.jsx'));

const AdminDashboard = () => {
  const router = useRouter();
  const { showNotification } = useNotification();

  // Enterprise-level session management
  const {
    isSessionActive,
    showWarningModal,
    timeRemaining,
    extendSession,
    logoutNow,
  } = useSessionManager({
    inactivityTimeout: 30 * 60 * 1000, // 30 minutes
    warningTime: 5 * 60 * 1000, // 5 minutes warning
    onSessionExpired: (reason) => {
      if (process.env.NODE_ENV === 'development') {
        console.log('[AdminDashboard] Session expired:', reason);
      }
    },
  });

  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Initialize monitoring
      monitoringService.init();
      monitoringService.trackPageView('/admin/dashboard');

      // Setup error handlers
      const cleanup = setupGlobalErrorHandlers(showNotification);
      return cleanup;
    }
  }, [showNotification]);

  // Sync activeTab with localStorage after hydration (client-side only)
  // This prevents hydration mismatch by ensuring server and client render the same initially
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTab = localStorage.getItem('homiebites_active_tab');
      if (savedTab && savedTab !== 'dashboard') {
        // Use requestAnimationFrame to ensure this runs after initial render
        requestAnimationFrame(() => {
          setActiveTab(savedTab);
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      const stored = localStorage.getItem('homiebites_sidebar_collapsed');
      return stored === 'true';
    } catch {
      return false;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(
        'homiebites_sidebar_collapsed',
        String(sidebarCollapsed)
      );
    } catch {
      /* ignore */
    }
  }, [sidebarCollapsed]);
  const [sidebarAutoHidden, setSidebarAutoHidden] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showCSVUploadModal, setShowCSVUploadModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState({
    show: false,
    title: '',
    message: '',
    type: 'warning',
    onConfirm: null,
    onCancelCallback: null,
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    isLoading: false,
  });
  const [newOrder, setNewOrder] = useState({
    date: new Date().toISOString().split('T')[0],
    deliveryAddress: '',
    quantity: 1,
    unitPrice: 100,
    total: 100,
    mode: 'Lunch',
    status: 'Unpaid',
    paymentMode: '',
  });
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(25);
  const [allOrdersFilterMonth, setAllOrdersFilterMonth] = useState('');
  const [allOrdersFilterAddress, setAllOrdersFilterAddress] = useState('');
  const [allOrdersFilterPaymentStatus, setAllOrdersFilterPaymentStatus] =
    useState('');
  const [dismissedNotifications, setDismissedNotifications] = useState([]);
  const [showOverdueFilter, setShowOverdueFilter] = useState(false);
  const [dateFilterForOrders, setDateFilterForOrders] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const [dataRefreshKey, setDataRefreshKey] = useState(0);

  const {
    orders,
    settings,
    setSettings,
    loading,
    loadOrders,
    loadMenuData,
    loadOffersData,
    loadUsers,
    loadSettings,
    currentUser,
    fastDelete,
    fastUpdate,
    fastCreate,
    cancelAll,
    loadError,
    menuData,
    reviews,
    users,
  } = useFastDataSync();

  const unreadNotifications = useMemo(() => {
    const list = Array.isArray(orders) ? orders : [];
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // 1. Count unpaid orders > 30 days (matching NotificationDropdown logic)
    const pending = list.filter((o) =>
      isPendingStatus(o.status, o.paymentStatus)
    );
    const overdueCount = pending
      .map((order) => {
        try {
          const orderDate = parseOrderDate(
            order.date || order.order_date || null
          );
          if (!orderDate) return null;
          const orderDateMidnight = new Date(orderDate);
          orderDateMidnight.setHours(0, 0, 0, 0);
          // Count only orders > 30 days (matching dropdown criteria)
          return orderDateMidnight < thirtyDaysAgo ? 1 : null;
        } catch (e) {
          return null;
        }
      })
      .filter(Boolean).length;

    // 2. Count website orders from last 7 days (matching NotificationDropdown logic)
    // Exclude Excel uploads - only count actual website/API orders
    const websiteOrdersCount = list.filter((order) => {
      // Exclude Excel uploads explicitly
      if (order.source === 'excel') {
        return false;
      }

      // Check if order is from website or API
      // Only use paymentMode as fallback if source is not set (legacy orders)
      const isWebsiteOrder =
        order.source === 'website' ||
        order.source === 'api' ||
        (!order.source &&
          order.paymentMode &&
          order.paymentMode.toLowerCase() === 'online');

      if (!isWebsiteOrder) return false;

      try {
        const orderDate = parseOrderDate(
          order.date || order.order_date || null
        );
        return orderDate && orderDate >= sevenDaysAgo;
      } catch (e) {
        return false;
      }
    }).length;

    // Return total count (matching what NotificationDropdown will show)
    return overdueCount + websiteOrdersCount;
  }, [orders]);

  // Helper function for color conversion
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  useEffect(() => {
    const token = localStorage.getItem('homiebites_token');
    const adminFlag = localStorage.getItem('homiebites_admin');
    const userStr = localStorage.getItem('homiebites_user');

    const userRole = userStr ? JSON.parse(userStr).role : null;
    const isAdminRole =
      userRole && (userRole.toLowerCase() === 'admin' || userRole === 'Admin');
    const isAdmin = adminFlag === 'true' || isAdminRole;

    if (!token || !isAdmin) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          '[AdminDashboard] Authentication check failed, redirecting to /admin'
        );
      }
      router.replace('/admin');
    }
  }, [router]);

  useEffect(() => {
    return () => {
      if (cancelAll) cancelAll();
      dataSyncManager.cleanup();
    };
  }, [cancelAll]);

  // Track when component has mounted on client to avoid hydration mismatches
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || typeof window === 'undefined') return;

    const savedPrimaryColor =
      localStorage.getItem('homiebites_primary_color') || '#449031';
    const savedSecondaryColor =
      localStorage.getItem('homiebites_secondary_color') || '#B8D84E';
    const savedFontSize = localStorage.getItem('homiebites_font_size') || '18';
    const savedFontFamily =
      localStorage.getItem('homiebites_font_family') || 'Baloo 2';

    const root = document.documentElement;
    const adminDashboard = document.querySelector('.admin-dashboard');

    const fs = parseFontSize(savedFontSize);
    if (fs != null) applyAdminFontSize(fs);

    root.style.setProperty('--admin-accent', savedPrimaryColor);
    const rgb = hexToRgb(savedPrimaryColor);
    if (rgb) {
      root.style.setProperty(
        '--admin-accent-light',
        `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`
      );
    }

    if (savedSecondaryColor) {
      root.style.setProperty('--admin-secondary', savedSecondaryColor);
      const secondaryRgb = hexToRgb(savedSecondaryColor);
      if (secondaryRgb) {
        root.style.setProperty(
          '--admin-secondary-light',
          `rgba(${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}, 0.15)`
        );
      }
    }

    if (savedFontFamily) {
      root.style.setProperty(
        '--font-primary',
        `'${savedFontFamily}', sans-serif`
      );
    }

    // Always apply light theme (dark theme removed)
    document.documentElement.classList.add('light-theme');
    document.documentElement.classList.remove('dark-theme');
    if (adminDashboard) {
      adminDashboard.classList.add('light-theme');
      adminDashboard.classList.remove('dark-theme');
    }

    setTimeout(() => {
      autoFixThemeOnLoad(5, 200);
    }, 100);
  }, [isMounted]);

  useEffect(() => {
    if (!isMounted || typeof window === 'undefined' || !settings) return;

    const root = document.documentElement;
    const adminDashboard = document.querySelector('.admin-dashboard');

    // Always use light theme alpha values (dark theme removed)

    if (settings.primaryColor !== undefined) {
      localStorage.setItem('homiebites_primary_color', settings.primaryColor);
      const primaryColor = settings.primaryColor;
      const rgb = hexToRgb(primaryColor);

      // Set on both :root and .admin-dashboard
      root.style.setProperty('--admin-accent', primaryColor);
      if (adminDashboard) {
        adminDashboard.style.setProperty('--admin-accent', primaryColor);
      }

      if (rgb) {
        // Use light theme alpha value
        const accentLightAlpha = 0.1;
        const accentLight = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${accentLightAlpha})`;
        root.style.setProperty('--admin-accent-light', accentLight);
        if (adminDashboard) {
          adminDashboard.style.setProperty('--admin-accent-light', accentLight);
        }
      }
    }
    if (settings.secondaryColor !== undefined) {
      localStorage.setItem(
        'homiebites_secondary_color',
        settings.secondaryColor
      );
      const secondaryColor = settings.secondaryColor;
      const rgb = hexToRgb(secondaryColor);

      // Set on both :root and .admin-dashboard
      root.style.setProperty('--admin-secondary', secondaryColor);
      if (adminDashboard) {
        adminDashboard.style.setProperty('--admin-secondary', secondaryColor);
      }

      if (rgb) {
        // Use light theme alpha value
        const secondaryLightAlpha = 0.12;
        const secondaryLight = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${secondaryLightAlpha})`;
        root.style.setProperty('--admin-secondary-light', secondaryLight);
        if (adminDashboard) {
          adminDashboard.style.setProperty(
            '--admin-secondary-light',
            secondaryLight
          );
        }
      }
    }
    // Always ensure light theme is applied (dark theme removed)
    root.classList.remove('dark-theme');
    root.classList.add('light-theme');
    if (adminDashboard) {
      adminDashboard.classList.remove('dark-theme');
      adminDashboard.classList.add('light-theme');
    }

    // Re-apply colors with light theme alpha values
    if (settings.primaryColor) {
      const rgb = hexToRgb(settings.primaryColor);
      if (rgb) {
        const accentLightAlpha = 0.1;
        const accentLight = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${accentLightAlpha})`;
        root.style.setProperty('--admin-accent-light', accentLight);
        if (adminDashboard) {
          adminDashboard.style.setProperty('--admin-accent-light', accentLight);
        }
      }
    }

    if (settings.secondaryColor) {
      const rgb = hexToRgb(settings.secondaryColor);
      if (rgb) {
        const secondaryLightAlpha = 0.12;
        const secondaryLight = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${secondaryLightAlpha})`;
        root.style.setProperty('--admin-secondary-light', secondaryLight);
        if (adminDashboard) {
          adminDashboard.style.setProperty(
            '--admin-secondary-light',
            secondaryLight
          );
        }
      }
    }
    if (settings.fontSize !== undefined) {
      const v = parseFontSize(settings.fontSize);
      const px = v != null ? roundToStep(v) : 16;
      localStorage.setItem('homiebites_font_size', String(px));
      applyAdminFontSize(px);
      // Dispatch event to notify all components
      window.dispatchEvent(
        new CustomEvent('adminFontSizeChanged', { detail: { fontSize: px } })
      );
    }
    if (settings.fontFamily !== undefined) {
      localStorage.setItem('homiebites_font_family', settings.fontFamily);
      root.style.setProperty(
        '--font-primary',
        `'${settings.fontFamily}', sans-serif`
      );
      // Load Google Font if not already present
      const fontName = String(settings.fontFamily).replace(/\s+/g, '+');
      const existingLink = document.querySelector(
        `link[href*="fonts.googleapis.com"][href*="${fontName}"]`
      );
      if (!existingLink && fontName) {
        const oldLinks = document.querySelectorAll(
          'link[href*="fonts.googleapis.com"]'
        );
        oldLinks.forEach((link) => link.remove());
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?family=${fontName}:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600;1,700;1,800&display=swap`;
        document.head.appendChild(link);
      }
    }
  }, [settings, isMounted]);

  useEffect(() => {
    if (typeof window !== 'undefined' && activeTab) {
      localStorage.setItem('homiebites_active_tab', activeTab);
      // Track tab changes
      monitoringService.trackEvent('admin_tab_change', { tab: activeTab });
    }
  }, [activeTab]);

  // Refresh orders when opening Pending Amounts so unpaid list is up to date
  useEffect(() => {
    if (activeTab === 'pendingAmounts' && loadOrders) {
      loadOrders({}, true);
    }
  }, [activeTab, loadOrders]);

  useEffect(() => {
    if (!isMounted || typeof window === 'undefined') return;

    const sync = () => {
      const key = localStorage.getItem('homiebites_font_size') || '18';
      const v = parseFontSize(key);
      applyAdminFontSize(v ?? 16);
    };

    const handleFontSizeChange = (e) => {
      const v = parseFontSize(e.detail?.fontSize);
      if (v != null) applyAdminFontSize(v);
    };

    requestAnimationFrame(() => {
      sync();
      setTimeout(sync, 100);
    });

    window.addEventListener('adminFontSizeChanged', handleFontSizeChange);
    return () =>
      window.removeEventListener('adminFontSizeChanged', handleFontSizeChange);
  }, [isMounted]);

  const handleLogout = async () => {
    showConfirmation({
      title: 'Logout',
      message:
        'Are you sure you want to logout? You will need to login again to access the dashboard.',
      type: 'warning',
      confirmText: 'Logout',
      cancelText: 'Cancel',
      onConfirm: async () => {
        try {
          // Use session manager's logout function for proper cleanup
          await logoutNow();
        } catch (error) {
          console.error('[AdminDashboard] Error during logout:', error);
          // Fallback to direct logout
          try {
            await logout();
            window.location.href = '/admin';
          } catch (fallbackError) {
            console.error(
              '[AdminDashboard] Fallback logout error:',
              fallbackError
            );
            window.location.href = '/admin';
          }
        }
      },
    });
  };

  const handleAddOrder = async (orderData) => {
    try {
      await fastCreate(
        orderData,
        async () => {
          if (showNotification) {
            showNotification(
              getNotificationMessage('orders', 'addSuccess'),
              'success',
              getNotificationDuration('success')
            );
          }

          try {
            await loadOrders();
          } catch (refreshError) {
            console.warn('Error refreshing orders after save:', refreshError);
          }

          const lastSubmittedDate = orderData.date || '';
          let formattedDate = lastSubmittedDate;

          if (!formattedDate || !/^\d{2}\/\d{2}\/\d{4}$/.test(formattedDate)) {
            const today = new Date();
            formattedDate = `${String(today.getDate()).padStart(2, '0')}/${String(
              today.getMonth() + 1
            ).padStart(2, '0')}/${today.getFullYear()}`;
          }

          setNewOrder({
            date: formattedDate,
            deliveryAddress: '',
            quantity: 1,
            unitPrice: settings?.defaultUnitPrice || 100,
            total: settings?.defaultUnitPrice || 100,
            mode: 'Lunch',
            status: 'Unpaid',
            paymentMode: '',
          });
        },
        (error) => {
          console.error('Error adding order:', error);
          if (showNotification) {
            const errorMessage =
              error?.message || getNotificationMessage('orders', 'addError');
            showNotification(
              errorMessage,
              'error',
              getNotificationDuration('error')
            );
          }
        }
      );
    } catch (error) {
      console.error('Error adding order:', error);
      if (showNotification) {
        const errorMessage =
          error?.message || getNotificationMessage('orders', 'addError');
        showNotification(
          errorMessage,
          'error',
          getNotificationDuration('error')
        );
      }
    }
  };

  const performOrderUpdate = async (
    orderId,
    orderData,
    skipModalClose = false
  ) => {
    try {
      const order = (orders || []).find(
        (o) => o.orderId === orderId || o._id === orderId || o.id === orderId
      );
      const apiOrderId = order?._id || order?.id || order?.orderId || orderId;

      const updateData = {};
      const allowedFields = [
        'orderId',
        'date',
        'deliveryAddress',
        'quantity',
        'unitPrice',
        'totalAmount',
        'mode',
        'status',
        'paymentStatus',
        'paymentMode',
        'notes',
        'customerName',
        'billingMonth',
        'billingYear',
        'addressId',
      ];

      allowedFields.forEach((key) => {
        if (orderData[key] !== undefined) {
          if (
            key === 'paymentMode' ||
            key === 'notes' ||
            key === 'customerName'
          ) {
            updateData[key] = orderData[key] === '' ? '' : orderData[key] || '';
          } else if (orderData[key] !== null) {
            updateData[key] = orderData[key];
          }
        }
      });

      if (updateData.status && !updateData.paymentStatus) {
        const statusLower = String(updateData.status).toLowerCase().trim();
        if (statusLower === 'paid' || statusLower === 'delivered') {
          updateData.paymentStatus = 'Paid';
        } else {
          updateData.paymentStatus = 'Pending';
        }
      } else if (updateData.paymentStatus && !updateData.status) {
        if (updateData.paymentStatus === 'Paid') {
          updateData.status = 'Paid';
        } else if (updateData.paymentStatus === 'Pending') {
          updateData.status = order?.status || 'Unpaid';
        }
      }

      await fastUpdate(
        apiOrderId,
        updateData,
        () => {
          if (showNotification) {
            showNotification(
              getNotificationMessage('orders', 'updateSuccess'),
              'success',
              getNotificationDuration('success')
            );
          }
          if (!skipModalClose) {
            setShowOrderModal(false);
            setEditingOrder(null);
          }

          if (loadOrders) {
            setTimeout(() => {
              loadOrders();
            }, 200);
          }
        },
        (error) => {
          console.error('Error updating order:', error);
          if (showNotification) {
            const errorMessage =
              error?.message || getNotificationMessage('orders', 'updateError');
            showNotification(
              errorMessage,
              'error',
              getNotificationDuration('error')
            );
          }
        }
      );
    } catch (error) {
      console.error('Error updating order:', error);
      if (showNotification) {
        const errorMessage =
          error?.message || getNotificationMessage('orders', 'updateError');
        showNotification(
          errorMessage,
          'error',
          getNotificationDuration('error')
        );
      }
      throw error;
    }
  };

  const handleEditOrder = async (orderId, orderData) => {
    const order = (orders || []).find(
      (o) => o.orderId === orderId || o._id === orderId || o.id === orderId
    );
    const orderInfo = order
      ? `Order ${order.orderId || orderId} for ${
          order.deliveryAddress || order.customerAddress || 'N/A'
        }`
      : `Order ${orderId}`;

    showConfirmation({
      title: 'Update Order',
      message: `Are you sure you want to save changes to ${orderInfo}?`,
      type: 'info',
      confirmText: 'Save Changes',
      onConfirm: async () => {
        await performOrderUpdate(orderId, orderData);
      },
    });
  };

  const showConfirmation = (config) => {
    setConfirmationModal({
      show: true,
      title: config.title || 'Confirm Action',
      message: config.message || 'Are you sure you want to proceed?',
      type: config.type || 'warning',
      onConfirm: async () => {
        if (config.onConfirm) {
          setConfirmationModal((prev) => ({ ...prev, isLoading: true }));
          try {
            await config.onConfirm();
            setConfirmationModal((prev) => ({
              ...prev,
              show: false,
              isLoading: false,
            }));
          } catch (error) {
            const errorMessage =
              error?.message ||
              error?.error ||
              String(error) ||
              'Action failed';
            if (showNotification) {
              showNotification(errorMessage, 'error', 6000);
            }
            setConfirmationModal((prev) => ({ ...prev, isLoading: false }));
          }
        } else {
          setConfirmationModal((prev) => ({ ...prev, show: false }));
        }
      },
      onCancelCallback: config.onCancel || null,
      confirmText: config.confirmText || 'Confirm',
      cancelText: config.cancelText || 'Cancel',
      isLoading: false,
    });
  };

  const handleDeleteOrder = async (orderId) => {
    const order = (orders || []).find((o) => (o._id || o.orderId) === orderId);
    const orderInfo = order
      ? `Order ${order.orderId || orderId} for ${
          order.deliveryAddress || order.customerAddress || 'N/A'
        }`
      : `Order ${orderId}`;

    showConfirmation({
      title: 'Delete Order',
      message: `Are you sure you want to delete ${orderInfo}? This action cannot be undone.`,
      type: 'danger',
      confirmText: 'Delete',
      onConfirm: async () => {
        try {
          await fastDelete(
            orderId,
            () => {
              if (showNotification) {
                showNotification(
                  getNotificationMessage('orders', 'deleteSuccess'),
                  'success',
                  getNotificationDuration('success')
                );
              }
            },
            (error) => {
              if (process.env.NODE_ENV === 'development') {
                console.error('Error deleting order:', error);
              }
              if (showNotification) {
                const errorMessage =
                  error?.message ||
                  getNotificationMessage('orders', 'deleteError');
                showNotification(
                  errorMessage,
                  'error',
                  getNotificationDuration('error')
                );
              }
            }
          );
        } catch (error) {
          console.error('Error deleting order:', error);
          if (showNotification) {
            showNotification(
              getNotificationMessage('orders', 'deleteError'),
              'error',
              getNotificationDuration('error')
            );
          }
        }
      },
    });
  };

  const handleUpdateOrderStatus = async (
    orderId,
    status,
    skipConfirmation = false
  ) => {
    const order = (orders || []).find(
      (o) => o.orderId === orderId || o._id === orderId || o.id === orderId
    );

    if (!order) {
      if (showNotification) {
        showNotification(
          getNotificationMessage('orders', 'notFound'),
          'error',
          getNotificationDuration('error')
        );
      }
      return;
    }

    const orderInfo = `Order ${order.orderId || orderId} for ${
      order.deliveryAddress || order.customerAddress || 'N/A'
    }`;

    const currentStatus = order.status || order.paymentStatus || 'Unknown';
    const normalizedCurrentStatus = currentStatus.toLowerCase().trim();
    const normalizedNewStatus = status.toLowerCase().trim();

    const isCurrentlyPaid =
      normalizedCurrentStatus === 'paid' ||
      normalizedCurrentStatus === 'delivered';
    const isNewlyPaid = normalizedNewStatus === 'paid';
    const isCurrentlyPending =
      normalizedCurrentStatus === 'pending' ||
      normalizedCurrentStatus === 'unpaid';
    const isNewlyPending =
      normalizedNewStatus === 'pending' || normalizedNewStatus === 'unpaid';

    if (
      (isCurrentlyPaid && isNewlyPaid) ||
      (isCurrentlyPending && isNewlyPending)
    ) {
      return;
    }

    const performUpdate = async () => {
      try {
        const apiOrderId = order._id || order.id || order.orderId;

        let normalizedStatus;
        let normalizedPaymentStatus;

        const statusLower = String(status).toLowerCase().trim();
        if (statusLower === 'paid') {
          normalizedStatus = 'Paid';
          normalizedPaymentStatus = 'Paid';
        } else if (statusLower === 'unpaid' || statusLower === 'pending') {
          normalizedStatus = 'Unpaid';
          normalizedPaymentStatus = 'Pending';
        } else {
          normalizedStatus = status.trim();
          normalizedPaymentStatus =
            statusLower === 'paid' || statusLower === 'delivered'
              ? 'Paid'
              : 'Pending';
        }

        await fastUpdate(
          apiOrderId,
          {
            status: normalizedStatus,
            paymentStatus: normalizedPaymentStatus,
          },
          () => {
            if (showNotification) {
              showNotification(
                getNotificationMessage('orders', 'statusUpdateSuccess'),
                'success',
                getNotificationDuration('success')
              );
            }

            if (loadOrders) {
              setTimeout(() => {
                loadOrders({}, true);
              }, 300);
            }
          },
          (error) => {
            console.error('Error updating order status:', error);
            if (showNotification) {
              const errorMessage =
                error?.message ||
                getNotificationMessage('orders', 'statusUpdateError');
              showNotification(
                errorMessage,
                'error',
                getNotificationDuration('error')
              );
            }

            if (loadOrders) {
              loadOrders();
            }
          }
        );
      } catch (error) {
        console.error('Error updating order status:', error);
        if (showNotification) {
          const errorMessage =
            error?.message ||
            getNotificationMessage('orders', 'statusUpdateError');
          showNotification(
            errorMessage,
            'error',
            getNotificationDuration('error')
          );
        }

        if (loadOrders) {
          loadOrders();
        }
      }
    };

    if (!skipConfirmation) {
      showConfirmation({
        title: 'Update Order Status',
        message: `Are you sure you want to change the status of ${orderInfo} from "${currentStatus}" to "${status}"?`,
        type: 'info',
        confirmText: 'Update Status',
        onConfirm: performUpdate,
      });
    } else {
      await performUpdate();
    }
  };

  const handleViewCustomerOrders = (address) => {
    setAllOrdersFilterAddress(address);
    setActiveTab('allOrdersData');
  };

  const handleDismissNotification = (notificationId) => {
    setDismissedNotifications((prev) => [...prev, notificationId]);
    const stored = JSON.parse(
      localStorage.getItem('homiebites_dismissed_notifications') || '[]'
    );
    if (!stored.includes(notificationId)) {
      stored.push(notificationId);
      localStorage.setItem(
        'homiebites_dismissed_notifications',
        JSON.stringify(stored)
      );
    }
  };

  const handleViewPendingAmounts = () => {
    setShowOverdueFilter(true);
    setActiveTab('pendingAmounts');
  };

  useEffect(() => {
    const stored = JSON.parse(
      localStorage.getItem('homiebites_dismissed_notifications') || '[]'
    );
    setDismissedNotifications(stored);
  }, []);

  const handleViewOrder = (orderId) => {
    const order = (orders || []).find((o) => (o._id || o.orderId) === orderId);
    if (order) {
      setEditingOrder(order);
      setShowOrderModal(true);
    }
  };

  const handleSendReminder = (_orderId) => {
    if (showNotification) {
      showNotification(
        getNotificationMessage('reminders', 'sentSuccess'),
        'success',
        getNotificationDuration('success')
      );
    }
  };

  const handleAcceptOrder = async (order) => {
    try {
      // Accept order means updating its status to accepted/confirmed
      // and ensuring it's properly recorded in the system
      const apiOrderId = order._id || order.id || order.orderId;

      await fastUpdate(
        apiOrderId,
        {
          status: 'Accepted',
          paymentStatus: order.paymentStatus || 'Pending',
        },
        () => {
          if (showNotification) {
            showNotification(
              `Order #${order.orderId || 'N/A'} has been accepted and added to the system`,
              'success',
              getNotificationDuration('success')
            );
          }
          if (loadOrders) {
            setTimeout(() => {
              loadOrders();
            }, 200);
          }
        },
        (error) => {
          console.error('Error accepting order:', error);
          if (showNotification) {
            const errorMessage = error?.message || 'Failed to accept order';
            showNotification(
              errorMessage,
              'error',
              getNotificationDuration('error')
            );
          }
        }
      );
    } catch (error) {
      console.error('Error accepting order:', error);
      if (showNotification) {
        showNotification(
          error?.message || 'Failed to accept order',
          'error',
          getNotificationDuration('error')
        );
      }
    }
  };

  const handleCancelOrder = async (order) => {
    try {
      // Cancel order means updating its status to cancelled
      const apiOrderId = order._id || order.id || order.orderId;

      await fastUpdate(
        apiOrderId,
        {
          status: 'Cancelled',
          paymentStatus: 'Cancelled',
        },
        () => {
          if (showNotification) {
            showNotification(
              `Order #${order.orderId || 'N/A'} has been cancelled`,
              'success',
              getNotificationDuration('success')
            );
          }
          if (loadOrders) {
            setTimeout(() => {
              loadOrders();
            }, 200);
          }
        },
        (error) => {
          console.error('Error cancelling order:', error);
          if (showNotification) {
            const errorMessage = error?.message || 'Failed to cancel order';
            showNotification(
              errorMessage,
              'error',
              getNotificationDuration('error')
            );
          }
        }
      );
    } catch (error) {
      console.error('Error cancelling order:', error);
      if (showNotification) {
        showNotification(
          error?.message || 'Failed to cancel order',
          'error',
          getNotificationDuration('error')
        );
      }
    }
  };

  const handleUpdateSettings = async (newSettings) => {
    try {
      const response = await api.updateSettings(newSettings);

      if (response && response.success) {
        if (showNotification) {
          let message = '';

          if (newSettings.businessInfo) {
            message = 'Business information has been saved successfully';
          } else if (newSettings.pricing) {
            const { defaultUnitPrice, lunchPrice, dinnerPrice } =
              newSettings.pricing;
            const priceParts = [];
            if (defaultUnitPrice !== undefined)
              priceParts.push(`Default: ₹${defaultUnitPrice}`);
            if (lunchPrice !== undefined)
              priceParts.push(`Lunch: ₹${lunchPrice}`);
            if (dinnerPrice !== undefined)
              priceParts.push(`Dinner: ₹${dinnerPrice}`);
            message =
              priceParts.length > 0
                ? `Pricing updated: ${priceParts.join(', ')}`
                : 'Pricing configuration has been updated';
          } else if (newSettings.orderSettings) {
            message = 'Order settings have been saved successfully';
          } else if (newSettings.notificationPrefs) {
            message = 'Notification preferences have been updated';
          } else if (newSettings.dataSettings) {
            const { autoBackup, autoBackupTime } = newSettings.dataSettings;
            message = autoBackup
              ? `Automatic backup enabled: Daily at ${autoBackupTime}`
              : 'Automatic backup has been disabled';
          } else if (newSettings.userProfile) {
            const { newPassword } = newSettings.userProfile;
            message = newPassword
              ? 'Your profile and password have been updated'
              : 'Your profile has been updated successfully';
          } else if (newSettings.kitchenSettings) {
            const { kitchenEnabled, kitchenClosedFrom, kitchenClosedTo } =
              newSettings.kitchenSettings;
            const statusText = kitchenEnabled ? 'open' : 'closed';
            if (kitchenClosedFrom && kitchenClosedTo) {
              const fromDate = new Date(kitchenClosedFrom).toLocaleDateString(
                'en-IN',
                {
                  day: 'numeric',
                  month: 'short',
                }
              );
              const toDate = new Date(kitchenClosedTo).toLocaleDateString(
                'en-IN',
                {
                  day: 'numeric',
                  month: 'short',
                }
              );
              message = `Kitchen is now ${statusText} (${fromDate} - ${toDate})`;
            } else if (!kitchenEnabled) {
              message = 'Kitchen is now closed for today';
            } else {
              message = 'Kitchen is now open';
            }
            // Reload settings to update indicator
            if (loadSettings) {
              setTimeout(() => {
                loadSettings();
              }, 300);
            }
          } else if (newSettings.themeSettings) {
            const {
              primaryColor,
              secondaryColor,
              fontSize,
              fontFamily,
              theme,
            } = newSettings.themeSettings;

            if (primaryColor !== undefined) {
              localStorage.setItem('homiebites_primary_color', primaryColor);
            }
            if (secondaryColor !== undefined) {
              localStorage.setItem(
                'homiebites_secondary_color',
                secondaryColor
              );
            }
            if (fontSize !== undefined) {
              const v = parseFontSize(fontSize);
              const px = v != null ? roundToStep(v) : 16;
              localStorage.setItem('homiebites_font_size', String(px));
              applyAdminFontSize(px);
              // Dispatch event to notify all components
              window.dispatchEvent(
                new CustomEvent('adminFontSizeChanged', {
                  detail: { fontSize: px },
                })
              );
              // Update settings state to preserve fontSize
              if (typeof setSettings === 'function') {
                setSettings((prev) => ({ ...prev, fontSize: String(px) }));
              }
            }
            if (fontFamily !== undefined) {
              localStorage.setItem('homiebites_font_family', fontFamily);
              if (typeof setSettings === 'function') {
                setSettings((prev) => ({ ...prev, fontFamily }));
              }
              // Apply immediately (don't wait for useEffect)
              try {
                const r = document.documentElement;
                r.style.setProperty(
                  '--font-primary',
                  `'${fontFamily}', sans-serif`
                );
                const fontName = String(fontFamily).replace(/\s+/g, '+');
                const hasLink = document.querySelector(
                  `link[href*="fonts.googleapis.com"][href*="${fontName}"]`
                );
                if (!hasLink && fontName) {
                  document
                    .querySelectorAll('link[href*="fonts.googleapis.com"]')
                    .forEach((link) => link.remove());
                  const link = document.createElement('link');
                  link.rel = 'stylesheet';
                  link.href = `https://fonts.googleapis.com/css2?family=${fontName}:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600;1,700;1,800&display=swap`;
                  document.head.appendChild(link);
                }
              } catch (e) {
                if (process.env.NODE_ENV === 'development')
                  console.warn('Apply font failed:', e);
              }
            }
            if (newSettings.themeSettings.autoHideSidebar !== undefined) {
              const savedAutoHideValue = Boolean(
                newSettings.themeSettings.autoHideSidebar
              );
              // Update settings state IMMEDIATELY - this is the source of truth
              // The Sidebar component reads from settings prop, so this update will take effect immediately
              if (typeof setSettings === 'function') {
                setSettings((prev) => ({
                  ...prev,
                  autoHideSidebar: savedAutoHideValue,
                }));
              }
              // Reload settings from database after a delay to ensure the persisted value is loaded
              // This ensures the value is correctly retrieved on next page load
              if (loadSettings) {
                setTimeout(() => {
                  loadSettings();
                }, 800); // Wait longer to ensure DB save completed
              }
            }

            const changes = [];

            if (theme) {
              const themeName = 'Light';
              changes.push(`${themeName} theme`);
            }

            if (primaryColor) {
              const colorNames = {
                '#449031': 'Green',
                '#3b82f6': 'Blue',
                '#8b5cf6': 'Purple',
                '#ef4444': 'Red',
                '#10b981': 'Emerald',
                '#c45c2d': 'Orange',
              };
              const colorName =
                colorNames[primaryColor.toLowerCase()] ||
                primaryColor.toUpperCase();
              changes.push(`${colorName} accent color`);
            }

            if (fontSize != null) {
              const v = parseFontSize(fontSize);
              const px = v != null ? roundToStep(v) : 16;
              changes.push(`${px}px font size`);
            }

            if (fontFamily && fontFamily.trim() !== '') {
              changes.push(`${fontFamily} font family`);
            }

            if (changes.length > 0) {
              message = `Appearance updated: ${changes.join(', ')}`;
            } else {
              message = 'Appearance settings have been updated successfully';
            }
          } else {
            message = 'Settings have been saved successfully';
          }

          showNotification(
            message || getNotificationMessage('settings', 'updateSuccess'),
            'success',
            getNotificationDuration('success')
          );
        }
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      if (showNotification) {
        const errorMessage = error.message || 'Error updating settings';
        showNotification(
          errorMessage || getNotificationMessage('settings', 'updateError'),
          'error',
          getNotificationDuration('error')
        );
      }
    }
  };

  const handleBackup = async () => {
    try {
      const payload = {
        version: 1,
        exportedAt: new Date().toISOString(),
        orders: Array.isArray(orders) ? orders : [],
        settings:
          settings && typeof settings === 'object' ? { ...settings } : {},
      };
      const json = JSON.stringify(payload, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `homiebites-backup-${new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-')}.json`;
      a.click();
      URL.revokeObjectURL(url);
      if (showNotification) {
        showNotification(
          getNotificationMessage('backup', 'createSuccess'),
          'success',
          getNotificationDuration('success')
        );
      }
    } catch (error) {
      console.error('Error creating backup:', error);
      if (showNotification) {
        showNotification(
          getNotificationMessage('backup', 'createError'),
          'error',
          getNotificationDuration('error')
        );
      }
    }
  };

  const handleRestore = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.onchange = async (e) => {
      const file = e.target?.files?.[0];
      input.value = '';
      if (!file) return;
      try {
        const text = await file.text();
        const parsed = JSON.parse(text);
        const orders = Array.isArray(parsed?.orders) ? parsed.orders : [];
        const settings =
          parsed?.settings && typeof parsed.settings === 'object'
            ? parsed.settings
            : null;
        const hasOrders = orders.length > 0;
        const hasSettings = settings && Object.keys(settings).length > 0;
        if (!hasOrders && !hasSettings) {
          if (showNotification) {
            showNotification(
              'Backup file contains no orders or settings to restore.',
              'warning',
              getNotificationDuration('warning')
            );
          }
          return;
        }
        const msg = [
          hasOrders &&
            `${orders.length} order${orders.length !== 1 ? 's' : ''}`,
          hasSettings && 'settings',
        ]
          .filter(Boolean)
          .join(' and ');
        showConfirmation({
          title: 'Restore from backup',
          message: `This will import ${msg} from the backup. Orders will be added to existing data. Continue?`,
          type: 'info',
          confirmText: 'Restore',
          onConfirm: async () => {
            try {
              if (hasOrders) await api.bulkImportOrders(orders);
              if (hasSettings)
                await api.updateSettings({ ...settings, _restore: true });
              if (loadOrders) await loadOrders();
              if (loadSettings) await loadSettings();
              if (showNotification) {
                showNotification(
                  getNotificationMessage('backup', 'restoreSuccess'),
                  'success',
                  getNotificationDuration('success')
                );
              }
            } catch (err) {
              console.error('Error during restore:', err);
              if (showNotification) {
                showNotification(
                  err?.message ||
                    getNotificationMessage('backup', 'restoreError'),
                  'error',
                  getNotificationDuration('error')
                );
              }
            }
          },
        });
      } catch (err) {
        console.error('Error parsing backup file:', err);
        if (showNotification) {
          showNotification(
            'Invalid backup file. Please select a HomieBites JSON backup.',
            'error',
            getNotificationDuration('error')
          );
        }
      }
    };
    input.click();
  };

  const handleClearAllMenuItems = async () => {
    try {
      await api.deleteMenu();
      if (showNotification) {
        showNotification(
          'All menu items and default record deleted successfully',
          'success'
        );
      }
    } catch (error) {
      console.error('Error deleting menu:', error);
      if (showNotification) {
        showNotification(
          'Error deleting menu: ' + (error.message || 'Unknown error'),
          'error'
        );
      }
    }
  };

  const handleClearAllData = async (skipConfirmation = false) => {
    const performClear = async () => {
      try {
        const response = await api.clearAllOrders();
        if (response.success) {
          const deletedCount = response.deletedCount || 0;
          const afterCount =
            response.afterCount !== undefined ? response.afterCount : null;

          if (afterCount !== null && afterCount > 0) {
            if (showNotification) {
              showNotification(
                getNotificationMessage('orders', 'clearAllWarning', afterCount),
                'warning',
                getNotificationDuration('warning')
              );
            }
          } else {
            if (showNotification) {
              showNotification(
                getNotificationMessage(
                  'orders',
                  'clearAllSuccess',
                  deletedCount
                ),
                'success',
                getNotificationDuration('success')
              );
            }
          }

          setTimeout(async () => {
            if (loadOrders) {
              try {
                await loadOrders();

                setTimeout(async () => {
                  try {
                    if (loadOrders) await loadOrders();
                  } catch (refreshError) {
                    if (showNotification) {
                      showNotification(
                        refreshError.message ||
                          'Failed to verify orders were cleared',
                        'error'
                      );
                    }
                  }
                }, 500);
              } catch (error) {
                if (showNotification) {
                  showNotification(
                    error.message ||
                      'Failed to refresh orders after clearing data',
                    'error'
                  );
                }
              }
            }
          }, 1000);
        } else {
          if (showNotification) {
            showNotification(
              response.error ||
                getNotificationMessage('orders', 'clearAllError'),
              'error',
              getNotificationDuration('error')
            );
          }
        }
      } catch (error) {
        console.error('Error clearing data:', error);
        if (showNotification) {
          showNotification(
            error.message || getNotificationMessage('orders', 'clearAllError'),
            'error',
            getNotificationDuration('error')
          );
        }
      }
    };

    if (!skipConfirmation) {
      showConfirmation({
        title: 'Clear All Data',
        message:
          'Are you sure you want to clear ALL orders data? This action cannot be undone and will permanently delete all orders.',
        type: 'danger',
        confirmText: 'Clear All Data',
        onConfirm: performClear,
      });
    } else {
      await performClear();
    }
  };

  const getTabInfo = () => {
    const getMonthLockStatus = () => {
      if (!settings || !settings.monthLockedTill) {
        return { status: 'OPEN', lockedTill: null };
      }
      try {
        const lockedDate = new Date(settings.monthLockedTill);
        const currentDate = new Date();
        if (lockedDate > currentDate) {
          const monthNames = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
          ];
          const month = monthNames[lockedDate.getMonth()];
          const year = lockedDate.getFullYear();
          return { status: 'LOCKED', lockedTill: `${month} ${year}` };
        }
      } catch (e) {}
      return { status: 'OPEN', lockedTill: null };
    };

    const monthLockStatus = getMonthLockStatus();

    const tabInfoMap = {
      dashboard: {
        title: 'Dashboard',
        subtitle: 'Overview of your business metrics and performance',
      },
      allOrdersData: {
        title: 'All Orders',
        subtitle: 'View and manage all orders across all time periods',
      },
      currentMonthOrders: {
        title: 'Current Month Orders',
        subtitle: 'Manage orders for the current billing month',
      },
      analytics: {
        title: 'Analytics',
        subtitle: 'Business insights and performance metrics',
      },
      customers: {
        title: 'Customers',
        subtitle: 'Manage and analyze customer data and addresses',
      },
      reports: {
        title: 'Reports',
        subtitle: 'Generate and export business reports',
      },
      pendingAmounts: {
        title: 'Pending Amounts',
        subtitle: 'Track and manage pending payment collections',
      },
      settings: {
        title: 'Settings',
        subtitle: 'Configure your application settings and preferences',
      },
      todayOrder: {
        title: 'Today Order',
        subtitle: 'Manage orders received from website today',
      },
      menuPrice: {
        title: 'Menu & Price',
        subtitle: 'Manage your menu items, categories, and pricing',
      },
      reviews: {
        title: 'Reviews & Feedback',
        subtitle: 'View and manage customer reviews and feedback',
      },
      offers: {
        title: 'Special Offers',
        subtitle: 'Create and manage special offers and promotions',
      },
      financialSummary: {
        title: 'Financial Summary',
        subtitle: 'View comprehensive financial reports and summaries',
      },
    };

    return tabInfoMap[activeTab] || tabInfoMap.dashboard;
  };

  const tabInfo = getTabInfo();

  useEffect(() => {
    if (typeof document !== 'undefined' && tabInfo?.title) {
      document.title = `${tabInfo.title} – HomieBites Admin`;
    }
  }, [activeTab, tabInfo?.title]);

  const renderActiveTab = () => {
    const safeOrders = Array.isArray(orders) ? orders : [];

    const commonProps = {
      orders: safeOrders,
      settings,
      loading,
      showNotification,
      loadOrders,
      showConfirmation,
    };

    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab {...commonProps} setActiveTab={setActiveTab} />;

      case 'allOrdersData':
        return (
          <AllOrdersDataTab
            {...commonProps}
            excelFileName=""
            allOrdersFilterMonth={allOrdersFilterMonth}
            setAllOrdersFilterMonth={setAllOrdersFilterMonth}
            allOrdersFilterAddress={allOrdersFilterAddress}
            setAllOrdersFilterAddress={setAllOrdersFilterAddress}
            allOrdersFilterPaymentStatus={allOrdersFilterPaymentStatus}
            setAllOrdersFilterPaymentStatus={setAllOrdersFilterPaymentStatus}
            onLoadExcelFile={() => setShowCSVUploadModal(true)}
            onClearAllData={handleClearAllData}
            onEditOrder={(order) => {
              setEditingOrder(order);
              setShowOrderModal(true);
            }}
            onDeleteOrder={handleDeleteOrder}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            currentPage={currentPage}
            recordsPerPage={recordsPerPage}
            onPageChange={setCurrentPage}
            onRecordsPerPageChange={setRecordsPerPage}
            initialDateFilter={dateFilterForOrders}
          />
        );

      case 'currentMonthOrders':
        return (
          <CurrentMonthOrdersTab
            {...commonProps}
            onAddOrder={handleAddOrder}
            onEditOrder={(order) => {
              setEditingOrder(order);
              setShowOrderModal(true);
            }}
            onUpdateOrder={performOrderUpdate}
            onDeleteOrder={handleDeleteOrder}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            currentPage={currentPage}
            recordsPerPage={recordsPerPage}
            onPageChange={setCurrentPage}
            onRecordsPerPageChange={setRecordsPerPage}
          />
        );

      case 'analytics':
        return (
          <AnalyticsTab
            {...commonProps}
            onViewDayDetails={(date) => {
              setDateFilterForOrders(date);
              setActiveTab('allOrdersData');
              showNotification(
                `Showing orders for ${new Date(date).toLocaleDateString(
                  'en-IN',
                  {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  }
                )}`,
                'info'
              );
            }}
          />
        );

      case 'customers':
        return (
          <AllAddressesTab
            {...commonProps}
            onViewOrders={handleViewCustomerOrders}
            onContact={() => {}}
          />
        );

      case 'reports':
        return (
          <ReportsTab
            {...commonProps}
            onLoadExcelFile={() => setShowCSVUploadModal(true)}
            onClearAllData={handleClearAllData}
            onBackup={handleBackup}
            onRestore={handleRestore}
            onExportSettings={async () => {
              // Export settings functionality
              try {
                const settingsToExport = {
                  ...settings,
                  exportedAt: new Date().toISOString(),
                };
                const dataStr = JSON.stringify(settingsToExport, null, 2);
                const dataBlob = new Blob([dataStr], {
                  type: 'application/json',
                });
                const url = URL.createObjectURL(dataBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `homiebites-settings-${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                if (showNotification)
                  showNotification('Settings exported successfully', 'success');
              } catch (error) {
                if (showNotification)
                  showNotification('Failed to export settings', 'error');
              }
            }}
            menuItems={menuData || []}
            reviews={[]}
            loadMenuData={loadMenuData}
          />
        );

      case 'pendingAmounts':
        return (
          <PendingAmountsTab
            {...commonProps}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onEditOrder={(order) => {
              setEditingOrder(order);
              setShowOrderModal(true);
            }}
            onDeleteOrder={handleDeleteOrder}
            onSendReminder={handleSendReminder}
            showOverdueFilter={showOverdueFilter}
            onOverdueFilterApplied={() => setShowOverdueFilter(false)}
          />
        );

      case 'financialSummary':
        return <FinancialSummaryTab {...commonProps} />;

      case 'reviews':
        return <ReviewsTab {...commonProps} />;

      case 'settings':
        return (
          <SettingsTab
            {...commonProps}
            onUpdateSettings={handleUpdateSettings}
            onBackup={handleBackup}
            onRestore={handleRestore}
            onClearAllData={handleClearAllData}
            onClearAllMenuItems={handleClearAllMenuItems}
          />
        );

      case 'todayOrder':
        return (
          <TodayOrderTab
            {...commonProps}
            onAcceptOrder={handleAcceptOrder}
            onCancelOrder={handleCancelOrder}
            onDeleteOrder={handleDeleteOrder}
            showConfirmation={showConfirmation}
          />
        );

      case 'menuPrice':
        return (
          <MenuPriceTab
            {...commonProps}
            showConfirmation={showConfirmation}
            activeTab={activeTab}
            dataRefreshKey={dataRefreshKey}
          />
        );

      case 'offers':
        return (
          <OffersTab
            {...commonProps}
            showConfirmation={showConfirmation}
            loadOffersData={loadOffersData}
          />
        );

      default:
        return <DashboardTab {...commonProps} setActiveTab={setActiveTab} />;
    }
  };

  const handleRefresh = () => {
    (async () => {
      try {
        if (typeof window !== 'undefined') {
          const cachedOrders = localStorage.getItem('homiebites_orders');
          if (cachedOrders) {
            localStorage.removeItem('homiebites_orders');
          }
        }

        const promises = [];

        if (loadOrders && typeof loadOrders === 'function') {
          promises.push(
            loadOrders({}, true).catch((err) =>
              console.error('Error reloading orders:', err)
            )
          );
        }
        if (loadMenuData && typeof loadMenuData === 'function') {
          promises.push(
            loadMenuData().catch((err) =>
              console.error('Error reloading menu:', err)
            )
          );
        }
        if (loadOffersData && typeof loadOffersData === 'function') {
          promises.push(
            loadOffersData().catch((err) =>
              console.error('Error reloading offers:', err)
            )
          );
        }
        if (loadUsers && typeof loadUsers === 'function') {
          promises.push(
            loadUsers().catch((err) =>
              console.error('Error reloading users:', err)
            )
          );
        }

        if (loadSettings && typeof loadSettings === 'function') {
          try {
            loadSettings();
          } catch (err) {
            console.error('Error reloading settings:', err);
          }
        }

        if (promises.length > 0) {
          await Promise.all(promises);
        }
        setDataRefreshKey((k) => k + 1);
      } catch (error) {
        console.error('Error refreshing data:', error);
      }
    })();
  };

  const compactTables = Boolean(settings?.compactTables);

  return (
    <ErrorBoundary>
      <div
        className={`admin-dashboard ${compactTables ? 'admin-compact-tables' : ''}`}
      >
        <a href="#admin-main-content" className="admin-skip-link">
          Skip to main content
        </a>
        <div
          className={`sidebar-overlay ${sidebarOpen ? 'show' : ''}`}
          onClick={() => setSidebarOpen(false)}
          aria-hidden={!sidebarOpen}
        />
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          currentUser={currentUser}
          onLogout={handleLogout}
          settings={settings}
          onAutoHideChange={setSidebarAutoHidden}
        />

        <main
          id="admin-main-content"
          className={`admin-main ${sidebarCollapsed ? 'sidebar-collapsed' : ''} ${sidebarAutoHidden ? 'sidebar-auto-hidden' : ''}`}
          role="main"
        >
          <div
            className="admin-live-region"
            aria-live="polite"
            aria-atomic="true"
          >
            {tabInfo?.title ? `Viewing ${tabInfo.title}` : ''}
          </div>
          <TopNav
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            sidebarCollapsed={sidebarCollapsed}
            setSidebarCollapsed={setSidebarCollapsed}
            unreadNotifications={unreadNotifications}
            setActiveTab={setActiveTab}
            tabTitle={tabInfo.title}
            tabSubtitle={tabInfo.subtitle}
            tabAction={tabInfo.action}
            onNewOrder={() => {
              setActiveTab('currentMonthOrders');
              setTimeout(() => {
                window.dispatchEvent(new CustomEvent('openNewOrderModal'));
              }, 150);
            }}
            onRefresh={handleRefresh}
            orders={orders}
            onViewOrder={(order) => {
              if (order && order._id) {
                handleViewOrder(order._id);
              } else {
                setActiveTab('allOrdersData');
              }
            }}
            onViewPendingAmounts={handleViewPendingAmounts}
          />

          <Suspense fallback={null}>
            <OfflineBanner
              connectionError={loadError || null}
              onRetry={() => loadOrders({}, true)}
              onBackOnline={() => loadOrders({}, true)}
              showNotification={showNotification}
            />
          </Suspense>
          <Suspense fallback={null}>
            <ImportantNotificationsBanner
              orders={orders}
              dismissedNotifications={dismissedNotifications}
              onDismiss={handleDismissNotification}
              onViewPendingAmounts={handleViewPendingAmounts}
            />
          </Suspense>

          <ErrorBoundary>
            <Suspense
              fallback={
                <FullPageLoader
                  show={true}
                  logoSrc="/logo.png"
                  title="Loading Dashboard"
                  subtitle="Initializing kitchen command center..."
                />
              }
            >
              {renderActiveTab()}
            </Suspense>
          </ErrorBoundary>
        </main>

        {showOrderModal && (
          <Suspense fallback={<InlineLoader message="Loading order form..." />}>
            <OrderModal
              show={showOrderModal}
              editingOrder={editingOrder}
              newOrder={newOrder}
              orders={orders}
              addressSuggestions={addressSuggestions}
              showAddressSuggestions={showAddressSuggestions}
              onClose={() => {
                setShowOrderModal(false);
                setEditingOrder(null);
                setNewOrder({
                  date: new Date().toISOString().split('T')[0],
                  deliveryAddress: '',
                  quantity: 1,
                  unitPrice: settings?.defaultUnitPrice || 100,
                  total: settings?.defaultUnitPrice || 100,
                  mode: 'Lunch',
                  status: 'Unpaid',
                  paymentMode: '',
                });
              }}
              onSave={editingOrder ? handleEditOrder : handleAddOrder}
              onNewOrderChange={(field, value) => {
                setNewOrder({ ...newOrder, [field]: value });
              }}
              onEditingOrderChange={(field, value) => {
                setEditingOrder({ ...editingOrder, [field]: value });
              }}
              setAddressSuggestions={setAddressSuggestions}
              setShowAddressSuggestions={setShowAddressSuggestions}
              showConfirmation={showConfirmation}
            />
          </Suspense>
        )}

        {showCSVUploadModal && (
          <Suspense fallback={<InlineLoader message="Loading CSV upload..." />}>
            <CSVUploadModal
              show={showCSVUploadModal}
              onClose={() => setShowCSVUploadModal(false)}
              onUploadSuccess={() => {}}
              showNotification={showNotification}
              loadOrders={loadOrders}
              showConfirmation={showConfirmation}
            />
          </Suspense>
        )}
        <Suspense fallback={null}>
          <ConfirmationModal
            show={confirmationModal.show}
            title={confirmationModal.title}
            message={confirmationModal.message}
            type={confirmationModal.type}
            confirmText={confirmationModal.confirmText}
            cancelText={confirmationModal.cancelText}
            onConfirm={confirmationModal.onConfirm}
            onCancel={() => {
              if (confirmationModal.onCancelCallback)
                confirmationModal.onCancelCallback();
              setConfirmationModal((prev) => ({
                ...prev,
                show: false,
                isLoading: false,
              }));
            }}
            isLoading={confirmationModal.isLoading}
          />
        </Suspense>

        <Suspense fallback={null}>
          <InstallPrompt />
        </Suspense>

        {/* Session Timeout Warning Modal */}
        <SessionTimeoutModal
          show={showWarningModal}
          timeRemaining={timeRemaining}
          onExtendSession={extendSession}
          onLogout={logoutNow}
        />
      </div>
    </ErrorBoundary>
  );
};

export default AdminDashboard;
