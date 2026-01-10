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
import { autoFixThemeOnLoad, watchThemeChanges, fixTheme } from './utils/themeFixer.js';

const AdminDashboard = () => {
  const router = useRouter();
  const { showNotification } = useNotification();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Setup global error handlers for unhandled errors
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
  const [dateFilterForOrders, setDateFilterForOrders] = useState(null); // For filtering orders by date from analytics

  // Load data using fast sync hook for optimized operations
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

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('homiebites_token');
    const adminFlag = localStorage.getItem('homiebites_admin');
    const userStr = localStorage.getItem('homiebites_user');
    
    // Check if user is authenticated and is admin
    const isAdmin = adminFlag === 'true' || (userStr && (JSON.parse(userStr).role?.toLowerCase() === 'admin' || JSON.parse(userStr).role === 'Admin'));

    if (!token || !isAdmin) {
      console.warn('[AdminDashboard] Authentication check failed, redirecting to /admin');
      router.replace('/admin');
      return;
    }
  }, [router]);

  // Cleanup on unmount - cancel all pending operations
  useEffect(() => {
    return () => {
      if (cancelAll) cancelAll();
      dataSyncManager.cleanup();
    };
  }, [cancelAll]);

  // Load and apply theme settings on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('homiebites_theme') || 'light';
    const savedPrimaryColor = localStorage.getItem('homiebites_primary_color') || '#449031';
    const savedFontSize = localStorage.getItem('homiebites_font_size') || 'medium';

    const root = document.documentElement;

    // Apply primary color
    root.style.setProperty('--admin-accent', savedPrimaryColor);
    const rgb = hexToRgb(savedPrimaryColor);
    if (rgb) {
      root.style.setProperty('--admin-accent-light', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`);
    }

    // Apply font size
    const fontSizeMap = {
      small: '14px',
      medium: '16px',
      large: '18px',
    };
    root.style.setProperty('--admin-base-font-size', fontSizeMap[savedFontSize] || '16px');
    document.body.style.fontSize = fontSizeMap[savedFontSize] || '16px';

    // Apply theme to both root and admin-dashboard for consistency
    const adminDashboard = document.querySelector('.admin-dashboard');
    
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark-theme');
      document.documentElement.classList.remove('light-theme');
      if (adminDashboard) {
        adminDashboard.classList.add('dark-theme');
        adminDashboard.classList.remove('light-theme');
      }
    } else if (savedTheme === 'light') {
      document.documentElement.classList.add('light-theme');
      document.documentElement.classList.remove('dark-theme');
      if (adminDashboard) {
        adminDashboard.classList.add('light-theme');
        adminDashboard.classList.remove('dark-theme');
      }
    } else if (savedTheme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark-theme');
        document.documentElement.classList.remove('light-theme');
        if (adminDashboard) {
          adminDashboard.classList.add('dark-theme');
          adminDashboard.classList.remove('light-theme');
        }
      } else {
        document.documentElement.classList.add('light-theme');
        document.documentElement.classList.remove('dark-theme');
        if (adminDashboard) {
          adminDashboard.classList.add('light-theme');
          adminDashboard.classList.remove('dark-theme');
        }
      }
    }
    
    // Auto-fix theme issues after a short delay to ensure DOM is ready
    setTimeout(() => {
      autoFixThemeOnLoad(5, 200);
    }, 100);
    
    // Watch for theme changes and auto-fix
    const themeWatcher = watchThemeChanges();
    
    return () => {
      // Cleanup theme watcher on unmount
      if (themeWatcher && themeWatcher.disconnect) {
        themeWatcher.disconnect();
      }
    };
  }, []);

  // Helper function to convert hex to RGB
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

  // Handle logout with confirmation
  const handleLogout = () => {
    showConfirmation({
      title: 'Logout',
      message:
        'Are you sure you want to logout? You will need to login again to access the dashboard.',
      type: 'warning',
      confirmText: 'Logout',
      cancelText: 'Cancel',
      onConfirm: () => {
        logout();
        router.replace('/login');
      },
    });
  };

  // Handle add order - using fast sync
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

          // Refresh orders data to get the latest list (including the new order)
          // This ensures the order ID preview updates correctly for the next entry
          try {
            await loadOrders();
          } catch (refreshError) {
            console.warn('Error refreshing orders after save:', refreshError);
            // Don't block on refresh error - order was already saved
          }

          // Reset form to allow new entry (after refresh so order ID updates)
          // Use DD/MM/YYYY format to match OrderModal's date format
          const today = new Date();
          const formattedDate = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;

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
          // Keep modal open for next entry (don't close it)
        },
        (error) => {
          console.error('Error adding order:', error);
          if (showNotification) {
            const errorMessage = error?.message || getNotificationMessage('orders', 'addError');
            showNotification(errorMessage, 'error', getNotificationDuration('error'));
          }
        }
      );
    } catch (error) {
      console.error('Error adding order:', error);
      if (showNotification) {
        const errorMessage = error?.message || getNotificationMessage('orders', 'addError');
        showNotification(errorMessage, 'error', getNotificationDuration('error'));
      }
    }
  };

  // Handle edit order - using fast sync
  const handleEditOrder = async (orderId, orderData) => {
    const order = (orders || []).find(
      (o) => o.orderId === orderId || o._id === orderId || o.id === orderId
    );
    const orderInfo = order
      ? `Order ${order.orderId || orderId} for ${order.deliveryAddress || order.customerAddress || 'N/A'}`
      : `Order ${orderId}`;

    const performUpdate = async () => {
      try {
        const apiOrderId = order?._id || order?.id || order?.orderId || orderId;

        await fastUpdate(
          apiOrderId,
          orderData,
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
          },
          (error) => {
            console.error('Error updating order:', error);
            if (showNotification) {
              const errorMessage =
                error?.message || getNotificationMessage('orders', 'updateError');
              showNotification(errorMessage, 'error', getNotificationDuration('error'));
            }
          }
        );
      } catch (error) {
        console.error('Error updating order:', error);
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

  // Show confirmation modal
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
            // Only close modal if no error occurred
            setConfirmationModal((prev) => ({ ...prev, show: false }));
          } catch (error) {
            // Error handling is done in the callback itself
            // Modal stays open so user can see the error and try again
            const errorMessage = error?.message || error?.error || String(error) || 'Action failed';
            if (showNotification) {
              showNotification(errorMessage, 'error', 6000);
            }
            // Don't close modal on error - let user see the error message
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

  // Handle delete order with confirmation - using fast sync
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
              console.error('Error deleting order:', error);
              if (showNotification) {
                const errorMessage =
                  error?.message || getNotificationMessage('orders', 'deleteError');
                showNotification(errorMessage, 'error', getNotificationDuration('error'));
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
    const currentStatus = order.status || 'Unknown';

    if (currentStatus.toLowerCase() === status.toLowerCase()) {
      // No change needed
      return;
    }

    // If confirmation is already shown by the component, skip it here
    const performUpdate = async () => {
      try {
        // Use the order's _id for API call (backend expects MongoDB _id)
        const apiOrderId = order._id || order.id || order.orderId;

        await fastUpdate(
          apiOrderId,
          {
            status: status,
            paymentStatus: status, // Also update paymentStatus for consistency
          },
          () => {
            if (showNotification) {
              showNotification(
                getNotificationMessage('orders', 'statusUpdateSuccess'),
                'success',
                getNotificationDuration('success')
              );
            }
            // Force refresh orders to ensure UI updates
            if (loadOrders) {
              setTimeout(() => {
                loadOrders();
              }, 100);
            }
          },
          (error) => {
            console.error('Error updating order status:', error);
            if (showNotification) {
              const errorMessage =
                error?.message || getNotificationMessage('orders', 'statusUpdateError');
              showNotification(errorMessage, 'error', getNotificationDuration('error'));
            }
            // Refresh on error to get accurate state
            if (loadOrders) {
              loadOrders();
            }
          }
        );
      } catch (error) {
        console.error('Error updating order status:', error);
        if (showNotification) {
          const errorMessage =
            error?.message || getNotificationMessage('orders', 'statusUpdateError');
          showNotification(errorMessage, 'error', getNotificationDuration('error'));
        }
        // Refresh on error
        if (loadOrders) {
          loadOrders();
        }
      }
    };

    // Only show confirmation if not already shown
    if (!skipConfirmation) {
      showConfirmation({
        title: 'Update Order Status',
        message: `Are you sure you want to change the status of ${orderInfo} from "${currentStatus}" to "${status}"?`,
        type: 'info',
        confirmText: 'Update Status',
        onConfirm: performUpdate,
      });
    } else {
      // Direct update without confirmation
      await performUpdate();
    }
  };

  // Handle view orders for customer
  const handleViewCustomerOrders = (address) => {
    setAllOrdersFilterAddress(address);
    setActiveTab('allOrdersData');
  };

  // Handle dismiss notification
  const handleDismissNotification = (notificationId) => {
    setDismissedNotifications((prev) => [...prev, notificationId]);
    const stored = JSON.parse(localStorage.getItem('homiebites_dismissed_notifications') || '[]');
    if (!stored.includes(notificationId)) {
      stored.push(notificationId);
      localStorage.setItem('homiebites_dismissed_notifications', JSON.stringify(stored));
    }
  };

  // Handle view pending amounts
  const handleViewPendingAmounts = () => {
    setShowOverdueFilter(true);
    setActiveTab('pendingAmounts');
  };

  // Load dismissed notifications from localStorage on mount
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('homiebites_dismissed_notifications') || '[]');
    setDismissedNotifications(stored);
  }, []);

  // Handle view order
  const handleViewOrder = (orderId) => {
    const order = (orders || []).find((o) => (o._id || o.orderId) === orderId);
    if (order) {
      setEditingOrder(order);
      setShowOrderModal(true);
    }
  };

  // Handle send reminder
  const handleSendReminder = (_orderId) => {
    // In a real app, this would send a reminder
    if (showNotification) {
      showNotification(
        getNotificationMessage('reminders', 'sentSuccess'),
        'success',
        getNotificationDuration('success')
      );
    }
  };

  // Handle update settings
  const handleUpdateSettings = async (newSettings) => {
    try {
      // Save settings to backend API
      const response = await api.updateSettings(newSettings);

      if (response && response.success) {
        // Update local settings state if needed
        // The settings will be reloaded on next sync

        if (showNotification) {
          // Determine which specific setting was updated and show appropriate message
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
            const { theme, primaryColor, fontSize, fontFamily } = newSettings.themeSettings;
            const changes = [];

            // Build descriptive message parts
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

            // Format message professionally
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

  // Handle backup
  const handleBackup = async () => {
    try {
      // In a real app, this would create a backup
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

  // Handle restore
  const handleRestore = async () => {
    try {
      // In a real app, this would restore from backup
      if (showNotification) {
        showNotification(
          getNotificationMessage('backup', 'restoreSuccess'),
          'success',
          getNotificationDuration('success')
        );
      }
      if (loadOrders) loadOrders();
    } catch (error) {
      console.error('Error restoring data:', error);
      if (showNotification) {
        showNotification(
          getNotificationMessage('backup', 'restoreError'),
          'error',
          getNotificationDuration('error')
        );
      }
    }
  };

  // Handle clear all data with confirmation
  const handleClearAllData = async (skipConfirmation = false) => {
    const performClear = async () => {
      try {
        const response = await api.clearAllOrders();
        if (response.success) {
          const deletedCount = response.deletedCount || 0;
          const afterCount = response.afterCount !== undefined ? response.afterCount : null;

          // Verify deletion was successful
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
                // Verify orders are actually cleared
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

    // Only show confirmation if not already shown
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
      // Direct clear without confirmation
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
      } catch (e) {
        // Ignore errors when checking order status
      }
      return { status: 'OPEN', lockedTill: null };
    };

    const monthLockStatus = getMonthLockStatus();

    const tabInfoMap = {
      dashboard: {
        title: 'Dashboard',
        subtitle: 'Overview of your business metrics',
        action: (
          <div
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              background:
                monthLockStatus.status === 'LOCKED'
                  ? 'var(--admin-warning-light)'
                  : 'var(--admin-success-light)',
              border: `2px solid ${
                monthLockStatus.status === 'LOCKED'
                  ? 'var(--admin-warning)'
                  : 'var(--admin-success)'
              }`,
              fontSize: '0.875rem',
              fontWeight: '600',
              color:
                monthLockStatus.status === 'LOCKED'
                  ? 'var(--admin-warning)'
                  : 'var(--admin-success)',
            }}
          >
            {monthLockStatus.status === 'LOCKED' ? '🔒' : '🟢'} Current Month:{' '}
            {monthLockStatus.status}
            {monthLockStatus.lockedTill && ` (till ${monthLockStatus.lockedTill})`}
          </div>
        ),
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
    // Ensure orders is always an array to prevent runtime errors
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
              // Format: YYYY-MM-DD
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

  // Refresh handler - hard refresh that bypasses cache (silent background refresh)
  const handleRefresh = () => {
    // Run refresh silently in background without blocking
    (async () => {
      try {
        // Clear any cached data first
        if (typeof window !== 'undefined') {
          // Clear localStorage cache for orders (if any)
          // Note: We don't clear all localStorage, just order-related cache
          const cachedOrders = localStorage.getItem('homiebites_orders');
          if (cachedOrders) {
            localStorage.removeItem('homiebites_orders');
          }
        }

        // Reload all data in parallel with hard refresh flag (non-blocking)
        const promises = [];

        // Add async functions with hard refresh
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

        // Handle sync functions separately
        if (loadSettings && typeof loadSettings === 'function') {
          try {
            loadSettings();
          } catch (err) {
            console.error('Error reloading settings:', err);
          }
        }

        // Wait for all async operations in background (non-blocking)
        if (promises.length > 0) {
          await Promise.all(promises);
        }
      } catch (error) {
        console.error('Error refreshing data:', error);
      }
    })();
  };

  return (
    <div className='admin-dashboard'>
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      <div className={`admin-main ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <TopNav
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
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

        {/* Important Notifications Banner */}
        <ImportantNotificationsBanner
          orders={orders}
          dismissedNotifications={dismissedNotifications}
          onDismiss={handleDismissNotification}
          onViewPendingAmounts={handleViewPendingAmounts}
        />

        {renderActiveTab()}
      </div>

      {/* Order Modal */}
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

      {/* CSV Upload Modal */}
      {showCSVUploadModal && (
        <CSVUploadModal
          show={showCSVUploadModal}
          onClose={() => setShowCSVUploadModal(false)}
          onUploadSuccess={(_data) => {
            // Upload successful
          }}
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

      {/* PWA Install Prompt - Admin Only */}
      <InstallPrompt />
    </div>
  );
};

export default AdminDashboard;
