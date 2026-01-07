import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AllAddressesTab from './components/AllAddressesTab.jsx';
import AllOrdersDataTab from './components/AllOrdersDataTab.jsx';
import AnalyticsTab from './components/AnalyticsTab.jsx';
import CSVUploadModal from './components/CSVUploadModal.jsx';
import ConfirmationModal from './components/ConfirmationModal.jsx';
import CurrentMonthOrdersTab from './components/CurrentMonthOrdersTab.jsx';
import DashboardTab from './components/DashboardTab.jsx';
import ImportantNotificationsBanner from './components/ImportantNotificationsBanner.jsx';
import InstallPrompt from './components/InstallPrompt.jsx';
import MenuPriceTab from './components/MenuPriceTab.jsx';
import NotificationsTab from './components/NotificationsTab.jsx';
import OrderModal from './components/OrderModal.jsx';
import PendingAmountsTab from './components/PendingAmountsTab.jsx';
import ReportsTab from './components/ReportsTab.jsx';
import SettingsTab from './components/SettingsTab.jsx';
import Sidebar from './components/Sidebar.jsx';
import TopNav from './components/TopNav.jsx';
import { useNotification } from './contexts/NotificationContext.jsx';
import { useFastDataSync } from './hooks/useFastDataSync.js';
import api from './lib/api.js';
import { logout } from './lib/auth.js';
import dataSyncManager from './utils/dataSyncManager.js';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [activeTab, setActiveTab] = useState('dashboard');
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

  // Load data using fast sync hook for optimized operations
  const {
    orders,
    settings,
    loading,
    loadOrders,
    currentUser,
    fastDelete,
    fastUpdate,
    fastCreate,
    syncDebounced,
    cancelAll,
    syncing,
  } = useFastDataSync();

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('homiebites_token');
    const isAdmin = localStorage.getItem('homiebites_admin') === 'true';

    if (!token || !isAdmin) {
      navigate('/admin/login', { replace: true });
    }
  }, [navigate]);

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

    // Apply theme
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark-theme');
      document.documentElement.classList.remove('light-theme');
    } else if (savedTheme === 'light') {
      document.documentElement.classList.add('light-theme');
      document.documentElement.classList.remove('dark-theme');
    } else if (savedTheme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark-theme');
        document.documentElement.classList.remove('light-theme');
      } else {
        document.documentElement.classList.add('light-theme');
        document.documentElement.classList.remove('dark-theme');
      }
    }
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

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  // Handle add order - using fast sync
  const handleAddOrder = async (orderData) => {
    try {
      await fastCreate(
        orderData,
        () => {
          if (showNotification) {
            showNotification('Order added successfully', 'success');
          }
          setShowOrderModal(false);
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
        },
        (error) => {
          console.error('Error adding order:', error);
          if (showNotification) {
            showNotification(error.message || 'Error adding order', 'error');
          }
        }
      );
    } catch (error) {
      console.error('Error adding order:', error);
      if (showNotification) {
        showNotification('Error adding order', 'error');
      }
    }
  };

  // Handle edit order - using fast sync
  const handleEditOrder = async (orderId, orderData) => {
    try {
      const order = (orders || []).find(
        (o) => o.orderId === orderId || o._id === orderId || o.id === orderId
      );
      const apiOrderId = order?._id || order?.id || order?.orderId || orderId;

      await fastUpdate(
        apiOrderId,
        orderData,
        () => {
          if (showNotification) {
            showNotification('Order updated successfully', 'success');
          }
          setShowOrderModal(false);
          setEditingOrder(null);
        },
        (error) => {
          console.error('Error updating order:', error);
          if (showNotification) {
            showNotification(error.message || 'Error updating order', 'error');
          }
        }
      );
    } catch (error) {
      console.error('Error updating order:', error);
      if (showNotification) {
        showNotification('Error updating order', 'error');
      }
    }
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
          await config.onConfirm();
        }
        setConfirmationModal((prev) => ({ ...prev, show: false }));
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
                showNotification('Order deleted successfully', 'success');
              }
            },
            (error) => {
              console.error('Error deleting order:', error);
              if (showNotification) {
                showNotification(error.message || 'Error deleting order', 'error');
              }
            }
          );
        } catch (error) {
          console.error('Error deleting order:', error);
          if (showNotification) {
            showNotification('Error deleting order', 'error');
          }
        }
      },
    });
  };

  // Handle update order status - using fast sync
  // Note: Confirmation is handled by the calling component (AllOrdersDataTab)
  const handleUpdateOrderStatus = async (orderId, status, skipConfirmation = false) => {
    const order = (orders || []).find(
      (o) => o.orderId === orderId || o._id === orderId || o.id === orderId
    );

    if (!order) {
      if (showNotification) {
        showNotification('Order not found', 'error');
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
              showNotification('Order status updated successfully', 'success');
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
              showNotification(error.message || 'Error updating order status', 'error');
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
          showNotification(error.message || 'Error updating order status', 'error');
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
  const handleSendReminder = (orderId) => {
    // In a real app, this would send a reminder
    if (showNotification) {
      showNotification('Reminder sent successfully', 'success');
    }
  };

  // Handle update settings
  const handleUpdateSettings = async (newSettings) => {
    try {
      // In a real app, this would call an API
      if (showNotification) {
        showNotification('Settings updated successfully', 'success');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      if (showNotification) {
        showNotification('Error updating settings', 'error');
      }
    }
  };

  // Handle backup
  const handleBackup = async () => {
    try {
      // In a real app, this would create a backup
      if (showNotification) {
        showNotification('Backup created successfully', 'success');
      }
    } catch (error) {
      console.error('Error creating backup:', error);
      if (showNotification) {
        showNotification('Error creating backup', 'error');
      }
    }
  };

  // Handle restore
  const handleRestore = async () => {
    try {
      // In a real app, this would restore from backup
      if (showNotification) {
        showNotification('Data restored successfully', 'success');
      }
      if (loadOrders) loadOrders();
    } catch (error) {
      console.error('Error restoring data:', error);
      if (showNotification) {
        showNotification('Error restoring data', 'error');
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
                `Warning: Deleted ${deletedCount} orders, but ${afterCount} orders still remain. Please try again.`,
                'warning'
              );
            }
          } else {
            if (showNotification) {
              showNotification(`Successfully deleted ${deletedCount} orders`, 'success');
            }
          }

          // Wait a moment for database to sync, then reload orders
          setTimeout(() => {
            if (loadOrders) {
              loadOrders().then(() => {
                // Verify orders are actually cleared
                setTimeout(() => {
                  if (loadOrders) loadOrders();
                }, 500);
              });
            }
          }, 1000);
        } else {
          if (showNotification) {
            showNotification(response.error || 'Failed to clear data', 'error');
          }
        }
      } catch (error) {
        console.error('Error clearing data:', error);
        if (showNotification) {
          showNotification('Error clearing data: ' + (error.message || 'Unknown error'), 'error');
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

  // Render active tab
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
        return <AnalyticsTab {...commonProps} />;

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
            onViewOrder={handleViewOrder}
            onMarkAsPaid={handleUpdateOrderStatus}
            onSendReminder={handleSendReminder}
          />
        );

      case 'menuPrice':
        return <MenuPriceTab {...commonProps} />;

      default:
        return <DashboardTab {...commonProps} setActiveTab={setActiveTab} />;
    }
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
              status: 'Pending',
              paymentMode: 'Online',
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
          onUploadSuccess={(data) => {
            console.log('Upload success:', data);
          }}
          showNotification={showNotification}
          loadOrders={loadOrders}
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

      {/* PWA Install Prompt */}
      <InstallPrompt />
    </div>
  );
};

export default AdminDashboard;
