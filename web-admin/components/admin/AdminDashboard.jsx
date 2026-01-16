'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '../../lib/api-admin.js';
import { logout } from '../../lib/auth-admin.js';
import { setupGlobalErrorHandlers } from '../../lib/globalErrorHandler.js';
import AllAddressesTab from './AllAddressesTab.jsx';
import AllOrdersDataTab from './AllOrdersDataTab.jsx';
import AnalyticsTab from './AnalyticsTab.jsx';
import CSVUploadModal from './CSVUploadModal.jsx';
import ConfirmationModal from './ConfirmationModal.jsx';
import CurrentMonthOrdersTab from './CurrentMonthOrdersTab.jsx';
import DashboardTab from './DashboardTab.jsx';
import ErrorBoundary from './ErrorBoundary.jsx';
import ImportantNotificationsBanner from './ImportantNotificationsBanner.jsx';
import InstallPrompt from './InstallPrompt.jsx';
import MenuPriceTab from './MenuPriceTab.jsx';
import NotificationsTab from './NotificationsTab.jsx';
import OrderModal from './OrderModal.jsx';
import PendingAmountsTab from './PendingAmountsTab.jsx';
import ReportsTab from './ReportsTab.jsx';
import SettingsTab from './SettingsTab.jsx';
import Sidebar from './Sidebar.jsx';
import TopNav from './TopNav.jsx';
import { useNotification } from './contexts/NotificationContext.jsx';
import { useFastDataSync } from './hooks/useFastDataSync.js';
import dataSyncManager from './utils/dataSyncManager.js';
import { getNotificationDuration, getNotificationMessage } from './utils/notificationMessages.js';
import './utils/sidebarFontSizeFix.js';
import { autoFixThemeOnLoad, watchThemeChanges } from './utils/themeFixer.js';

