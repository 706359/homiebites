import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import errorTracker from '../shared/utils/errorTracker.js';
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
import { useAdminData } from './hooks/useAdminData.js';
import { createMenuFromList } from './utils/updateMenuFromList.js';

// Import utilities
import {
  getFilteredOrdersByDate,
  getPendingOrders,
  getTodayStats,
  getWeeklyStats,
} from './utils/calculations.js';
import { convertExcelToOrders } from './utils/excelUtils.js';
import {
  calculateTotalAmount,
  ensureAllOrdersHaveUniqueIds,
  extractBillingMonth,
  extractBillingYear,
  findOrderByKey,
  formatBillingMonth,
  formatReferenceMonth,
  getLastUnitPriceForAddress,
  getUniqueAddresses,
} from './utils/orderUtils.js';

// Import tab components
import AllAddressesTab from './components/AllAddressesTab.jsx';
import AllOrdersDataTab from './components/AllOrdersDataTab.jsx';
import AnalyticsTab from './components/AnalyticsTab.jsx';
import CurrentMonthOrdersTab from './components/CurrentMonthOrdersTab.jsx';
import DashboardTab from './components/DashboardTab.jsx';
import MenuTab from './components/MenuTab.jsx';
import NotificationsTab from './components/NotificationsTab.jsx';
import OffersTab from './components/OffersTab.jsx';
import OrderModal from './components/OrderModal.jsx';
import PendingAmountsTab from './components/PendingAmountsTab.jsx';
import SettingsTab from './components/SettingsTab.jsx';
import Sidebar from './components/Sidebar.jsx';
import SummaryTab from './components/SummaryTab.jsx';

import './styles/index.css';

