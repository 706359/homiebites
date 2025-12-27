import { useEffect, useMemo, useState } from 'react';
import { adminFeatures, orderStatuses } from '../shared/utils/adminConfig.js';
import { triggerDataSync } from '../shared/utils/menuData.js';
import api from '../web/lib/api.js';
import { logout } from '../web/lib/auth.js';
import { getMenuData, getMenuDataSync, resetMenuData, saveMenuData } from '../web/lib/menuData.js';
import {
  getOffersData,
  getOffersDataSync,
  saveOffersData,
  triggerOffersDataSync,
} from '../web/lib/offersData.js';
import ConfirmModal from './ConfirmModal';
import NotificationSystem, { showNotification } from './NotificationSystem';

import './AdminDashboard.css';

const AdminDashboard = ({ onLogout }) => {
  const [menuData, setMenuData] = useState([]);
  const [offersData, setOffersData] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [saved, setSaved] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [showAddOfferModal, setShowAddOfferModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [newOffer, setNewOffer] = useState({
    title: '',
    description: '',
    discount: '',
    badge: '',
    terms: [],
    startDate: '',
    endDate: '',
    whatsappMessage: '',
    ctaText: 'Get This Deal',
    isActive: true,
  });
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [newsletterSubscriptions, setNewsletterSubscriptions] = useState([]);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [settings, setSettings] = useState({
    whatsappNumber: '919958983578',
    deliveryTimings: '7:30 PM - 8:30 PM',
    minOrderValue: 100,
    deliveryCharge: 0,
    announcement: 'Free delivery on orders over ₹200',
  });
  const [notifications, setNotifications] = useState([]);
  const [orderFilter, setOrderFilter] = useState('all'); // all, pending, delivered, etc.
  const [orderSort, setOrderSort] = useState('newest'); // newest, oldest, amount
  const [searchQuery, setSearchQuery] = useState('');

  const [dateRange, setDateRange] = useState('all'); // all, today, week, month, custom
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [showAddOrderModal, setShowAddOrderModal] = useState(false);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(() => {
    // Ensure valid default value
    const saved = localStorage.getItem('homiebites_records_per_page');
    const parsed = saved ? parseInt(saved, 10) : 20;
    return parsed >= 20 && parsed <= 200 ? parsed : 20;
  });
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showDeleteOrderModal, setShowDeleteOrderModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  // Customer/Address filters
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [customerSort, setCustomerSort] = useState('totalAmount'); // totalAmount, totalOrders, lastOrder
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showRemoveItemModal, setShowRemoveItemModal] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [newOrder, setNewOrder] = useState({
    date: new Date().toISOString().split('T')[0],
    deliveryAddress: '',
    quantity: 1,
    unitPrice: 0,
    totalAmount: 0,
    status: 'Paid',
    paymentMode: 'Online',
    billingMonth: '',
    referenceMonth: '',
    elapsedDays: '',
  });
  const [sidebarOpen, setSidebarOpen] = useState(false); // For mobile overlay
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // For desktop collapse
  const [currentUser, setCurrentUser] = useState(null);

  // Reset to first page when filters change
  useEffect(() => {
    try {
      setCurrentPage(1);
    } catch (error) {
      console.error('Error resetting page:', error);
    }
  }, [
    orderFilter,
    dateRange,
    customStartDate,
    customEndDate,
    searchQuery,
    orderSort,
    customerSearchQuery,
    customerSort,
  ]);

  useEffect(() => {
    // Wrap all async operations to prevent unhandled promise rejections
    const loadAllData = async () => {
      try {
        // Use Promise.allSettled to ensure all promises complete, even if some fail
        const results = await Promise.allSettled([
          loadMenuData().catch((err) => {
            console.error('loadMenuData failed:', err);
            return null;
          }),
          loadOffersData().catch((err) => {
            console.error('loadOffersData failed:', err);
            return null;
          }),
          loadOrders().catch((err) => {
            console.error('loadOrders failed:', err);
            return null;
          }),
          loadUsers().catch((err) => {
            console.error('loadUsers failed:', err);
            return null;
          }),
        ]);

        // Log any failures but continue
        results.forEach((result, index) => {
          if (result.status === 'rejected') {
            console.error(`Data load ${index} failed:`, result.reason);
          }
        });

        // These are synchronous, safe to call
        try {
          loadSettings();
        } catch (err) {
          console.error('loadSettings failed:', err);
        }

        try {
          loadNotifications();
        } catch (err) {
          console.error('loadNotifications failed:', err);
        }

        try {
          loadNewsletterSubscriptions();
        } catch (err) {
          console.error('loadNewsletterSubscriptions failed:', err);
        }

        try {
          loadCurrentUser();
        } catch (err) {
          console.error('loadCurrentUser failed:', err);
        }
      } catch (error) {
        console.error('Critical error loading dashboard data:', error);
        // Still try to load sync data as fallback
        try {
          loadSettings();
          loadNotifications();
          loadNewsletterSubscriptions();
          loadCurrentUser();
        } catch (fallbackError) {
          console.error('Fallback data load also failed:', fallbackError);
        }
      }
    };

    // Wrap in try-catch to prevent any unhandled errors
    try {
      loadAllData().catch((err) => {
        console.error('loadAllData promise rejected:', err);
      });
    } catch (err) {
      console.error('loadAllData threw synchronously:', err);
    }
  }, []);

  const loadCurrentUser = () => {
    try {
      const userStr = localStorage.getItem('homiebites_user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
      }
    } catch (error) {
      console.error('Error loading current user:', error);
    }
  };

  const loadMenuData = async () => {
    try {
      const data = await getMenuData();
      setMenuData(data);
    } catch (error) {
      console.error('Error loading menu:', error);
      const data = getMenuDataSync();
      setMenuData(data);
    }
  };

  const loadOffersData = async () => {
    try {
      const data = await getOffersData();
      setOffersData(data);
    } catch (error) {
      console.error('Error loading offers:', error);
      const data = getOffersDataSync();
      setOffersData(data);
    }
  };

  const loadOrders = async () => {
    try {
      // Try API first
      const token = localStorage.getItem('homiebites_token');
      if (token) {
        try {
          const response = await api.getAllOrders({
            status: orderFilter !== 'all' ? orderFilter : undefined,
            dateFrom: dateRange === 'custom' && customStartDate ? customStartDate : undefined,
            dateTo: dateRange === 'custom' && customEndDate ? customEndDate : undefined,
            search: searchQuery || undefined,
          });
          if (response.success && response.data) {
            setOrders(response.data);
            // Cache in localStorage for offline access
            localStorage.setItem('homiebites_orders', JSON.stringify(response.data));
            return;
          }
        } catch (apiError) {
          console.warn('Failed to load orders from API, using cached data:', apiError.message);
        }
      }

      // Fallback to localStorage
      const stored = localStorage.getItem('homiebites_orders');
      if (stored) {
        setOrders(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error loading orders:', e);
    }
  };

  const loadUsers = async () => {
    try {
      // Try API first
      const token = localStorage.getItem('homiebites_token');
      if (token) {
        try {
          const response = await api.getAllUsers();
          if (response.success && response.data) {
            setUsers(response.data);
            // Cache in localStorage for offline access
            localStorage.setItem('homiebites_users', JSON.stringify(response.data));
            return;
          }
        } catch (apiError) {
          console.warn('Failed to load users from API, using cached data:', apiError.message);
        }
      }

      // Fallback to localStorage
      const stored =
        localStorage.getItem('homiebites_users') || localStorage.getItem('homiebites_users_data');
      if (stored) {
        const usersData = JSON.parse(stored);
        // Handle both array and object formats
        const usersArray = Array.isArray(usersData) ? usersData : Object.values(usersData);
        setUsers(usersArray);
      }
    } catch (e) {
      console.error('Error loading users:', e);
    }
  };

  const loadSettings = () => {
    try {
      const stored = localStorage.getItem('homiebites_settings');
      if (stored) {
        setSettings(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error loading settings:', e);
    }
  };

  const loadNotifications = () => {
    try {
      const stored = localStorage.getItem('homiebites_notifications');
      if (stored) {
        setNotifications(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error loading notifications:', e);
    }
  };

  const loadNewsletterSubscriptions = () => {
    try {
      const stored = localStorage.getItem('homiebites_newsletter');
      if (stored) {
        setNewsletterSubscriptions(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error loading newsletter subscriptions:', e);
    }
  };

  const handleSave = async () => {
    setSyncing(true);
    try {
      await saveMenuData(menuData);
      triggerDataSync();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      showNotification(
        'Menu updated successfully! Changes will sync to website and app.',
        'success'
      );
    } catch (error) {
      console.error('Error saving menu:', error);
      showNotification('Menu saved locally (API unavailable)', 'warning');
    } finally {
      setSyncing(false);
    }
  };

  const handleSaveOffers = async () => {
    setSyncing(true);
    try {
      await saveOffersData(offersData);
      triggerOffersDataSync();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      showNotification('Offers updated successfully! Changes will sync to website.', 'success');
      await loadOffersData();
    } catch (error) {
      console.error('Error saving offers:', error);
      showNotification('Offers saved locally (API unavailable)', 'warning');
    } finally {
      setSyncing(false);
    }
  };

  const handleAddOffer = () => {
    setEditingOffer(null);
    setNewOffer({
      title: '',
      description: '',
      discount: '',
      badge: '',
      terms: [],
      startDate: '',
      endDate: '',
      whatsappMessage: '',
      ctaText: 'Get This Deal',
      isActive: true,
    });
    setShowAddOfferModal(true);
  };

  const handleSaveNewOffer = () => {
    if (!newOffer.title || !newOffer.description) {
      showNotification('Please fill in Title and Description', 'warning');
      return;
    }

    if (editingOffer) {
      // Update existing offer
      setOffersData((prev) =>
        prev.map((offer) =>
          offer.id === editingOffer.id ? { ...newOffer, id: editingOffer.id } : offer
        )
      );
      showNotification('Offer updated successfully!', 'success');
    } else {
      // Add new offer
      const offer = {
        ...newOffer,
        id: Date.now(),
        createdAt: new Date().toISOString(),
      };
      setOffersData((prev) => [...prev, offer]);
      showNotification('Offer added successfully!', 'success');
    }

    setShowAddOfferModal(false);
    setEditingOffer(null);
  };

  const handleEditOffer = (offer) => {
    setEditingOffer(offer);
    setNewOffer(offer);
    setShowAddOfferModal(true);
  };

  const handleDeleteOffer = (offerId) => {
    setOffersData((prev) => prev.filter((offer) => offer.id !== offerId));
    showNotification('Offer deleted successfully!', 'success');
  };

  const addTerm = () => {
    setNewOffer((prev) => ({
      ...prev,
      terms: [...prev.terms, ''],
    }));
  };

  const updateTerm = (index, value) => {
    setNewOffer((prev) => {
      const newTerms = [...prev.terms];
      newTerms[index] = value;
      return { ...prev, terms: newTerms };
    });
  };

  const removeTerm = (index) => {
    setNewOffer((prev) => ({
      ...prev,
      terms: prev.terms.filter((_, i) => i !== index),
    }));
  };

  const handleAddOrder = () => {
    setEditingOrder(null);
    setShowAddOrderModal(true);
    // Set default date to today
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    // Calculate billing month and reference month
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const monthIndex = today.getMonth();
    const billingMonth = monthNames[monthIndex];
    const referenceMonth = `${String(monthIndex + 1).padStart(2, '0')} - ${monthNames[monthIndex].substring(0, 3)}'${year.toString().slice(-2)}`;

    setNewOrder({
      date: formattedDate,
      deliveryAddress: '',
      quantity: 1,
      unitPrice: 0,
      totalAmount: 0,
      status: 'Paid',
      paymentMode: 'Online',
      billingMonth: billingMonth,
      referenceMonth: referenceMonth,
      elapsedDays: '0',
      year: year.toString(),
    });
  };

  const handleSaveNewOrder = async () => {
    if (!newOrder.deliveryAddress || !newOrder.date) {
      showNotification('Please fill in Delivery Address and Date', 'warning');
      return;
    }

    // Calculate total if not provided
    const total = newOrder.totalAmount || newOrder.quantity * newOrder.unitPrice;

    if (editingOrder) {
      // Update existing order
      await handleSaveEditedOrder();
      return;
    }

    // Try to save to API first
    const token = localStorage.getItem('homiebites_token');
    if (token) {
      try {
        const apiOrder = {
          date: newOrder.date,
          deliveryAddress: newOrder.deliveryAddress,
          quantity: parseInt(newOrder.quantity) || 1,
          unitPrice: parseFloat(newOrder.unitPrice) || 0,
          totalAmount: total,
          status: newOrder.status,
          paymentMode: newOrder.paymentMode,
          billingMonth: newOrder.billingMonth,
          referenceMonth: newOrder.referenceMonth,
          elapsedDays: newOrder.elapsedDays || '0',
          year: newOrder.year || new Date().getFullYear().toString(),
          items: [
            {
              name: `Order #${orders.length + 1}`,
              quantity: parseInt(newOrder.quantity) || 1,
              price: parseFloat(newOrder.unitPrice) || 0,
            },
          ],
        };

        const response = await api.createOrder(apiOrder);
        if (response.success) {
          // Reload orders from API
          await loadOrders();
          showNotification('Order added successfully!', 'success');
          setShowAddOrderModal(false);
          setNewOrder({
            date: new Date().toISOString().split('T')[0],
            deliveryAddress: '',
            quantity: 1,
            unitPrice: 0,
            totalAmount: 0,
            status: 'Paid',
            paymentMode: 'Online',
            billingMonth: '',
            referenceMonth: '',
            elapsedDays: '',
          });
          return;
        }
      } catch (apiError) {
        console.warn('Failed to save order to API, saving locally:', apiError.message);
        showNotification('Order saved locally (API unavailable)', 'warning');
      }
    }

    // Fallback to localStorage
    const order = {
      id: Date.now().toString(),
      sNo: (orders.length + 1).toString(),
      date: newOrder.date,
      deliveryAddress: newOrder.deliveryAddress,
      quantity: parseInt(newOrder.quantity) || 1,
      unitPrice: parseFloat(newOrder.unitPrice) || 0,
      totalAmount: total,
      status: newOrder.status,
      paymentMode: newOrder.paymentMode,
      billingMonth: newOrder.billingMonth,
      referenceMonth: newOrder.referenceMonth,
      elapsedDays: newOrder.elapsedDays || '0',
      year: newOrder.year || new Date().getFullYear().toString(),
      customerAddress: newOrder.deliveryAddress,
      total: total,
      createdAt: new Date().toISOString(),
      items: [
        {
          name: `Order #${orders.length + 1}`,
          quantity: parseInt(newOrder.quantity) || 1,
          price: parseFloat(newOrder.unitPrice) || 0,
        },
      ],
    };

    const updatedOrders = [...orders, order];
    setOrders(updatedOrders);
    localStorage.setItem('homiebites_orders', JSON.stringify(updatedOrders));

    showNotification('Order added successfully!', 'success');

    setShowAddOrderModal(false);
    setNewOrder({
      date: new Date().toISOString().split('T')[0],
      deliveryAddress: '',
      quantity: 1,
      unitPrice: 0,
      totalAmount: 0,
      status: 'Paid',
      paymentMode: 'Online',
      billingMonth: '',
      referenceMonth: '',
      elapsedDays: '',
    });
  };

  const handleNewOrderChange = (field, value) => {
    setNewOrder((prev) => {
      const updated = { ...prev, [field]: value };
      // Auto-calculate total if quantity or unit price changes
      if (field === 'quantity' || field === 'unitPrice') {
        updated.totalAmount =
          (parseInt(updated.quantity) || 0) * (parseFloat(updated.unitPrice) || 0);
      }
      // Auto-calculate unit price if total and quantity change
      if (field === 'totalAmount' && updated.quantity) {
        updated.unitPrice =
          (parseFloat(updated.totalAmount) || 0) / (parseInt(updated.quantity) || 1);
      }
      return updated;
    });
  };

  const handleSaveSettings = () => {
    localStorage.setItem('homiebites_settings', JSON.stringify(settings));
    alert('✅ Settings saved successfully!');
  };

  const handleReset = () => {
    setShowResetModal(true);
  };

  const confirmReset = async () => {
    const defaultData = await resetMenuData();
    setMenuData(defaultData);
    showNotification('Default menu loaded. Click "Save Changes" to apply to website.', 'info');
  };

  const updateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map((order) =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem('homiebites_orders', JSON.stringify(updatedOrders));
  };

  // Mark all orders as delivered
  const markAllOrdersAsDelivered = () => {
    try {
      if (!Array.isArray(orders) || orders.length === 0) {
        showNotification('No orders to update', 'info');
        return;
      }

      if (
        window.confirm(
          `Are you sure you want to mark ALL ${orders.length} orders as delivered? This action cannot be undone.`
        )
      ) {
        try {
          const updatedOrders = orders.map((order) => {
            try {
              if (!order) return order;
              return {
                ...order,
                status: 'delivered',
              };
            } catch (orderError) {
              console.warn('Error processing order in markAllDelivered:', orderError, order);
              return order; // Return original order if error
            }
          });
          setOrders(updatedOrders);
          localStorage.setItem('homiebites_orders', JSON.stringify(updatedOrders));
          showNotification(`Successfully marked ${updatedOrders.length} orders as delivered!`, 'success');
        } catch (error) {
          console.error('Error marking all orders as delivered:', error);
          showNotification('Error marking orders as delivered', 'error');
        }
      }
    } catch (error) {
      console.error('Error in markAllOrdersAsDelivered:', error);
      showNotification('Error: Unable to mark orders as delivered', 'error');
    }
  };

  const handleDeleteOrder = (orderId) => {
    setOrderToDelete(orderId);
    setShowDeleteOrderModal(true);
  };

  const confirmDeleteOrder = async () => {
    if (orderToDelete) {
      // Try API first
      const token = localStorage.getItem('homiebites_token');
      const order = orders.find((o) => o.id === orderToDelete);
      const orderId = order?._id || order?.id;

      if (token && orderId) {
        try {
          const response = await api.deleteOrder(orderId);
          if (response.success) {
            await loadOrders();
            showNotification('Order deleted successfully!', 'success');
            setOrderToDelete(null);
            return;
          }
        } catch (apiError) {
          console.warn('Failed to delete order from API:', apiError.message);
          showNotification('Order deleted locally (API unavailable)', 'warning');
        }
      }

      // Fallback to localStorage
      const updatedOrders = orders.filter((order) => order.id !== orderToDelete);
      setOrders(updatedOrders);
      localStorage.setItem('homiebites_orders', JSON.stringify(updatedOrders));
      showNotification('Order deleted successfully!', 'success');
      setOrderToDelete(null);
    }
  };

  const handleEditOrder = (order) => {
    setEditingOrder({ ...order });
    setShowAddOrderModal(true);
  };

  const handleSaveEditedOrder = async () => {
    try {
      if (!editingOrder.deliveryAddress || !editingOrder.date) {
        showNotification('Please fill in Delivery Address and Date', 'warning');
        return;
      }

      // Try API first
      const token = localStorage.getItem('homiebites_token');
      const orderId = editingOrder._id || editingOrder.id;

      if (token && orderId) {
        try {
          const apiOrder = {
            date: editingOrder.date,
            deliveryAddress: editingOrder.deliveryAddress,
            quantity: parseInt(editingOrder.quantity) || 1,
            unitPrice: parseFloat(editingOrder.unitPrice) || 0,
            totalAmount: editingOrder.totalAmount || editingOrder.quantity * editingOrder.unitPrice,
            status: editingOrder.status,
            paymentMode: editingOrder.paymentMode,
            billingMonth: editingOrder.billingMonth,
            referenceMonth: editingOrder.referenceMonth,
            elapsedDays: editingOrder.elapsedDays || '0',
            year: editingOrder.year || new Date().getFullYear().toString(),
          };

          const response = await api.updateOrder(orderId, apiOrder);
          if (response.success) {
            await loadOrders();
            showNotification('Order updated successfully!', 'success');
            setShowAddOrderModal(false);
            setEditingOrder(null);
            return;
          }
        } catch (apiError) {
          console.warn('Failed to update order via API, updating locally:', apiError.message);
        }
      }

      // Fallback to localStorage
      const updatedOrders = orders.map((order) =>
        order.id === editingOrder.id ? editingOrder : order
      );
      setOrders(updatedOrders);
      localStorage.setItem('homiebites_orders', JSON.stringify(updatedOrders));
      showNotification('Order updated successfully!', 'success');
      setShowAddOrderModal(false);
      setEditingOrder(null);
    } catch (error) {
      console.error('Error updating order:', error);
      showNotification('Error updating order. Please try again.', 'error');
    }
  };

  const getFilteredUsers = () => {
    if (!userSearchQuery) return users;
    const query = userSearchQuery.toLowerCase();
    return users.filter(
      (user) =>
        (user.name || '').toLowerCase().includes(query) ||
        (user.email || '').toLowerCase().includes(query) ||
        (user.phone || '').includes(query)
    );
  };

  const addNotification = () => {
    const newNotification = {
      id: Date.now(),
      title: '',
      message: '',
      type: 'info',
      active: true,
      createdAt: new Date().toISOString(),
    };
    setNotifications([...notifications, newNotification]);
  };

  const saveNotifications = () => {
    localStorage.setItem('homiebites_notifications', JSON.stringify(notifications));
    alert('✅ Notifications saved!');
  };

  const updateCategory = (categoryId, field, value) => {
    setMenuData((prev) =>
      prev.map((cat) => (cat.id === categoryId ? { ...cat, [field]: value } : cat))
    );
  };

  const updateItem = (categoryId, itemId, field, value) => {
    setMenuData((prev) =>
      prev.map((cat) => {
        if (cat.id === categoryId) {
          const updatedItems = cat.items.map((item) =>
            item.id === itemId ? { ...item, [field]: value } : item
          );
          return { ...cat, items: updatedItems };
        }
        return cat;
      })
    );
  };

  const addItem = (categoryId) => {
    setMenuData((prev) =>
      prev.map((cat) => {
        if (cat.id === categoryId) {
          const newItem = {
            id: Date.now(),
            name: 'New Item',
            price: 0,
          };
          return { ...cat, items: [...cat.items, newItem] };
        }
        return cat;
      })
    );
  };

  const removeItem = (categoryId, itemId) => {
    setItemToRemove({ categoryId, itemId });
    setShowRemoveItemModal(true);
  };

  const confirmRemoveItem = () => {
    if (itemToRemove) {
      setMenuData((prev) =>
        prev.map((cat) => {
          if (cat.id === itemToRemove.categoryId) {
            return { ...cat, items: cat.items.filter((item) => item.id !== itemToRemove.itemId) };
          }
          return cat;
        })
      );
      showNotification('Item removed successfully!', 'success');
      setItemToRemove(null);
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    try {
      // Clear all admin-related data
      logout();
      localStorage.removeItem('homiebites_admin');
      localStorage.removeItem('homiebites_user');
      localStorage.removeItem('homiebites_token');

      // Call the onLogout callback if provided
      if (onLogout && typeof onLogout === 'function') {
        onLogout();
      } else {
        // Fallback: redirect to admin login page
        window.location.href = '/admin';
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Still try to redirect even if there's an error
      window.location.href = '/admin';
    }
  };

  // Format currency with 2 decimal places
  const formatCurrency = (amount) => {
    try {
      const num = parseFloat(amount) || 0;
      return num.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    } catch (error) {
      console.error('Error formatting currency:', error);
      return '0.00';
    }
  };

  // Get total revenue - ALL orders (matches Excel format)
  const getTotalRevenue = (ordersList = orders) => {
    try {
      if (!Array.isArray(ordersList)) {
        return 0;
      }
      return ordersList.reduce((total, order) => {
        try {
          if (!order) return total;
          const amount = parseFloat(order.total || order.totalAmount || 0);
          return total + (isNaN(amount) ? 0 : amount);
        } catch (error) {
          return total;
        }
      }, 0);
    } catch (error) {
      console.error('Error calculating total revenue:', error);
      return 0;
    }
  };

  // Get delivered revenue only (for stats)
  const getDeliveredRevenue = (ordersList = orders) => {
    try {
      if (!Array.isArray(ordersList)) {
        return 0;
      }
      return ordersList.reduce((total, order) => {
        try {
          if (!order || order.status !== 'delivered') return total;
          const amount = parseFloat(order.total || order.totalAmount || 0);
          return total + (isNaN(amount) ? 0 : amount);
        } catch (error) {
          return total;
        }
      }, 0);
    } catch (error) {
      console.error('Error calculating delivered revenue:', error);
      return 0;
    }
  };

  const getPendingOrders = () => {
    return orders.filter((o) => ['pending', 'confirmed', 'preparing'].includes(o.status)).length;
  };

  const getFilteredOrdersByDate = (ordersList) => {
    try {
      if (!Array.isArray(ordersList)) {
        return [];
      }

      if (dateRange === 'all') return ordersList;

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      return ordersList.filter((order) => {
        try {
          if (!order) return false;

          const dateValue = order.createdAt || order.date;
          if (!dateValue) return true; // Include orders without dates

          const orderDate = new Date(dateValue);
          if (isNaN(orderDate.getTime())) {
            return true; // Include invalid dates rather than crash
          }

          const orderDateOnly = new Date(
            orderDate.getFullYear(),
            orderDate.getMonth(),
            orderDate.getDate()
          );

          if (dateRange === 'today') {
            return orderDateOnly.getTime() === today.getTime();
          }

          if (dateRange === 'week') {
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return orderDateOnly >= weekAgo;
          }

          if (dateRange === 'month') {
            return (
              orderDate.getMonth() === now.getMonth() &&
              orderDate.getFullYear() === now.getFullYear()
            );
          }

          if (dateRange === 'custom' && customStartDate && customEndDate) {
            const start = new Date(customStartDate);
            const end = new Date(customEndDate);

            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
              return true; // Include if dates are invalid
            }

            end.setHours(23, 59, 59, 999);
            return orderDate >= start && orderDate <= end;
          }

          return true;
        } catch (filterError) {
          console.warn('Error filtering order by date:', filterError, order);
          return true; // Include order on error
        }
      });
    } catch (error) {
      console.error('Critical error in getFilteredOrdersByDate:', error);
      return ordersList || []; // Return original list on error
    }
  };

  const getTodayStats = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayOrders = orders.filter((order) => {
      const orderDate = new Date(order.createdAt || order.date || Date.now());
      return orderDate >= today && orderDate < tomorrow;
    });

    return {
      orders: todayOrders.length,
      pending: todayOrders.filter((o) => ['pending', 'confirmed', 'preparing'].includes(o.status))
        .length,
      revenue: getDeliveredRevenue(todayOrders), // Only delivered for stats
      totalRevenue: getTotalRevenue(todayOrders), // All orders for total
    };
  };

  const getWeeklyStats = () => {
    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const weekOrders = orders.filter((order) => {
      const orderDate = new Date(order.createdAt || order.date || Date.now());
      return orderDate >= weekAgo;
    });

    const deliveredWeekOrders = weekOrders.filter((o) => o.status === 'delivered');
    const revenue = getDeliveredRevenue(weekOrders); // Only delivered for stats
    const totalRevenue = getTotalRevenue(weekOrders); // All orders for total

    return {
      orders: weekOrders.length,
      revenue: revenue,
      totalRevenue: totalRevenue,
      avgOrderValue:
        deliveredWeekOrders.length > 0 ? Math.round(revenue / deliveredWeekOrders.length) : 0,
      avgOrderValueAll: weekOrders.length > 0 ? Math.round(totalRevenue / weekOrders.length) : 0,
    };
  };

  const handleImportOrders = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    const isExcel = fileName.endsWith('.xlsx') || fileName.endsWith('.xls');
    const isJSON = fileName.endsWith('.json');

    if (!isExcel && !isJSON) {
      showNotification(
        'Unsupported file format. Please upload a JSON (.json) or Excel (.xlsx, .xls) file.',
        'error'
      );
      return;
    }

    try {
      let importedData = [];

      if (isExcel) {
        // Import SheetJS library - Use CDN to avoid Vite module resolution issues
        let XLSX;

        // Check if already loaded
        if (typeof window !== 'undefined' && window.XLSX) {
          XLSX = window.XLSX;
        } else {
          // Load from CDN (most reliable for admin folder)
          await new Promise((resolve, reject) => {
            // Check if script already exists
            const existingScript = document.querySelector('script[src*="xlsx"]');
            if (existingScript) {
              if (window.XLSX) {
                XLSX = window.XLSX;
                resolve();
                return;
              }
              // Wait for existing script to load
              existingScript.addEventListener('load', () => {
                XLSX = window.XLSX;
                resolve();
              });
              existingScript.addEventListener('error', reject);
              return;
            }

            // Create and load script
            const script = document.createElement('script');
            script.src = 'https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js';
            script.async = true;
            script.onload = () => {
              XLSX = window.XLSX;
              if (!XLSX) {
                reject(new Error('XLSX not available after script load'));
              } else {
                resolve();
              }
            };
            script.onerror = () => reject(new Error('Failed to load Excel library from CDN'));
            document.head.appendChild(script);
          });

          if (!XLSX && window.XLSX) {
            XLSX = window.XLSX;
          }

          if (!XLSX) {
            throw new Error('Failed to load Excel library. Please check your internet connection.');
          }
        }

        // Read Excel file as array buffer
        const reader = new FileReader();
        const fileData = await new Promise((resolve, reject) => {
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = reject;
          reader.readAsArrayBuffer(file);
        });

        // Parse Excel file
        let workbook;
        try {
          workbook = XLSX.read(fileData, { type: 'array' });
        } catch (parseError) {
          throw new Error(`Failed to parse Excel file: ${parseError.message}`);
        }

        if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
          throw new Error('Excel file has no sheets');
        }

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        if (!worksheet) {
          throw new Error(`Sheet "${firstSheetName}" is empty or invalid`);
        }

        // Convert to JSON array
        let jsonData;
        try {
          jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
        } catch (convertError) {
          throw new Error(`Failed to convert sheet to JSON: ${convertError.message}`);
        }

        // Convert to order objects (assuming first row is headers)
        if (!jsonData || jsonData.length === 0) {
          throw new Error('Excel file is empty');
        }

        if (jsonData.length < 2) {
          throw new Error(
            'Excel file must have at least a header row and one data row. Found only headers.'
          );
        }

        // Detect pivot/summary format (HomieBites.com.xlsx format)
        // Format: Row 0 has "FY-YYYY/YY", Row 1 has "Address" + month columns, Row 2+ has data
        const row0 = jsonData[0] || [];
        const row1 = jsonData[1] || [];
        const hasFYHeader = row0.some((cell) => String(cell || '').includes('FY-'));
        const hasAddressHeader =
          String(row1[0] || '')
            .toLowerCase()
            .trim() === 'address';
        const hasMonthColumns = row1.some((cell, idx) => {
          if (idx === 0) return false; // Skip address column
          const cellStr = String(cell || '').trim();
          // Check for month format like "02'24", "03'24", etc.
          return /^\d{2}'?\d{2}$/.test(cellStr) || /^\d{1,2}'?\d{2}$/.test(cellStr);
        });

        let usePivotFormat = hasFYHeader && hasAddressHeader && hasMonthColumns;

        if (usePivotFormat) {
          try {
            // Parse pivot/summary format
            const fyMatch = String(
              row0.find((cell) => String(cell || '').includes('FY-')) || ''
            ).match(/FY-(\d{4})\/(\d{2})/);
            const baseYear = fyMatch ? parseInt(fyMatch[1]) : new Date().getFullYear();

            // Parse each data row (starting from row 2)
            importedData = [];
            for (let rowIndex = 2; rowIndex < jsonData.length; rowIndex++) {
              try {
                const row = jsonData[rowIndex] || [];
                if (!row || row.length === 0) continue;

                const address = String(row[0] || '').trim();

                if (!address || address.toLowerCase() === 'grand total' || address === '') {
                  continue; // Skip empty rows and totals
                }

                // Extract customer name from address
                let customerName = address;
                try {
                  const addressParts = address.split(/\s+/);
                  if (addressParts.length > 1) {
                    const possibleName = addressParts[addressParts.length - 1];
                    if (possibleName && !/^\d+/.test(possibleName)) {
                      customerName = possibleName;
                    }
                  }
                } catch (nameError) {
                  console.warn('Error extracting customer name:', nameError);
                  // Keep default customerName = address
                }

                // Process each column starting from index 1 (skip address column)
                let orderCounter = 0;
                const maxCols = Math.min(row1.length, row.length);
                for (let colIndex = 1; colIndex < maxCols; colIndex++) {
                  try {
                    const headerStr = String(row1[colIndex] || '').trim();

                    // Stop at Grand Total column
                    if (headerStr.toLowerCase() === 'grand total') {
                      break;
                    }

                    // Check if this is a month column (format: "02'24", "03'24", etc.)
                    const monthMatch = headerStr.match(/^(\d{1,2})'?(\d{2})$/);
                    if (monthMatch) {
                      const amount = row[colIndex];
                      const numAmount =
                        typeof amount === 'number'
                          ? amount
                          : parseFloat(String(amount || '').replace(/[₹,]/g, ''));

                      // Only create order if amount is valid and > 0
                      if (!isNaN(numAmount) && numAmount > 0) {
                        let month = parseInt(monthMatch[1]) - 1; // 0-indexed (0-11)
                        let year = parseInt(monthMatch[2]);

                        // Validate month
                        if (isNaN(month) || month < 0 || month > 11) {
                          console.warn(`Invalid month: ${monthMatch[1]}`, headerStr);
                          continue;
                        }

                        // Handle 2-digit year: assume 20xx
                        if (year < 100) {
                          year = 2000 + year;
                        }

                        // Validate year
                        if (isNaN(year) || year < 2000 || year > 2100) {
                          console.warn(`Invalid year: ${monthMatch[2]}`, headerStr);
                          continue;
                        }

                        // Use the year from the month header directly (e.g., "02'24" = February 2024)
                        // The year in the header is the calendar year, not FY year

                        const orderDate = new Date(year, month, 15); // Use 15th as default day

                        // Validate date
                        if (isNaN(orderDate.getTime())) {
                          console.warn(
                            `Invalid date created: year=${year}, month=${month}`,
                            headerStr
                          );
                          continue;
                        }

                        orderCounter++;

                        // Create order
                        const order = {
                          id: `ORD-${address.replace(/[^a-zA-Z0-9]/g, '-')}-${year}-${String(month + 1).padStart(2, '0')}-${orderCounter}`,
                          deliveryAddress: address,
                          customerName: customerName,
                          total: numAmount,
                          totalAmount: numAmount,
                          date: orderDate.toISOString(),
                          createdAt: orderDate.toISOString(),
                          status: 'delivered', // Historical data assumed delivered
                          quantity: 1,
                          unitPrice: numAmount,
                          items: [
                            {
                              name: `Order for ${address}`,
                              quantity: 1,
                              price: numAmount,
                            },
                          ],
                          billingMonth: headerStr,
                          year: String(year),
                        };

                        importedData.push(order);
                      }
                    }
                  } catch (colError) {
                    console.warn(`Error processing column ${colIndex}:`, colError);
                    // Continue to next column
                  }
                }
              } catch (rowError) {
                console.warn(`Error processing row ${rowIndex}:`, rowError);
                // Continue to next row
              }
            }

            // If no orders were imported, fall back to standard format
            if (importedData.length === 0) {
              console.warn(
                'No valid orders found in pivot format, falling back to standard format'
              );
              usePivotFormat = false;
            }
          } catch (pivotError) {
            console.error(
              'Error parsing pivot format, falling back to standard format:',
              pivotError
            );
            usePivotFormat = false;
          }
        }

        if (!usePivotFormat) {
          // Standard format - parse as before
          const headers = jsonData[0].map((h) => String(h || '').trim());
          importedData = jsonData
            .slice(1)
            .map((row, rowIndex) => {
              const order = {};
              headers.forEach((header, index) => {
                if (header && row[index] !== undefined) {
                  const value = row[index];
                  const headerLower = header.toLowerCase().trim();

                  // Map specific Excel columns to order fields (exact matches first, then partial)
                  if (
                    headerLower.includes('s no') ||
                    headerLower.includes('serial') ||
                    headerLower === 'id' ||
                    headerLower.startsWith('s no')
                  ) {
                    // Use S No. as order ID, but format it properly
                    const sno = String(value || '').trim();
                    order.id = sno || `ORD-${rowIndex + 1}`;
                    // Remove #- prefix if present
                    if (order.id.startsWith('#-')) {
                      order.id = order.id.substring(2);
                    }
                  } else if (headerLower === 'date' || headerLower.includes('order date')) {
                    // Handle date conversion - support M/D/YY format
                    try {
                      if (value instanceof Date) {
                        order.date = value.toISOString();
                        order.createdAt = value.toISOString();
                      } else if (value === null || value === undefined || value === '') {
                        // Skip empty dates - will use default later
                      } else if (typeof value === 'number') {
                        // Excel date serial number
                        const excelEpoch = new Date(1899, 11, 30);
                        const dateValue = new Date(
                          excelEpoch.getTime() + value * 24 * 60 * 60 * 1000
                        );
                        if (!isNaN(dateValue.getTime())) {
                          order.date = dateValue.toISOString();
                          order.createdAt = dateValue.toISOString();
                        }
                      } else if (typeof value === 'string') {
                        const dateStr = String(value).trim();
                        if (dateStr) {
                          // Try M/D/YY format first (e.g., "2/5/24", "12/23/25")
                          const mdyMatch = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
                          if (mdyMatch) {
                            let month = parseInt(mdyMatch[1]) - 1; // JS months are 0-indexed
                            let day = parseInt(mdyMatch[2]);
                            let year = parseInt(mdyMatch[3]);

                            // Handle 2-digit years: assume 20xx for 00-50, 19xx for 51-99
                            if (year < 100) {
                              year = year <= 50 ? 2000 + year : 1900 + year;
                            }

                            const parsedDate = new Date(year, month, day);
                            if (!isNaN(parsedDate.getTime())) {
                              order.date = parsedDate.toISOString();
                              order.createdAt = parsedDate.toISOString();
                            }
                          } else {
                            // Try standard Date parsing
                            const parsedDate = new Date(dateStr);
                            if (!isNaN(parsedDate.getTime())) {
                              order.date = parsedDate.toISOString();
                              order.createdAt = parsedDate.toISOString();
                            }
                          }
                        }
                      }
                    } catch (dateError) {
                      console.warn('Date parsing error:', dateError, 'Value:', value);
                    }
                  } else if (
                    headerLower.includes('delivery address') ||
                    (headerLower.includes('address') && !headerLower.includes('billing'))
                  ) {
                    const address = String(value || '').trim();
                    order.deliveryAddress = address;
                    // If no customer name, use address as customer name
                    if (!order.customerName && address) {
                      // Try to extract name from address (e.g., "C1-604 Haritima" -> "Haritima")
                      const addressParts = address.split(/\s+/);
                      if (addressParts.length > 1) {
                        // Last part might be name
                        const possibleName = addressParts[addressParts.length - 1];
                        if (possibleName && !/^\d+/.test(possibleName)) {
                          order.customerName = possibleName;
                        } else {
                          order.customerName = address;
                        }
                      } else {
                        order.customerName = address;
                      }
                    }
                  } else if (headerLower === 'quantity' || headerLower.includes('qty')) {
                    order.quantity = parseInt(value) || 1;
                  } else if (headerLower.includes('unit price') || headerLower === 'unit price') {
                    order.unitPrice = parseFloat(value) || 0;
                  } else if (
                    headerLower.includes('total amount') ||
                    (headerLower.includes('total') && !headerLower.includes('quantity'))
                  ) {
                    // Parse total amount - handle both numbers and strings
                    const totalValue =
                      typeof value === 'string'
                        ? parseFloat(value.replace(/[₹,]/g, ''))
                        : parseFloat(value);
                    order.total = !isNaN(totalValue) && totalValue > 0 ? totalValue : 0;
                    order.totalAmount = order.total; // Also set totalAmount for compatibility
                  } else if (headerLower === 'status' || headerLower.includes('order status')) {
                    const statusStr = String(value || '')
                      .trim()
                      .toLowerCase();
                    // Map status values
                    if (statusStr === 'paid') {
                      order.status = 'delivered'; // Map Paid to delivered
                    } else if (statusStr === 'unpaid') {
                      order.status = 'pending'; // Map Unpaid to pending
                    } else if (statusStr) {
                      // Use status as-is if it matches known statuses
                      const validStatuses = [
                        'pending',
                        'confirmed',
                        'preparing',
                        'delivered',
                        'cancelled',
                      ];
                      order.status = validStatuses.includes(statusStr) ? statusStr : 'pending';
                    }
                  } else if (
                    headerLower.includes('payment mode') ||
                    headerLower.includes('payment method') ||
                    headerLower === 'payment'
                  ) {
                    order.paymentMode = String(value || '');
                  } else if (headerLower.includes('billing month')) {
                    order.billingMonth = String(value || '');
                  } else if (headerLower.includes('reference month')) {
                    order.referenceMonth = String(value || '');
                  } else if (headerLower === 'year') {
                    order.year = String(value || '');
                  } else if (
                    headerLower.includes('name') &&
                    (headerLower.includes('customer') || headerLower.includes('client'))
                  ) {
                    order.customerName = String(value || '');
                  } else if (
                    headerLower.includes('phone') ||
                    headerLower.includes('mobile') ||
                    headerLower.includes('contact')
                  ) {
                    order.customerPhone = String(value || '');
                  } else {
                    // Store other fields as-is (with sanitized key)
                    const sanitizedKey = headerLower.replace(/[^a-z0-9]/g, '_');
                    if (sanitizedKey) {
                      order[sanitizedKey] = value;
                    }
                  }
                }
              });

              // Ensure required fields have defaults
              if (!order.id) {
                order.id = `ORD-${rowIndex + 1}`;
              }

              // Remove #- prefix from ID if present
              if (order.id && String(order.id).startsWith('#-')) {
                order.id = String(order.id).substring(2);
              }

              // Date handling - use parsed date or default
              if (!order.date || !order.createdAt) {
                // Try to infer date from billing month/year if available
                if (order.billingMonth && order.year) {
                  // Parse billing month (e.g., "February'24" or "2(Feb'24)")
                  const monthMatch = order.billingMonth.match(/(\d+)/);
                  if (monthMatch) {
                    const month = parseInt(monthMatch[1]) - 1; // 0-indexed
                    const year = parseInt(order.year);
                    if (!isNaN(month) && !isNaN(year)) {
                      const inferredDate = new Date(year, month, 1);
                      order.date = inferredDate.toISOString();
                      order.createdAt = inferredDate.toISOString();
                    }
                  }
                }

                // If still no date, use a reasonable default (start of the year from data)
                if (!order.date) {
                  const defaultYear = order.year ? parseInt(order.year) : new Date().getFullYear();
                  const defaultDate = new Date(defaultYear, 0, 1); // Jan 1 of the year
                  order.date = defaultDate.toISOString();
                  order.createdAt = defaultDate.toISOString();
                }
              }

              // Status default
              if (!order.status) {
                order.status = 'pending';
              }

              // Calculate total if not provided but unitPrice and quantity are available
              if (!order.total || order.total === 0) {
                if (order.unitPrice && order.quantity) {
                  order.total = order.unitPrice * order.quantity;
                  order.totalAmount = order.total;
                } else {
                  order.total = 0;
                  order.totalAmount = 0;
                }
              } else {
                // Ensure totalAmount is set
                order.totalAmount = order.total;
              }

              // Ensure customer name from delivery address if missing
              if (!order.customerName && order.deliveryAddress) {
                const addrParts = order.deliveryAddress.split(/\s+/);
                if (addrParts.length > 1) {
                  const possibleName = addrParts[addrParts.length - 1];
                  order.customerName = /^\d+/.test(possibleName)
                    ? order.deliveryAddress
                    : possibleName;
                } else {
                  order.customerName = order.deliveryAddress;
                }
              }

              // Create items array if missing (for display)
              if (!order.items || !Array.isArray(order.items) || order.items.length === 0) {
                order.items = [
                  {
                    name: `Order #${order.id}`,
                    quantity: order.quantity || 1,
                    price: order.unitPrice || order.total || 0,
                  },
                ];
              }

              return order;
            })
            .filter((order) => order.deliveryAddress || order.id); // Filter out empty rows
        }
      } else {
        // Handle JSON file
        try {
          const reader = new FileReader();
          const fileContent = await new Promise((resolve, reject) => {
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsText(file);
          });
          importedData = JSON.parse(fileContent);
        } catch (jsonError) {
          throw new Error(`Failed to parse JSON file: ${jsonError.message}`);
        }
      }

      // Validate imported data
      if (!importedData || !Array.isArray(importedData)) {
        showNotification('Invalid file format. File must contain an array of orders.', 'error');
        return;
      }

      // Filter out any invalid orders and validate required fields
      importedData = importedData.filter((order) => {
        try {
          if (!order || (!order.deliveryAddress && !order.id)) {
            return false;
          }

          // Ensure order has valid date
          if (!order.date || !order.createdAt) {
            order.date = new Date().toISOString();
            order.createdAt = new Date().toISOString();
          } else {
            // Validate date strings
            const dateObj = new Date(order.date);
            if (isNaN(dateObj.getTime())) {
              order.date = new Date().toISOString();
              order.createdAt = new Date().toISOString();
            }
          }

          // Ensure order has valid ID
          if (!order.id) {
            order.id = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          }

          // Ensure order has valid status
          if (!order.status) {
            order.status = 'pending';
          }

          // Ensure order has valid total
          if (!order.total && order.total !== 0) {
            order.total = 0;
            order.totalAmount = 0;
          }

          return true;
        } catch (filterError) {
          console.warn('Error validating order:', filterError, order);
          return false;
        }
      });

      if (importedData.length === 0) {
        showNotification('No orders found in file.', 'warning');
        return;
      }

      const existingOrders = orders;
      // Try to save imported orders to API
      const token = localStorage.getItem('homiebites_token');
      if (token) {
        try {
          // Import orders one by one to API
          let importedCount = 0;
          for (const orderData of importedData) {
            try {
              await api.createOrder(orderData);
              importedCount++;
            } catch (err) {
              console.warn('Failed to import order:', err);
            }
          }
          if (importedCount > 0) {
            await loadOrders();
            showNotification(`Successfully imported ${importedCount} orders to API!`, 'success');
            return;
          }
        } catch (apiError) {
          console.warn('Failed to import orders to API:', apiError.message);
        }
      }

      // Fallback to localStorage
      const mergedOrders = [...importedData, ...existingOrders];
      setOrders(mergedOrders);
      localStorage.setItem('homiebites_orders', JSON.stringify(mergedOrders));
      showNotification(`Successfully imported ${importedData.length} orders!`, 'success');
    } catch (error) {
      console.error('Error importing file:', error);
      const errorMessage = error.message || 'Unknown error occurred';
      showNotification(
        `Error importing file: ${errorMessage}. Please check the file format and try again.`,
        'error'
      );

      // Log more details in development
      if (import.meta.env.DEV) {
        console.error('Import error details:', {
          error,
          fileName: file?.name,
          fileSize: file?.size,
          fileType: file?.type,
        });
      }
    } finally {
      // Reset file input to allow re-importing the same file
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  const handleExportOrders = () => {
    const dataStr = JSON.stringify(orders, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `homiebites-orders-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getFilteredOrders = () => {
    try {
      // Ensure orders is an array
      if (!Array.isArray(orders)) {
        console.warn('Orders is not an array:', orders);
        return [];
      }

      let filtered = [...orders];

      // Filter by status
      if (orderFilter !== 'all') {
        filtered = filtered.filter((o) => {
          try {
            return o && o.status === orderFilter;
          } catch (e) {
            return false;
          }
        });
      }

      // Filter by date range
      try {
        filtered = getFilteredOrdersByDate(filtered);
      } catch (dateError) {
        console.error('Error filtering by date:', dateError);
        // Continue with unfiltered data
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter((o) => {
          try {
            if (!o) return false;
            return (
              (o.customerName || o.name || '').toLowerCase().includes(query) ||
              (o.customerPhone || o.phone || '').includes(query) ||
              (o.id || '').toString().includes(query) ||
              (o.deliveryAddress || o.customerAddress || o.address || '')
                .toLowerCase()
                .includes(query)
            );
          } catch (e) {
            return false;
          }
        });
      }

      // Sort
      try {
        filtered.sort((a, b) => {
          try {
            const dateA = new Date(a?.createdAt || a?.date || 0);
            const dateB = new Date(b?.createdAt || b?.date || 0);

            if (orderSort === 'newest') {
              const diff = dateB - dateA;
              return isNaN(diff) ? 0 : diff;
            }
            if (orderSort === 'oldest') {
              const diff = dateA - dateB;
              return isNaN(diff) ? 0 : diff;
            }
            if (orderSort === 'amount') {
              return (b?.total || 0) - (a?.total || 0);
            }
            return 0;
          } catch (sortError) {
            return 0;
          }
        });
      } catch (sortError) {
        console.error('Error sorting orders:', sortError);
        // Return unsorted data
      }

      return filtered;
    } catch (error) {
      console.error('Critical error in getFilteredOrders:', error);
      return [];
    }
  };

  // Memoize filtered orders to prevent unnecessary recalculations
  const filteredOrders = useMemo(() => {
    try {
      return getFilteredOrders();
    } catch (error) {
      console.error('Error getting filtered orders:', error);
      return [];
    }
  }, [orders, orderFilter, dateRange, customStartDate, customEndDate, searchQuery, orderSort]);

  // Pagination functions (using memoized filteredOrders)
  const paginatedOrders = useMemo(() => {
    try {
      if (!Array.isArray(filteredOrders) || filteredOrders.length === 0) {
        return [];
      }
      const startIndex = (currentPage - 1) * recordsPerPage;
      const endIndex = startIndex + recordsPerPage;
      return filteredOrders.slice(startIndex, endIndex);
    } catch (error) {
      console.error('Error in getPaginatedOrders:', error);
      return [];
    }
  }, [filteredOrders, currentPage, recordsPerPage]);

  const getPaginatedOrders = () => paginatedOrders;

  const totalPages = useMemo(() => {
    try {
      if (
        !Array.isArray(filteredOrders) ||
        filteredOrders.length === 0 ||
        !recordsPerPage ||
        recordsPerPage <= 0
      ) {
        return 1;
      }
      return Math.max(1, Math.ceil(filteredOrders.length / recordsPerPage));
    } catch (error) {
      console.error('Error in getTotalPages:', error);
      return 1;
    }
  }, [filteredOrders, recordsPerPage]);

  const getTotalPages = () => totalPages;

  const handlePageChange = (newPage) => {
    try {
      const validPage = Math.max(1, Math.min(totalPages, Math.floor(newPage)));
      if (validPage >= 1 && validPage <= totalPages) {
        setCurrentPage(validPage);
      }
    } catch (error) {
      console.error('Error in handlePageChange:', error);
      setCurrentPage(1);
    }
  };

  const handleRecordsPerPageChange = (newRecordsPerPage) => {
    try {
      const validRecords = Math.max(20, Math.min(200, Math.floor(newRecordsPerPage)));
      setRecordsPerPage(validRecords);
      localStorage.setItem('homiebites_records_per_page', validRecords.toString());
      setCurrentPage(1); // Reset to first page
    } catch (error) {
      console.error('Error in handleRecordsPerPageChange:', error);
      setRecordsPerPage(20);
      setCurrentPage(1);
    }
  };

  // Summary Report - Excel-style format (memoized with size limit)
  const summaryReport = useMemo(() => {
    return (() => {
      try {
        const filtered = filteredOrders;

        if (!Array.isArray(filtered) || filtered.length === 0) {
          return {
            data: [],
            months: [],
            grandTotal: 0,
          };
        }

        // Limit processing to prevent memory issues (process max 10000 orders)
        const maxOrders = 10000;
        const ordersToProcess =
          filtered.length > maxOrders ? filtered.slice(0, maxOrders) : filtered;

        if (filtered.length > maxOrders) {
          console.warn(`Processing ${maxOrders} of ${filtered.length} orders for summary report`);
        }

        // Group orders by delivery address
        const addressMap = new Map();

        ordersToProcess.forEach((order) => {
          try {
            if (!order) return;

            const address =
              order.deliveryAddress || order.customerAddress || order.address || 'Unknown';
            if (!addressMap.has(address)) {
              addressMap.set(address, {
                address: address,
                monthlyTotals: {},
                grandTotal: 0,
              });
            }

            const addressData = addressMap.get(address);

            // Safely parse date
            let orderDate;
            try {
              const dateValue = order.createdAt || order.date;
              if (!dateValue) return;

              orderDate = new Date(dateValue);
              if (isNaN(orderDate.getTime())) {
                return; // Skip invalid dates
              }
            } catch (dateError) {
              console.warn('Invalid date in order:', order.id, dateError);
              return;
            }

            const month = String(orderDate.getMonth() + 1).padStart(2, '0');
            const year = String(orderDate.getFullYear()).slice(-2);
            const monthKey = `${month}'${year}`;

            if (!addressData.monthlyTotals[monthKey]) {
              addressData.monthlyTotals[monthKey] = 0;
            }

            // Include ALL orders in totals (matching Excel format)
            // Excel shows all orders, including zeros
            const amount = parseFloat(order.total || order.totalAmount || 0);
            if (!isNaN(amount)) {
              // Initialize if doesn't exist
              if (addressData.monthlyTotals[monthKey] === undefined) {
                addressData.monthlyTotals[monthKey] = 0;
              }
              addressData.monthlyTotals[monthKey] += amount;
              addressData.grandTotal += amount;
            }
          } catch (orderError) {
            console.warn('Error processing order in summary:', orderError, order);
            // Continue with next order
          }
        });

        // Get all unique months
        const allMonths = new Set();
        addressMap.forEach((data) => {
          if (data && data.monthlyTotals) {
            Object.keys(data.monthlyTotals).forEach((month) => allMonths.add(month));
          }
        });

        const sortedMonths = Array.from(allMonths).sort((a, b) => {
          try {
            const [monthA, yearA] = a.split("'");
            const [monthB, yearB] = b.split("'");

            const monthNumA = parseInt(monthA);
            const yearNumA = parseInt(yearA);
            const monthNumB = parseInt(monthB);
            const yearNumB = parseInt(yearB);

            if (isNaN(monthNumA) || isNaN(yearNumA) || isNaN(monthNumB) || isNaN(yearNumB)) {
              return 0;
            }

            const dateA = new Date(2000 + yearNumA, monthNumA - 1);
            const dateB = new Date(2000 + yearNumB, monthNumB - 1);

            if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
              return 0;
            }

            return dateA - dateB;
          } catch (sortError) {
            console.warn('Error sorting months:', sortError, a, b);
            return 0;
          }
        });

        // Convert to array and sort by grand total
        const summaryData = Array.from(addressMap.values())
          .filter((item) => item && item.address)
          .sort((a, b) => (b.grandTotal || 0) - (a.grandTotal || 0));

        return {
          data: summaryData,
          months: sortedMonths,
          grandTotal: summaryData.reduce((sum, row) => sum + (row.grandTotal || 0), 0),
        };
      } catch (error) {
        console.error('Error in getSummaryReport:', error);
        return {
          data: [],
          months: [],
          grandTotal: 0,
        };
      }
    })();
  }, [filteredOrders]);

  // Wrapper function for backward compatibility
  const getSummaryReport = () => summaryReport;

  // Get all unique customers/addresses with statistics
  const getAllCustomers = useMemo(() => {
    try {
      // Ensure orders is an array
      if (!Array.isArray(orders) || orders.length === 0) {
        return [];
      }

      // Limit processing to prevent memory issues (max 50000 orders)
      const maxOrders = 50000;
      const ordersToProcess = orders.length > maxOrders ? orders.slice(0, maxOrders) : orders;

      if (orders.length > maxOrders) {
        console.warn(`Processing ${maxOrders} of ${orders.length} orders for customer list`);
      }

      const customerMap = new Map();

      ordersToProcess.forEach((order) => {
        try {
          if (!order) return;

          const address =
            order.deliveryAddress || order.customerAddress || order.address || 'Unknown';
          const customerName = order.customerName || order.name || address;

          if (!customerMap.has(address)) {
            customerMap.set(address, {
              address: address,
              customerName: customerName,
              totalOrders: 0,
              totalAmount: 0,
              lastOrderDate: null,
              firstOrderDate: null,
              orders: [],
              phone: order.customerPhone || order.phone || '',
            });
          }

          const customer = customerMap.get(address);
          if (!customer) return; // Safety check

          customer.totalOrders += 1;
          // Include ALL orders in customer totals (matching Excel format)
          const orderAmount = parseFloat(order.total || order.totalAmount || 0);
          if (!isNaN(orderAmount)) {
            // Include even zero amounts to match Excel
            customer.totalAmount += orderAmount;
          }

          // Safely parse order date
          try {
            const dateValue = order.createdAt || order.date;
            if (dateValue) {
              const orderDate = new Date(dateValue);
              if (!isNaN(orderDate.getTime())) {
                if (!customer.lastOrderDate || orderDate > customer.lastOrderDate) {
                  customer.lastOrderDate = orderDate;
                }
                if (!customer.firstOrderDate || orderDate < customer.firstOrderDate) {
                  customer.firstOrderDate = orderDate;
                }
              }
            }
          } catch (dateError) {
            console.warn('Error parsing order date for customer:', dateError);
          }

          // Safely add order to list
          if (order && order.id) {
            customer.orders.push(order);
          }

          // Update phone if available
          if (!customer.phone && (order.customerPhone || order.phone)) {
            customer.phone = order.customerPhone || order.phone || '';
          }
        } catch (orderError) {
          console.warn('Error processing order for customer:', orderError);
        }
      });

      return Array.from(customerMap.values());
    } catch (error) {
      console.error('Error getting all customers:', error);
      return [];
    }
  }, [orders]);

  // Get filtered and sorted customers (memoized)
  const filteredCustomers = useMemo(() => {
    try {
      // Ensure getAllCustomers is an array
      if (!Array.isArray(getAllCustomers)) {
        console.warn('getAllCustomers is not an array:', getAllCustomers);
        return [];
      }

      let filtered = [...getAllCustomers];

      // Search filter
      if (customerSearchQuery) {
        const query = customerSearchQuery.toLowerCase();
        filtered = filtered.filter((c) => {
          try {
            if (!c) return false;
            return (
              (c.address || '').toLowerCase().includes(query) ||
              (c.customerName || '').toLowerCase().includes(query) ||
              (c.phone || '').includes(query)
            );
          } catch (filterError) {
            return false;
          }
        });
      }

      // Sort (create new array to avoid mutation)
      const sorted = [...filtered].sort((a, b) => {
        try {
          if (!a || !b) return 0;
          if (customerSort === 'totalAmount') {
            return (b.totalAmount || 0) - (a.totalAmount || 0);
          }
          if (customerSort === 'totalOrders') {
            return (b.totalOrders || 0) - (a.totalOrders || 0);
          }
          if (customerSort === 'lastOrder') {
            try {
              const dateA = a.lastOrderDate
                ? a.lastOrderDate instanceof Date
                  ? a.lastOrderDate.getTime()
                  : new Date(a.lastOrderDate).getTime()
                : 0;
              const dateB = b.lastOrderDate
                ? b.lastOrderDate instanceof Date
                  ? b.lastOrderDate.getTime()
                  : new Date(b.lastOrderDate).getTime()
                : 0;
              if (isNaN(dateA) || isNaN(dateB)) return 0;
              return dateB - dateA;
            } catch (dateError) {
              return 0;
            }
          }
          return 0;
        } catch (sortError) {
          return 0;
        }
      });

      return sorted;
    } catch (error) {
      console.error('Error filtering customers:', error);
      return [];
    }
  }, [getAllCustomers, customerSearchQuery, customerSort]);

  // Wrapper function for backward compatibility
  const getFilteredCustomers = () => filteredCustomers;

  // Get paginated customers (memoized)
  const paginatedCustomers = useMemo(() => {
    try {
      if (!Array.isArray(filteredCustomers) || filteredCustomers.length === 0) {
        return [];
      }
      const startIndex = (currentPage - 1) * recordsPerPage;
      const endIndex = startIndex + recordsPerPage;
      return filteredCustomers.slice(startIndex, endIndex);
    } catch (error) {
      console.error('Error in getPaginatedCustomers:', error);
      return [];
    }
  }, [filteredCustomers, currentPage, recordsPerPage]);

  // Wrapper function for backward compatibility
  const getPaginatedCustomers = () => paginatedCustomers;

  // Get total pages for customers (memoized)
  const customerTotalPages = useMemo(() => {
    try {
      if (
        !Array.isArray(filteredCustomers) ||
        filteredCustomers.length === 0 ||
        !recordsPerPage ||
        recordsPerPage <= 0
      ) {
        return 1;
      }
      return Math.max(1, Math.ceil(filteredCustomers.length / recordsPerPage));
    } catch (error) {
      console.error('Error in getCustomerTotalPages:', error);
      return 1;
    }
  }, [filteredCustomers, recordsPerPage]);

  // Wrapper function for backward compatibility
  const getCustomerTotalPages = () => customerTotalPages;

  // Helper function to get date-only (no time) from order
  const getOrderDateOnly = (order) => {
    try {
      const dateValue = order.createdAt || order.date;
      if (!dateValue) return null;

      const orderDate = new Date(dateValue);
      if (isNaN(orderDate.getTime())) return null;

      // Return date-only string (YYYY-MM-DD format)
      const year = orderDate.getFullYear();
      const month = String(orderDate.getMonth() + 1).padStart(2, '0');
      const day = String(orderDate.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.warn('Error parsing order date:', error, order);
      return null;
    }
  };

  // Helper function to get year from order date
  const getOrderYear = (order) => {
    try {
      const dateValue = order.createdAt || order.date;
      if (!dateValue) return new Date().getFullYear();

      const orderDate = new Date(dateValue);
      if (isNaN(orderDate.getTime())) return new Date().getFullYear();

      return orderDate.getFullYear();
    } catch (error) {
      console.warn('Error getting year from order:', error, order);
      return new Date().getFullYear();
    }
  };

  const getOrderTrends = () => {
    try {
      const last7Days = [];
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);

        const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

        const dayOrders = orders.filter((order) => {
          const orderDateKey = getOrderDateOnly(order);
          return orderDateKey === dateKey;
        });

        const deliveredOrders = dayOrders.filter((o) => o.status === 'delivered');
        const revenue = deliveredOrders.reduce((sum, o) => sum + (parseFloat(o.total || o.totalAmount || 0)), 0);

        last7Days.push({
          date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
          dateKey: dateKey,
          orders: dayOrders.length,
          revenue: revenue,
        });
      }
      return last7Days;
    } catch (error) {
      console.error('Error in getOrderTrends:', error);
      return [];
    }
  };

  const getTopItems = () => {
    const itemCounts = {};
    orders.forEach((order) => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach((item) => {
          const itemName = item.name || item.item || 'Unknown';
          itemCounts[itemName] = (itemCounts[itemName] || 0) + (item.quantity || 1);
        });
      }
    });

    return Object.entries(itemCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const getAnalyticsData = () => {
    try {
      const monthlyData = {};
      const statusCounts = {};
      const dailyRevenue = {};
      const yearlyData = {};

      orders.forEach((order) => {
        try {
          if (!order) return;

          // Get date-only (no time) from order
          const dateKey = getOrderDateOnly(order);
          if (!dateKey) return;

          const orderDate = new Date(dateKey + 'T00:00:00');
          if (isNaN(orderDate.getTime())) return;

          const year = orderDate.getFullYear();
          const monthKey = `${year}-${String(orderDate.getMonth() + 1).padStart(2, '0')}`;
          const status = order.status || 'pending';
          const orderAmount = parseFloat(order.total || order.totalAmount || 0);

          // Yearly data
          if (!yearlyData[year]) {
            yearlyData[year] = { orders: 0, revenue: 0 };
          }
          yearlyData[year].orders++;
          if (status === 'delivered') {
            yearlyData[year].revenue += orderAmount;
          }

          // Monthly data (grouped by year-month)
          if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = { orders: 0, revenue: 0, year: year };
          }
          monthlyData[monthKey].orders++;
          if (status === 'delivered') {
            monthlyData[monthKey].revenue += orderAmount;
          }

          // Status counts
          statusCounts[status] = (statusCounts[status] || 0) + 1;

          // Daily revenue (date-only, no time)
          if (status === 'delivered') {
            if (!dailyRevenue[dateKey]) {
              dailyRevenue[dateKey] = 0;
            }
            dailyRevenue[dateKey] += orderAmount;
          }
        } catch (orderError) {
          console.warn('Error processing order in getAnalyticsData:', orderError, order);
        }
      });

      return { monthlyData, statusCounts, dailyRevenue, yearlyData };
    } catch (error) {
      console.error('Error in getAnalyticsData:', error);
      return { monthlyData: {}, statusCounts: {}, dailyRevenue: {}, yearlyData: {} };
    }
  };

  // Get monthly breakdown by address
  const getMonthlyBreakdownByAddress = () => {
    const addressData = {};
    const monthNames = [
      '01-Jan',
      '02-Feb',
      '03-Mar',
      '04-Apr',
      '05-May',
      '06-Jun',
      '07-Jul',
      '08-Aug',
      '09-Sep',
      '10-Oct',
      '11-Nov',
      '12-Dec',
    ];

    orders.forEach((order) => {
      const address = order.deliveryAddress || order.customerAddress || order.address || 'Unknown';
      if (!addressData[address]) {
        addressData[address] = {};
        monthNames.forEach((month) => {
          addressData[address][month] = 0;
        });
        addressData[address]['Grand Total'] = 0;
      }

      // Parse billing month or reference month to get month number
      const billingMonth = order.billingMonth || order.referenceMonth || '';
      let monthKey = null;

      if (billingMonth) {
        // Try to extract month from "01 - Jan'25" or "2(Feb'24)" format
        const monthMatch = billingMonth.match(/(\d{1,2})/);
        if (monthMatch) {
          const monthNum = parseInt(monthMatch[1]);
          if (monthNum >= 1 && monthNum <= 12) {
            monthKey = monthNames[monthNum - 1];
          }
        }
      }

      // If no month found, try to parse from date
      if (!monthKey && order.date) {
        try {
          const [day, month, year] = order.date.split('/');
          if (month) {
            const monthNum = parseInt(month);
            if (monthNum >= 1 && monthNum <= 12) {
              monthKey = monthNames[monthNum - 1];
            }
          }
        } catch (e) {
          // Ignore
        }
      }

      const amount = order.totalAmount || order.total || 0;
      if (monthKey && addressData[address][monthKey] !== undefined) {
        addressData[address][monthKey] += amount;
      }
      addressData[address]['Grand Total'] += amount;
    });

    return addressData;
  };

  // Get top 25 addresses by total amount
  const getTop25Addresses = () => {
    const addressTotals = {};

    orders.forEach((order) => {
      const address = order.deliveryAddress || order.customerAddress || order.address || 'Unknown';
      const amount = order.totalAmount || order.total || 0;
      if (!addressTotals[address]) {
        addressTotals[address] = 0;
      }
      addressTotals[address] += amount;
    });

    return Object.entries(addressTotals)
      .map(([address, total]) => ({ address, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 25);
  };

  // Get unpaid amounts by address
  const getUnpaidByAddress = () => {
    const unpaidData = {};

    orders.forEach((order) => {
      const status = (order.status || '').toLowerCase();
      if (status !== 'paid' && status !== 'delivered') {
        const address =
          order.deliveryAddress || order.customerAddress || order.address || 'Unknown';
        const amount = order.totalAmount || order.total || 0;

        if (!unpaidData[address]) {
          unpaidData[address] = { unpaid: 0, grandTotal: 0 };
        }
        unpaidData[address].unpaid += amount;
      }

      // Also calculate grand total for each address
      const address = order.deliveryAddress || order.customerAddress || order.address || 'Unknown';
      const amount = order.totalAmount || order.total || 0;
      if (!unpaidData[address]) {
        unpaidData[address] = { unpaid: 0, grandTotal: 0 };
      }
      unpaidData[address].grandTotal += amount;
    });

    return Object.entries(unpaidData)
      .map(([address, data]) => ({ address, ...data }))
      .filter((item) => item.unpaid > 0)
      .sort((a, b) => b.unpaid - a.unpaid);
  };

  // Get yearly comparison with trends
  const getYearlyComparison = () => {
    const addressData = {};

    orders.forEach((order) => {
      const address = order.deliveryAddress || order.customerAddress || order.address || 'Unknown';
      const year =
        order.year ||
        new Date(order.createdAt || order.date || Date.now()).getFullYear().toString();
      const amount = order.totalAmount || order.total || 0;

      if (!addressData[address]) {
        addressData[address] = { 2024: 0, 2025: 0 };
      }

      if (year === '2024' || year === '2025') {
        addressData[address][year] += amount;
      }
    });

    return Object.entries(addressData)
      .map(([address, data]) => {
        const grandTotal = data['2024'] + data['2025'];
        const trend =
          data['2025'] > data['2024'] ? 'up' : data['2025'] < data['2024'] ? 'down' : 'same';
        const gap = data['2025'] - data['2024'];
        return {
          address,
          2024: data['2024'],
          2025: data['2025'],
          grandTotal,
          trend,
          gap,
        };
      })
      .sort((a, b) => b.grandTotal - a.grandTotal);
  };

  return (
    <div className='admin-dashboard'>
      {/* Sidebar */}
      <div
        className={`admin-sidebar ${sidebarOpen ? 'open' : ''} ${sidebarCollapsed ? 'collapsed' : ''}`}
      >
        <div className='sidebar-header'>
          <div className='sidebar-logo'>
            <img
              src='/logo.png'
              alt='HomieBites'
              className='sidebar-logo-img'
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className='sidebar-logo-fallback' style={{ display: 'none' }}>
              <i className='fa-solid fa-shield-halved'></i>
            </div>
          </div>
        </div>

        <nav className='sidebar-nav'>
          {Object.entries(adminFeatures).map(([key, feature]) => (
            <button
              key={key}
              className={`sidebar-item ${activeTab === key ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(key);
                setSidebarOpen(false);
              }}
              title={sidebarCollapsed ? feature.name : ''}
            >
              <i className={`fa-solid ${feature.icon}`}></i>
              {!sidebarCollapsed && <span>{feature.name}</span>}
            </button>
          ))}
        </nav>

        <div className='sidebar-footer'>
          <button
            className='sidebar-toggle-btn sidebar-item'
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <i
              className={`fa-solid ${sidebarCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'}`}
            ></i>
            {!sidebarCollapsed && <span>Collapse</span>}
          </button>

          {/* Profile Section */}
          {currentUser && (
            <div className={`sidebar-profile ${sidebarCollapsed ? 'collapsed' : ''}`}>
              <div className='profile-avatar'>
                <i className='fa-solid fa-user'></i>
              </div>
              {!sidebarCollapsed && (
                <div className='profile-info'>
                  <div className='profile-name'>{currentUser.name || 'Admin User'}</div>
                  <div className='profile-role'>
                    {currentUser.role === 'admin' ? 'Super Admin' : 'Admin'}
                  </div>
                </div>
              )}
            </div>
          )}

          <button
            className='sidebar-item logout-btn'
            onClick={handleLogoutClick}
            title={sidebarCollapsed ? 'Logout' : ''}
          >
            <i className='fa-solid fa-sign-out-alt'></i>
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`admin-main ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Top Header */}
        <div className='admin-header'>
          <div className='header-left'>
            <button className='sidebar-toggle' onClick={() => setSidebarOpen(!sidebarOpen)}>
              <i className='fa-solid fa-bars'></i>
            </button>
            <div>
              <h1>Admin Dashboard</h1>
              <p>Manage menu, orders, users, and settings</p>
            </div>
          </div>
          <div className='header-right'>
            <div className='admin-stats-compact'>
              <div className='stat-mini'>
                <i className='fa-solid fa-shopping-cart'></i>
                <span>{orders.length}</span>
              </div>
              <div className='stat-mini'>
                <i className='fa-solid fa-rupee-sign'></i>
                <span>₹{getTotalRevenue()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className='admin-stats'>
          <div className='stat-card'>
            <i className='fa-solid fa-shopping-cart'></i>
            <div>
              <h3>{orders.length}</h3>
              <p>Total Orders</p>
              <span className='stat-change positive'>
                <i className='fa-solid fa-arrow-up'></i> {getTodayStats().orders} today
              </span>
            </div>
          </div>
          <div className='stat-card'>
            <i className='fa-solid fa-clock'></i>
            <div>
              <h3>{getPendingOrders()}</h3>
              <p>Pending Orders</p>
              <span className='stat-change'>{getTodayStats().pending} new today</span>
            </div>
          </div>
          <div className='stat-card'>
            <i className='fa-solid fa-rupee-sign'></i>
            <div>
              <h3>₹{formatCurrency(getTotalRevenue())}</h3>
              <p>Total Revenue</p>
              <span className='stat-change positive'>
                <i className='fa-solid fa-arrow-up'></i> ₹{formatCurrency(getTodayStats().revenue)}{' '}
                today
              </span>
            </div>
          </div>
          <div className='stat-card'>
            <i className='fa-solid fa-users'></i>
            <div>
              <h3>{users.length}</h3>
              <p>Registered Users</p>
              <span className='stat-change'>{getWeeklyStats().orders} orders this week</span>
            </div>
          </div>
        </div>

        {activeTab === 'dashboard' && (
          <div className='admin-content'>
            <h2>Dashboard Overview</h2>
            <div className='dashboard-grid'>
              <div className='dashboard-card'>
                <h3>Today's Summary</h3>
                <div className='dashboard-stats'>
                  <div className='stat-item'>
                    <span className='stat-label'>Orders</span>
                    <span className='stat-value'>{getTodayStats().orders}</span>
                  </div>
                  <div className='stat-item'>
                    <span className='stat-label'>Revenue</span>
                    <span className='stat-value'>₹{formatCurrency(getTodayStats().revenue)}</span>
                  </div>
                  <div className='stat-item'>
                    <span className='stat-label'>Pending</span>
                    <span className='stat-value'>{getTodayStats().pending}</span>
                  </div>
                </div>
              </div>
              <div className='dashboard-card'>
                <h3>Weekly Summary</h3>
                <div className='dashboard-stats'>
                  <div className='stat-item'>
                    <span className='stat-label'>Orders</span>
                    <span className='stat-value'>{getWeeklyStats().orders}</span>
                  </div>
                  <div className='stat-item'>
                    <span className='stat-label'>Revenue</span>
                    <span className='stat-value'>₹{formatCurrency(getWeeklyStats().revenue)}</span>
                  </div>
                  <div className='stat-item'>
                    <span className='stat-label'>Avg Order</span>
                    <span className='stat-value'>₹{getWeeklyStats().avgOrderValue}</span>
                  </div>
                </div>
              </div>
              <div className='dashboard-card'>
                <h3>Quick Actions</h3>
                <div className='quick-actions'>
                  <button className='btn btn-primary' onClick={() => setActiveTab('orders')}>
                    <i className='fa-solid fa-shopping-cart'></i> Manage Orders
                  </button>
                  <button className='btn btn-secondary' onClick={() => setActiveTab('menu')}>
                    <i className='fa-solid fa-utensils'></i> Edit Menu
                  </button>
                  <button className='btn btn-secondary' onClick={() => setActiveTab('analytics')}>
                    <i className='fa-solid fa-chart-line'></i> View Analytics
                  </button>
                </div>
              </div>
              <div className='dashboard-card'>
                <h3>Recent Orders</h3>
                <div className='recent-orders-list'>
                  {orders
                    .sort(
                      (a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)
                    )
                    .slice(0, 5)
                    .map((order) => (
                      <div key={order.id} className='recent-order-item'>
                        <div>
                          <strong>#{order.id.toString().slice(-6)}</strong>
                          <span>{order.customerName || order.name || 'N/A'}</span>
                        </div>
                        <div>
                          <span>₹{formatCurrency(order.total || 0)}</span>
                          <span className={`status-badge status-${order.status || 'pending'}`}>
                            {order.status || 'pending'}
                          </span>
                        </div>
                      </div>
                    ))}
                  {orders.length === 0 && <p className='no-data'>No orders yet</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'menu' && (
          <div className='admin-content'>
            <div className='admin-actions'>
              <button className='btn btn-primary' onClick={handleSave} disabled={syncing}>
                <i className='fa-solid fa-save'></i> Save Changes
              </button>
              <button className='btn btn-ghost' onClick={handleReset} disabled={syncing}>
                <i className='fa-solid fa-undo'></i> Reset to Defaults
              </button>
              <a
                href='/menu'
                target='_blank'
                rel='noopener noreferrer'
                className='btn btn-secondary'
                style={{
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <i className='fa-solid fa-external-link'></i> View Menu Page
              </a>
              {saved && <span className='save-indicator'>✓ Saved successfully!</span>}
            </div>

            <div className='menu-editor'>
              {menuData.map((category) => (
                <div key={category.id} className='menu-category-card'>
                  <div className='category-header'>
                    <div className='category-title-input'>
                      <i className={`fa-solid ${category.icon}`}></i>
                      <input
                        type='text'
                        value={category.category}
                        onChange={(e) => updateCategory(category.id, 'category', e.target.value)}
                        className='category-name-input'
                      />
                    </div>
                    {category.tag && (
                      <input
                        type='text'
                        value={category.tag}
                        onChange={(e) => updateCategory(category.id, 'tag', e.target.value)}
                        className='category-tag-input'
                        placeholder='Tag (e.g., Best Seller)'
                      />
                    )}
                  </div>

                  {category.description && (
                    <textarea
                      value={category.description}
                      onChange={(e) => updateCategory(category.id, 'description', e.target.value)}
                      className='category-description'
                      placeholder='Description'
                      rows='2'
                    />
                  )}

                  <div className='menu-items-list'>
                    {category.items.map((item) => (
                      <div key={item.id} className='menu-item-row'>
                        <input
                          type='text'
                          value={item.name}
                          onChange={(e) => updateItem(category.id, item.id, 'name', e.target.value)}
                          className='item-name-input'
                          placeholder='Item name'
                        />
                        <div className='item-price-input-group'>
                          <span className='currency'>₹</span>
                          <input
                            type='number'
                            value={item.price}
                            onChange={(e) =>
                              updateItem(
                                category.id,
                                item.id,
                                'price',
                                parseInt(e.target.value) || 0
                              )
                            }
                            className='item-price-input'
                            placeholder='0'
                            min='0'
                          />
                        </div>
                        <div className='menu-item-actions'>
                          <span className='item-preview-price'>
                            ₹{formatCurrency(item.price || 0)}
                          </span>
                          <button
                            className='btn btn-special danger'
                            onClick={() => removeItem(category.id, item.id)}
                            title='Remove item'
                          >
                            <i className='fa-solid fa-trash'></i>
                          </button>
                        </div>
                      </div>
                    ))}
                    <button className='btn btn-primary' onClick={() => addItem(category.id)}>
                      <i className='fa-solid fa-plus'></i>
                      <span>Add Item</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'offers' && (
          <div className='admin-content'>
            <div className='admin-actions'>
              <button className='btn btn-primary' onClick={handleAddOffer}>
                <i className='fa-solid fa-plus'></i> Add Offer
              </button>
              <button className='btn btn-primary' onClick={handleSaveOffers} disabled={syncing}>
                <i className='fa-solid fa-save'></i> Save Changes
              </button>
              <a
                href='/offers'
                target='_blank'
                rel='noopener noreferrer'
                className='btn btn-secondary'
                style={{
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <i className='fa-solid fa-external-link'></i> View Offers Page
              </a>
              {saved && <span className='save-indicator'>✓ Saved successfully!</span>}
            </div>

            <div className='offers-list'>
              {offersData.length === 0 ? (
                <div className='no-data' style={{ padding: '3rem', textAlign: 'center' }}>
                  <p>No offers created yet. Click "Add Offer" to create your first offer!</p>
                </div>
              ) : (
                offersData.map((offer) => (
                  <div key={offer.id} className='offer-card-admin'>
                    <div className='offer-card-header-admin'>
                      <div>
                        <h3>{offer.title}</h3>
                        {offer.discount && (
                          <span className='offer-discount-badge'>{offer.discount}</span>
                        )}
                        {offer.badge && <span className='offer-badge-admin'>{offer.badge}</span>}
                      </div>
                      <div className='offer-actions-admin'>
                        <label className='toggle-switch'>
                          <input
                            type='checkbox'
                            checked={offer.isActive}
                            onChange={(e) => {
                              setOffersData((prev) =>
                                prev.map((o) =>
                                  o.id === offer.id ? { ...o, isActive: e.target.checked } : o
                                )
                              );
                            }}
                          />
                          <span className='toggle-slider'></span>
                          <span className='toggle-label'>
                            {offer.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </label>
                        <button
                          className='btn btn-secondary'
                          onClick={() => handleEditOffer(offer)}
                        >
                          <i className='fa-solid fa-edit'></i> Edit
                        </button>
                        <button
                          className='btn btn-special danger'
                          onClick={() => handleDeleteOffer(offer.id)}
                        >
                          <i className='fa-solid fa-trash'></i> Delete
                        </button>
                      </div>
                    </div>
                    <p className='offer-description-admin'>{offer.description}</p>
                    {offer.startDate || offer.endDate ? (
                      <div className='offer-dates-admin'>
                        {offer.startDate && (
                          <span>Starts: {new Date(offer.startDate).toLocaleDateString()}</span>
                        )}
                        {offer.endDate && (
                          <span>Ends: {new Date(offer.endDate).toLocaleDateString()}</span>
                        )}
                      </div>
                    ) : null}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className='admin-content'>
            <div className='orders-header'>
              <h2>All Orders</h2>
              <div className='orders-actions'>
                <button className='btn btn-primary' onClick={handleAddOrder}>
                  <i className='fa-solid fa-plus'></i> Add Order
                </button>
                <button
                  className='btn btn-secondary'
                  onClick={markAllOrdersAsDelivered}
                  title='Mark all orders as delivered'
                >
                  <i className='fa-solid fa-check-double'></i> Mark All Delivered
                </button>
                <label className='btn btn-ghost import-btn'>
                  <i className='fa-solid fa-upload'></i> Import Orders
                  <input
                    type='file'
                    accept='.json,.xlsx,.xls'
                    onChange={handleImportOrders}
                    style={{ display: 'none' }}
                  />
                </label>
                <button className='btn btn-ghost' onClick={handleExportOrders}>
                  <i className='fa-solid fa-download'></i> Export Orders
                </button>
              </div>
            </div>

            <div className='orders-filters'>
              <div className='filter-group'>
                <label>Date Range:</label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className='filter-select'
                >
                  <option value='all'>All Time</option>
                  <option value='today'>Today</option>
                  <option value='week'>Last 7 Days</option>
                  <option value='month'>This Month</option>
                  <option value='custom'>Custom Range</option>
                </select>
              </div>
              {dateRange === 'custom' && (
                <>
                  <div className='filter-group'>
                    <label>Start Date:</label>
                    <input
                      type='date'
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className='filter-select'
                    />
                  </div>
                  <div className='filter-group'>
                    <label>End Date:</label>
                    <input
                      type='date'
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className='filter-select'
                    />
                  </div>
                </>
              )}
              <div className='filter-group'>
                <label>Status:</label>
                <select
                  value={orderFilter}
                  onChange={(e) => setOrderFilter(e.target.value)}
                  className='filter-select'
                >
                  <option value='all'>All Orders</option>
                  {orderStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div className='filter-group'>
                <label>Sort by:</label>
                <select
                  value={orderSort}
                  onChange={(e) => setOrderSort(e.target.value)}
                  className='filter-select'
                >
                  <option value='newest'>Newest First</option>
                  <option value='oldest'>Oldest First</option>
                  <option value='amount'>Highest Amount</option>
                </select>
              </div>
              <div className='filter-group search-group'>
                <i className='fa-solid fa-search'></i>
                <input
                  type='text'
                  placeholder='Search by name, phone, address, or order ID...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='search-input'
                />
              </div>
            </div>

            {filteredOrders.length > 0 && (
              <div className='orders-summary'>
                <span>Total: {filteredOrders.length} orders</span>
                <span>Total Revenue: ₹{formatCurrency(getTotalRevenue(filteredOrders))}</span>
              </div>
            )}

            {/* Pagination Controls */}
            {filteredOrders.length > 0 && (
              <div className='pagination-controls'>
                <div className='pagination-info'>
                  <label>Show:</label>
                  <select
                    value={recordsPerPage}
                    onChange={(e) => handleRecordsPerPageChange(Number(e.target.value))}
                    className='records-per-page-select'
                  >
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={200}>200</option>
                  </select>
                  <span>records per page</span>
                </div>
                <div className='pagination-info'>
                  Showing {(currentPage - 1) * recordsPerPage + 1} to{' '}
                  {Math.min(currentPage * recordsPerPage, filteredOrders.length)} of{' '}
                  {filteredOrders.length} orders
                </div>
              </div>
            )}

            <div className='orders-table-container'>
              {filteredOrders.length === 0 ? (
                <p className='no-data'>No orders found</p>
              ) : (
                <table className='orders-table'>
                  <thead>
                    <tr>
                      <th>S No.</th>
                      <th>Order ID</th>
                      <th>Date</th>
                      <th>Delivery Address</th>
                      <th>Customer</th>
                      <th>Phone</th>
                      <th>Quantity</th>
                      <th>Unit Price</th>
                      <th>Total Amount</th>
                      <th>Status</th>
                      <th>Payment Mode</th>
                      <th>Billing Month</th>
                      <th>Reference Month</th>
                      <th>Year</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      try {
                        const paginatedOrdersList = getPaginatedOrders();
                        if (!Array.isArray(paginatedOrdersList)) {
                          return (
                            <tr>
                              <td colSpan='15' className='no-data'>
                                No orders available
                              </td>
                            </tr>
                          );
                        }
                        return paginatedOrdersList.map((order, index) => {
                          try {
                            if (!order) {
                              return null;
                            }

                            // Safely parse date
                            let orderDate;
                            let year = new Date().getFullYear();
                            let month = new Date().getMonth() + 1;
                            try {
                              const dateValue = order.createdAt || order.date;
                              if (dateValue) {
                                orderDate = new Date(dateValue);
                                if (isNaN(orderDate.getTime())) {
                                  orderDate = new Date(); // Fallback to current date
                                }
                                year = orderDate.getFullYear();
                                month = orderDate.getMonth() + 1;
                              } else {
                                orderDate = new Date(); // Fallback to current date
                              }
                            } catch (dateError) {
                              console.warn('Invalid date in order:', order.id, dateError);
                              orderDate = new Date(); // Fallback to current date
                            }

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

                            // Safely calculate billing month
                            let billingMonth = order.billingMonth || '';
                            if (!billingMonth && month >= 1 && month <= 12) {
                              billingMonth = `${monthNames[month - 1]}'${String(year).slice(-2)}`;
                            }

                            // Safely calculate reference month
                            let referenceMonth = order.referenceMonth || '';
                            if (!referenceMonth && month >= 1 && month <= 12) {
                              referenceMonth = `${String(month).padStart(2, '0')} - ${monthNames[month - 1]}'${String(year).slice(-2)}`;
                            }

                            // Safely calculate quantity
                            let quantity = 1;
                            try {
                              if (order.quantity && !isNaN(parseInt(order.quantity))) {
                                quantity = parseInt(order.quantity);
                              } else if (Array.isArray(order.items) && order.items.length > 0) {
                                quantity = order.items.reduce((sum, item) => {
                                  const qty = parseInt(item.quantity || 1);
                                  return sum + (isNaN(qty) ? 1 : qty);
                                }, 0);
                              }
                              if (quantity <= 0) quantity = 1;
                            } catch (qtyError) {
                              console.warn('Error calculating quantity for order:', order.id, qtyError);
                              quantity = 1;
                            }

                            // Safely calculate unit price
                            let unitPrice = 0;
                            try {
                              if (order.unitPrice && !isNaN(parseFloat(order.unitPrice))) {
                                unitPrice = parseFloat(order.unitPrice);
                              } else {
                                const totalAmount = parseFloat(order.total || order.totalAmount || 0);
                                if (!isNaN(totalAmount) && quantity > 0) {
                                  unitPrice = totalAmount / quantity;
                                }
                              }
                              if (isNaN(unitPrice) || unitPrice < 0) unitPrice = 0;
                            } catch (priceError) {
                              console.warn('Error calculating unit price for order:', order.id, priceError);
                              unitPrice = 0;
                            }

                            // Safely format date string
                            let dateString = 'N/A';
                            try {
                              if (orderDate && !isNaN(orderDate.getTime())) {
                                dateString = orderDate.toLocaleDateString('en-IN', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                                });
                              }
                            } catch (dateFormatError) {
                              console.warn('Error formatting date for order:', order.id, dateFormatError);
                            }

                            return (
                              <tr key={order.id || index}>
                                <td className='order-sno-cell'>
                                  {(currentPage - 1) * recordsPerPage + index + 1}
                                </td>
                                <td className='order-id-cell'>
                                  <strong>
                                    #{String(order.id || index).replace(/^#-?/, '').slice(-6)}
                                  </strong>
                                </td>
                                <td className='order-date-cell'>{dateString}</td>
                                <td className='order-address-cell'>
                                  {order.deliveryAddress ||
                                    order.customerAddress ||
                                    order.address ||
                                    'N/A'}
                                </td>
                                <td className='order-customer-cell'>
                                  {order.customerName || order.name || 'N/A'}
                                </td>
                                <td className='order-phone-cell'>
                                  {order.customerPhone || order.phone || 'N/A'}
                                </td>
                                <td className='order-quantity-cell'>{quantity}</td>
                                <td className='order-unit-price-cell'>
                                  ₹{formatCurrency(unitPrice)}
                                </td>
                                <td className='order-amount-cell'>
                                  <strong>
                                    ₹{formatCurrency(order.total || order.totalAmount || 0)}
                                  </strong>
                                </td>
                                <td className='order-status-cell'>
                                  <select
                                    value={order.status || 'pending'}
                                    onChange={(e) => {
                                      try {
                                        updateOrderStatus(order.id, e.target.value);
                                      } catch (statusError) {
                                        console.error('Error updating order status:', statusError);
                                      }
                                    }}
                                    className={`status-select status-${order.status || 'pending'}`}
                                  >
                                    {orderStatuses.map((status) => (
                                      <option key={status} value={status}>
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                      </option>
                                    ))}
                                  </select>
                                </td>
                                <td className='order-payment-cell'>
                                  {order.paymentMode || 'N/A'}
                                </td>
                                <td className='order-billing-month-cell'>{billingMonth || 'N/A'}</td>
                                <td className='order-reference-month-cell'>
                                  {referenceMonth || 'N/A'}
                                </td>
                                <td className='order-year-cell'>{year}</td>
                                <td className='order-actions-cell'>
                                  <div className='order-actions-group'>
                                    <button
                                      className='btn btn-secondary'
                                      onClick={() => {
                                        try {
                                          const details = `Order ID: ${order.id || 'N/A'} | Date: ${orderDate ? orderDate.toLocaleString() : 'N/A'} | Customer: ${order.customerName || order.name || 'N/A'} | Total: ₹${formatCurrency(order.total || order.totalAmount || 0)} | Status: ${order.status || 'pending'}`;
                                          showNotification(details, 'info', 8000);
                                        } catch (detailsError) {
                                          console.error('Error showing order details:', detailsError);
                                        }
                                      }}
                                      title='View Details'
                                    >
                                      <i className='fa-solid fa-eye'></i>
                                    </button>
                                    <button
                                      className='btn btn-secondary'
                                      onClick={() => {
                                        try {
                                          handleEditOrder(order);
                                        } catch (editError) {
                                          console.error('Error editing order:', editError);
                                        }
                                      }}
                                      title='Edit Order'
                                    >
                                      <i className='fa-solid fa-edit'></i>
                                    </button>
                                    <button
                                      className='btn btn-special danger'
                                      onClick={() => {
                                        try {
                                          handleDeleteOrder(order.id);
                                        } catch (deleteError) {
                                          console.error('Error deleting order:', deleteError);
                                        }
                                      }}
                                      title='Delete Order'
                                    >
                                      <i className='fa-solid fa-trash'></i>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          } catch (orderError) {
                            console.error('Error rendering order row:', orderError, order);
                            return (
                              <tr key={order?.id || index}>
                                <td colSpan='15' className='error-cell'>
                                  Error loading order #{order?.id || index}
                                </td>
                              </tr>
                            );
                          }
                        });
                      } catch (mapError) {
                        console.error('Error mapping orders:', mapError);
                        return (
                          <tr>
                            <td colSpan='15' className='no-data'>
                              Error loading orders. Please refresh the page.
                            </td>
                          </tr>
                        );
                      }
                    })()}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan='15' className='table-footer'>
                        <strong>
                          Page {currentPage} of {totalPages} | Total: {filteredOrders.length} orders
                          | Total Amount: ₹{formatCurrency(getTotalRevenue(filteredOrders))}
                        </strong>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              )}
            </div>

            {/* Pagination Navigation */}
            {filteredOrders.length > 0 && totalPages > 1 && (
              <div className='pagination-navigation'>
                <button
                  className='btn btn-ghost'
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  title='First Page'
                >
                  <i className='fa-solid fa-angle-double-left'></i>
                </button>
                <button
                  className='btn btn-ghost'
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  title='Previous Page'
                >
                  <i className='fa-solid fa-angle-left'></i>
                </button>

                {/* Page Numbers */}
                <div className='page-numbers'>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= currentPage - 2 && pageNum <= currentPage + 2)
                    ) {
                      return (
                        <button
                          key={pageNum}
                          className={`btn btn-ghost ${currentPage === pageNum ? 'active' : ''}`}
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </button>
                      );
                    } else if (pageNum === currentPage - 3 || pageNum === currentPage + 3) {
                      return (
                        <span key={pageNum} className='page-ellipsis'>
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                <button
                  className='btn btn-ghost'
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  title='Next Page'
                >
                  <i className='fa-solid fa-angle-right'></i>
                </button>
                <button
                  className='btn btn-ghost'
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  title='Last Page'
                >
                  <i className='fa-solid fa-angle-double-right'></i>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Summary Report Tab - Excel Style */}
        {activeTab === 'summary' && (
          <div className='admin-content'>
            <div className='orders-header'>
              <h2>Summary Report (Excel Format)</h2>
              <div className='orders-actions'>
                <button className='btn btn-ghost' onClick={() => setActiveTab('orders')}>
                  <i className='fa-solid fa-list'></i> View Detailed Orders
                </button>
              </div>
            </div>

            {(() => {
              try {
                const summary = getSummaryReport();
                if (!summary || !summary.data) {
                  return <p className='no-data'>Error loading summary data. Please try again.</p>;
                }

                // Safety check: prevent rendering if data is too large
                if (summary.data.length > 5000) {
                  return (
                    <div className='error-message'>
                      <p>Summary report contains too many addresses ({summary.data.length}).</p>
                      <p>Please use filters to reduce the dataset size.</p>
                      <button
                        className='btn btn-primary'
                        onClick={() => {
                          setDateRange('month');
                          setOrderFilter('all');
                          setSearchQuery('');
                        }}
                      >
                        Filter to Current Month
                      </button>
                    </div>
                  );
                }

                return (
                  <>
                    <div className='summary-info'>
                      <span>Total Addresses: {summary.data.length}</span>
                      <span>Grand Total: ₹{formatCurrency(summary.grandTotal)}</span>
                    </div>

                    {/* Pagination Controls for Summary */}
                    {summary.data.length > 0 && (
                      <div className='pagination-controls'>
                        <div className='pagination-info'>
                          <label>Show:</label>
                          <select
                            value={recordsPerPage}
                            onChange={(e) => handleRecordsPerPageChange(Number(e.target.value))}
                            className='records-per-page-select'
                          >
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                            <option value={200}>200</option>
                          </select>
                          <span>records per page</span>
                        </div>
                        <div className='pagination-info'>
                          Showing {(currentPage - 1) * recordsPerPage + 1} to{' '}
                          {Math.min(currentPage * recordsPerPage, summary.data.length)} of{' '}
                          {summary.data.length} addresses
                        </div>
                      </div>
                    )}

                    <div className='orders-table-container summary-table-container'>
                      {summary.data.length === 0 ? (
                        <p className='no-data'>No data available</p>
                      ) : (
                        <table className='orders-table summary-table'>
                          <thead>
                            <tr>
                              <th>Address</th>
                              {summary.months.map((month) => (
                                <th key={month}>{month}</th>
                              ))}
                              <th>Grand Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {summary.data
                              .slice(
                                (currentPage - 1) * recordsPerPage,
                                currentPage * recordsPerPage
                              )
                              .map((row, index) => (
                                <tr key={index}>
                                  <td className='address-cell'>{row.address}</td>
                                  {summary.months.map((month) => (
                                    <td key={month} className='amount-cell'>
                                      {row.monthlyTotals[month]
                                        ? `₹${formatCurrency(row.monthlyTotals[month])}`
                                        : '-'}
                                    </td>
                                  ))}
                                  <td className='grand-total-cell'>
                                    <strong>₹{formatCurrency(row.grandTotal)}</strong>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                          <tfoot>
                            <tr className='summary-total-row'>
                              <td>
                                <strong>Total</strong>
                              </td>
                              {summary.months.map((month) => {
                                const monthTotal = summary.data.reduce(
                                  (sum, row) => sum + (row.monthlyTotals[month] || 0),
                                  0
                                );
                                return (
                                  <td key={month} className='month-total-cell'>
                                    <strong>₹{formatCurrency(monthTotal)}</strong>
                                  </td>
                                );
                              })}
                              <td className='grand-total-cell'>
                                <strong>₹{formatCurrency(summary.grandTotal)}</strong>
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      )}
                    </div>

                    {/* Pagination Navigation for Summary */}
                    {summary.data.length > 0 &&
                      Math.ceil(summary.data.length / recordsPerPage) > 1 && (
                        <div className='pagination-navigation'>
                          <button
                            className='btn btn-ghost'
                            onClick={() => handlePageChange(1)}
                            disabled={currentPage === 1}
                            title='First Page'
                          >
                            <i className='fa-solid fa-angle-double-left'></i>
                          </button>
                          <button
                            className='btn btn-ghost'
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            title='Previous Page'
                          >
                            <i className='fa-solid fa-angle-left'></i>
                          </button>

                          <div className='page-numbers'>
                            {Array.from(
                              { length: Math.ceil(summary.data.length / recordsPerPage) },
                              (_, i) => i + 1
                            ).map((pageNum) => {
                              const totalPages = Math.ceil(summary.data.length / recordsPerPage);
                              if (
                                pageNum === 1 ||
                                pageNum === totalPages ||
                                (pageNum >= currentPage - 2 && pageNum <= currentPage + 2)
                              ) {
                                return (
                                  <button
                                    key={pageNum}
                                    className={`btn btn-ghost ${currentPage === pageNum ? 'active' : ''}`}
                                    onClick={() => handlePageChange(pageNum)}
                                  >
                                    {pageNum}
                                  </button>
                                );
                              } else if (
                                pageNum === currentPage - 3 ||
                                pageNum === currentPage + 3
                              ) {
                                return (
                                  <span key={pageNum} className='page-ellipsis'>
                                    ...
                                  </span>
                                );
                              }
                              return null;
                            })}
                          </div>

                          <button
                            className='btn btn-ghost'
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={
                              currentPage === Math.ceil(summary.data.length / recordsPerPage)
                            }
                            title='Next Page'
                          >
                            <i className='fa-solid fa-angle-right'></i>
                          </button>
                          <button
                            className='btn btn-ghost'
                            onClick={() =>
                              handlePageChange(Math.ceil(summary.data.length / recordsPerPage))
                            }
                            disabled={
                              currentPage === Math.ceil(summary.data.length / recordsPerPage)
                            }
                            title='Last Page'
                          >
                            <i className='fa-solid fa-angle-double-right'></i>
                          </button>
                        </div>
                      )}
                  </>
                );
              } catch (summaryError) {
                console.error('Error rendering summary report:', summaryError);
                return (
                  <div className='error-message'>
                    <p>Error loading summary report. Please refresh the page or try again later.</p>
                    <button className='btn btn-primary' onClick={() => window.location.reload()}>
                      Refresh Page
                    </button>
                  </div>
                );
              }
            })()}
          </div>
        )}

        {/* Customers/Addresses Tab */}
        {activeTab === 'customers' && (
          <div className='admin-content'>
            <div className='orders-header'>
              <h2>Customers & Addresses</h2>
              <div className='orders-actions'>
                <button className='btn btn-ghost' onClick={() => setActiveTab('summary')}>
                  <i className='fa-solid fa-table'></i> View Summary Report
                </button>
              </div>
            </div>

            <div className='orders-filters'>
              <div className='filter-group search-group'>
                <i className='fa-solid fa-search'></i>
                <input
                  type='text'
                  placeholder='Search by address, name, or phone...'
                  value={customerSearchQuery}
                  onChange={(e) => {
                    setCustomerSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className='search-input'
                />
              </div>
              <div className='filter-group'>
                <label>Sort by:</label>
                <select
                  value={customerSort}
                  onChange={(e) => {
                    setCustomerSort(e.target.value);
                    setCurrentPage(1);
                  }}
                  className='filter-select'
                >
                  <option value='totalAmount'>Total Amount (High to Low)</option>
                  <option value='totalOrders'>Total Orders (High to Low)</option>
                  <option value='lastOrder'>Last Order (Recent First)</option>
                </select>
              </div>
            </div>

            {filteredCustomers.length > 0 && (
              <div className='orders-summary'>
                <span>Total Customers: {filteredCustomers.length}</span>
                <span>
                  Total Revenue: ₹
                  {formatCurrency(
                    filteredCustomers.reduce((sum, c) => sum + (c.totalAmount || 0), 0)
                  )}
                </span>
              </div>
            )}

            {/* Pagination Controls */}
            {filteredCustomers.length > 0 && (
              <div className='pagination-controls'>
                <div className='pagination-info'>
                  <label>Show:</label>
                  <select
                    value={recordsPerPage}
                    onChange={(e) => handleRecordsPerPageChange(Number(e.target.value))}
                    className='records-per-page-select'
                  >
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={200}>200</option>
                  </select>
                  <span>records per page</span>
                </div>
                <div className='pagination-info'>
                  Showing {(currentPage - 1) * recordsPerPage + 1} to{' '}
                  {Math.min(currentPage * recordsPerPage, filteredCustomers.length)} of{' '}
                  {filteredCustomers.length} customers
                </div>
              </div>
            )}

            <div className='orders-table-container'>
              {filteredCustomers.length === 0 ? (
                <p className='no-data'>No customers found</p>
              ) : (
                <table className='orders-table'>
                  <thead>
                    <tr>
                      <th>Address</th>
                      <th>Customer Name</th>
                      <th>Phone</th>
                      <th>Total Orders</th>
                      <th>Total Amount</th>
                      <th>Avg Order Value</th>
                      <th>Last Order</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedCustomers.map((customer, index) => {
                      try {
                        if (!customer) return null;

                        const avgOrderValue =
                          customer.totalOrders > 0 && customer.totalAmount
                            ? Math.round(customer.totalAmount / customer.totalOrders)
                            : 0;

                        let daysSinceLastOrder = null;
                        let lastOrderDateStr = 'N/A';
                        try {
                          if (customer.lastOrderDate) {
                            const lastDate =
                              customer.lastOrderDate instanceof Date
                                ? customer.lastOrderDate
                                : new Date(customer.lastOrderDate);
                            if (!isNaN(lastDate.getTime())) {
                              lastOrderDateStr = lastDate.toLocaleDateString();
                              daysSinceLastOrder = Math.floor(
                                (new Date().getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
                              );
                            }
                          }
                        } catch (dateError) {
                          console.warn('Error calculating days since last order:', dateError);
                        }

                        const isActive = daysSinceLastOrder !== null && daysSinceLastOrder <= 90;

                        return (
                          <tr
                            key={customer.address || index}
                            className={
                              selectedCustomer?.address === customer.address ? 'selected' : ''
                            }
                          >
                            <td className='address-cell'>
                              <strong>{customer.address || 'Unknown'}</strong>
                            </td>
                            <td className='order-customer-cell'>
                              {customer.customerName || 'N/A'}
                            </td>
                            <td className='order-phone-cell'>{customer.phone || 'N/A'}</td>
                            <td className='order-amount-cell'>{customer.totalOrders || 0}</td>
                            <td className='order-amount-cell'>
                              <strong>₹{formatCurrency(customer.totalAmount || 0)}</strong>
                            </td>
                            <td className='order-amount-cell'>₹{formatCurrency(avgOrderValue)}</td>
                            <td className='order-date-cell'>
                              {lastOrderDateStr}
                              {daysSinceLastOrder !== null && daysSinceLastOrder > 0 && (
                                <span className='days-ago'>({daysSinceLastOrder}d ago)</span>
                              )}
                            </td>
                            <td className='order-status-cell'>
                              <span
                                className={`status-badge status-${isActive ? 'active' : 'inactive'}`}
                              >
                                {isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className='order-actions-cell'>
                              <div className='order-actions-group'>
                                <button
                                  className='btn btn-secondary'
                                  onClick={() => {
                                    try {
                                      setSelectedCustomer(
                                        selectedCustomer?.address === customer.address
                                          ? null
                                          : customer
                                      );
                                    } catch (error) {
                                      console.error('Error selecting customer:', error);
                                    }
                                  }}
                                  title='View Details'
                                >
                                  <i className='fa-solid fa-eye'></i>
                                </button>
                                <button
                                  className='btn btn-secondary'
                                  onClick={() => {
                                    try {
                                      setSearchQuery(customer.address || '');
                                      setActiveTab('orders');
                                    } catch (error) {
                                      console.error('Error navigating to orders:', error);
                                    }
                                  }}
                                  title='View Orders'
                                >
                                  <i className='fa-solid fa-shopping-cart'></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      } catch (rowError) {
                        console.error('Error rendering customer row:', rowError, customer);
                        return null;
                      }
                    })}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan='9' className='table-footer'>
                        <strong>
                          Page {currentPage} of {customerTotalPages} | Total:{' '}
                          {filteredCustomers.length} customers | Total Revenue: ₹
                          {formatCurrency(
                            filteredCustomers.reduce((sum, c) => sum + (c.totalAmount || 0), 0)
                          )}
                        </strong>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              )}
            </div>

            {/* Customer Details Modal */}
            {selectedCustomer &&
              (() => {
                try {
                  // Safely get customer data
                  const customer = selectedCustomer;
                  const ordersList = Array.isArray(customer.orders) ? customer.orders : [];
                  const totalOrders = customer.totalOrders || 0;
                  const totalAmount = customer.totalAmount || 0;
                  const avgOrderValue = totalOrders > 0 ? Math.round(totalAmount / totalOrders) : 0;

                  return (
                    <div className='modal-overlay' onClick={() => setSelectedCustomer(null)}>
                      <div
                        className='modal-content customer-details-modal'
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className='modal-header'>
                          <h3>Customer Details</h3>
                          <button className='modal-close' onClick={() => setSelectedCustomer(null)}>
                            <i className='fa-solid fa-times'></i>
                          </button>
                        </div>
                        <div className='modal-body'>
                          <div className='customer-details-section'>
                            <h4>Customer Information</h4>
                            <div className='detail-row'>
                              <span className='detail-label'>Address:</span>
                              <span className='detail-value'>{customer.address || 'N/A'}</span>
                            </div>
                            <div className='detail-row'>
                              <span className='detail-label'>Customer Name:</span>
                              <span className='detail-value'>{customer.customerName || 'N/A'}</span>
                            </div>
                            {customer.phone && (
                              <div className='detail-row'>
                                <span className='detail-label'>Phone:</span>
                                <span className='detail-value'>{customer.phone}</span>
                              </div>
                            )}
                            <div className='detail-row'>
                              <span className='detail-label'>Total Orders:</span>
                              <span className='detail-value'>{totalOrders}</span>
                            </div>
                            <div className='detail-row'>
                              <span className='detail-label'>Total Amount:</span>
                              <span className='detail-value'>₹{formatCurrency(totalAmount)}</span>
                            </div>
                            <div className='detail-row'>
                              <span className='detail-label'>Average Order Value:</span>
                              <span className='detail-value'>₹{formatCurrency(avgOrderValue)}</span>
                            </div>
                            {customer.firstOrderDate && (
                              <div className='detail-row'>
                                <span className='detail-label'>First Order:</span>
                                <span className='detail-value'>
                                  {customer.firstOrderDate instanceof Date
                                    ? customer.firstOrderDate.toLocaleDateString()
                                    : new Date(customer.firstOrderDate).toLocaleDateString()}
                                </span>
                              </div>
                            )}
                            {customer.lastOrderDate && (
                              <div className='detail-row'>
                                <span className='detail-label'>Last Order:</span>
                                <span className='detail-value'>
                                  {customer.lastOrderDate instanceof Date
                                    ? customer.lastOrderDate.toLocaleDateString()
                                    : new Date(customer.lastOrderDate).toLocaleDateString()}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className='customer-orders-section'>
                            <h4>Order History ({ordersList.length} orders)</h4>
                            <div className='customer-orders-list'>
                              {ordersList.length > 0 ? (
                                <>
                                  {ordersList
                                    .filter((order) => order && order.id)
                                    .sort((a, b) => {
                                      try {
                                        const dateA = new Date(a.createdAt || a.date || 0);
                                        const dateB = new Date(b.createdAt || b.date || 0);
                                        if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
                                          return 0;
                                        }
                                        return dateB - dateA;
                                      } catch (sortError) {
                                        return 0;
                                      }
                                    })
                                    .slice(0, 10)
                                    .map((order) => {
                                      try {
                                        const orderDate = new Date(
                                          order.createdAt || order.date || Date.now()
                                        );
                                        const orderAmount = order.total || order.totalAmount || 0;
                                        const orderStatus = order.status || 'pending';
                                        const orderId = String(order.id || '')
                                          .replace(/^#-?/, '')
                                          .slice(-6);

                                        return (
                                          <div
                                            key={order.id || Math.random()}
                                            className='customer-order-item'
                                          >
                                            <div>
                                              <strong>#{orderId}</strong>
                                              <span>
                                                {!isNaN(orderDate.getTime())
                                                  ? orderDate.toLocaleDateString()
                                                  : 'N/A'}
                                              </span>
                                            </div>
                                            <div>
                                              <span>₹{formatCurrency(orderAmount)}</span>
                                              <span
                                                className={`status-badge status-${orderStatus}`}
                                              >
                                                {orderStatus}
                                              </span>
                                            </div>
                                          </div>
                                        );
                                      } catch (orderError) {
                                        console.warn('Error rendering order in modal:', orderError);
                                        return null;
                                      }
                                    })}
                                  {ordersList.length > 10 && (
                                    <button
                                      className='btn btn-ghost'
                                      onClick={() => {
                                        try {
                                          setSearchQuery(customer.address || '');
                                          setActiveTab('orders');
                                          setSelectedCustomer(null);
                                        } catch (error) {
                                          console.error('Error navigating to orders:', error);
                                        }
                                      }}
                                    >
                                      View All {ordersList.length} Orders
                                    </button>
                                  )}
                                </>
                              ) : (
                                <p className='no-data'>No orders found for this customer</p>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className='modal-footer'>
                          <button
                            className='btn btn-primary'
                            onClick={() => {
                              try {
                                setSearchQuery(customer.address || '');
                                setActiveTab('orders');
                                setSelectedCustomer(null);
                              } catch (error) {
                                console.error('Error navigating to orders:', error);
                              }
                            }}
                          >
                            View All Orders
                          </button>
                          <button
                            className='btn btn-ghost'
                            onClick={() => setSelectedCustomer(null)}
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                } catch (modalError) {
                  console.error('Error rendering customer modal:', modalError);
                  return (
                    <div className='modal-overlay' onClick={() => setSelectedCustomer(null)}>
                      <div
                        className='modal-content customer-details-modal'
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className='modal-header'>
                          <h3>Error</h3>
                          <button className='modal-close' onClick={() => setSelectedCustomer(null)}>
                            <i className='fa-solid fa-times'></i>
                          </button>
                        </div>
                        <div className='modal-body'>
                          <p>Error loading customer details. Please try again.</p>
                        </div>
                        <div className='modal-footer'>
                          <button
                            className='btn btn-ghost'
                            onClick={() => setSelectedCustomer(null)}
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }
              })()}

            {/* Pagination Navigation */}
            {filteredCustomers.length > 0 && customerTotalPages > 1 && (
              <div className='pagination-navigation'>
                <button
                  className='btn btn-ghost'
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  title='First Page'
                >
                  <i className='fa-solid fa-angle-double-left'></i>
                </button>
                <button
                  className='btn btn-ghost'
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  title='Previous Page'
                >
                  <i className='fa-solid fa-angle-left'></i>
                </button>

                <div className='page-numbers'>
                  {Array.from({ length: customerTotalPages }, (_, i) => i + 1).map((pageNum) => {
                    if (
                      pageNum === 1 ||
                      pageNum === customerTotalPages ||
                      (pageNum >= currentPage - 2 && pageNum <= currentPage + 2)
                    ) {
                      return (
                        <button
                          key={pageNum}
                          className={`btn btn-ghost ${currentPage === pageNum ? 'active' : ''}`}
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </button>
                      );
                    } else if (pageNum === currentPage - 3 || pageNum === currentPage + 3) {
                      return (
                        <span key={pageNum} className='page-ellipsis'>
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                <button
                  className='btn btn-ghost'
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === customerTotalPages}
                  title='Next Page'
                >
                  <i className='fa-solid fa-angle-right'></i>
                </button>
                <button
                  className='btn btn-ghost'
                  onClick={() => handlePageChange(customerTotalPages)}
                  disabled={currentPage === customerTotalPages}
                  title='Last Page'
                >
                  <i className='fa-solid fa-angle-double-right'></i>
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div className='admin-content'>
            <div className='users-header'>
              <h2>User Management</h2>
              <div className='users-search'>
                <i className='fa-solid fa-search'></i>
                <input
                  type='text'
                  placeholder='Search users by name, email, or phone...'
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  className='search-input'
                />
              </div>
            </div>
            <div className='users-summary'>
              <span>Total Users: {users.length}</span>
              <span>Showing: {getFilteredUsers().length}</span>
            </div>
            <div className='users-list'>
              {getFilteredUsers().length === 0 ? (
                <p className='no-data'>
                  {userSearchQuery
                    ? 'No users found matching your search'
                    : 'No registered users yet'}
                </p>
              ) : (
                getFilteredUsers().map((user) => (
                  <div
                    key={user.id}
                    className={`user-card ${selectedUser?.id === user.id ? 'selected' : ''}`}
                    onClick={() => setSelectedUser(selectedUser?.id === user.id ? null : user)}
                  >
                    <div className='user-info'>
                      {user.profilePicture && (
                        <img
                          src={user.profilePicture}
                          alt={user.name}
                          className='user-avatar-img'
                        />
                      )}
                      {!user.profilePicture && (
                        <div className='user-avatar-initial'>
                          {user.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                      )}
                      <div>
                        <h3>{user.name}</h3>
                        <p>{user.email}</p>
                        <p>{user.phone}</p>
                        <p className='user-meta'>
                          Registered: {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className='user-stats'>
                      <div className='stat-box'>
                        <strong>{orders.filter((o) => o.userId === user.id).length}</strong>
                        <span>Orders</span>
                      </div>
                      <div className='stat-box'>
                        <strong>
                          ₹
                          {orders
                            .filter((o) => o.userId === user.id)
                            .reduce((sum, o) => sum + (o.total || 0), 0)}
                        </strong>
                        <span>Total Spent</span>
                      </div>
                      <div className='stat-box'>
                        <strong>{(user.addresses || []).length}</strong>
                        <span>Addresses</span>
                      </div>
                    </div>
                    {selectedUser?.id === user.id && (
                      <div className='user-details-expanded'>
                        <div className='user-detail-section'>
                          <h4>Addresses</h4>
                          {user.addresses && user.addresses.length > 0 ? (
                            <ul>
                              {user.addresses.map((addr, idx) => (
                                <li key={idx}>
                                  <strong>{addr.name}</strong> - {addr.address}
                                  {addr.landmark && ` (${addr.landmark})`}
                                  {addr.pincode && ` - ${addr.pincode}`}
                                  {addr.isDefault && <span className='default-badge'>Default</span>}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p>No saved addresses</p>
                          )}
                        </div>
                        <div className='user-detail-section'>
                          <h4>Recent Orders</h4>
                          {orders.filter((o) => o.userId === user.id).length > 0 ? (
                            <ul>
                              {orders
                                .filter((o) => o.userId === user.id)
                                .sort(
                                  (a, b) =>
                                    new Date(b.createdAt || b.date) -
                                    new Date(a.createdAt || a.date)
                                )
                                .slice(0, 5)
                                .map((order) => (
                                  <li key={order.id}>
                                    Order #{order.id.toString().slice(-6)} - ₹
                                    {formatCurrency(order.total || 0)} - {order.status || 'pending'}{' '}
                                    - {new Date(order.createdAt || order.date).toLocaleDateString()}
                                  </li>
                                ))}
                            </ul>
                          ) : (
                            <p>No orders yet</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className='admin-content'>
            <h2>Settings</h2>
            <div className='settings-form'>
              <div className='form-group'>
                <label>WhatsApp Number</label>
                <input
                  type='text'
                  value={settings.whatsappNumber}
                  onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                  placeholder='+91 1234567890'
                />
              </div>
              <div className='form-group'>
                <label>Delivery Timings</label>
                <input
                  type='text'
                  value={settings.deliveryTimings}
                  onChange={(e) => setSettings({ ...settings, deliveryTimings: e.target.value })}
                  placeholder='9:00 AM - 9:00 PM'
                />
              </div>
              <div className='form-group'>
                <label>Minimum Order Value (₹)</label>
                <input
                  type='number'
                  value={settings.minOrderValue}
                  onChange={(e) =>
                    setSettings({ ...settings, minOrderValue: parseInt(e.target.value) || 0 })
                  }
                  placeholder='0'
                />
              </div>
              <div className='form-group'>
                <label>Delivery Charge (₹)</label>
                <input
                  type='number'
                  value={settings.deliveryCharge}
                  onChange={(e) =>
                    setSettings({ ...settings, deliveryCharge: parseInt(e.target.value) || 0 })
                  }
                  placeholder='0'
                />
              </div>
              <div className='form-group' style={{ gridColumn: '1 / -1' }}>
                <label>Top Announcement Bar Text</label>
                <input
                  type='text'
                  value={settings.announcement}
                  onChange={(e) => setSettings({ ...settings, announcement: e.target.value })}
                  placeholder='Enter announcement text...'
                />
              </div>
              <button className='btn btn-primary' onClick={handleSaveSettings}>
                <i className='fa-solid fa-save'></i> Save Settings
              </button>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className='admin-content'>
            <div className='analytics-header'>
              <h2>Analytics & Reports</h2>
              <button className='btn btn-primary' onClick={handleExportOrders}>
                <i className='fa-solid fa-file-export'></i> Export Report
              </button>
            </div>

            <div className='analytics-overview'>
              <div className='analytics-grid'>
                <div className='analytics-card'>
                  <div className='analytics-icon revenue'>
                    <i className='fa-solid fa-rupee-sign'></i>
                  </div>
                  <div className='analytics-info'>
                    <h3>Total Revenue</h3>
                    <p className='analytics-value'>₹{formatCurrency(getTotalRevenue())}</p>
                    <span className='analytics-label'>From delivered orders</span>
                    <div className='analytics-trend'>
                      <span className='trend-up'>
                        <i className='fa-solid fa-arrow-up'></i> ₹
                        {formatCurrency(getWeeklyStats().revenue)} this week
                      </span>
                    </div>
                  </div>
                </div>
                <div className='analytics-card'>
                  <div className='analytics-icon orders'>
                    <i className='fa-solid fa-shopping-cart'></i>
                  </div>
                  <div className='analytics-info'>
                    <h3>Total Orders</h3>
                    <p className='analytics-value'>{orders.length}</p>
                    <span className='analytics-label'>All time</span>
                    <div className='analytics-trend'>
                      <span className='trend-up'>
                        <i className='fa-solid fa-arrow-up'></i> {getWeeklyStats().orders} this week
                      </span>
                    </div>
                  </div>
                </div>
                <div className='analytics-card'>
                  <div className='analytics-icon average'>
                    <i className='fa-solid fa-chart-line'></i>
                  </div>
                  <div className='analytics-info'>
                    <h3>Average Order Value</h3>
                    <p className='analytics-value'>
                      ₹
                      {orders.length > 0
                        ? Math.round(
                            getTotalRevenue() /
                              (orders.filter((o) => o.status === 'delivered').length || 1)
                          )
                        : 0}
                    </p>
                    <span className='analytics-label'>Per delivered order</span>
                    <div className='analytics-trend'>
                      <span>Weekly avg: ₹{getWeeklyStats().avgOrderValue}</span>
                    </div>
                  </div>
                </div>
                <div className='analytics-card'>
                  <div className='analytics-icon completed'>
                    <i className='fa-solid fa-check-circle'></i>
                  </div>
                  <div className='analytics-info'>
                    <h3>Completed Orders</h3>
                    <p className='analytics-value'>
                      {orders.filter((o) => o.status === 'delivered').length}
                    </p>
                    <span className='analytics-label'>
                      {orders.length > 0
                        ? Math.round(
                            (orders.filter((o) => o.status === 'delivered').length /
                              orders.length) *
                              100
                          )
                        : 0}
                      % completion rate
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Trends Chart */}
            <div className='analytics-chart-section'>
              <h3>Order Trends (Last 7 Days)</h3>
              <div className='trend-chart'>
                {getOrderTrends().map((day, index) => {
                  const maxOrders = Math.max(...getOrderTrends().map((d) => d.orders), 1);
                  const height = (day.orders / maxOrders) * 100;
                  return (
                    <div key={index} className='trend-bar-container'>
                      <div className='trend-bar' style={{ height: `${height}%` }}>
                        <span className='trend-value'>{day.orders}</span>
                      </div>
                      <span className='trend-label'>{day.date}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Revenue Trends */}
            <div className='analytics-chart-section'>
              <h3>Revenue Trends (Last 7 Days)</h3>
              <div className='revenue-chart'>
                {getOrderTrends().map((day, index) => {
                  const maxRevenue = Math.max(...getOrderTrends().map((d) => d.revenue), 1);
                  const height = (day.revenue / maxRevenue) * 100;
                  return (
                    <div key={index} className='revenue-bar-container'>
                      <div className='revenue-bar' style={{ height: `${height}%` }}>
                        <span className='revenue-value'>₹{formatCurrency(day.revenue)}</span>
                      </div>
                      <span className='revenue-label'>{day.date}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top Items */}
            <div className='analytics-section'>
              <h3 className='section-title'>
                <i className='fa-solid fa-fire'></i> Top Selling Items
              </h3>
              <div className='top-items-list'>
                {getTopItems().length > 0 ? (
                  getTopItems().map((item, index) => (
                    <div key={index} className='top-item-card'>
                      <div className='item-rank'>#{index + 1}</div>
                      <div className='item-info'>
                        <h4>{item.name}</h4>
                        <p>{item.count} orders</p>
                      </div>
                      <div className='item-badge'>
                        <i className='fa-solid fa-fire'></i>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className='no-data'>No order data available</p>
                )}
              </div>
            </div>

            <div className='analytics-sections'>
              <div className='analytics-section'>
                <h3 className='section-title'>
                  <i className='fa-solid fa-chart-pie'></i> Orders by Status
                </h3>
                <div className='status-breakdown'>
                  {Object.entries(getAnalyticsData().statusCounts).map(([status, count]) => (
                    <div key={status} className='status-item'>
                      <div className='status-info'>
                        <span className='status-name'>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                        <span className='status-count'>{count} orders</span>
                      </div>
                      <div className='status-bar'>
                        <div
                          className='status-bar-fill'
                          style={{
                            width: `${orders.length > 0 ? (count / orders.length) * 100 : 0}%`,
                            backgroundColor:
                              status === 'delivered'
                                ? 'var(--admin-success)'
                                : status === 'pending'
                                  ? 'var(--admin-warning)'
                                  : status === 'cancelled'
                                    ? 'var(--admin-danger)'
                                    : 'var(--admin-accent)',
                          }}
                        ></div>
                      </div>
                      <span className='status-percentage'>
                        {orders.length > 0 ? Math.round((count / orders.length) * 100) : 0}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className='analytics-section'>
                <h3 className='section-title'>
                  <i className='fa-solid fa-calendar-alt'></i> Yearly Revenue Summary
                </h3>
                <div className='yearly-revenue-table'>
                  {Object.keys(getAnalyticsData().yearlyData || {}).length > 0 ? (
                    <table className='analytics-table'>
                      <thead>
                        <tr>
                          <th>Year</th>
                          <th>Orders</th>
                          <th>Revenue</th>
                          <th>Average</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(getAnalyticsData().yearlyData || {})
                          .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
                          .map(([year, data]) => {
                            try {
                              return (
                                <tr key={year}>
                                  <td>
                                    <strong>{year}</strong>
                                  </td>
                                  <td>{data.orders || 0}</td>
                                  <td>
                                    <strong>₹{formatCurrency(data.revenue || 0)}</strong>
                                  </td>
                                  <td>
                                    ₹{formatCurrency(data.orders > 0 ? (data.revenue || 0) / data.orders : 0)}
                                  </td>
                                </tr>
                              );
                            } catch (error) {
                              console.warn('Error rendering yearly data row:', error, year);
                              return null;
                            }
                          })}
                      </tbody>
                    </table>
                  ) : (
                    <p className='no-data'>No yearly data available</p>
                  )}
                </div>
              </div>

              <div className='analytics-section'>
                <h3 className='section-title'>
                  <i className='fa-solid fa-calendar-alt'></i> Monthly Revenue (by Year)
                </h3>
                <div className='monthly-revenue-table'>
                  {Object.keys(getAnalyticsData().monthlyData).length > 0 ? (
                    <table className='analytics-table'>
                      <thead>
                        <tr>
                          <th>Year-Month</th>
                          <th>Orders</th>
                          <th>Revenue</th>
                          <th>Average</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(getAnalyticsData().monthlyData)
                          .sort((a, b) => b[0].localeCompare(a[0]))
                          .slice(0, 12)
                          .map(([monthKey, data]) => {
                            try {
                              const [year, month] = monthKey.split('-');
                              const monthDate = new Date(parseInt(year), parseInt(month) - 1, 1);
                              return (
                                <tr key={monthKey}>
                                  <td>
                                    {monthDate.toLocaleDateString('en-US', {
                                      month: 'long',
                                      year: 'numeric',
                                    })}
                                  </td>
                                  <td>{data.orders || 0}</td>
                                  <td>
                                    <strong>₹{formatCurrency(data.revenue || 0)}</strong>
                                  </td>
                                  <td>
                                    ₹{formatCurrency(data.orders > 0 ? (data.revenue || 0) / data.orders : 0)}
                                  </td>
                                </tr>
                              );
                            } catch (error) {
                              console.warn('Error rendering monthly data row:', error, monthKey);
                              return null;
                            }
                          })}
                      </tbody>
                    </table>
                  ) : (
                    <p className='no-data'>No monthly data available</p>
                  )}
                </div>
              </div>

              <div className='analytics-section'>
                <h3 className='section-title'>
                  <i className='fa-solid fa-chart-bar'></i> Recent Daily Revenue (Last 30 Days)
                </h3>
                <div className='daily-revenue-chart'>
                  {(() => {
                    const dailyData = getAnalyticsData().dailyRevenue;
                    const dailyEntries = Object.entries(dailyData);
                    const maxRevenue =
                      dailyEntries.length > 0
                        ? Math.max(...dailyEntries.map(([_, rev]) => rev))
                        : 1;

                    return dailyEntries
                      .sort((a, b) => b[0].localeCompare(a[0]))
                      .slice(0, 30)
                      .map(([dateKey, revenue]) => {
                        try {
                          const dateObj = new Date(dateKey + 'T00:00:00');
                          if (isNaN(dateObj.getTime())) return null;

                          return (
                            <div key={dateKey} className='daily-bar'>
                              <div className='bar-label'>
                                {dateObj.toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </div>
                              <div className='bar-container'>
                                <div
                                  className='bar-fill'
                                  style={{
                                    width: `${(revenue / maxRevenue) * 100}%`,
                                    backgroundColor: 'var(--admin-success)',
                                  }}
                                >
                                  <span className='bar-value'>₹{formatCurrency(revenue)}</span>
                                </div>
                              </div>
                            </div>
                          );
                        } catch (error) {
                          console.warn('Error rendering daily revenue bar:', error, dateKey);
                          return null;
                        }
                      });
                  })()}
                  {Object.keys(getAnalyticsData().dailyRevenue).length === 0 && (
                    <p className='no-data'>No revenue data available</p>
                  )}
                </div>
              </div>

              <div className='analytics-section'>
                <h3 className='section-title'>
                  <i className='fa-solid fa-list'></i> Top Orders by Amount
                </h3>
                <div className='top-orders-table'>
                  {orders.length > 0 ? (
                    <table className='analytics-table'>
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Date</th>
                          <th>Customer</th>
                          <th>Items</th>
                          <th>Amount</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...orders]
                          .sort((a, b) => (b.total || 0) - (a.total || 0))
                          .slice(0, 10)
                          .map((order) => (
                            <tr key={order.id}>
                              <td>#{order.id.toString().slice(-6)}</td>
                              <td>
                                {new Date(order.createdAt || order.date).toLocaleDateString()}
                              </td>
                              <td>{order.customerName || order.name}</td>
                              <td>{(order.items || []).length} items</td>
                              <td>
                                <strong>₹{formatCurrency(order.total || 0)}</strong>
                              </td>
                              <td>
                                <span
                                  className={`status-badge status-${order.status || 'pending'}`}
                                >
                                  {order.status || 'pending'}
                                </span>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className='no-data'>No orders available</p>
                  )}
                </div>
              </div>

              {/* Monthly Breakdown by Address */}
              <div className='analytics-section'>
                <h3 className='section-title'>
                  <i className='fa-solid fa-calendar-alt'></i> Monthly Breakdown by Address
                </h3>
                <div className='monthly-breakdown-table-container' style={{ overflowX: 'auto' }}>
                  <table className='analytics-table monthly-breakdown-table'>
                    <thead>
                      <tr>
                        <th>Delivery Address</th>
                        <th>01-Jan'25</th>
                        <th>02-Feb'25</th>
                        <th>03-Mar'25</th>
                        <th>04-Apr'25</th>
                        <th>05-May'25</th>
                        <th>06-Jun'25</th>
                        <th>07-Jul'25</th>
                        <th>08-Aug'25</th>
                        <th>09-Sep'25</th>
                        <th>10-Oct'25</th>
                        <th>11-Nov'25</th>
                        <th>12-Dec'25</th>
                        <th>
                          <strong>Grand Total</strong>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(getMonthlyBreakdownByAddress())
                        .sort((a, b) => b[1]['Grand Total'] - a[1]['Grand Total'])
                        .map(([address, data]) => (
                          <tr key={address}>
                            <td>
                              <strong>{address}</strong>
                            </td>
                            <td>{data['01-Jan'] ? `₹${formatCurrency(data['01-Jan'])}` : ''}</td>
                            <td>{data['02-Feb'] ? `₹${formatCurrency(data['02-Feb'])}` : ''}</td>
                            <td>{data['03-Mar'] ? `₹${formatCurrency(data['03-Mar'])}` : ''}</td>
                            <td>{data['04-Apr'] ? `₹${formatCurrency(data['04-Apr'])}` : ''}</td>
                            <td>{data['05-May'] ? `₹${formatCurrency(data['05-May'])}` : ''}</td>
                            <td>{data['06-Jun'] ? `₹${formatCurrency(data['06-Jun'])}` : ''}</td>
                            <td>{data['07-Jul'] ? `₹${formatCurrency(data['07-Jul'])}` : ''}</td>
                            <td>{data['08-Aug'] ? `₹${formatCurrency(data['08-Aug'])}` : ''}</td>
                            <td>{data['09-Sep'] ? `₹${formatCurrency(data['09-Sep'])}` : ''}</td>
                            <td>{data['10-Oct'] ? `₹${formatCurrency(data['10-Oct'])}` : ''}</td>
                            <td>{data['11-Nov'] ? `₹${formatCurrency(data['11-Nov'])}` : ''}</td>
                            <td>{data['12-Dec'] ? `₹${formatCurrency(data['12-Dec'])}` : ''}</td>
                            <td>
                              <strong>₹{formatCurrency(data['Grand Total'])}</strong>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Top 25 Addresses */}
              <div className='analytics-section'>
                <h3 className='section-title'>
                  <i className='fa-solid fa-trophy'></i> Top 25 Addresses
                </h3>
                <div className='top-addresses-table'>
                  <table className='analytics-table'>
                    <thead>
                      <tr>
                        <th>Rank</th>
                        <th>Delivery Address</th>
                        <th>Grand Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getTop25Addresses().map((item, index) => (
                        <tr key={item.address}>
                          <td>
                            <strong>#{index + 1}</strong>
                          </td>
                          <td>{item.address}</td>
                          <td>
                            <strong>₹{formatCurrency(item.total)}</strong>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Unpaid Amounts */}
              <div className='analytics-section'>
                <h3 className='section-title'>
                  <i className='fa-solid fa-exclamation-triangle'></i> Unpaid Amounts by Address
                </h3>
                <div className='unpaid-table'>
                  <table className='analytics-table'>
                    <thead>
                      <tr>
                        <th>Delivery Address</th>
                        <th>Unpaid</th>
                        <th>Grand Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getUnpaidByAddress().map((item) => (
                        <tr key={item.address}>
                          <td>{item.address}</td>
                          <td>
                            <strong style={{ color: 'var(--admin-danger)' }}>
                              ₹{formatCurrency(item.unpaid)}
                            </strong>
                          </td>
                          <td>₹{formatCurrency(item.grandTotal)}</td>
                        </tr>
                      ))}
                      {getUnpaidByAddress().length > 0 && (
                        <tr
                          className='grand-total-row'
                          style={{ borderTop: '2px solid var(--border-color)', fontWeight: 'bold' }}
                        >
                          <td>
                            <strong>Grand Total</strong>
                          </td>
                          <td>
                            <strong style={{ color: 'var(--admin-danger)' }}>
                              ₹
                              {formatCurrency(
                                getUnpaidByAddress().reduce((sum, item) => sum + item.unpaid, 0)
                              )}
                            </strong>
                          </td>
                          <td>
                            <strong>
                              ₹
                              {formatCurrency(
                                getUnpaidByAddress().reduce((sum, item) => sum + item.grandTotal, 0)
                              )}
                            </strong>
                          </td>
                        </tr>
                      )}
                      {getUnpaidByAddress().length === 0 && (
                        <tr>
                          <td
                            colSpan='3'
                            style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray)' }}
                          >
                            No unpaid orders
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Yearly Comparison */}
              <div className='analytics-section'>
                <h3 className='section-title'>
                  <i className='fa-solid fa-chart-line'></i> Yearly Comparison (2024 vs 2025)
                </h3>
                <div className='yearly-comparison-table'>
                  <table className='analytics-table'>
                    <thead>
                      <tr>
                        <th>Delivery Address</th>
                        <th>2024</th>
                        <th>2025</th>
                        <th>Grand Total</th>
                        <th>Trend</th>
                        <th>Gap</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getYearlyComparison().map((item) => (
                        <tr key={item.address}>
                          <td>{item.address}</td>
                          <td>{item['2024'] ? `₹${formatCurrency(item['2024'])}` : ''}</td>
                          <td>{item['2025'] ? `₹${formatCurrency(item['2025'])}` : ''}</td>
                          <td>
                            <strong>₹{formatCurrency(item.grandTotal)}</strong>
                          </td>
                          <td>
                            {item.trend === 'up' && (
                              <span className='trend-up' style={{ color: 'var(--admin-success)' }}>
                                <i className='fa-solid fa-arrow-up'></i>
                              </span>
                            )}
                            {item.trend === 'down' && (
                              <span className='trend-down' style={{ color: 'var(--admin-danger)' }}>
                                <i className='fa-solid fa-arrow-down'></i>
                              </span>
                            )}
                            {item.trend === 'same' && <span className='trend-same'>-</span>}
                          </td>
                          <td
                            style={{
                              color: item.gap >= 0 ? 'var(--admin-success)' : 'var(--admin-danger)',
                            }}
                          >
                            {item.gap >= 0 ? '+' : ''}₹{formatCurrency(item.gap)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className='admin-content'>
            <h2>Notifications & Announcements</h2>
            <button className='btn btn-primary' onClick={addNotification}>
              <i className='fa-solid fa-plus'></i> Add Notification
            </button>
            <div className='notifications-list'>
              {notifications.map((notif) => (
                <div key={notif.id} className='notification-card'>
                  <input
                    type='text'
                    value={notif.title}
                    onChange={(e) => {
                      const updated = notifications.map((n) =>
                        n.id === notif.id ? { ...n, title: e.target.value } : n
                      );
                      setNotifications(updated);
                    }}
                    placeholder='Notification Title'
                    className='notification-title'
                  />
                  <textarea
                    value={notif.message}
                    onChange={(e) => {
                      const updated = notifications.map((n) =>
                        n.id === notif.id ? { ...n, message: e.target.value } : n
                      );
                      setNotifications(updated);
                    }}
                    placeholder='Notification Message'
                    className='notification-message'
                    rows='3'
                  />
                  <div className='notification-actions'>
                    <label>
                      <input
                        type='checkbox'
                        checked={notif.active}
                        onChange={(e) => {
                          const updated = notifications.map((n) =>
                            n.id === notif.id ? { ...n, active: e.target.checked } : n
                          );
                          setNotifications(updated);
                        }}
                      />
                      Active
                    </label>
                    <button
                      className='btn btn-special danger btn-small'
                      onClick={() => {
                        setNotifications(notifications.filter((n) => n.id !== notif.id));
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button className='btn btn-primary' onClick={saveNotifications}>
              <i className='fa-solid fa-save'></i> Save Notifications
            </button>

            <div className='newsletter-section'>
              <h3>Newsletter Subscriptions</h3>
              <div className='newsletter-stats'>
                <span>Total Subscriptions: {newsletterSubscriptions.length}</span>
                <button
                  className='btn btn-ghost'
                  onClick={() => {
                    const csv = [
                      ['Email', 'Subscribed At'],
                      ...newsletterSubscriptions.map((sub) => [
                        sub.email,
                        new Date(sub.subscribedAt).toLocaleString(),
                      ]),
                    ]
                      .map((row) => row.join(','))
                      .join('\n');
                    const blob = new Blob([csv], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `newsletter-subscriptions-${new Date().toISOString().split('T')[0]}.csv`;
                    link.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  <i className='fa-solid fa-download'></i> Export CSV
                </button>
              </div>
              <div className='newsletter-list'>
                {newsletterSubscriptions.length === 0 ? (
                  <p className='no-data'>No newsletter subscriptions yet</p>
                ) : (
                  <table className='newsletter-table'>
                    <thead>
                      <tr>
                        <th>Email</th>
                        <th>Subscribed At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {newsletterSubscriptions
                        .sort((a, b) => new Date(b.subscribedAt) - new Date(a.subscribedAt))
                        .map((sub, idx) => (
                          <tr key={idx}>
                            <td>{sub.email}</td>
                            <td>{new Date(sub.subscribedAt).toLocaleString()}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Order Modal */}
        {showAddOrderModal && (
          <div
            className='modal-overlay'
            onClick={() => {
              setShowAddOrderModal(false);
              setEditingOrder(null);
            }}
          >
            <div className='modal-content' onClick={(e) => e.stopPropagation()}>
              <div className='modal-header'>
                <h2>{editingOrder ? 'Edit Order' : 'Add New Order'}</h2>
                <button
                  className='modal-close'
                  onClick={() => {
                    setShowAddOrderModal(false);
                    setEditingOrder(null);
                  }}
                >
                  <i className='fa-solid fa-times'></i>
                </button>
              </div>
              <div className='modal-body'>
                <div className='form-group'>
                  <label>Date (DD/MM/YYYY):</label>
                  <input
                    type='text'
                    value={editingOrder ? editingOrder.date : newOrder.date}
                    onChange={(e) =>
                      editingOrder
                        ? setEditingOrder({ ...editingOrder, date: e.target.value })
                        : handleNewOrderChange('date', e.target.value)
                    }
                    placeholder='01/01/2025'
                  />
                </div>
                <div className='form-group'>
                  <label>Delivery Address *:</label>
                  <input
                    type='text'
                    value={editingOrder ? editingOrder.deliveryAddress : newOrder.deliveryAddress}
                    onChange={(e) =>
                      editingOrder
                        ? setEditingOrder({ ...editingOrder, deliveryAddress: e.target.value })
                        : handleNewOrderChange('deliveryAddress', e.target.value)
                    }
                    placeholder='A1-407 Shriti'
                    required
                  />
                </div>
                <div className='form-row'>
                  <div className='form-group'>
                    <label>Qty.:</label>
                    <input
                      type='number'
                      value={editingOrder ? editingOrder.quantity : newOrder.quantity}
                      onChange={(e) =>
                        editingOrder
                          ? setEditingOrder({
                              ...editingOrder,
                              quantity: parseInt(e.target.value) || 1,
                            })
                          : handleNewOrderChange('quantity', e.target.value)
                      }
                      min='1'
                    />
                  </div>
                  <div className='form-group'>
                    <label>Unit Price (₹):</label>
                    <input
                      type='number'
                      value={editingOrder ? editingOrder.unitPrice : newOrder.unitPrice}
                      onChange={(e) =>
                        editingOrder
                          ? setEditingOrder({
                              ...editingOrder,
                              unitPrice: parseFloat(e.target.value) || 0,
                            })
                          : handleNewOrderChange('unitPrice', e.target.value)
                      }
                      min='0'
                      step='0.01'
                    />
                  </div>
                  <div className='form-group'>
                    <label>Total Amount (₹):</label>
                    <input
                      type='number'
                      value={
                        editingOrder
                          ? editingOrder.totalAmount || editingOrder.total
                          : newOrder.totalAmount
                      }
                      onChange={(e) =>
                        editingOrder
                          ? setEditingOrder({
                              ...editingOrder,
                              totalAmount: parseFloat(e.target.value) || 0,
                              total: parseFloat(e.target.value) || 0,
                            })
                          : handleNewOrderChange('totalAmount', e.target.value)
                      }
                      min='0'
                      step='0.01'
                    />
                  </div>
                </div>
                <div className='form-row'>
                  <div className='form-group'>
                    <label>Status:</label>
                    <select
                      value={editingOrder ? editingOrder.status : newOrder.status}
                      onChange={(e) =>
                        editingOrder
                          ? setEditingOrder({ ...editingOrder, status: e.target.value })
                          : handleNewOrderChange('status', e.target.value)
                      }
                    >
                      <option value='Paid'>Paid</option>
                      <option value='Pending'>Pending</option>
                      <option value='Unpaid'>Unpaid</option>
                      <option value='Delivered'>Delivered</option>
                    </select>
                  </div>
                  <div className='form-group'>
                    <label>Payment Mode:</label>
                    <select
                      value={editingOrder ? editingOrder.paymentMode : newOrder.paymentMode}
                      onChange={(e) =>
                        editingOrder
                          ? setEditingOrder({ ...editingOrder, paymentMode: e.target.value })
                          : handleNewOrderChange('paymentMode', e.target.value)
                      }
                    >
                      <option value='Online'>Online</option>
                      <option value='Cash'>Cash</option>
                      <option value='UPI'>UPI</option>
                      <option value='Card'>Card</option>
                    </select>
                  </div>
                </div>
                <div className='form-row'>
                  <div className='form-group'>
                    <label>Billing Month:</label>
                    <input
                      type='text'
                      value={editingOrder ? editingOrder.billingMonth : newOrder.billingMonth}
                      onChange={(e) =>
                        editingOrder
                          ? setEditingOrder({ ...editingOrder, billingMonth: e.target.value })
                          : handleNewOrderChange('billingMonth', e.target.value)
                      }
                      placeholder='January'
                    />
                  </div>
                  <div className='form-group'>
                    <label>Reference Month:</label>
                    <input
                      type='text'
                      value={editingOrder ? editingOrder.referenceMonth : newOrder.referenceMonth}
                      onChange={(e) =>
                        editingOrder
                          ? setEditingOrder({ ...editingOrder, referenceMonth: e.target.value })
                          : handleNewOrderChange('referenceMonth', e.target.value)
                      }
                      placeholder="01 - Jan'25"
                    />
                  </div>
                  <div className='form-group'>
                    <label>Elapsed Days:</label>
                    <input
                      type='number'
                      value={editingOrder ? editingOrder.elapsedDays : newOrder.elapsedDays}
                      onChange={(e) =>
                        editingOrder
                          ? setEditingOrder({ ...editingOrder, elapsedDays: e.target.value })
                          : handleNewOrderChange('elapsedDays', e.target.value)
                      }
                      min='0'
                    />
                  </div>
                </div>
              </div>
              <div className='modal-footer'>
                <button
                  className='btn btn-ghost'
                  onClick={() => {
                    setShowAddOrderModal(false);
                    setEditingOrder(null);
                  }}
                >
                  Cancel
                </button>
                <button className='btn btn-primary' onClick={handleSaveNewOrder}>
                  <i className='fa-solid fa-save'></i>{' '}
                  {editingOrder ? 'Update Order' : 'Save Order'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Offer Modal */}
        {showAddOfferModal && (
          <div
            className='modal-overlay'
            onClick={() => {
              setShowAddOfferModal(false);
              setEditingOffer(null);
            }}
          >
            <div
              className='modal-content'
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: '600px' }}
            >
              <div className='modal-header'>
                <h2>{editingOffer ? 'Edit Offer' : 'Add New Offer'}</h2>
                <button
                  className='modal-close'
                  onClick={() => {
                    setShowAddOfferModal(false);
                    setEditingOffer(null);
                  }}
                >
                  &times;
                </button>
              </div>
              <div className='modal-body'>
                <div className='form-group'>
                  <label>Title *</label>
                  <input
                    type='text'
                    value={newOffer.title}
                    onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })}
                    placeholder='e.g., Monthly Subscription Offer'
                  />
                </div>
                <div className='form-group'>
                  <label>Description *</label>
                  <textarea
                    value={newOffer.description}
                    onChange={(e) => setNewOffer({ ...newOffer, description: e.target.value })}
                    placeholder='Describe your offer...'
                    rows={3}
                  />
                </div>
                <div className='form-row'>
                  <div className='form-group'>
                    <label>Discount</label>
                    <input
                      type='text'
                      value={newOffer.discount}
                      onChange={(e) => setNewOffer({ ...newOffer, discount: e.target.value })}
                      placeholder='e.g., 7% OFF'
                    />
                  </div>
                  <div className='form-group'>
                    <label>Badge</label>
                    <input
                      type='text'
                      value={newOffer.badge}
                      onChange={(e) => setNewOffer({ ...newOffer, badge: e.target.value })}
                      placeholder='e.g., Limited Time'
                    />
                  </div>
                </div>
                <div className='form-row'>
                  <div className='form-group'>
                    <label>Start Date</label>
                    <input
                      type='date'
                      value={newOffer.startDate}
                      onChange={(e) => setNewOffer({ ...newOffer, startDate: e.target.value })}
                    />
                  </div>
                  <div className='form-group'>
                    <label>End Date</label>
                    <input
                      type='date'
                      value={newOffer.endDate}
                      onChange={(e) => setNewOffer({ ...newOffer, endDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className='form-group'>
                  <label>WhatsApp Message</label>
                  <input
                    type='text'
                    value={newOffer.whatsappMessage}
                    onChange={(e) => setNewOffer({ ...newOffer, whatsappMessage: e.target.value })}
                    placeholder='Message sent when user clicks "Get Deal"'
                  />
                </div>
                <div className='form-group'>
                  <label>CTA Button Text</label>
                  <input
                    type='text'
                    value={newOffer.ctaText}
                    onChange={(e) => setNewOffer({ ...newOffer, ctaText: e.target.value })}
                    placeholder='Get This Deal'
                  />
                </div>
                <div className='form-group'>
                  <label>
                    Terms & Conditions{' '}
                    <button
                      type='button'
                      className='btn btn-primary btn-small'
                      onClick={addTerm}
                      style={{ marginLeft: '0.5rem', padding: '0.25rem 0.5rem' }}
                    >
                      <i className='fa-solid fa-plus'></i> Add Term
                    </button>
                  </label>
                  {newOffer.terms.map((term, index) => (
                    <div
                      key={index}
                      style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}
                    >
                      <input
                        type='text'
                        value={term}
                        onChange={(e) => updateTerm(index, e.target.value)}
                        placeholder={`Term ${index + 1}`}
                        style={{ flex: 1 }}
                      />
                      <button
                        type='button'
                        className='btn btn-special danger btn-small'
                        onClick={() => removeTerm(index)}
                        style={{ padding: '0.25rem 0.5rem' }}
                      >
                        <i className='fa-solid fa-trash'></i>
                      </button>
                    </div>
                  ))}
                </div>
                <div className='form-group'>
                  <label>
                    <input
                      type='checkbox'
                      checked={newOffer.isActive}
                      onChange={(e) => setNewOffer({ ...newOffer, isActive: e.target.checked })}
                    />{' '}
                    Active (Show on website)
                  </label>
                </div>
              </div>
              <div className='modal-footer'>
                <button
                  className='btn btn-ghost'
                  onClick={() => {
                    setShowAddOfferModal(false);
                    setEditingOffer(null);
                  }}
                >
                  Cancel
                </button>
                <button className='btn btn-primary' onClick={handleSaveNewOffer}>
                  <i className='fa-solid fa-save'></i>{' '}
                  {editingOffer ? 'Update Offer' : 'Save Offer'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <NotificationSystem />
      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
        title='Confirm Logout'
        message='Are you sure you want to logout? You will need to login again to access the admin dashboard.'
        confirmText='Logout'
        cancelText='Cancel'
        type='warning'
      />
      <ConfirmModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={confirmReset}
        title='Reset Menu Data'
        message='Are you sure you want to reset all menu data to defaults? This action cannot be undone.'
        confirmText='Reset'
        cancelText='Cancel'
        type='danger'
      />
      <ConfirmModal
        isOpen={showDeleteOrderModal}
        onClose={() => {
          setShowDeleteOrderModal(false);
          setOrderToDelete(null);
        }}
        onConfirm={confirmDeleteOrder}
        title='Delete Order'
        message='Are you sure you want to delete this order? This action cannot be undone.'
        confirmText='Delete'
        cancelText='Cancel'
        type='danger'
      />
      <ConfirmModal
        isOpen={showRemoveItemModal}
        onClose={() => {
          setShowRemoveItemModal(false);
          setItemToRemove(null);
        }}
        onConfirm={confirmRemoveItem}
        title='Remove Item'
        message='Are you sure you want to remove this item from the menu?'
        confirmText='Remove'
        cancelText='Cancel'
        type='warning'
      />
    </div>
  );
};

export default AdminDashboard;
