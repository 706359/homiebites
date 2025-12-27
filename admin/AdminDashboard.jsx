import { useEffect, useState } from 'react';
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
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showDeleteOrderModal, setShowDeleteOrderModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
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

  useEffect(() => {
    // Wrap all async operations to prevent unhandled promise rejections
    const loadAllData = async () => {
      try {
        await Promise.allSettled([loadMenuData(), loadOffersData(), loadOrders(), loadUsers()]);
        // These are synchronous, safe to call
        loadSettings();
        loadNotifications();
        loadNewsletterSubscriptions();
        loadCurrentUser();
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        // Still try to load sync data
        loadSettings();
        loadNotifications();
        loadNewsletterSubscriptions();
        loadCurrentUser();
      }
    };

    loadAllData();
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

  const getTotalRevenue = (ordersList = orders) => {
    return ordersList.reduce((total, order) => {
      if (order.status === 'delivered') {
        return total + (order.total || 0);
      }
      return total;
    }, 0);
  };

  const getPendingOrders = () => {
    return orders.filter((o) => ['pending', 'confirmed', 'preparing'].includes(o.status)).length;
  };

  const getFilteredOrdersByDate = (ordersList) => {
    if (dateRange === 'all') return ordersList;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return ordersList.filter((order) => {
      const orderDate = new Date(order.createdAt || order.date || Date.now());
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
          orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear()
        );
      }

      if (dateRange === 'custom' && customStartDate && customEndDate) {
        const start = new Date(customStartDate);
        const end = new Date(customEndDate);
        end.setHours(23, 59, 59, 999);
        return orderDate >= start && orderDate <= end;
      }

      return true;
    });
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
      revenue: todayOrders
        .filter((o) => o.status === 'delivered')
        .reduce((sum, o) => sum + (o.total || 0), 0),
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
    const revenue = deliveredWeekOrders.reduce((sum, o) => sum + (o.total || 0), 0);

    return {
      orders: weekOrders.length,
      revenue: revenue,
      avgOrderValue:
        deliveredWeekOrders.length > 0 ? Math.round(revenue / deliveredWeekOrders.length) : 0,
    };
  };

  const handleImportOrders = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        if (Array.isArray(importedData)) {
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
                showNotification(
                  `Successfully imported ${importedCount} orders to API!`,
                  'success'
                );
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
        } else {
          showNotification(
            'Invalid file format. Please upload a valid JSON array of orders.',
            'error'
          );
        }
      } catch (error) {
        showNotification('Error reading file: ' + error.message, 'error');
      }
    };
    reader.readAsText(file);
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
    let filtered = [...orders];

    // Filter by status
    if (orderFilter !== 'all') {
      filtered = filtered.filter((o) => o.status === orderFilter);
    }

    // Filter by date range
    filtered = getFilteredOrdersByDate(filtered);

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (o) =>
          (o.customerName || o.name || '').toLowerCase().includes(query) ||
          (o.customerPhone || o.phone || '').includes(query) ||
          (o.id || '').toString().includes(query) ||
          (o.customerAddress || o.address || '').toLowerCase().includes(query)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt || a.date || 0);
      const dateB = new Date(b.createdAt || b.date || 0);

      if (orderSort === 'newest') return dateB - dateA;
      if (orderSort === 'oldest') return dateA - dateB;
      if (orderSort === 'amount') return (b.total || 0) - (a.total || 0);
      return 0;
    });

    return filtered;
  };

  const getOrderTrends = () => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const dayOrders = orders.filter((o) => {
        const orderDate = new Date(o.createdAt || o.date || Date.now());
        orderDate.setHours(0, 0, 0, 0);
        return orderDate.getTime() === date.getTime();
      });

      last7Days.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        orders: dayOrders.length,
        revenue: dayOrders
          .filter((o) => o.status === 'delivered')
          .reduce((sum, o) => sum + (o.total || 0), 0),
      });
    }
    return last7Days;
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
    const monthlyData = {};
    const statusCounts = {};
    const dailyRevenue = {};

    orders.forEach((order) => {
      const orderDate = new Date(order.createdAt || order.date || Date.now());
      const monthKey = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}`;
      const dayKey = orderDate.toISOString().split('T')[0];
      const status = order.status || 'pending';

      // Monthly data
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { orders: 0, revenue: 0 };
      }
      monthlyData[monthKey].orders++;
      if (status === 'delivered') {
        monthlyData[monthKey].revenue += order.total || 0;
      }

      // Status counts
      statusCounts[status] = (statusCounts[status] || 0) + 1;

      // Daily revenue
      if (status === 'delivered') {
        if (!dailyRevenue[dayKey]) {
          dailyRevenue[dayKey] = 0;
        }
        dailyRevenue[dayKey] += order.total || 0;
      }
    });

    return { monthlyData, statusCounts, dailyRevenue };
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
              <h3>₹{getTotalRevenue().toLocaleString()}</h3>
              <p>Total Revenue</p>
              <span className='stat-change positive'>
                <i className='fa-solid fa-arrow-up'></i> ₹{getTodayStats().revenue.toLocaleString()}{' '}
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
                    <span className='stat-value'>₹{getTodayStats().revenue.toLocaleString()}</span>
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
                    <span className='stat-value'>₹{getWeeklyStats().revenue.toLocaleString()}</span>
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
                          <span>₹{order.total || 0}</span>
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
                          <span className='item-preview-price'>₹{item.price || 0}</span>
                          <button
                            className='btn-remove'
                            onClick={() => removeItem(category.id, item.id)}
                            title='Remove item'
                          >
                            <i className='fa-solid fa-trash'></i>
                          </button>
                        </div>
                      </div>
                    ))}
                    <button className='btn-add-item' onClick={() => addItem(category.id)}>
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
                        <button className='btn-edit' onClick={() => handleEditOffer(offer)}>
                          <i className='fa-solid fa-edit'></i> Edit
                        </button>
                        <button className='btn-delete' onClick={() => handleDeleteOffer(offer.id)}>
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
                <label className='btn btn-ghost import-btn'>
                  <i className='fa-solid fa-upload'></i> Import Orders
                  <input
                    type='file'
                    accept='.json'
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

            {getFilteredOrders().length > 0 && (
              <div className='orders-summary'>
                <span>Showing {getFilteredOrders().length} orders</span>
                <span>Total: ₹{getTotalRevenue(getFilteredOrders()).toLocaleString()}</span>
              </div>
            )}

            <div className='orders-table-container'>
              {getFilteredOrders().length === 0 ? (
                <p className='no-data'>No orders found</p>
              ) : (
                <table className='orders-table'>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Date & Time</th>
                      <th>Customer</th>
                      <th>Phone</th>
                      <th>Items</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getFilteredOrders().map((order) => (
                      <tr key={order.id}>
                        <td className='order-id-cell'>
                          <strong>#{order.id.toString().slice(-6)}</strong>
                        </td>
                        <td className='order-date-cell'>
                          {new Date(order.createdAt || order.date).toLocaleString()}
                        </td>
                        <td className='order-customer-cell'>
                          {order.customerName || order.name || 'N/A'}
                        </td>
                        <td className='order-phone-cell'>
                          {order.customerPhone || order.phone || 'N/A'}
                        </td>
                        <td className='order-items-cell'>
                          <div className='items-preview'>
                            {(order.items || []).slice(0, 2).map((item, idx) => (
                              <span key={idx} className='item-badge'>
                                {item.name} x{item.quantity}
                              </span>
                            ))}
                            {(order.items || []).length > 2 && (
                              <span className='more-items'>
                                +{(order.items || []).length - 2} more
                              </span>
                            )}
                          </div>
                        </td>
                        <td className='order-amount-cell'>
                          <strong>₹{order.total || 0}</strong>
                        </td>
                        <td className='order-status-cell'>
                          <select
                            value={order.status || 'pending'}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className={`status-select status-${order.status || 'pending'}`}
                          >
                            {orderStatuses.map((status) => (
                              <option key={status} value={status}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className='order-actions-cell'>
                          <div className='order-actions-group'>
                            <button
                              className='btn-view-details'
                              onClick={() => {
                                const details = `Order ID: ${order.id} | Date: ${new Date(order.createdAt || order.date).toLocaleString()} | Customer: ${order.customerName || order.name} | Total: ₹${order.total} | Status: ${order.status || 'pending'}`;
                                showNotification(details, 'info', 8000);
                              }}
                              title='View Details'
                            >
                              <i className='fa-solid fa-eye'></i>
                            </button>
                            <button
                              className='btn-edit-order'
                              onClick={() => handleEditOrder(order)}
                              title='Edit Order'
                            >
                              <i className='fa-solid fa-edit'></i>
                            </button>
                            <button
                              className='btn-delete-order'
                              onClick={() => handleDeleteOrder(order.id)}
                              title='Delete Order'
                            >
                              <i className='fa-solid fa-trash'></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan='5' className='table-footer'>
                        <strong>Total: {getFilteredOrders().length} orders</strong>
                      </td>
                      <td colSpan='3' className='table-footer-amount'>
                        <strong>
                          Total Amount: ₹
                          {getFilteredOrders().reduce((sum, o) => sum + (o.total || 0), 0)}
                        </strong>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              )}
            </div>
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
                                    Order #{order.id.toString().slice(-6)} - ₹{order.total || 0} -{' '}
                                    {order.status || 'pending'} -{' '}
                                    {new Date(order.createdAt || order.date).toLocaleDateString()}
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
                    <p className='analytics-value'>₹{getTotalRevenue().toLocaleString()}</p>
                    <span className='analytics-label'>From delivered orders</span>
                    <div className='analytics-trend'>
                      <span className='trend-up'>
                        <i className='fa-solid fa-arrow-up'></i> ₹
                        {getWeeklyStats().revenue.toLocaleString()} this week
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
                        <span className='revenue-value'>₹{day.revenue}</span>
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
                  <i className='fa-solid fa-calendar-alt'></i> Monthly Revenue
                </h3>
                <div className='monthly-revenue-table'>
                  {Object.keys(getAnalyticsData().monthlyData).length > 0 ? (
                    <table className='analytics-table'>
                      <thead>
                        <tr>
                          <th>Month</th>
                          <th>Orders</th>
                          <th>Revenue</th>
                          <th>Average</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(getAnalyticsData().monthlyData)
                          .sort((a, b) => b[0].localeCompare(a[0]))
                          .slice(0, 12)
                          .map(([month, data]) => (
                            <tr key={month}>
                              <td>
                                {new Date(month + '-01').toLocaleDateString('en-US', {
                                  month: 'long',
                                  year: 'numeric',
                                })}
                              </td>
                              <td>{data.orders}</td>
                              <td>
                                <strong>₹{data.revenue.toLocaleString()}</strong>
                              </td>
                              <td>
                                ₹{data.orders > 0 ? Math.round(data.revenue / data.orders) : 0}
                              </td>
                            </tr>
                          ))}
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
                      .map(([day, revenue]) => (
                        <div key={day} className='daily-bar'>
                          <div className='bar-label'>
                            {new Date(day).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
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
                              <span className='bar-value'>₹{revenue}</span>
                            </div>
                          </div>
                        </div>
                      ));
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
                                <strong>₹{order.total || 0}</strong>
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
                            <td>{data['01-Jan'] ? `₹${data['01-Jan'].toLocaleString()}` : ''}</td>
                            <td>{data['02-Feb'] ? `₹${data['02-Feb'].toLocaleString()}` : ''}</td>
                            <td>{data['03-Mar'] ? `₹${data['03-Mar'].toLocaleString()}` : ''}</td>
                            <td>{data['04-Apr'] ? `₹${data['04-Apr'].toLocaleString()}` : ''}</td>
                            <td>{data['05-May'] ? `₹${data['05-May'].toLocaleString()}` : ''}</td>
                            <td>{data['06-Jun'] ? `₹${data['06-Jun'].toLocaleString()}` : ''}</td>
                            <td>{data['07-Jul'] ? `₹${data['07-Jul'].toLocaleString()}` : ''}</td>
                            <td>{data['08-Aug'] ? `₹${data['08-Aug'].toLocaleString()}` : ''}</td>
                            <td>{data['09-Sep'] ? `₹${data['09-Sep'].toLocaleString()}` : ''}</td>
                            <td>{data['10-Oct'] ? `₹${data['10-Oct'].toLocaleString()}` : ''}</td>
                            <td>{data['11-Nov'] ? `₹${data['11-Nov'].toLocaleString()}` : ''}</td>
                            <td>{data['12-Dec'] ? `₹${data['12-Dec'].toLocaleString()}` : ''}</td>
                            <td>
                              <strong>₹{data['Grand Total'].toLocaleString()}</strong>
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
                            <strong>₹{item.total.toLocaleString()}</strong>
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
                              ₹{item.unpaid.toLocaleString()}
                            </strong>
                          </td>
                          <td>₹{item.grandTotal.toLocaleString()}</td>
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
                              {getUnpaidByAddress()
                                .reduce((sum, item) => sum + item.unpaid, 0)
                                .toLocaleString()}
                            </strong>
                          </td>
                          <td>
                            <strong>
                              ₹
                              {getUnpaidByAddress()
                                .reduce((sum, item) => sum + item.grandTotal, 0)
                                .toLocaleString()}
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
                          <td>{item['2024'] ? `₹${item['2024'].toLocaleString()}` : ''}</td>
                          <td>{item['2025'] ? `₹${item['2025'].toLocaleString()}` : ''}</td>
                          <td>
                            <strong>₹{item.grandTotal.toLocaleString()}</strong>
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
                            {item.gap >= 0 ? '+' : ''}₹{item.gap.toLocaleString()}
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
                      className='btn-small btn-danger'
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
                      className='btn btn-small'
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
                        className='btn btn-small'
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