const AdminDashboard = () => {
  const router = useRouter();
  const { showNotification } = useNotification();

  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('homiebites_active_tab') || 'dashboard';
    }
    return 'dashboard';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cleanup = setupGlobalErrorHandlers(showNotification);
      return cleanup;
    }
  }, [showNotification]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showCSVUploadModal, setShowCSVUploadModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState({
    show: false,
    title: '',
    message: '',
    type: 'warning',
    onConfirm: null,
    confirmText: 'Confirm',
    cancelText: 'Cancel',
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
  const [allOrdersFilterPaymentStatus, setAllOrdersFilterPaymentStatus] = useState('');
  const [dismissedNotifications, setDismissedNotifications] = useState([]);
  const [showOverdueFilter, setShowOverdueFilter] = useState(false);
  const [dateFilterForOrders, setDateFilterForOrders] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  const {
    orders,
    settings,
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
  } = useFastDataSync();

  useEffect(() => {
    const token = localStorage.getItem('homiebites_token');
    const adminFlag = localStorage.getItem('homiebites_admin');
    const userStr = localStorage.getItem('homiebites_user');

    const userRole = userStr ? JSON.parse(userStr).role : null;
    const isAdminRole = userRole && (userRole.toLowerCase() === 'admin' || userRole === 'Admin');
    const isAdmin = adminFlag === 'true' || isAdminRole;

    if (!token || !isAdmin) {
      if (process.env.NODE_ENV === 'development') {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[AdminDashboard] Authentication check failed, redirecting to /admin');
        }
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

    const savedTheme = localStorage.getItem('homiebites_theme') || 'light';
    const savedPrimaryColor = localStorage.getItem('homiebites_primary_color') || '#449031';
    const savedSecondaryColor = localStorage.getItem('homiebites_secondary_color') || '#B8D84E';
    const savedFontSize = localStorage.getItem('homiebites_font_size') || 'medium';
    const savedFontFamily = localStorage.getItem('homiebites_font_family') || 'Baloo 2';

    const root = document.documentElement;
    const adminDashboard = document.querySelector('.admin-dashboard');

    root.style.setProperty('--admin-accent', savedPrimaryColor);
    const rgb = hexToRgb(savedPrimaryColor);
    if (rgb) {
      root.style.setProperty('--admin-accent-light', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`);
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
      const fontFamily = `'${savedFontFamily}', sans-serif`;
      root.style.setProperty('--font-primary', fontFamily);
      document.body.style.fontFamily = fontFamily;
    }

    const fontSizeMap = {
      small: '14px',
      medium: '16px',
      large: '18px',
      'extra-large': '20px',
    };

    const defaultFontSize = savedFontSize || 'medium';
    const fontSize = fontSizeMap[defaultFontSize] || '16px';
    root.style.setProperty('--admin-base-font-size', fontSize);
    document.body.style.fontSize = fontSize;
    // CSS variables are now set on :root, so sidebar will inherit them automatically

    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark-theme');
      document.documentElement.classList.remove('light-theme');
      if (adminDashboard) {
        adminDashboard.classList.add('dark-theme');
        adminDashboard.classList.remove('light-theme');

        const allElements = adminDashboard.querySelectorAll('*');
        allElements.forEach((el) => {
          el.classList.add('dark-theme-applied');
        });
      }
    } else if (savedTheme === 'light') {
      document.documentElement.classList.add('light-theme');
      document.documentElement.classList.remove('dark-theme');
      if (adminDashboard) {
        adminDashboard.classList.add('light-theme');
        adminDashboard.classList.remove('dark-theme');

        const allElements = adminDashboard.querySelectorAll('*');
        allElements.forEach((el) => {
          el.classList.remove('dark-theme-applied');
        });
      }
    } else if (savedTheme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark-theme');
        document.documentElement.classList.remove('light-theme');
        if (adminDashboard) {
          adminDashboard.classList.add('dark-theme');
          adminDashboard.classList.remove('light-theme');
          const allElements = adminDashboard.querySelectorAll('*');
          allElements.forEach((el) => {
            el.classList.add('dark-theme-applied');
          });
        }
      } else {
        document.documentElement.classList.add('light-theme');
        document.documentElement.classList.remove('dark-theme');
        if (adminDashboard) {
          adminDashboard.classList.add('light-theme');
          adminDashboard.classList.remove('dark-theme');
          const allElements = adminDashboard.querySelectorAll('*');
          allElements.forEach((el) => {
            el.classList.remove('dark-theme-applied');
          });
        }
      }
    }

    setTimeout(() => {
      autoFixThemeOnLoad(5, 200);
    }, 100);

    const themeWatcher = watchThemeChanges();

    return () => {
      if (themeWatcher && themeWatcher.disconnect) {
        themeWatcher.disconnect();
      }
    };
  }, [isMounted]);

  useEffect(() => {
    if (settings) {
      if (settings.theme !== undefined) {
        localStorage.setItem('homiebites_theme', settings.theme);
      }
      if (settings.primaryColor !== undefined) {
        localStorage.setItem('homiebites_primary_color', settings.primaryColor);
      }
      if (settings.secondaryColor !== undefined) {
        localStorage.setItem('homiebites_secondary_color', settings.secondaryColor);
      }
      if (settings.fontSize !== undefined) {
        localStorage.setItem('homiebites_font_size', settings.fontSize);
      }
      if (settings.fontFamily !== undefined) {
        localStorage.setItem('homiebites_font_family', settings.fontFamily);
      }
    }
  }, [settings]);

  useEffect(() => {
    if (typeof window !== 'undefined' && activeTab) {
      localStorage.setItem('homiebites_active_tab', activeTab);
    }
  }, [activeTab]);

  useEffect(() => {
    if (!isMounted || typeof window === 'undefined') return;

    const syncSidebarFontSize = () => {
      const adminDashboard = document.querySelector('.admin-dashboard');
      const root = document.documentElement;

      if (!adminDashboard) return;

      const baseFontSize =
        getComputedStyle(adminDashboard).getPropertyValue('--admin-base-font-size').trim() ||
        getComputedStyle(root).getPropertyValue('--admin-base-font-size').trim() ||
        '16px';

      // Set CSS variables on :root instead of directly on sidebar to avoid inline styles
      root.style.setProperty('--admin-base-font-size', baseFontSize);

      const baseSize = parseFloat(baseFontSize);
      if (!isNaN(baseSize)) {
        root.style.setProperty('--admin-font-size-h1', `${baseSize * 1.75}px`);
        root.style.setProperty('--admin-font-size-h2', `${baseSize * 1.375}px`);
        root.style.setProperty('--admin-font-size-h3', `${baseSize * 1.125}px`);
        root.style.setProperty('--admin-font-size-h4', `${baseSize}px`);
        root.style.setProperty('--admin-font-size-body-lg', `${baseSize * 0.9375}px`);
        root.style.setProperty('--admin-font-size-body', `${baseSize * 0.875}px`);
        root.style.setProperty('--admin-font-size-body-sm', `${baseSize * 0.8125}px`);
        root.style.setProperty('--admin-font-size-body-xs', `${baseSize * 0.75}px`);
        root.style.setProperty('--admin-font-size-body-xxs', `${baseSize * 0.6875}px`);
        root.style.setProperty('--admin-font-size-caption', `${baseSize * 0.625}px`);
      }
    };

    const handleFontSizeChange = (event) => {
      const { fontSize } = event.detail;
      const adminDashboard = document.querySelector('.admin-dashboard');
      const adminSidebar = document.querySelector('.admin-sidebar');

      if (adminDashboard) {
        adminDashboard.style.setProperty('--admin-base-font-size', fontSize);
        adminDashboard.style.fontSize = fontSize;
        void adminDashboard.offsetHeight;
      }

      syncSidebarFontSize();
    };

    // Sync on mount - use requestAnimationFrame to ensure DOM is ready after hydration
    requestAnimationFrame(() => {
      syncSidebarFontSize();
      setTimeout(syncSidebarFontSize, 100);
      setTimeout(syncSidebarFontSize, 500);
    });

    window.addEventListener('adminFontSizeChanged', handleFontSizeChange);

    return () => {
      window.removeEventListener('adminFontSizeChanged', handleFontSizeChange);
    };
  }, [isMounted]);

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
          // Perform logout cleanup
          await logout();
          
          // Show success message
          showNotification({
            type: 'success',
            message: 'Logged out successfully',
            duration: getNotificationDuration('success'),
          });
          
          // Add small delay to show success message before redirect
          await new Promise((resolve) => setTimeout(resolve, 500));
          
          // Redirect to admin login page consistently
          window.location.href = '/admin';
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            if (process.env.NODE_ENV === 'development') {
            console.error('[AdminDashboard] Error during logout:', error);
          }
          }
          // Still redirect even if there's an error
          await logout();
          window.location.href = '/admin';
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
            if (process.env.NODE_ENV === 'development') {
              if (process.env.NODE_ENV === 'development') {
                console.warn('Error refreshing orders after save:', refreshError);
              }
            }
          }

          const today = new Date();
          const formattedDate = `${String(today.getDate()).padStart(2, '0')}/${String(
            today.getMonth() + 1
          ).padStart(2, '0')}/${today.getFullYear()}`;

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
          if (process.env.NODE_ENV === 'development') {
            if (process.env.NODE_ENV === 'development') {
          console.error('Error adding order:', error);
        }
          }
          if (showNotification) {
            const errorMessage = error?.message || getNotificationMessage('orders', 'addError');
            showNotification(errorMessage, 'error', getNotificationDuration('error'));
          }
        }
      );
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error adding order:', error);
        }
      }
      if (showNotification) {
        const errorMessage = error?.message || getNotificationMessage('orders', 'addError');
        showNotification(errorMessage, 'error', getNotificationDuration('error'));
      }
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

    const performUpdate = async () => {
      try {
        const apiOrderId = order?._id || order?.id || order?.orderId || orderId;

        const updateData = {};
        const allowedFields = [
          'orderId',
          'date',
          'deliveryAddress',
          'quantity',
          'unitPrice',
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
            if (key === 'paymentMode' || key === 'notes' || key === 'customerName') {
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
            updateData.status = order.status || 'Unpaid';
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
            setShowOrderModal(false);
            setEditingOrder(null);

            if (loadOrders) {
              setTimeout(() => {
                loadOrders();
              }, 200);
            }
          },
          (error) => {
            if (process.env.NODE_ENV === 'development') {
              if (process.env.NODE_ENV === 'development') {
                console.error('Error updating order:', error);
              }
            }
            if (showNotification) {
              const errorMessage =
                error?.message || getNotificationMessage('orders', 'updateError');
              showNotification(errorMessage, 'error', getNotificationDuration('error'));
            }
          }
        );
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error updating order:', error);
        }
        if (showNotification) {
          const errorMessage = error?.message || getNotificationMessage('orders', 'updateError');
          showNotification(errorMessage, 'error', getNotificationDuration('error'));
        }
      }
    };

    showConfirmation({
      title: 'Update Order',
      message: `Are you sure you want to save changes to ${orderInfo}?`,
      type: 'info',
      confirmText: 'Save Changes',
      onConfirm: performUpdate,
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
          try {
            await config.onConfirm();
            setConfirmationModal((prev) => ({ ...prev, show: false }));
          } catch (error) {
            const errorMessage = error?.message || error?.error || String(error) || 'Action failed';
            if (showNotification) {
              showNotification(errorMessage, 'error', 6000);
            }

            return;
          }
        } else {
          setConfirmationModal((prev) => ({ ...prev, show: false }));
        }
      },
      onCancelCallback: config.onCancel || null,
      confirmText: config.confirmText || 'Confirm',
      cancelText: config.cancelText || 'Cancel',
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
                if (process.env.NODE_ENV === 'development') {
                  console.error('Error deleting order:', error);
                }
              }
              if (showNotification) {
                const errorMessage =
                  error?.message || getNotificationMessage('orders', 'deleteError');
                showNotification(errorMessage, 'error', getNotificationDuration('error'));
              }
            }
          );
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.error('Error deleting order:', error);
          }
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

  const handleUpdateOrderStatus = async (orderId, status, skipConfirmation = false) => {
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
      normalizedCurrentStatus === 'paid' || normalizedCurrentStatus === 'delivered';
    const isNewlyPaid = normalizedNewStatus === 'paid';
    const isCurrentlyPending =
      normalizedCurrentStatus === 'pending' || normalizedCurrentStatus === 'unpaid';
    const isNewlyPending = normalizedNewStatus === 'pending' || normalizedNewStatus === 'unpaid';

    if ((isCurrentlyPaid && isNewlyPaid) || (isCurrentlyPending && isNewlyPending)) {
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
            statusLower === 'paid' || statusLower === 'delivered' ? 'Paid' : 'Pending';
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
                loadOrders();
              }, 300);
            }
          },
          (error) => {
            if (process.env.NODE_ENV === 'development') {
              if (process.env.NODE_ENV === 'development') {
                console.error('Error updating order status:', error);
              }
            }
            if (showNotification) {
              const errorMessage =
                error?.message || getNotificationMessage('orders', 'statusUpdateError');
              showNotification(errorMessage, 'error', getNotificationDuration('error'));
            }

            if (loadOrders) {
              loadOrders();
            }
          }
        );
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error updating order status:', error);
        }
        if (showNotification) {
          const errorMessage =
            error?.message || getNotificationMessage('orders', 'statusUpdateError');
          showNotification(errorMessage, 'error', getNotificationDuration('error'));
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
    const stored = JSON.parse(localStorage.getItem('homiebites_dismissed_notifications') || '[]');
    if (!stored.includes(notificationId)) {
      stored.push(notificationId);
      localStorage.setItem('homiebites_dismissed_notifications', JSON.stringify(stored));
    }
  };

  const handleViewPendingAmounts = () => {
    setShowOverdueFilter(true);
    setActiveTab('pendingAmounts');
  };

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('homiebites_dismissed_notifications') || '[]');
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

  const handleUpdateSettings = async (newSettings) => {
    try {
      const response = await api.updateSettings(newSettings);

      if (response && response.success) {
        if (showNotification) {
          let message = '';

          if (newSettings.businessInfo) {
            message = 'Business information has been saved successfully';
          } else if (newSettings.pricing) {
            const { defaultUnitPrice, lunchPrice, dinnerPrice } = newSettings.pricing;
            const priceParts = [];
            if (defaultUnitPrice !== undefined) priceParts.push(`Default: ₹${defaultUnitPrice}`);
            if (lunchPrice !== undefined) priceParts.push(`Lunch: ₹${lunchPrice}`);
            if (dinnerPrice !== undefined) priceParts.push(`Dinner: ₹${dinnerPrice}`);
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
          } else if (newSettings.themeSettings) {
            const { theme, primaryColor, secondaryColor, fontSize, fontFamily } =
              newSettings.themeSettings;

            if (theme !== undefined) {
              localStorage.setItem('homiebites_theme', theme);
            }
            if (primaryColor !== undefined) {
              localStorage.setItem('homiebites_primary_color', primaryColor);
            }
            if (secondaryColor !== undefined) {
              localStorage.setItem('homiebites_secondary_color', secondaryColor);
            }
            if (fontSize !== undefined) {
              localStorage.setItem('homiebites_font_size', fontSize);
            }
            if (fontFamily !== undefined) {
              localStorage.setItem('homiebites_font_family', fontFamily);
            }

            const changes = [];

            if (theme) {
              const themeName = theme === 'light' ? 'Light' : theme === 'dark' ? 'Dark' : 'Auto';
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
                colorNames[primaryColor.toLowerCase()] || primaryColor.toUpperCase();
              changes.push(`${colorName} accent color`);
            }

            if (fontSize) {
              const sizeName =
                fontSize === 'small'
                  ? 'Small'
                  : fontSize === 'large'
                  ? 'Large'
                  : fontSize === 'extra-large'
                  ? 'Extra Large'
                  : 'Medium';
              changes.push(`${sizeName} font size`);
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
      if (process.env.NODE_ENV === 'development') {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error updating settings:', error);
        }
      }
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
      if (showNotification) {
        showNotification(
          getNotificationMessage('backup', 'createSuccess'),
          'success',
          getNotificationDuration('success')
        );
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error creating backup:', error);
        }
      }
      if (showNotification) {
        showNotification(
          getNotificationMessage('backup', 'createError'),
          'error',
          getNotificationDuration('error')
        );
      }
    }
  };

  const handleRestore = async () => {
    try {
      if (showNotification) {
        showNotification(
          getNotificationMessage('backup', 'restoreSuccess'),
          'success',
          getNotificationDuration('success')
        );
      }
      if (loadOrders) loadOrders();
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error restoring data:', error);
        }
      }
      if (showNotification) {
        showNotification(
          getNotificationMessage('backup', 'restoreError'),
          'error',
          getNotificationDuration('error')
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
          const afterCount = response.afterCount !== undefined ? response.afterCount : null;

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
                getNotificationMessage('orders', 'clearAllSuccess', deletedCount),
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
                        refreshError.message || 'Failed to verify orders were cleared',
                        'error'
                      );
                    }
                  }
                }, 500);
              } catch (error) {
                if (showNotification) {
                  showNotification(
                    error.message || 'Failed to refresh orders after clearing data',
                    'error'
                  );
                }
              }
            }
          }, 1000);
        } else {
          if (showNotification) {
            showNotification(
              response.error || getNotificationMessage('orders', 'clearAllError'),
              'error',
              getNotificationDuration('error')
            );
          }
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          if (process.env.NODE_ENV === 'development') {
            console.error('Error clearing data:', error);
          }
        }
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
        subtitle: 'Overview of your business metrics',
      },
      allOrdersData: {
        title: 'All Orders Data',
        subtitle: 'View and manage all orders',
      },
      currentMonthOrders: {
        title: 'Current Month Orders',
        subtitle: 'Manage orders for the current billing month',
        action: (
          <button
            className='btn btn-primary'
            onClick={() => {
              setEditingOrder(null);
              setShowOrderModal(true);
            }}
          >
            <i className='fa-solid fa-plus'></i> Add New Order
          </button>
        ),
      },
      analytics: {
        title: 'Analytics',
        subtitle: 'Business insights and performance metrics',
      },
      customers: {
        title: 'Customers',
        subtitle: 'Manage and analyze customer data',
      },
      reports: {
        title: 'Reports',
        subtitle: 'Generate and manage business reports',
      },
      pendingAmounts: {
        title: 'Payment Management',
        subtitle: 'Track and manage payment collections',
      },
      settings: {
        title: 'Settings',
        subtitle: 'Configure your application settings',
      },
      notifications: {
        title: 'Notifications',
        subtitle: 'Stay updated with your business activities',
      },
      menuPrice: {
        title: 'Menu & Price',
        subtitle: 'Manage your menu items, categories, and pricing',
      },
    };

    return tabInfoMap[activeTab] || tabInfoMap.dashboard;
  };

  const tabInfo = getTabInfo();

  const renderActiveTab = () => {
    const safeOrders = Array.isArray(orders) ? orders : [];

    // Debug logging for orders (only log if not loading to avoid spam)
    if (!loading && process.env.NODE_ENV === 'development') {
      console.log('=== ADMIN DASHBOARD ORDERS DEBUG ===');
      console.log('Orders array length:', safeOrders.length);
      console.log('Loading state:', loading);
      console.log('Orders type:', typeof orders, 'isArray:', Array.isArray(orders));
      if (safeOrders.length > 0) {
        console.log('✅ Orders loaded successfully!');
        console.log('Sample order:', safeOrders[0]);
      } else {
        console.warn('⚠️ NO ORDERS FOUND after loading completed!');
        console.log('This means the API returned an empty array or failed.');
        console.log('Check the console for [useAdminData] logs above to see API response.');
        console.log('Common issues:');
        console.log('1. Backend API not running');
        console.log('2. Authentication token expired');
        console.log('3. Database is empty');
        console.log('4. API endpoint returning error');
      }
      console.log('=== END ADMIN DASHBOARD DEBUG ===');
    }

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
            excelFileName=''
            allOrdersFilterMonth={allOrdersFilterMonth}
            setAllOrdersFilterMonth={setAllOrdersFilterMonth}
            allOrdersFilterAddress={allOrdersFilterAddress}
            setAllOrdersFilterAddress={setAllOrdersFilterAddress}
            allOrdersFilterPaymentStatus={allOrdersFilterPaymentStatus}
            setAllOrdersFilterPaymentStatus={setAllOrdersFilterPaymentStatus}
            onLoadExcelFile={() => setShowCSVUploadModal(true)}
            onClearExcelData={() => {}}
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
                `Showing orders for ${new Date(date).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}`,
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
        return <ReportsTab {...commonProps} />;

      case 'pendingAmounts':
        return (
          <PendingAmountsTab
            {...commonProps}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onSendReminder={handleSendReminder}
            showOverdueFilter={showOverdueFilter}
            onOverdueFilterApplied={() => setShowOverdueFilter(false)}
          />
        );

      case 'settings':
        return (
          <SettingsTab
            {...commonProps}
            onUpdateSettings={handleUpdateSettings}
            onBackup={handleBackup}
            onRestore={handleRestore}
            onClearAllData={handleClearAllData}
          />
        );

      case 'notifications':
        return (
          <NotificationsTab
            {...commonProps}
            setActiveTab={setActiveTab}
            showConfirmation={showConfirmation}
            onViewOrder={handleViewOrder}
            onMarkAsPaid={handleUpdateOrderStatus}
            onSendReminder={handleSendReminder}
          />
        );

      case 'menuPrice':
        return <MenuPriceTab {...commonProps} showConfirmation={showConfirmation} />;

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
            loadOrders({}, true).catch((err) => console.error('Error reloading orders:', err))
          );
        }
        if (loadMenuData && typeof loadMenuData === 'function') {
          promises.push(loadMenuData().catch((err) => console.error('Error reloading menu:', err)));
        }
        if (loadOffersData && typeof loadOffersData === 'function') {
          promises.push(
            loadOffersData().catch((err) => console.error('Error reloading offers:', err))
          );
        }
        if (loadUsers && typeof loadUsers === 'function') {
          promises.push(loadUsers().catch((err) => console.error('Error reloading users:', err)));
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
      } catch (error) {
        console.error('Error refreshing data:', error);
      }
    })();
  };

  return (
    <ErrorBoundary>
      <div className='admin-dashboard'>
        {}
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
          onLogout={handleLogout}
        />

        <div className={`admin-main ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
          <TopNav
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            sidebarCollapsed={sidebarCollapsed}
            setSidebarCollapsed={setSidebarCollapsed}
            unreadNotifications={0}
            currentUser={currentUser}
            onLogout={handleLogout}
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
          />

          {}
          <div className='admin-content'>
            <ImportantNotificationsBanner
              orders={orders}
              dismissedNotifications={dismissedNotifications}
              onDismiss={handleDismissNotification}
              onViewPendingAmounts={handleViewPendingAmounts}
            />

            {}
            <ErrorBoundary>{renderActiveTab()}</ErrorBoundary>
          </div>
        </div>

        {}
        {showOrderModal && (
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
          />
        )}

        {}
        {showCSVUploadModal && (
          <CSVUploadModal
            show={showCSVUploadModal}
            onClose={() => setShowCSVUploadModal(false)}
            onUploadSuccess={(_data) => {}}
            showNotification={showNotification}
            loadOrders={loadOrders}
            showConfirmation={showConfirmation}
          />
        )}
        <ConfirmationModal
          show={confirmationModal.show}
          title={confirmationModal.title}
          message={confirmationModal.message}
          type={confirmationModal.type}
          confirmText={confirmationModal.confirmText}
          cancelText={confirmationModal.cancelText}
          onConfirm={confirmationModal.onConfirm}
          onCancel={() => {
            if (confirmationModal.onCancelCallback) confirmationModal.onCancelCallback();
            setConfirmationModal({ ...confirmationModal, show: false });
          }}
        />

        {}
        <InstallPrompt />
      </div>
    </ErrorBoundary>
  );
};

export default AdminDashboard;