// Helper: format date as DD-MMM-YYYY (e.g., 31-Dec-2025)
const formatDateDDMMM = (input) => {
  if (!input) return '';
  const d = new Date(input);
  if (isNaN(d.getTime())) return String(input);
  const day = String(d.getDate()).padStart(2, '0');
  const months = [
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
  return `${day}-${months[d.getMonth()]}-${d.getFullYear()}`;
};

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
    type: 'Flat', // 'Flat' or 'Percentage'
    value: 0, // Numeric value
    description: '',
    discount: '', // Legacy field for display
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
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  const [dateRange, setDateRange] = useState('all'); // all, today, week, month, custom
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [showAddOrderModal, setShowAddOrderModal] = useState(false);
  const autoOpenAddOrderRef = useRef(false);
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
  // Master Orders Model: Only store source fields, derive the rest
  const [newOrder, setNewOrder] = useState({
    date: new Date().toISOString().split('T')[0], // ISO format: YYYY-MM-DD
    deliveryAddress: '',
    quantity: 1,
    unitPrice: 0,
    status: 'Unpaid',
    paymentMode: '',
    source: 'manual', // 'excel' or 'manual'
  });
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // For mobile overlay
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // For desktop collapse
  const [currentUser, setCurrentUser] = useState(null);
  // Excel Viewer state
  const [excelData, setExcelData] = useState(null);
  const [excelFileName, setExcelFileName] = useState('');
  const [selectedSheet, setSelectedSheet] = useState('');
  const [excelSheets, setExcelSheets] = useState([]);
  const [editingCell, setEditingCell] = useState(null); // {row: number, col: number}
  const [showAddRowModal, setShowAddRowModal] = useState(false);
  const [newRowData, setNewRowData] = useState({});
  const [columnTypes, setColumnTypes] = useState({}); // {sheetName: {colIdx: 'date'|'number'|'text'}}
  // Filters for All Orders Data tab
  const [allOrdersFilterMonth, setAllOrdersFilterMonth] = useState('');
  const [allOrdersFilterAddress, setAllOrdersFilterAddress] = useState('');
  const [allOrdersFilterPaymentStatus, setAllOrdersFilterPaymentStatus] = useState('');

  // Debounce search query for performance (300ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

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
    debouncedSearchQuery,
    orderSort,
    customerSearchQuery,
    customerSort,
  ]);
  // Use centralized `useAdminData` hook for loading and storing dashboard data
  const adminData = useAdminData();

  // Extract hook functions and data FIRST before using them
  const {
    menuData: menuDataHook,
    setMenuData: setMenuDataHook,
    offersData: offersDataHook,
    setOffersData: setOffersDataHook,
    orders: ordersHook,
    setOrders: setOrdersHook,
    users: usersHook,
    setUsers: setUsersHook,
    newsletterSubscriptions: newsletterSubsHook,
    setNewsletterSubscriptions: setNewsletterSubscriptionsHook,
    settings: settingsHook,
    setSettings: setSettingsHook,
    notifications: notificationsHook,
    setNotifications: setNotificationsHook,
    currentUser: currentUserHook,
    setCurrentUser: setCurrentUserHook,
    loadMenuData: hookLoadMenuData,
    loadOffersData: hookLoadOffersData,
    loadOrders: hookLoadOrders,
    loadUsers: hookLoadUsers,
    loadSettings: hookLoadSettings,
    loadNotifications: hookLoadNotifications,
    loadNewsletterSubscriptions: hookLoadNewsletterSubscriptions,
    loadCurrentUser: hookLoadCurrentUser,
    loading: loadingHook,
  } = adminData;

  // Load orders from backend on mount using hook's loadOrders
  useEffect(() => {
    const token = localStorage.getItem('homiebites_token');
    if (token && hookLoadOrders) {
      // Use hook's loadOrders which will sync to both hook and local state
      // This will be called by useAdminData on mount, but we ensure it's called here too
      hookLoadOrders().catch((err) => {
        console.error('Error loading orders on mount:', err);
      });
    }
  }, [hookLoadOrders]); // Include hookLoadOrders in deps

  // Sync hook-provided data into local component state
  // Use ordersHook directly if available (even if empty array), otherwise use local orders state
  const displayOrders = Array.isArray(ordersHook) ? ordersHook : orders;

  useEffect(() => {
    try {
      if (Array.isArray(menuDataHook)) setMenuData(menuDataHook);
      if (Array.isArray(offersDataHook)) setOffersData(offersDataHook);
      // Sync orders from hook to local state
      if (Array.isArray(ordersHook)) {
        const ordersWithIds = ensureAllOrdersHaveUniqueIds(ordersHook);
        setOrders(ordersWithIds);
        lastSyncedOrdersRef.current = ordersWithIds;
      }
      if (Array.isArray(usersHook)) setUsers(usersHook);
      if (Array.isArray(newsletterSubsHook)) setNewsletterSubscriptions(newsletterSubsHook);
      if (settingsHook && typeof settingsHook === 'object') setSettings(settingsHook);
      if (Array.isArray(notificationsHook)) setNotifications(notificationsHook);
      if (currentUserHook) setCurrentUser(currentUserHook);
    } catch (e) {
      console.error('Error syncing admin hook data:', e);
    }
  }, [
    menuDataHook,
    offersDataHook,
    ordersHook,
    usersHook,
    newsletterSubsHook,
    settingsHook,
    notificationsHook,
    currentUserHook,
  ]);

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

  // Convert Excel data to orders format (use Excel as source of truth)
  // Using utility function from utils/excelUtils.js with MASTER ORDERS MODEL
  // Use ordersRef to avoid dependency on orders state (prevents infinite loops)
  const convertExcelToOrdersWrapper = useCallback((excelDataObj, sheetName = null) => {
    try {
      if (!excelDataObj || typeof excelDataObj !== 'object') {
        console.warn('Invalid excelDataObj passed to convertExcelToOrdersWrapper');
        return [];
      }
      const existingOrders = ordersRef.current || [];
      if (!Array.isArray(existingOrders)) {
        console.warn('ordersRef.current is not an array, using empty array');
        return convertExcelToOrders(excelDataObj, sheetName, []);
      }
      return convertExcelToOrders(excelDataObj, sheetName, existingOrders);
    } catch (error) {
      console.error('Error in convertExcelToOrdersWrapper:', error);
      return [];
    }
  }, []); // Empty deps - uses ref instead

  // Clear all orders from backend and localStorage
  const clearAllOrders = useCallback(async () => {
    const clearOpId = errorTracker.addToQueue('clear-all-orders', 'Clear All Orders', {
      source: 'admin_dashboard',
    });

    try {
      showNotification('Starting to clear all orders...', 'info');

      // Clear from state
      setOrders([]);
      // Orders are stored in backend only, not localStorage
      lastSyncedOrdersRef.current = []; // Update ref

      // Try to delete all orders from backend
      const token = localStorage.getItem('homiebites_token');
      if (token) {
        try {
          // Get all orders first (with no filters to get everything)
          showNotification('Fetching orders from backend...', 'info');
          const response = await api.getAllOrders({});

          if (response.success && response.data && Array.isArray(response.data)) {
            const ordersToDelete = response.data;
            const totalOrders = ordersToDelete.length;

            if (totalOrders === 0) {
              showNotification('No orders found in backend', 'info');
              errorTracker.completeOperation(clearOpId, { deletedCount: 0 });
              return;
            }

            showNotification(`Deleting ${totalOrders} orders from backend...`, 'info');

            // Delete orders in batches to avoid overwhelming the server
            const batchSize = 10;
            let deletedCount = 0;
            let failedCount = 0;

            for (let i = 0; i < ordersToDelete.length; i += batchSize) {
              const batch = ordersToDelete.slice(i, i + batchSize);
              const batchPromises = batch.map((order) => {
                const orderId = order.orderId || order.id || order._id;
                if (!orderId) {
                  console.warn('Order missing ID:', order);
                  return Promise.resolve({ success: false, skipped: true });
                }

                return api
                  .deleteOrder(orderId)
                  .then(() => {
                    deletedCount++;
                    return { success: true, orderId };
                  })
                  .catch((err) => {
                    failedCount++;
                    console.warn(`Failed to delete order ${orderId}:`, err);
                    errorTracker.captureError({
                      type: 'order_delete_failed',
                      orderId,
                      error: err,
                    });
                    return { success: false, orderId, error: err };
                  });
              });

              await Promise.allSettled(batchPromises);

              // Show progress
              if (i + batchSize < totalOrders) {
                showNotification(
                  `Deleting orders... ${Math.min(i + batchSize, totalOrders)}/${totalOrders}`,
                  'info'
                );
              }
            }

            errorTracker.completeOperation(clearOpId, {
              deletedCount,
              failedCount,
              totalOrders,
            });

            if (failedCount > 0) {
              showNotification(
                `Cleared ${deletedCount} orders. ${failedCount} failed to delete.`,
                'warning'
              );
            } else {
              showNotification(
                `Successfully deleted all ${deletedCount} orders from backend!`,
                'success'
              );
            }
          } else {
            showNotification('No orders found in backend response', 'info');
            errorTracker.completeOperation(clearOpId, { deletedCount: 0 });
          }
        } catch (apiError) {
          errorTracker.failOperation(clearOpId, apiError);
          console.error('Failed to delete orders from backend:', apiError);
          showNotification(
            'Failed to delete orders from backend: ' +
              (apiError.message || 'Unknown error') +
              '. Local data cleared.',
            'warning'
          );
          // Continue anyway - localStorage is cleared
        }
      } else {
        showNotification('No authentication token. Cleared local orders only.', 'warning');
        errorTracker.completeOperation(clearOpId, { localOnly: true });
      }
    } catch (error) {
      errorTracker.failOperation(clearOpId, error);
      console.error('Error clearing orders:', error);
      showNotification('Error clearing orders: ' + error.message, 'error');
    }
  }, []);

  // Load saved Excel file data (persist across refreshes)
  const loadExcelFileData = useCallback(() => {
    try {
      const savedExcelData = localStorage.getItem('homiebites_excel_data');
      const savedFileName = localStorage.getItem('homiebites_excel_filename');
      const savedSheets = localStorage.getItem('homiebites_excel_sheets');
      const savedSelectedSheet = localStorage.getItem('homiebites_excel_selected_sheet');
      const savedColumnTypes = localStorage.getItem('homiebites_excel_column_types');

      if (savedExcelData && savedFileName) {
        try {
          const parsedData = JSON.parse(savedExcelData);
          const parsedSheets = savedSheets ? JSON.parse(savedSheets) : [];
          const parsedColumnTypes = savedColumnTypes ? JSON.parse(savedColumnTypes) : {};

          setExcelData(parsedData);
          setExcelFileName(savedFileName);

          if (parsedSheets.length > 0) {
            setExcelSheets(parsedSheets);
            if (savedSelectedSheet && parsedSheets.includes(savedSelectedSheet)) {
              setSelectedSheet(savedSelectedSheet);
            } else {
              setSelectedSheet(parsedSheets[0]);
            }
          }

          if (Object.keys(parsedColumnTypes).length > 0) {
            setColumnTypes(parsedColumnTypes);
          }

          // Note: Excel data is only for viewing/editing, not for syncing to orders
          // Orders are loaded from backend only
          // Excel upload is handled separately in handleLoadExcelFile
        } catch (parseError) {
          console.error('Error parsing saved Excel data:', parseError);
          // Clear corrupted data
          localStorage.removeItem('homiebites_excel_data');
          localStorage.removeItem('homiebites_excel_filename');
          localStorage.removeItem('homiebites_excel_sheets');
          localStorage.removeItem('homiebites_excel_selected_sheet');
          localStorage.removeItem('homiebites_excel_column_types');
        }
      }
    } catch (error) {
      console.error('Error loading Excel file data:', error);
    }
  }, [convertExcelToOrdersWrapper]);

  // Auto-sync Excel data to orders (Excel is source of truth)
  // Use refs to prevent infinite loops and debounce sync operations
  const syncTimeoutRef = useRef(null);
  const isSyncingRef = useRef(false);
  const lastSyncedDataRef = useRef(null);
  const syncOpIdRef = useRef(null);
  const lastSyncedOrdersRef = useRef(null); // Track last synced orders to prevent loops
  const ordersRef = useRef(orders); // Keep ref in sync with orders state

  // Keep ordersRef in sync with orders state
  useEffect(() => {
    ordersRef.current = orders;
  }, [orders]);

  useEffect(() => {
    // Clear any pending sync
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    // Skip if already syncing or no Excel data
    if (!excelData || typeof excelData !== 'object' || !excelFileName || isSyncingRef.current) {
      return;
    }

    // Validate excelData structure
    try {
      const sheetKeys = Object.keys(excelData);
      if (sheetKeys.length === 0) {
        return; // No sheets to process
      }
    } catch (validationError) {
      console.error('Invalid excelData structure:', validationError);
      return;
    }

    // Prevent syncing the same data multiple times
    // Use a lightweight hash instead of full JSON.stringify for large data
    let dataKey;
    try {
      // Create a simple hash from data length and first/last sheet names
      const sheetNames = Object.keys(excelData || {});
      const firstSheet = sheetNames[0] || '';
      const lastSheet = sheetNames[sheetNames.length - 1] || '';
      const totalRows = sheetNames.reduce((sum, name) => {
        const sheet = excelData[name];
        return sum + (Array.isArray(sheet) ? sheet.length : 0);
      }, 0);
      dataKey = `${excelFileName}-${sheetNames.length}-${totalRows}-${firstSheet}-${lastSheet}`;
    } catch (keyError) {
      console.warn('Error creating data key, using fallback:', keyError);
      dataKey = `${excelFileName}-${Date.now()}`;
    }

    if (lastSyncedDataRef.current === dataKey) {
      return;
    }

    // Debounce sync to prevent excessive updates (500ms delay)
    syncTimeoutRef.current = setTimeout(() => {
      // Prevent sync if already syncing
      if (isSyncingRef.current) {
        console.warn('Sync already in progress, skipping...');
        return;
      }

      const syncOpId = errorTracker.addToQueue('sync-excel-to-orders', 'Sync Excel to Orders', {
        fileName: excelFileName,
        sheetCount: Object.keys(excelData).length,
      });
      syncOpIdRef.current = syncOpId;

      try {
        // Double-check sync lock before proceeding
        if (isSyncingRef.current) {
          console.warn('Sync already in progress (double-check), skipping...');
          return;
        }

        isSyncingRef.current = true;
        // Use wrapper which captures latest orders state
        try {
          const convertedOrders = convertExcelToOrdersWrapper(excelData, null);

          // Validate converted orders before proceeding
          if (!convertedOrders) {
            console.warn('convertExcelToOrdersWrapper returned null/undefined');
            errorTracker.failOperation(syncOpId, new Error('Conversion returned null'));
            return;
          }

          if (!Array.isArray(convertedOrders)) {
            console.warn('convertExcelToOrdersWrapper returned non-array:', typeof convertedOrders);
            errorTracker.failOperation(syncOpId, new Error('Conversion returned non-array'));
            return;
          }

          if (convertedOrders.length > 0) {
            // Prevent infinite loop: only update if orders actually changed
            // Compare with last synced orders from ref (avoids dependency on orders state)
            const lastSynced = lastSyncedOrdersRef.current || [];
            const currentCount = lastSynced.length;
            const newCount = convertedOrders.length;

            // Quick comparison: if counts differ, definitely changed
            // If counts same, compare first and last IDs
            let hasChanged = currentCount !== newCount;

            if (!hasChanged && currentCount > 0) {
              try {
                const currentFirstId = lastSynced[0]?.id || '';
                const newFirstId = convertedOrders[0]?.id || '';
                const currentLastId = lastSynced[currentCount - 1]?.id || '';
                const newLastId = convertedOrders[newCount - 1]?.id || '';
                hasChanged = currentFirstId !== newFirstId || currentLastId !== newLastId;
              } catch (compareError) {
                console.warn('Error comparing orders:', compareError);
                // If comparison fails, assume changed to be safe
                hasChanged = true;
              }
            }

            if (hasChanged) {
              try {
                // Limit orders array size to prevent memory issues (max 50,000 orders)
                const maxOrders = 50000;
                const ordersToSet =
                  convertedOrders.length > maxOrders
                    ? convertedOrders.slice(0, maxOrders)
                    : convertedOrders;

                if (convertedOrders.length > maxOrders) {
                  console.warn(
                    `Orders array truncated from ${convertedOrders.length} to ${maxOrders} to prevent memory issues`
                  );
                }

                setOrders(ordersToSet);
                try {
                  setOrdersHook && setOrdersHook(ordersToSet);
                } catch (e) {}
                // Orders are loaded from backend only, not synced from Excel
                // Excel sync is disabled - use Excel upload feature instead
                lastSyncedDataRef.current = dataKey;
                lastSyncedOrdersRef.current = ordersToSet; // Update ref to prevent loops
                errorTracker.completeOperation(syncOpId, { orderCount: ordersToSet.length });
              } catch (updateError) {
                console.error('Error updating orders state:', updateError);
                errorTracker.failOperation(syncOpId, updateError);
              }
            } else {
              // Orders haven't changed, just update the sync ref
              lastSyncedDataRef.current = dataKey;
              errorTracker.completeOperation(syncOpId, {
                orderCount: convertedOrders.length,
                note: 'No changes detected',
              });
            }
          }
        } catch (conversionError) {
          console.error('Error converting Excel to orders:', conversionError);
          errorTracker.failOperation(syncOpId, conversionError);
          // Don't re-throw - let outer catch handle it gracefully
        }
      } catch (error) {
        errorTracker.failOperation(syncOpId, error);
        console.error('Error syncing Excel data to orders:', error);
        // Don't update lastSyncedDataRef on error so it can retry
      } finally {
        isSyncingRef.current = false;
        syncOpIdRef.current = null;
      }
    }, 500);

    // Cleanup timeout on unmount or dependency change
    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
      if (syncOpIdRef.current) {
        errorTracker.failOperation(syncOpIdRef.current, new Error('Sync cancelled'));
        syncOpIdRef.current = null;
      }
    };
  }, [excelData, excelFileName, convertExcelToOrdersWrapper]);

  // Save Excel file data to localStorage (auto-save on changes)
  useEffect(() => {
    if (excelData && excelFileName) {
      try {
        localStorage.setItem('homiebites_excel_data', JSON.stringify(excelData));
        localStorage.setItem('homiebites_excel_filename', excelFileName);
        localStorage.setItem('homiebites_excel_sheets', JSON.stringify(excelSheets));
        if (selectedSheet) {
          localStorage.setItem('homiebites_excel_selected_sheet', selectedSheet);
        }
        if (Object.keys(columnTypes).length > 0) {
          localStorage.setItem('homiebites_excel_column_types', JSON.stringify(columnTypes));
        }
      } catch (error) {
        console.error('Error saving Excel file data:', error);
      }
    }
  }, [excelData, excelFileName, excelSheets, selectedSheet, columnTypes]);

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

  // Local loadOrders function - delegates to hook's loadOrders for consistency
  const loadOrders = useCallback(async () => {
    try {
      // Use hook's loadOrders which handles backend loading and state sync
      // The hook will update ordersHook, which will then sync to local orders via useEffect
      await hookLoadOrders();
      console.log('[AdminDashboard] Orders loaded via hook');
    } catch (e) {
      console.error('Error loading orders:', e);
      showNotification('Error loading orders from backend: ' + e.message, 'error');
    }
  }, [hookLoadOrders, showNotification]);

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
      try {
        setMenuDataHook && setMenuDataHook(menuData);
      } catch (e) {}
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
      try {
        setOffersDataHook && setOffersDataHook(offersData);
      } catch (e) {}
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
      setOffersData((prev) => {
        const next = prev.map((offer) =>
          offer.id === editingOffer.id ? { ...newOffer, id: editingOffer.id } : offer
        );
        try {
          setOffersDataHook && setOffersDataHook(next);
        } catch (e) {}
        return next;
      });
      showNotification('Offer updated successfully!', 'success');
    } else {
      // Add new offer
      const offer = {
        ...newOffer,
        id: Date.now(),
        createdAt: new Date().toISOString(),
      };
      setOffersData((prev) => {
        const next = [...prev, offer];
        try {
          setOffersDataHook && setOffersDataHook(next);
        } catch (e) {}
        return next;
      });
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
    setOffersData((prev) => {
      const next = prev.filter((offer) => offer.id !== offerId);
      try {
        setOffersDataHook && setOffersDataHook(next);
      } catch (e) {}
      return next;
    });
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
    // Set default date to today (ISO format: YYYY-MM-DD)
    const today = new Date().toISOString().split('T')[0];

    setNewOrder({
      date: today,
      deliveryAddress: '',
      quantity: 1,
      unitPrice: 0,
      status: 'Paid',
      paymentMode: 'Online',
      source: 'manual',
    });

    // Load address suggestions
    const uniqueAddresses = getUniqueAddresses(orders);
    setAddressSuggestions(uniqueAddresses);
  };

  const handleSaveNewOrder = async () => {
    if (!newOrder.deliveryAddress || !newOrder.date) {
      showNotification('Please fill in Delivery Address and Date', 'warning');
      return;
    }

    // MASTER ORDERS MODEL: Auto-calculate derived fields (NEVER store manually)
    const quantity = parseInt(newOrder.quantity) || 1;
    const unitPrice = parseFloat(newOrder.unitPrice) || 0;
    const totalAmount = calculateTotalAmount(quantity, unitPrice);
    const orderDate = new Date(newOrder.date);
    const billingMonth = extractBillingMonth(orderDate);
    const billingYear = extractBillingYear(orderDate);

    if (editingOrder) {
      // Update existing order (no duplicates)
      await handleSaveEditedOrder();
      return;
    }

    // Smart update/insert logic: Check if order with same (date + address) exists
    const existingOrder = findOrderByKey(orders, newOrder.date, newOrder.deliveryAddress);
    const isUpdate = !!existingOrder;

    // If Excel file is loaded, use smart update/insert logic
    if (excelData && excelFileName && selectedSheet && excelData[selectedSheet]) {
      try {
        const sheetData = [...excelData[selectedSheet]];
        const headers = sheetData[0] || [];

        // Check if order with same (date + address) exists in Excel
        const existingRowIndex = sheetData.findIndex((row, idx) => {
          if (idx === 0) return false; // Skip header
          const rowDate =
            row[
              headers.findIndex((h) =>
                String(h || '')
                  .toLowerCase()
                  .includes('date')
              )
            ];
          const rowAddress =
            row[
              headers.findIndex((h) =>
                String(h || '')
                  .toLowerCase()
                  .includes('address')
              )
            ];
          return (
            String(rowDate || '').trim() === String(newOrder.date).trim() &&
            String(rowAddress || '')
              .trim()
              .toLowerCase() === String(newOrder.deliveryAddress).trim().toLowerCase()
          );
        });

        // Create row data (only source fields + auto-calculated total)
        const newRow = headers.map((header) => {
          const headerStr = String(header || '')
            .toLowerCase()
            .trim();
          if (headerStr.includes('s no') || headerStr.includes('serial')) {
            return existingRowIndex > 0 ? existingRowIndex : sheetData.length; // Keep S No. or next
          } else if (headerStr.includes('date') && !headerStr.includes('delivery')) {
            return newOrder.date;
          } else if (headerStr.includes('delivery address') || headerStr.includes('address')) {
            return newOrder.deliveryAddress;
          } else if (headerStr.includes('quantity') || headerStr.includes('qty')) {
            return quantity;
          } else if (headerStr.includes('unit price') || headerStr.includes('price')) {
            return unitPrice;
          } else if (headerStr.includes('total amount') || headerStr.includes('total')) {
            return totalAmount; // Auto-calculated
          } else if (headerStr.includes('status')) {
            return newOrder.status;
          } else if (headerStr.includes('payment') || headerStr.includes('mode')) {
            return newOrder.paymentMode;
          } else if (headerStr.includes('billing month')) {
            // Auto-calculated for display (never stored)
            return billingMonth && billingYear ? formatBillingMonth(billingMonth, billingYear) : '';
          } else if (headerStr.includes('reference month')) {
            // Auto-calculated for display (never stored)
            return billingMonth && billingYear
              ? formatReferenceMonth(billingMonth, billingYear)
              : '';
          } else if (headerStr.includes('year')) {
            return billingYear || '';
          }
          return '';
        });

        if (existingRowIndex > 0) {
          // UPDATE existing row
          sheetData[existingRowIndex] = newRow;
          showNotification(
            'Order updated in Excel file. Dashboard will refresh automatically.',
            'success'
          );
        } else {
          // INSERT new row
          sheetData.push(newRow);
          showNotification(
            'Order added to Excel file. Dashboard will refresh automatically.',
            'success'
          );
        }

        const updatedData = { ...excelData };
        updatedData[selectedSheet] = sheetData;
        setExcelData(updatedData);

        // Save Excel data to localStorage for persistence
        try {
          localStorage.setItem('homiebites_excel_data', JSON.stringify(updatedData));
        } catch (storageError) {
          console.warn('Error saving Excel data to localStorage:', storageError);
        }

        // Excel data change will auto-sync to orders via useEffect
        setShowAddOrderModal(false);
        setShowAddressSuggestions(false);
        setNewOrder({
          date: new Date().toISOString().split('T')[0],
          deliveryAddress: '',
          quantity: 1,
          unitPrice: 0,
          status: 'Paid',
          paymentMode: 'Online',
          source: 'manual',
        });
        return; // Don't save to API/localStorage if Excel is source of truth
      } catch (excelError) {
        console.error('Error adding order to Excel:', excelError);
        showNotification('Error adding to Excel, saving to orders instead', 'warning');
        // Fall through to normal save
      }
    }

    // Save to backend API only (no localStorage fallback)
    const token = localStorage.getItem('homiebites_token');
    if (!token) {
      showNotification('Please login to save orders', 'error');
      return;
    }

    try {
      // MASTER ORDERS MODEL: Only send source fields + auto-calculated fields
      // Backend will generate orderId automatically (never generate in frontend)
      const apiOrder = {
        // orderId is NOT sent - backend generates it
        date: newOrder.date,
        deliveryAddress: newOrder.deliveryAddress,
        quantity: quantity,
        unitPrice: unitPrice,
        // totalAmount is NOT sent - backend calculates it
        status: newOrder.status,
        paymentMode: newOrder.paymentMode,
        billingMonth: billingMonth, // Auto-calculated (INT)
        billingYear: billingYear, // Auto-calculated (INT)
        source: newOrder.source || 'manual',
        items: [
          {
            name: `Order for ${newOrder.deliveryAddress}`,
            quantity: quantity,
            price: unitPrice,
          },
        ],
      };

      const response = await api.createOrder(apiOrder);
      if (response.success) {
        // Reload orders from backend
        await loadOrders();
        showNotification('Order added successfully!', 'success');
        setShowAddOrderModal(false);
        setShowAddressSuggestions(false);
        setNewOrder({
          date: new Date().toISOString().split('T')[0],
          deliveryAddress: '',
          quantity: 1,
          unitPrice: 0,
          status: 'Paid',
          paymentMode: 'Online',
          source: 'manual',
        });
        return;
      } else {
        throw new Error(response.error || 'Failed to create order');
      }
    } catch (apiError) {
      console.error('Failed to save order to backend:', apiError);
      showNotification('Error saving order to backend: ' + apiError.message, 'error');
    }
    setShowAddressSuggestions(false);
    setNewOrder({
      date: new Date().toISOString().split('T')[0],
      deliveryAddress: '',
      quantity: 1,
      unitPrice: 0,
      status: 'Unpaid',
      paymentMode: '',
      source: 'manual',
    });
  };

  const handleNewOrderChange = (field, value) => {
    setNewOrder((prev) => {
      const updated = { ...prev, [field]: value };

      // Auto-fill unit price when address changes (smart suggestion)
      if (field === 'deliveryAddress' && value) {
        const lastPrice = getLastUnitPriceForAddress(orders, value);
        if (lastPrice && !prev.unitPrice) {
          updated.unitPrice = lastPrice;
        }
        // Update address suggestions
        const query = String(value).toLowerCase();
        const filtered = getUniqueAddresses(orders).filter((addr) =>
          addr.toLowerCase().includes(query)
        );
        setAddressSuggestions(filtered);
        setShowAddressSuggestions(filtered.length > 0 && query.length > 0);
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
    try {
      const defaultData = await resetMenuData();
      setMenuData(defaultData);
      try {
        setMenuDataHook && setMenuDataHook(defaultData);
      } catch (e) {}

      // Automatically save to backend
      await saveMenuData(defaultData);
      showNotification('Menu data reset and saved successfully!', 'success');
    } catch (error) {
      console.error('Error resetting menu data:', error);
      showNotification('Failed to save menu data. Please try again.', 'error');
    }
  };

  // Update menu with new items list from provided data
  const updateMenuFromList = useCallback(async () => {
    try {
      setSyncing(true);
      const newMenuData = createMenuFromList();
      setMenuData(newMenuData);
      try {
        setMenuDataHook && setMenuDataHook(newMenuData);
      } catch (e) {}

      // Automatically save to backend
      await saveMenuData(newMenuData);
      showNotification('Menu updated and saved successfully to backend!', 'success');
      triggerDataSync();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error updating menu data:', error);
      showNotification('Failed to save menu data. Please try again.', 'error');
    } finally {
      setSyncing(false);
    }
  }, [setMenuDataHook]);

  // Expose updateMenuFromList globally for browser console access
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.updateMenuFromList = updateMenuFromList;
      // Auto-trigger on first load if flag is set
      const shouldUpdate = sessionStorage.getItem('homiebites_trigger_menu_update');
      if (shouldUpdate === 'true') {
        sessionStorage.removeItem('homiebites_trigger_menu_update');
        updateMenuFromList();
      }
    }
    return () => {
      if (typeof window !== 'undefined') {
        delete window.updateMenuFromList;
      }
    };
  }, [updateMenuFromList]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('homiebites_token');
      if (!token) {
        showNotification('Please login to update order status', 'error');
        return;
      }

      // Find the order to update
      const orderToUpdate = orders.find(
        (o) => o.orderId === orderId || o.id === orderId || o._id === orderId
      );

      if (!orderToUpdate) {
        showNotification('Order not found', 'error');
        return;
      }

      // Prefer _id (MongoDB ObjectId) if available, otherwise use orderId or id
      const orderIdToUpdate =
        orderToUpdate._id || orderToUpdate.id || orderToUpdate.orderId || orderId;

      // Update order status via API
      await api.updateOrder(orderIdToUpdate, {
        ...orderToUpdate,
        status: newStatus,
        paymentStatus:
          newStatus === 'Paid' ? 'Paid' : newStatus === 'Unpaid' ? 'Unpaid' : 'Pending',
      });

      // Reload orders from backend to get updated data
      if (hookLoadOrders) {
        await hookLoadOrders();
      }

      showNotification('Order status updated successfully', 'success');
    } catch (error) {
      console.error('Error updating order status:', error);
      showNotification('Failed to update order status: ' + error.message, 'error');
    }
  };

  // Mark all orders as delivered
  const markAllOrdersAsDelivered = async () => {
    try {
      if (!Array.isArray(orders) || orders.filter((o) => o && o.orderId).length === 0) {
        showNotification('No orders to update', 'info');
        return;
      }

      const token = localStorage.getItem('homiebites_token');
      if (!token) {
        showNotification('Please login to update orders', 'error');
        return;
      }

      const ordersToUpdate = orders.filter((o) => o && (o._id || o.id));
      if (ordersToUpdate.length === 0) {
        showNotification('No orders with valid IDs to update', 'warning');
        return;
      }

      if (
        window.confirm(
          `Are you sure you want to mark ALL ${ordersToUpdate.length} orders as delivered? This will update the backend.`
        )
      ) {
        try {
          showNotification('Updating orders in backend...', 'info');

          // Update each order via API
          const updatePromises = ordersToUpdate.map(async (order) => {
            try {
              const orderId = order._id || order.id;
              if (!orderId) return null;

              await api.updateOrder(orderId, {
                ...order,
                status: 'delivered',
              });
              return orderId;
            } catch (err) {
              console.warn(`Failed to update order ${order.orderId}:`, err);
              return null;
            }
          });

          const results = await Promise.all(updatePromises);
          const successCount = results.filter((r) => r !== null).length;

          // Reload orders from backend
          await loadOrders();

          showNotification(
            `Successfully marked ${successCount} of ${ordersToUpdate.length} orders as delivered!`,
            successCount === ordersToUpdate.length ? 'success' : 'warning'
          );
        } catch (error) {
          console.error('Error marking all orders as delivered:', error);
          showNotification('Error marking orders as delivered: ' + error.message, 'error');
        }
      }
    } catch (error) {
      console.error('Error in markAllOrdersAsDelivered:', error);
      showNotification('Error: Unable to mark orders as delivered', 'error');
    }
  };

  // Mark all orders as paid
  const markAllOrdersAsPaid = async (ordersToMark = null) => {
    try {
      const ordersToUpdate = ordersToMark || orders.filter((o) => o && (o._id || o.id));

      if (!Array.isArray(ordersToUpdate) || ordersToUpdate.length === 0) {
        showNotification('No orders to update', 'info');
        return;
      }

      const token = localStorage.getItem('homiebites_token');
      if (!token) {
        showNotification('Please login to update orders', 'error');
        return;
      }

      if (
        window.confirm(
          `Are you sure you want to mark ${ordersToUpdate.length} order(s) as paid? This will update the backend.`
        )
      ) {
        try {
          showNotification(`Updating ${ordersToUpdate.length} orders in backend...`, 'info');

          // Update each order via API
          const updatePromises = ordersToUpdate.map(async (order) => {
            try {
              const orderId = order._id || order.id;
              if (!orderId) return null;

              // Set both status fields - backend normalizes paymentStatus to 'Paid', 'Unpaid', or 'Pending'
              // Status should be capitalized to match dropdown options ('Paid', 'Unpaid')
              // Filter will still work because it uses .toLowerCase() for comparison
              await api.updateOrder(orderId, {
                ...order,
                status: 'Paid', // Capitalized to match dropdown options
                paymentStatus: 'Paid', // Backend expects capitalized paymentStatus
              });
              return orderId;
            } catch (err) {
              console.warn(`Failed to update order ${order.orderId || orderId}:`, err);
              return null;
            }
          });

          const results = await Promise.all(updatePromises);
          const successCount = results.filter((r) => r !== null).length;

          // Reload orders from backend after a short delay to ensure backend has processed updates
          if (hookLoadOrders) {
            // Small delay to ensure backend has processed all updates
            await new Promise((resolve) => setTimeout(resolve, 500));
            await hookLoadOrders();
          }

          showNotification(
            `Successfully marked ${successCount} of ${ordersToUpdate.length} order(s) as paid!`,
            successCount === ordersToUpdate.length ? 'success' : 'warning'
          );
        } catch (error) {
          console.error('Error marking orders as paid:', error);
          showNotification('Error marking orders as paid: ' + error.message, 'error');
        }
      }
    } catch (error) {
      console.error('Error in markAllOrdersAsPaid:', error);
      showNotification('Error: Unable to mark orders as paid', 'error');
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
      const order = orders.find(
        (o) => o.orderId === orderToDelete || o.id === orderToDelete || o._id === orderToDelete
      );
      const orderId = order?.orderId || order?.id || order?._id;

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
          console.error('Failed to delete order from API:', apiError);
          showNotification('Error deleting order: ' + apiError.message, 'error');
        }
      } else {
        showNotification('Please login to delete orders', 'error');
      }
      setOrderToDelete(null);
      setShowDeleteOrderModal(false);
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

      // MASTER ORDERS MODEL: Auto-calculate derived fields
      const quantity = parseInt(editingOrder.quantity) || 1;
      const unitPrice = parseFloat(editingOrder.unitPrice) || 0;
      const totalAmount = calculateTotalAmount(quantity, unitPrice);
      const orderDate = new Date(editingOrder.date);
      const billingMonth = extractBillingMonth(orderDate);
      const billingYear = extractBillingYear(orderDate);

      // Preserve existing orderId when editing (should not change) - declare once at top
      const existingOrderId = editingOrder.orderId || editingOrder.order_id || editingOrder.id;

      // Try API first
      const token = localStorage.getItem('homiebites_token');
      const orderId = editingOrder._id || editingOrder.id;

      if (token && orderId) {
        try {
          // MASTER ORDERS MODEL: Only send source fields + auto-calculated fields
          // Preserve orderId when editing - it should never change
          const apiOrder = {
            orderId: existingOrderId, // Preserve existing Order ID
            date: editingOrder.date,
            deliveryAddress: editingOrder.deliveryAddress,
            quantity: quantity,
            unitPrice: unitPrice,
            totalAmount: totalAmount, // Auto-calculated
            status: editingOrder.status,
            paymentMode: editingOrder.paymentMode,
            billingMonth: billingMonth, // Auto-calculated (INT)
            billingYear: billingYear, // Auto-calculated (INT)
            source: editingOrder.source || 'manual',
          };

          const response = await api.updateOrder(orderId, apiOrder);
          if (response.success) {
            await loadOrders();
            showNotification('Order updated successfully!', 'success');
            setShowAddOrderModal(false);
            setEditingOrder(null);
            setShowAddressSuggestions(false);
            return;
          } else {
            throw new Error(response.error || 'Failed to update order');
          }
        } catch (apiError) {
          console.error('Failed to update order via API:', apiError);
          showNotification('Error updating order: ' + apiError.message, 'error');
        }
      } else {
        showNotification('Please login to update orders', 'error');
      }
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
      type: 'payment_reminder', // payment_reminder, offer_announcement, service_update
      title: '',
      message: '',
      channels: [], // website_banner, whatsapp
      whatsappMessage: '',
      active: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications([...notifications, newNotification]);
  };

  const saveNotifications = () => {
    localStorage.setItem('homiebites_notifications', JSON.stringify(notifications));
    alert('✅ Notifications saved!');
  };

  const updateCategory = (categoryId, field, value) => {
    setMenuData((prev) => {
      const next = prev.map((cat) => (cat.id === categoryId ? { ...cat, [field]: value } : cat));
      try {
        setMenuDataHook && setMenuDataHook(next);
      } catch (e) {}
      return next;
    });
  };

  const updateItem = (categoryId, itemId, field, value) => {
    setMenuData((prev) => {
      const next = prev.map((cat) => {
        if (cat.id === categoryId) {
          const updatedItems = cat.items.map((item) =>
            item.id === itemId ? { ...item, [field]: value } : item
          );
          return { ...cat, items: updatedItems };
        }
        return cat;
      });
      try {
        setMenuDataHook && setMenuDataHook(next);
      } catch (e) {}
      return next;
    });
  };

  const addItem = (categoryId) => {
    setMenuData((prev) => {
      const next = prev.map((cat) => {
        if (cat.id === categoryId) {
          const newItem = {
            id: Date.now(),
            name: 'New Item',
            price: 0,
          };
          return { ...cat, items: [...cat.items, newItem] };
        }
        return cat;
      });
      try {
        setMenuDataHook && setMenuDataHook(next);
      } catch (e) {}
      return next;
    });
  };

  const removeItem = (categoryId, itemId) => {
    setItemToRemove({ categoryId, itemId });
    setShowRemoveItemModal(true);
  };

  const confirmRemoveItem = () => {
    if (itemToRemove) {
      setMenuData((prev) => {
        const next = prev.map((cat) => {
          if (cat.id === itemToRemove.categoryId) {
            return { ...cat, items: cat.items.filter((item) => item.id !== itemToRemove.itemId) };
          }
          return cat;
        });
        try {
          setMenuDataHook && setMenuDataHook(next);
        } catch (e) {}
        return next;
      });
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

  // Wrapper functions for utility functions (for backward compatibility)
  // Note: These functions are now imported from utils/orderUtils.js and utils/calculations.js
  const getPendingOrdersWrapper = () => {
    return getPendingOrders(orders);
  };

  const getFilteredOrdersByDateWrapper = (ordersList) => {
    return getFilteredOrdersByDate(ordersList, dateRange, customStartDate, customEndDate);
  };

  const getTodayStatsWrapper = () => {
    return getTodayStats(orders);
  };

  const getWeeklyStatsWrapper = () => {
    return getWeeklyStats(orders);
  };

  // When viewing current month orders tab, default to current month
  useEffect(() => {
    try {
      if (activeTab === 'currentMonthOrders') {
        setDateRange('month'); // Default to current month
        setCustomStartDate('');
        setCustomEndDate('');
        setSearchQuery('');
        // Do NOT auto-open Add Order modal
      } else if (activeTab === 'allOrdersData') {
        setDateRange('all'); // Default to all for master data
        setCustomStartDate('');
        setCustomEndDate('');
        setSearchQuery('');
        setCurrentPage(1); // Reset pagination when switching to All Orders Data tab
      }
    } catch (e) {
      console.error('Error setting default tab filters:', e);
    }
  }, [activeTab]);

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
        // Upload Excel file to backend; backend will parse the 'All Data' tab and insert orders
        const token = localStorage.getItem('homiebites_token');
        if (!token) {
          showNotification('Please login as admin to import Excel files.', 'error');
          return;
        }

        try {
          const formData = new FormData();
          formData.append('file', file);

          const base = import.meta.env.VITE_API_URL || 'http://localhost:3001';
          const resp = await fetch(`${base}/api/orders/upload-excel`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          });

          const respJson = await resp.json().catch(() => null);
          if (!resp.ok) {
            const msg =
              (respJson && (respJson.error || (respJson.data && respJson.data.error))) ||
              `Upload failed (${resp.status})`;
            showNotification(msg, 'error');
            return;
          }

          const importedCount = respJson?.data?.imported || 0;
          const errorCount = respJson?.data?.errors || 0;
          await loadOrders();
          showNotification(
            `Imported ${importedCount} orders${errorCount ? ` (${errorCount} errors)` : ''}`,
            'success'
          );
          return;
        } catch (uploadErr) {
          console.warn('Excel upload failed:', uploadErr);
          showNotification('Excel upload failed. See console for details.', 'error');
          return;
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

          // Ensure order has valid ID (use temporary ID - backend will generate proper HB format ID on sync)
          if (!order.id) {
            order.id = `TEMP-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
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
      // Try to save imported orders to API using bulk import
      const token = localStorage.getItem('homiebites_token');
      if (token) {
        try {
          // Use bulk import API for better performance and reliability
          const response = await api.bulkImportOrders(importedData);
          if (response.success && response.data.imported > 0) {
            await loadOrders();
            const importedCount = response.data.imported;
            const errorCount = response.data.errors;
            showNotification(
              `Successfully imported ${importedCount} orders to backend!${errorCount > 0 ? ` (${errorCount} errors)` : ''}`,
              'success'
            );
            return;
          }
        } catch (apiError) {
          console.warn('Bulk import failed, falling back to individual imports:', apiError.message);
          // Fall back to individual imports if bulk import fails
          try {
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
          } catch (fallbackError) {
            console.warn('Individual imports also failed:', fallbackError.message);
          }
        }
      }

      // Fallback to localStorage
      const mergedOrders = [...importedData, ...existingOrders];
      setOrders(mergedOrders);
      try {
        setOrdersHook && setOrdersHook(mergedOrders);
      } catch (e) {}
      // Orders are saved to backend only, not localStorage
      lastSyncedOrdersRef.current = mergedOrders; // Update ref
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

  // Handle Excel file upload for viewer
  const handleLoadExcelFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const excelOpId = errorTracker.addToQueue('load-excel-file', 'Load Excel File', {
      fileName: file.name,
      fileSize: file.size,
    });

    const fileName = file.name.toLowerCase();
    const isExcel = fileName.endsWith('.xlsx') || fileName.endsWith('.xls');

    if (!isExcel) {
      showNotification('Please upload an Excel file (.xlsx or .xls)', 'error');
      return;
    }

    try {
      // Load SheetJS library
      let XLSX;
      if (typeof window !== 'undefined' && window.XLSX) {
        XLSX = window.XLSX;
      } else {
        await new Promise((resolve, reject) => {
          const existingScript = document.querySelector('script[src*="xlsx"]');
          if (existingScript && window.XLSX) {
            XLSX = window.XLSX;
            resolve();
            return;
          }

          const script = document.createElement('script');
          script.src = 'https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js';
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
      }

      // Read file
      const fileData = await file.arrayBuffer();
      const workbook = XLSX.read(fileData, { type: 'array' });

      if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
        showNotification('Excel file has no sheets', 'error');
        return;
      }

      // Parse all sheets
      const sheetsData = {};
      const detectedColumnTypes = {};

      workbook.SheetNames.forEach((sheetName) => {
        const worksheet = workbook.Sheets[sheetName];
        if (worksheet) {
          // Convert to JSON array (first row as headers)
          const jsonData = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
            defval: '',
            raw: false,
          });
          sheetsData[sheetName] = jsonData;

          // Detect column types based on headers and sample data
          if (jsonData.length > 1) {
            const headers = jsonData[0] || [];
            const columnTypeMap = {};

            headers.forEach((header, colIdx) => {
              const headerStr = String(header || '').toLowerCase();

              // Check header names for type hints
              if (
                headerStr.includes('date') ||
                headerStr.includes('time') ||
                headerStr.includes('created') ||
                headerStr.includes('delivered')
              ) {
                columnTypeMap[colIdx] = 'date';
              } else if (
                headerStr.includes('amount') ||
                headerStr.includes('price') ||
                headerStr.includes('total') ||
                headerStr.includes('revenue') ||
                headerStr.includes('cost') ||
                headerStr.includes('₹') ||
                headerStr.includes('rs') ||
                headerStr.includes('rupee')
              ) {
                columnTypeMap[colIdx] = 'number';
              } else if (
                headerStr.includes('quantity') ||
                headerStr.includes('qty') ||
                headerStr.includes('count')
              ) {
                columnTypeMap[colIdx] = 'number';
              } else {
                // Check sample data (first 5 rows)
                let hasNumber = false;
                let hasDate = false;

                for (let i = 1; i < Math.min(6, jsonData.length); i++) {
                  const cellValue = jsonData[i][colIdx];
                  if (cellValue !== '' && cellValue !== null && cellValue !== undefined) {
                    // Check if it's a number
                    if (!isNaN(parseFloat(cellValue)) && isFinite(cellValue)) {
                      hasNumber = true;
                    }
                    // Check if it's a date string
                    const dateStr = String(cellValue);
                    if (
                      dateStr.match(/\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4}/) ||
                      dateStr.match(/\d{4}[-\/]\d{1,2}[-\/]\d{1,2}/)
                    ) {
                      hasDate = true;
                    }
                  }
                }

                if (hasDate) {
                  columnTypeMap[colIdx] = 'date';
                } else if (hasNumber) {
                  columnTypeMap[colIdx] = 'number';
                } else {
                  columnTypeMap[colIdx] = 'text';
                }
              }
            });

            detectedColumnTypes[sheetName] = columnTypeMap;
          }
        }
      });

      // Convert Excel to orders format (ALL records, not just new ones)
      const convertedOrders = convertExcelToOrdersWrapper(sheetsData, null);
      if (!convertedOrders || !Array.isArray(convertedOrders) || convertedOrders.length === 0) {
        showNotification(
          'Excel file loaded, but no orders found. Please check the file format.',
          'warning'
        );
        errorTracker.failOperation(excelOpId, new Error('No orders found in Excel file'));
        return;
      }

      // Ask user if they want to replace old data with Excel data
      const token = localStorage.getItem('homiebites_token');
      if (!token) {
        showNotification('Please login to upload Excel file', 'error');
        return;
      }

      // Always ask for confirmation when uploading Excel (it will replace backend data)
      const existingCount = orders && orders.length > 0 ? orders.length : 0;
      const message =
        existingCount > 0
          ? `You have ${existingCount} existing orders in the backend.\n\nUploading this Excel file will REMOVE all existing orders and replace them with ${convertedOrders.length} orders from the Excel file.\n\nClick "Yes" to proceed with replacement, or "No" to cancel.`
          : `Uploading this Excel file will add ${convertedOrders.length} orders to the backend.\n\nClick "Yes" to proceed, or "No" to cancel.`;

      const shouldReplaceOldData = window.confirm(message);

      if (!shouldReplaceOldData) {
        showNotification('Excel upload cancelled.', 'info');
        errorTracker.completeOperation(excelOpId, { fileName: file.name, cancelled: true });
        return;
      }

      // Always clear backend first before uploading Excel data
      if (existingCount > 0) {
        try {
          showNotification('Clearing old data from backend...', 'info');

          // Fetch all orders from backend first (to ensure we have all IDs)
          const allOrdersResponse = await api.getAllOrders({});
          if (
            allOrdersResponse.success &&
            allOrdersResponse.data &&
            Array.isArray(allOrdersResponse.data)
          ) {
            const allOrders = allOrdersResponse.data;

            // Delete all existing orders from backend one by one
            const deletePromises = allOrders.map((order) => {
              const orderId = order._id || order.id;
              if (orderId) {
                return api.deleteOrder(orderId).catch((err) => {
                  console.warn(`Failed to delete order ${orderId}:`, err);
                  return null;
                });
              }
              return Promise.resolve(null);
            });

            const deleteResults = await Promise.all(deletePromises);
            const successCount = deleteResults.filter((r) => r !== null).length;
            showNotification(
              `Cleared ${successCount} of ${allOrders.length} orders from backend.`,
              'success'
            );
          } else {
            showNotification(
              'Warning: Could not fetch all orders to clear. Continuing with upload...',
              'warning'
            );
          }
        } catch (clearError) {
          console.error('Error clearing old data from backend:', clearError);
          showNotification(
            'Warning: Could not clear all old data from backend. Continuing with upload...',
            'warning'
          );
        }
      }

      // Upload ALL Excel records to backend
      try {
        showNotification(`Uploading ${convertedOrders.length} orders to backend...`, 'info');

        // Use bulk import API to upload all orders at once
        const response = await api.bulkImportOrders(convertedOrders);

        if (response.success) {
          const importedCount = response.data?.imported || convertedOrders.length;
          const errorCount = response.data?.errors || 0;

          // Reload orders from backend
          await loadOrders();

          // Clear Excel data from localStorage (Excel is just for bulk upload, not for storage)
          setExcelData(null);
          setExcelFileName('');
          setExcelSheets([]);
          setSelectedSheet('');
          setColumnTypes({});
          localStorage.removeItem('homiebites_excel_data');
          localStorage.removeItem('homiebites_excel_filename');
          localStorage.removeItem('homiebites_excel_sheets');
          localStorage.removeItem('homiebites_excel_selected_sheet');
          localStorage.removeItem('homiebites_excel_column_types');

          showNotification(
            `Successfully uploaded ${importedCount} orders to backend!${errorCount > 0 ? ` (${errorCount} errors)` : ''}`,
            'success'
          );
          errorTracker.completeOperation(excelOpId, {
            fileName: file.name,
            imported: importedCount,
          });
        } else {
          throw new Error(response.error || 'Bulk import failed');
        }
      } catch (uploadError) {
        console.error('Error uploading orders to backend:', uploadError);

        // Fallback: Try individual uploads
        try {
          showNotification('Bulk upload failed, trying individual uploads...', 'warning');
          let importedCount = 0;
          let errorCount = 0;

          for (const orderData of convertedOrders) {
            try {
              await api.createOrder(orderData);
              importedCount++;
            } catch (err) {
              console.warn('Failed to import order:', err);
              errorCount++;
            }
          }

          if (importedCount > 0) {
            await loadOrders();
            showNotification(
              `Uploaded ${importedCount} orders to backend${errorCount > 0 ? ` (${errorCount} failed)` : ''}`,
              importedCount === convertedOrders.length ? 'success' : 'warning'
            );
            errorTracker.completeOperation(excelOpId, {
              fileName: file.name,
              imported: importedCount,
              errors: errorCount,
            });
          } else {
            throw new Error('All orders failed to upload');
          }
        } catch (fallbackError) {
          console.error('Individual uploads also failed:', fallbackError);
          showNotification(`Error uploading orders to backend: ${uploadError.message}`, 'error');
          errorTracker.failOperation(excelOpId, uploadError);
        }
      }
    } catch (error) {
      errorTracker.failOperation(excelOpId, error);
      console.error('Error loading Excel file:', error);
      showNotification(`Error loading Excel file: ${error.message}`, 'error');
    } finally {
      // Reset file input
      if (e.target) {
        e.target.value = '';
      }
    }
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
        filtered = getFilteredOrdersByDateWrapper(filtered);
      } catch (dateError) {
        console.error('Error filtering by date:', dateError);
        // Continue with unfiltered data
      }

      // Search filter (using debounced query for performance)
      if (debouncedSearchQuery) {
        const query = debouncedSearchQuery.toLowerCase().trim();
        if (query.length > 0) {
          filtered = filtered.filter((o) => {
            try {
              if (!o) return false;
              // Early return optimizations
              const idStr = String(o.id || '');
              if (idStr.includes(query)) return true;

              const nameStr = (o.customerName || o.name || '').toLowerCase();
              if (nameStr.includes(query)) return true;

              const phoneStr = String(o.customerPhone || o.phone || '');
              if (phoneStr.includes(query)) return true;

              const addrStr = (
                o.deliveryAddress ||
                o.customerAddress ||
                o.address ||
                ''
              ).toLowerCase();
              if (addrStr.includes(query)) return true;

              return false;
            } catch (e) {
              return false;
            }
          });
        }
      }

      // Sort (create new array to avoid mutation)
      try {
        filtered = [...filtered].sort((a, b) => {
          try {
            if (orderSort === 'amount') {
              const amountA = parseFloat(a?.total || a?.totalAmount || 0);
              const amountB = parseFloat(b?.total || b?.totalAmount || 0);
              return amountB - amountA;
            }

            const dateA = new Date(a?.createdAt || a?.date || 0);
            const dateB = new Date(b?.createdAt || b?.date || 0);

            if (orderSort === 'newest') {
              const diff = dateB.getTime() - dateA.getTime();
              return isNaN(diff) ? 0 : diff;
            }
            if (orderSort === 'oldest') {
              const diff = dateA.getTime() - dateB.getTime();
              return isNaN(diff) ? 0 : diff;
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
  }, [
    orders,
    orderFilter,
    dateRange,
    customStartDate,
    customEndDate,
    debouncedSearchQuery,
    orderSort,
  ]);

  // Always use ALL orders data for calculations (not filtered by tab)
  // This ensures stats/charts always reflect complete data from "All Orders Data" tab
  const statsOrders = orders;

  // All Orders Data tab filtering logic moved to AllOrdersDataTab component

  // Pagination functions (using memoized filteredOrders)
  const paginatedOrders = useMemo(() => {
    try {
      if (
        !Array.isArray(filteredOrders) ||
        filteredOrders.filter((o) => o && o.orderId).length === 0
      ) {
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
        filteredOrders.filter((o) => o && o.orderId).length === 0 ||
        !recordsPerPage ||
        recordsPerPage <= 0
      ) {
        return 1;
      }
      return Math.max(
        1,
        Math.ceil(filteredOrders.filter((o) => o && o.orderId).length / recordsPerPage)
      );
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
  // Always use ALL orders data from "All Orders Data" tab
  const summaryReport = useMemo(() => {
    return (() => {
      try {
        const filtered = orders; // Use ALL orders, not filteredOrders

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

            // MASTER ORDERS MODEL: Use billingMonth/billingYear (INT) from backend, fallback to date parsing
            let month, year;

            if (
              order.billingMonth &&
              order.billingYear &&
              typeof order.billingMonth === 'number' &&
              typeof order.billingYear === 'number'
            ) {
              // Use backend values (INT)
              month = String(order.billingMonth).padStart(2, '0');
              year = String(order.billingYear).slice(-2);
            } else {
              // Fallback: Parse from date
              let orderDate;
              try {
                const dateValue = order.date || order.createdAt;
                if (!dateValue) return;

                orderDate = new Date(dateValue);
                if (isNaN(orderDate.getTime())) {
                  return; // Skip invalid dates
                }
                month = String(orderDate.getMonth() + 1).padStart(2, '0');
                year = String(orderDate.getFullYear()).slice(-2);
              } catch (dateError) {
                console.warn('Invalid date in order:', order.id, dateError);
                return;
              }
            }

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
  }, [orders]); // Use orders dependency instead of filteredOrders

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

  // Helper function to get date-only (no time) from order (simple, no caching to avoid dependency issues)
  const getOrderDateOnly = useCallback((order) => {
    try {
      if (!order) return null;

      const dateValue = order.createdAt || order.date;
      if (!dateValue) return null;

      const orderDate = new Date(dateValue);
      if (isNaN(orderDate.getTime())) {
        return null;
      }

      // Return date-only string (YYYY-MM-DD format)
      const year = orderDate.getFullYear();
      const month = String(orderDate.getMonth() + 1).padStart(2, '0');
      const day = String(orderDate.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch (error) {
      return null;
    }
  }, []);

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

  // Memoize order trends calculation (simplified to prevent infinite loops)
  const getOrderTrends = useMemo(() => {
    try {
      if (!Array.isArray(statsOrders) || statsOrders.filter((o) => o && o.orderId).length === 0) {
        return [];
      }

      const last7Days = [];
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Limit processing for performance
      const maxOrders = 5000;
      const validStatsOrders = statsOrders.filter((o) => o && o.orderId);
      const ordersToProcess =
        validStatsOrders.length > maxOrders
          ? validStatsOrders.slice(0, maxOrders)
          : validStatsOrders;

      // Pre-calculate date keys for all orders once (performance optimization)
      const orderDateMap = new Map();

      for (let i = 0; i < ordersToProcess.length; i++) {
        try {
          const order = ordersToProcess[i];
          if (!order) continue;

          const dateValue = order.createdAt || order.date;
          if (!dateValue) continue;

          const orderDate = new Date(dateValue);
          if (isNaN(orderDate.getTime())) continue;

          const year = orderDate.getFullYear();
          const month = String(orderDate.getMonth() + 1).padStart(2, '0');
          const day = String(orderDate.getDate()).padStart(2, '0');
          const dateKey = `${year}-${month}-${day}`;

          if (!orderDateMap.has(dateKey)) {
            orderDateMap.set(dateKey, []);
          }
          orderDateMap.get(dateKey).push(order);
        } catch (error) {
          // Skip invalid orders
          continue;
        }
      }

      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);

        const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

        const dayOrders = orderDateMap.get(dateKey) || [];
        const deliveredOrders = dayOrders.filter((o) => o && o.status === 'delivered');
        const revenue = deliveredOrders.reduce((sum, o) => {
          const amount = parseFloat(o.total || o.totalAmount || 0);
          return sum + (isNaN(amount) ? 0 : amount);
        }, 0);

        last7Days.push({
          date: formatDateDDMMM(date),
          dateKey: dateKey,
          orders: dayOrders.filter((o) => o && o.orderId).length,
          revenue: revenue,
        });
      }
      return last7Days;
    } catch (error) {
      console.error('Error in getOrderTrends:', error);
      return [];
    }
  }, [statsOrders]);

  // Memoize top items calculation
  const getTopItems = useMemo(() => {
    try {
      const itemCounts = {};
      const maxOrders = 5000; // Limit processing for performance
      const validStatsOrders2 = statsOrders.filter((o) => o && o.orderId);
      const ordersToProcess =
        validStatsOrders2.length > maxOrders
          ? validStatsOrders2.slice(0, maxOrders)
          : validStatsOrders2;

      ordersToProcess.forEach((order) => {
        try {
          if (order.items && Array.isArray(order.items)) {
            order.items.forEach((item) => {
              const itemName = item.name || item.item || 'Unknown';
              itemCounts[itemName] = (itemCounts[itemName] || 0) + (item.quantity || 1);
            });
          }
        } catch (itemError) {
          // Skip invalid items
        }
      });

      return Object.entries(itemCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
    } catch (error) {
      console.error('Error in getTopItems:', error);
      return [];
    }
  }, [statsOrders]);

  // Memoize analytics data calculation (simplified to prevent infinite loops)
  const getAnalyticsData = useMemo(() => {
    try {
      if (!Array.isArray(statsOrders) || statsOrders.length === 0) {
        return { monthlyData: {}, statusCounts: {}, dailyRevenue: {}, yearlyData: {} };
      }

      const monthlyData = {};
      const statusCounts = {};
      const dailyRevenue = {};
      const yearlyData = {};

      // Limit processing for performance (max 10000 orders to prevent crashes)
      const maxOrders = 10000;
      const ordersToProcess =
        statsOrders.length > maxOrders ? statsOrders.slice(0, maxOrders) : statsOrders;

      // Process orders directly without calling getOrderDateOnly to avoid dependency issues
      for (let i = 0; i < ordersToProcess.length; i++) {
        try {
          const order = ordersToProcess[i];
          if (!order) continue;

          const dateValue = order.createdAt || order.date;
          if (!dateValue) continue;

          const orderDate = new Date(dateValue);
          if (isNaN(orderDate.getTime())) continue;

          const year = orderDate.getFullYear();
          const month = orderDate.getMonth() + 1;
          const monthKey = `${year}-${String(month).padStart(2, '0')}`;
          const day = String(orderDate.getDate()).padStart(2, '0');
          const dateKey = `${year}-${String(month).padStart(2, '0')}-${day}`;

          const status = order.status || 'pending';
          const orderAmount = parseFloat(order.total || order.totalAmount || 0);
          const amount = isNaN(orderAmount) ? 0 : orderAmount;

          // Yearly data
          if (!yearlyData[year]) {
            yearlyData[year] = { orders: 0, revenue: 0 };
          }
          yearlyData[year].orders++;
          if (status === 'delivered') {
            yearlyData[year].revenue += amount;
          }

          // Monthly data (grouped by year-month)
          if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = { orders: 0, revenue: 0, year: year };
          }
          monthlyData[monthKey].orders++;
          if (status === 'delivered') {
            monthlyData[monthKey].revenue += amount;
          }

          // Status counts
          statusCounts[status] = (statusCounts[status] || 0) + 1;

          // Daily revenue (date-only, no time)
          if (status === 'delivered') {
            if (!dailyRevenue[dateKey]) {
              dailyRevenue[dateKey] = 0;
            }
            dailyRevenue[dateKey] += amount;
          }
        } catch (orderError) {
          // Skip invalid orders silently for performance
          continue;
        }
      }

      return { monthlyData, statusCounts, dailyRevenue, yearlyData };
    } catch (error) {
      console.error('Error in getAnalyticsData:', error);
      return { monthlyData: {}, statusCounts: {}, dailyRevenue: {}, yearlyData: {} };
    }
  }, [orders]);

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

      // MASTER ORDERS MODEL: Use billingMonth (INT) from backend, fallback to date parsing
      let monthKey = null;

      // First try: Use billingMonth (INT) from backend
      if (
        order.billingMonth &&
        typeof order.billingMonth === 'number' &&
        order.billingMonth >= 1 &&
        order.billingMonth <= 12
      ) {
        monthKey = monthNames[order.billingMonth - 1];
      } else if (order.billingMonth) {
        // Backward compatibility: Try to parse string format
        const monthMatch = String(order.billingMonth).match(/(\d{1,2})/);
        if (monthMatch) {
          const monthNum = parseInt(monthMatch[1]);
          if (monthNum >= 1 && monthNum <= 12) {
            monthKey = monthNames[monthNum - 1];
          }
        }
      }

      // Fallback: Parse from date
      if (!monthKey && order.date) {
        try {
          const orderDate = new Date(order.date);
          if (!isNaN(orderDate.getTime())) {
            const monthNum = orderDate.getMonth() + 1;
            if (monthNum >= 1 && monthNum <= 12) {
              monthKey = monthNames[monthNum - 1];
            }
          }
        } catch (e) {
          // Ignore
        }
      }

      const amount = parseFloat(order.totalAmount || order.total || 0);
      if (monthKey && addressData[address][monthKey] !== undefined) {
        addressData[address][monthKey] += isNaN(amount) ? 0 : amount;
      }
      addressData[address]['Grand Total'] += isNaN(amount) ? 0 : amount;
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
    // Use displayOrders which has the most up-to-date data
    const ordersToProcess = Array.isArray(displayOrders)
      ? displayOrders
      : Array.isArray(orders)
        ? orders
        : [];

    if (ordersToProcess.length === 0) {
      console.log('[PendingAmountsTab] No orders to process');
      return [];
    }

    ordersToProcess.forEach((order) => {
      // Check both status and paymentStatus fields
      const status = (order.status || order.paymentStatus || '').toLowerCase().trim();
      const isPaid = status === 'paid' || status === 'delivered';

      const address = order.deliveryAddress || order.customerAddress || order.address || 'Unknown';
      const amount = parseFloat(order.totalAmount || order.total || 0);

      // Initialize address data if not exists
      if (!unpaidData[address]) {
        unpaidData[address] = { unpaid: 0, grandTotal: 0 };
      }

      // Add to grand total for all orders
      unpaidData[address].grandTotal += isNaN(amount) ? 0 : amount;

      // Add to unpaid total only if not paid
      if (!isPaid && !isNaN(amount)) {
        unpaidData[address].unpaid += amount;
      }
    });

    const result = Object.entries(unpaidData)
      .map(([address, data]) => ({ address, ...data }))
      .filter((item) => item.unpaid > 0)
      .sort((a, b) => b.unpaid - a.unpaid);

    // Debug log
    if (result.length === 0 && ordersToProcess.length > 0) {
      console.log(
        '[PendingAmountsTab] No unpaid orders found. Total orders:',
        ordersToProcess.length
      );
      console.log(
        '[PendingAmountsTab] Sample order statuses:',
        ordersToProcess.slice(0, 5).map((o) => ({
          status: o.status,
          paymentStatus: o.paymentStatus,
          amount: o.totalAmount || o.total,
        }))
      );
    }

    return result;
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
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        currentUser={currentUser}
        onLogout={handleLogoutClick}
      />

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
            {/* Compact stats removed - Dashboard tab now shows Today/Current Month stats only */}
          </div>
        </div>

        {/* Stats Cards - Removed lifetime stats (moved to Summary tab per MASTER_RULES.md) */}

        {activeTab === 'dashboard' && (
          <DashboardTab
            orders={displayOrders}
            setActiveTab={setActiveTab}
            settings={settings}
            loading={loadingHook}
          />
        )}

        {activeTab === 'menu' && (
          <MenuTab
            menuData={menuData}
            updateCategory={updateCategory}
            updateItem={updateItem}
            addItem={addItem}
            removeItem={removeItem}
          />
        )}

        {activeTab === 'offers' && (
          <OffersTab
            offersData={offersData}
            syncing={syncing}
            saved={saved}
            handleAddOffer={handleAddOffer}
            handleSaveOffers={handleSaveOffers}
            handleEditOffer={handleEditOffer}
            handleDeleteOffer={handleDeleteOffer}
            setOffersData={setOffersData}
          />
        )}

        {/* Order Management tab removed - orders are added via Excel upload or manual entry */}
        {activeTab === 'currentMonthOrders' && (
          <CurrentMonthOrdersTab
            orders={Array.isArray(orders) ? orders : []}
            onAddOrder={handleAddOrder}
            onEditOrder={handleEditOrder}
            onDeleteOrder={handleDeleteOrder}
            onUpdateOrderStatus={updateOrderStatus}
            currentPage={currentPage || 1}
            recordsPerPage={recordsPerPage || 20}
            onPageChange={handlePageChange}
            onRecordsPerPageChange={handleRecordsPerPageChange}
            loading={loadingHook}
          />
        )}

        {/* Summary Tab - Address-wise Monthly Totals */}
        {activeTab === 'summary' && (
          <SummaryTab
            orders={displayOrders}
            summaryReport={summaryReport}
            currentPage={currentPage}
            recordsPerPage={recordsPerPage}
            onPageChange={handlePageChange}
            onRecordsPerPageChange={handleRecordsPerPageChange}
          />
        )}

        {/* All Address Tab */}
        {activeTab === 'customers' && (
          <AllAddressesTab
            orders={displayOrders}
            filteredCustomers={filteredCustomers}
            paginatedCustomers={paginatedCustomers}
            currentPage={currentPage}
            recordsPerPage={recordsPerPage}
            customerSearchQuery={customerSearchQuery}
            customerSort={customerSort}
            customerTotalPages={customerTotalPages}
            onSearchChange={setCustomerSearchQuery}
            onSortChange={setCustomerSort}
            onPageChange={handlePageChange}
            onRecordsPerPageChange={handleRecordsPerPageChange}
          />
        )}

        {activeTab === 'users' && (
          <PendingAmountsTab
            orders={displayOrders}
            getUnpaidByAddress={getUnpaidByAddress}
            onUpdateOrderStatus={updateOrderStatus}
            onViewOrders={(address) => {
              setSearchQuery(address);
              setActiveTab('allOrdersData');
            }}
            showNotification={showNotification}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsTab
            settings={settings}
            onSettingsChange={setSettings}
            onSaveSettings={handleSaveSettings}
          />
        )}

        {activeTab === 'analytics' && <AnalyticsTab orders={displayOrders} />}

        {activeTab === 'notifications' && (
          <NotificationsTab notifications={notifications} setNotifications={setNotifications} />
        )}

        {/* All Orders Data Tab - Master Table */}
        {activeTab === 'allOrdersData' && (
          <AllOrdersDataTab
            orders={displayOrders}
            settings={settings}
            excelFileName={excelFileName}
            allOrdersFilterMonth={allOrdersFilterMonth}
            setAllOrdersFilterMonth={setAllOrdersFilterMonth}
            allOrdersFilterAddress={allOrdersFilterAddress}
            setAllOrdersFilterAddress={setAllOrdersFilterAddress}
            allOrdersFilterPaymentStatus={allOrdersFilterPaymentStatus}
            setAllOrdersFilterPaymentStatus={setAllOrdersFilterPaymentStatus}
            onLoadExcelFile={handleLoadExcelFile}
            onUpdateOrderStatus={updateOrderStatus}
            loading={loadingHook || false}
            currentPage={currentPage}
            recordsPerPage={recordsPerPage >= 50 ? recordsPerPage : 50} // Default to 50 for All Orders Data tab
            onPageChange={(page) => {
              setCurrentPage(page);
            }}
            onRecordsPerPageChange={(perPage) => {
              setRecordsPerPage(perPage);
              localStorage.setItem('homiebites_records_per_page', String(perPage));
              setCurrentPage(1); // Reset to first page when changing page size
            }}
            onClearExcelData={async () => {
              if (
                window.confirm(
                  'Clear saved Excel file data? This will remove the file from memory and clear all orders from dashboard and backend.'
                )
              ) {
                try {
                  setExcelData(null);
                  setExcelFileName('');
                  setExcelSheets([]);
                  setSelectedSheet('');
                  setColumnTypes({});
                  localStorage.removeItem('homiebites_excel_data');
                  localStorage.removeItem('homiebites_excel_filename');
                  localStorage.removeItem('homiebites_excel_sheets');
                  localStorage.removeItem('homiebites_excel_selected_sheet');
                  localStorage.removeItem('homiebites_excel_column_types');
                  await clearAllOrders();
                  lastSyncedDataRef.current = null;
                  showNotification('Excel file data and all orders cleared', 'success');
                } catch (error) {
                  console.error('Error clearing Excel data:', error);
                  showNotification('Error clearing data: ' + error.message, 'error');
                }
              }
            }}
            onEditOrder={handleEditOrder}
            onDeleteOrder={handleDeleteOrder}
            showNotification={showNotification}
          />
        )}

        {/* Add New Row Modal for Excel */}
        {showAddRowModal && excelData && selectedSheet && (
          <div
            className='modal-overlay'
            onClick={() => {
              setShowAddRowModal(false);
              setNewRowData({});
            }}
          >
            <div className='modal-content modal-content-wide' onClick={(e) => e.stopPropagation()}>
              <div className='modal-header'>
                <h2>Add New Row to {selectedSheet}</h2>
                <button
                  className='modal-close'
                  onClick={() => {
                    setShowAddRowModal(false);
                    setNewRowData({});
                  }}
                >
                  <i className='fa-solid fa-times'></i>
                </button>
              </div>
              <div className='modal-body'>
                {excelData[selectedSheet][0] && (
                  <div className='form-grid'>
                    {excelData[selectedSheet][0].map((header, colIdx) => {
                      const headerStr = String(header || '').toLowerCase();
                      const colType = columnTypes[selectedSheet]?.[colIdx] || 'text';
                      const isNumber = colType === 'number';
                      const isDate = colType === 'date';

                      return (
                        <div key={colIdx} className='form-group'>
                          <label>{String(header || `Column ${colIdx + 1}`)}</label>
                          {isDate ? (
                            <input
                              type='date'
                              value={newRowData[colIdx] || ''}
                              onChange={(e) =>
                                setNewRowData({ ...newRowData, [colIdx]: e.target.value })
                              }
                            />
                          ) : isNumber ? (
                            <input
                              type='number'
                              step='0.01'
                              value={newRowData[colIdx] || ''}
                              onChange={(e) =>
                                setNewRowData({
                                  ...newRowData,
                                  [colIdx]: parseFloat(e.target.value) || 0,
                                })
                              }
                            />
                          ) : (
                            <input
                              type='text'
                              value={newRowData[colIdx] || ''}
                              onChange={(e) =>
                                setNewRowData({ ...newRowData, [colIdx]: e.target.value })
                              }
                              placeholder={`Enter ${header}`}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <div className='modal-footer'>
                <button
                  className='btn btn-ghost'
                  onClick={() => {
                    setShowAddRowModal(false);
                    setNewRowData({});
                  }}
                >
                  Cancel
                </button>
                <button
                  className='btn btn-primary'
                  onClick={() => {
                    try {
                      const updatedData = { ...excelData };
                      const sheetData = [...updatedData[selectedSheet]];
                      const headers = sheetData[0] || [];
                      const newRow = headers.map((_, colIdx) => newRowData[colIdx] || '');
                      sheetData.push(newRow);
                      updatedData[selectedSheet] = sheetData;
                      setExcelData(updatedData);
                      setShowAddRowModal(false);
                      setNewRowData({});
                      // Excel data change will auto-sync to orders via useEffect
                      showNotification(
                        'Row added successfully. Dashboard will update automatically.',
                        'success'
                      );
                    } catch (error) {
                      console.error('Error adding row:', error);
                      showNotification('Error adding row', 'error');
                    }
                  }}
                >
                  <i className='fa-solid fa-plus'></i> Add Row
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Order Modal */}
        <OrderModal
          show={showAddOrderModal}
          editingOrder={editingOrder}
          newOrder={newOrder}
          orders={displayOrders}
          addressSuggestions={addressSuggestions}
          showAddressSuggestions={showAddressSuggestions}
          onClose={() => {
            setShowAddOrderModal(false);
            setEditingOrder(null);
            setShowAddressSuggestions(false);
          }}
          onSave={handleSaveNewOrder}
          onNewOrderChange={handleNewOrderChange}
          onEditingOrderChange={setEditingOrder}
          setAddressSuggestions={setAddressSuggestions}
          setShowAddressSuggestions={setShowAddressSuggestions}
        />

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
              className='modal-content modal-content-medium'
              onClick={(e) => e.stopPropagation()}
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
                    <label>Type *</label>
                    <select
                      value={newOffer.type || 'Flat'}
                      onChange={(e) => setNewOffer({ ...newOffer, type: e.target.value })}
                    >
                      <option value='Flat'>Flat ₹ Off</option>
                      <option value='Percentage'>Percentage %</option>
                    </select>
                  </div>
                  <div className='form-group'>
                    <label>Value *</label>
                    <input
                      type='number'
                      value={newOffer.value || 0}
                      onChange={(e) =>
                        setNewOffer({ ...newOffer, value: parseFloat(e.target.value) || 0 })
                      }
                      placeholder={newOffer.type === 'Percentage' ? 'e.g., 10' : 'e.g., 50'}
                      min='0'
                      step={newOffer.type === 'Percentage' ? '1' : '0.01'}
                    />
                    <small className='form-helper-text'>
                      {newOffer.type === 'Percentage'
                        ? 'Percentage value (e.g., 10 for 10%)'
                        : 'Flat amount in ₹'}
                    </small>
                  </div>
                </div>
                <div className='form-row'>
                  <div className='form-group'>
                    <label>Discount Display (Optional)</label>
                    <input
                      type='text'
                      value={newOffer.discount}
                      onChange={(e) => setNewOffer({ ...newOffer, discount: e.target.value })}
                      placeholder='e.g., 7% OFF'
                    />
                    <small className='form-helper-text'>
                      Text shown on website (auto-generated if empty)
                    </small>
                  </div>
                  <div className='form-group'>
                    <label>Badge (Optional)</label>
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
                    <button type='button' className='btn btn-primary btn-small' onClick={addTerm}>
                      <i className='fa-solid fa-plus'></i> Add Term
                    </button>
                  </label>
                  {newOffer.terms.map((term, index) => (
                    <div key={index} className='form-term-item'>
                      <input
                        type='text'
                        value={term}
                        onChange={(e) => updateTerm(index, e.target.value)}
                        placeholder={`Term ${index + 1}`}
                        className='form-term-input'
                      />
                      <button
                        type='button'
                        className='btn btn-special danger btn-small'
                        onClick={() => removeTerm(index)}
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
