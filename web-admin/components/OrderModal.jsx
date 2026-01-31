import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useNotification } from '../contexts/NotificationContext';
import { useAutoKeyboardAvoidance } from '../hooks/useKeyboardAvoidance';
import api from '../lib/api';
import { getWhatsAppLink } from '../lib/businessConstants';
import { getFirstError, hasValidationErrors } from '../lib/formValidation';
import { InlineLoader } from './loaders/LoaderComponents';
import './OrderModal.css';
import Icon from './ui/Icon.jsx';

const OrderModal = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const { success, error, info } = useNotification();
  const [orderItems, setOrderItems] = useState({});
  const [customerName, setCustomerName] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [displayDate, setDisplayDate] = useState(''); // DD/MM/YYYY format for display
  const [deliveryTime, setDeliveryTime] = useState('');
  const [preferredDeliveryTime, setPreferredDeliveryTime] = useState(''); // Specific time like "08:30"
  const [deliveryMode, setDeliveryMode] = useState('home'); // 'home', 'pickup', or 'outside'
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingOrderData, setPendingOrderData] = useState(null);
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [validationErrors, setValidationErrors] = useState({});
  const [showAddMoreDropdown, setShowAddMoreDropdown] = useState(false);
  const [addedItemIds, setAddedItemIds] = useState(new Set());
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [addressSuggestionsFull, setAddressSuggestionsFull] = useState([]); // Store full addresses with names
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
  const addressSearchTimeoutRef = useRef(null);
  const addressAbortControllerRef = useRef(null);
  const allAddressesRef = useRef([]); // Cache all addresses for instant suggestions
  const [kitchenStatus, setKitchenStatus] = useState({
    isOpen: true,
    message: '',
  });

  // Enable keyboard avoidance for mobile
  useAutoKeyboardAvoidance({
    containerSelector: '.order-modal',
    inputSelector: 'input, textarea, select',
  });

  useEffect(() => {
    if (isOpen) {
      loadGalleryItems();
      // Load all addresses into cache when modal opens
      loadAllAddresses().then((addresses) => {
        allAddressesRef.current = addresses;
      });
      // Check kitchen status when modal opens
      checkKitchenStatus();
    }
  }, [isOpen]);

  const checkKitchenStatus = async () => {
    try {
      const response = await api.getKitchenStatus();
      if (response && response.success && response.data) {
        const isOpen = response.data.isOpen === true; // Explicitly check for true
        setKitchenStatus({
          isOpen: isOpen,
          message: response.data.message || '',
        });

        // Debug log in development
        if (process.env.NODE_ENV === 'development') {
          console.log('[OrderModal] Kitchen status:', {
            isOpen,
            message: response.data.message,
          });
        }
      } else {
        // If response is not successful, default to open
        setKitchenStatus({ isOpen: true, message: '' });
      }
    } catch (err) {
      console.error('Error checking kitchen status:', err);
      // Default to open on error
      setKitchenStatus({ isOpen: true, message: '' });
    }
  };

  // Load addresses on component mount (when website opens)
  useEffect(() => {
    // Load addresses in background when component mounts
    loadAllAddresses().then((addresses) => {
      allAddressesRef.current = addresses;
    });
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!showAddMoreDropdown) return;

    const handleClickOutside = (e) => {
      const dropdown = e.target.closest('.add-more-container');
      if (!dropdown) {
        setShowAddMoreDropdown(false);
      }
    };

    // Use capture phase for better reliability
    document.addEventListener('mousedown', handleClickOutside, true);
    document.addEventListener('touchstart', handleClickOutside, true);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
      document.removeEventListener('touchstart', handleClickOutside, true);
    };
  }, [showAddMoreDropdown]);

  // Close address suggestions when clicking outside
  useEffect(() => {
    if (!showAddressSuggestions) return;

    const handleClickOutside = (e) => {
      const container = e.target.closest('.address-input-container');
      if (!container) {
        setShowAddressSuggestions(false);
      }
    };

    // Use capture phase for better reliability
    document.addEventListener('mousedown', handleClickOutside, true);
    document.addEventListener('touchstart', handleClickOutside, true);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
      document.removeEventListener('touchstart', handleClickOutside, true);
    };
  }, [showAddressSuggestions]);

  const loadGalleryItems = async () => {
    try {
      setLoading(true);
      const response = await api.getGallery();
      if (response.success && response.data) {
        // Filter only active items with prices
        const items = response.data
          .filter(
            (item) => item.isActive !== false && item.price && item.price > 0
          )
          .map((item) => ({
            id: item._id || item.id,
            name: item.name,
            price: item.price,
            category: item.category || 'Other',
            imageUrl: item.imageUrl,
          }));
        setGalleryItems(items);
      } else {
        setGalleryItems([]);
      }
    } catch (err) {
      console.error('Error loading gallery items:', err);
      error('Failed to load menu items. Please refresh the page.');
      setGalleryItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Map time slot to category keywords
  const getCategoryForTimeSlot = (timeSlot) => {
    const timeSlotMap = {
      morning: ['breakfast', 'morning'],
      noon: ['lunch', 'noon'],
      night: ['dinner', 'night'],
    };
    return timeSlotMap[timeSlot] || [];
  };

  // Filter items by category based on time slot
  const filterItemsByTimeSlot = (items) => {
    if (
      !deliveryTime ||
      deliveryMode === 'pickup' ||
      deliveryMode === 'outside'
    ) {
      // If no time slot selected or pickup/outside mode, show all items
      return items;
    }
    const categoryKeywords = getCategoryForTimeSlot(deliveryTime);
    return items.filter((item) => {
      if (!item.category) {
        // If item has no category, include it (for backward compatibility)
        return true;
      }
      const itemCategory = item.category.toLowerCase().trim();
      // Check if item category matches any of the time slot keywords
      return categoryKeywords.some((keyword) => itemCategory.includes(keyword));
    });
  };

  // Filter items to show default items (Thali and Steel Tiffin) - always show these regardless of time slot
  const getDefaultItems = () => {
    const defaultItems = galleryItems.filter((item) => {
      if (!item.name) return false;
      const nameLower = item.name.toLowerCase().trim();
      // Match Thali (any variation)
      const isThali = nameLower.includes('thali');
      // Match Steel Tiffin or Tiffin Steel (any variation)
      const isSteelTiffin =
        (nameLower.includes('steel') && nameLower.includes('tiffin')) ||
        (nameLower.includes('tiffin') && nameLower.includes('steel')) ||
        nameLower.includes('tiffin steel') ||
        nameLower.includes('steel tiffin') ||
        nameLower.includes('zumbo') ||
        nameLower.includes('zambo');

      return isThali || isSteelTiffin;
    });

    // Debug logging in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[OrderModal] Default items:', {
        totalGalleryItems: galleryItems.length,
        defaultItemsFound: defaultItems.length,
        defaultItemNames: defaultItems.map((item) => item.name),
        allItemNames: galleryItems.map((item) => item.name),
      });
    }

    // Note: Default items are NOT filtered by time slot - they always show
    return defaultItems;
  };

  const getAdditionalItems = () => {
    const defaultItems = getDefaultItems();
    const defaultItemIds = new Set(defaultItems.map((item) => item.id));
    // Keep manually added items visible regardless of time slot (better UX)
    return galleryItems.filter(
      (item) => !defaultItemIds.has(item.id) && addedItemIds.has(item.id)
    );
  };

  const getAvailableItemsForDropdown = () => {
    const defaultItems = getDefaultItems();
    const defaultItemIds = new Set(defaultItems.map((item) => item.id));
    const allAddedIds = new Set([...defaultItemIds, ...addedItemIds]);
    const availableItems = galleryItems.filter(
      (item) => !allAddedIds.has(item.id)
    );
    return filterItemsByTimeSlot(availableItems);
  };

  const handleAddItem = (itemId) => {
    setAddedItemIds((prev) => new Set([...prev, itemId]));
    setShowAddMoreDropdown(false);
    // Initialize quantity to 1 if not already in orderItems
    if (!orderItems[itemId]) {
      updateQuantity(itemId, 1);
    }
  };

  const getVisibleItems = () => {
    return [...getDefaultItems(), ...getAdditionalItems()];
  };

  // Helper functions for DD/MM/YYYY date format
  const formatDateToDDMMYYYY = (dateValue) => {
    if (!dateValue) return '';
    try {
      // If already in DD/MM/YYYY format, return as is
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateValue)) {
        return dateValue;
      }
      // If in YYYY-MM-DD format, convert to DD/MM/YYYY
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
        const [year, month, day] = dateValue.split('-');
        return `${day}/${month}/${year}`;
      }
      // If it's a Date object or ISO string
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) return '';
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return '';
    }
  };

  const parseDateFromDDMMYYYY = (dateStr) => {
    if (!dateStr) return '';
    // Parse DD/MM/YYYY format
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
      const [day, month, year] = dateStr.split('/').map(Number);
      if (
        day >= 1 &&
        day <= 31 &&
        month >= 1 &&
        month <= 12 &&
        year >= 2000 &&
        year <= 2100
      ) {
        // Return in YYYY-MM-DD format for internal use
        return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      }
    }
    // If already in YYYY-MM-DD format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return dateStr;
    }
    return '';
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Set minimum date to today in DD/MM/YYYY format
      const today = new Date();
      const day = String(today.getDate()).padStart(2, '0');
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const year = today.getFullYear();
      const todayFormatted = `${day}/${month}/${year}`;
      setDisplayDate(todayFormatted);
      setDeliveryDate(parseDateFromDDMMYYYY(todayFormatted));
    } else {
      document.body.style.overflow = '';
      // Reset form when closing
      setOrderItems({});
      setCustomerName('');
      setDeliveryAddress('');
      setDeliveryDate('');
      setDisplayDate('');
      setDeliveryTime('');
      setPreferredDeliveryTime('');
      setDeliveryMode('home');
      setValidationErrors({});
      setAddedItemIds(new Set());
      setShowAddMoreDropdown(false);
      setAddressSuggestions([]);
      setAddressSuggestionsFull([]);
      setAddressSuggestionsFull([]);
      setShowAddressSuggestions(false);
      setShowConfirmModal(false);
      setPendingOrderData(null);
      if (addressSearchTimeoutRef.current) {
        clearTimeout(addressSearchTimeoutRef.current);
        addressSearchTimeoutRef.current = null;
      }
    }
    return () => {
      document.body.style.overflow = '';
      if (addressSearchTimeoutRef.current) {
        clearTimeout(addressSearchTimeoutRef.current);
      }
      // Cancel any pending address suggestion requests
      if (addressAbortControllerRef.current) {
        addressAbortControllerRef.current.abort();
        addressAbortControllerRef.current = null;
      }
    };
  }, [isOpen]);

  // Load all addresses from localStorage or fetch from API
  const loadAllAddresses = async () => {
    try {
      // Check if addresses are cached in localStorage
      const cachedData = localStorage.getItem('homiebites_all_addresses');
      const cacheTimestamp = localStorage.getItem(
        'homiebites_addresses_cache_time'
      );
      const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

      // Use cache if it exists and is less than 24 hours old
      if (cachedData && cacheTimestamp) {
        const age = Date.now() - parseInt(cacheTimestamp, 10);
        if (age < CACHE_DURATION) {
          try {
            const addresses = JSON.parse(cachedData);
            return addresses;
          } catch (e) {
            // Invalid cache, fetch fresh
          }
        }
      }

      // Fetch all addresses from API (empty query returns all unique addresses)
      const response = await api.getAddressSuggestions('');
      if (response.success && response.data) {
        // Cache in localStorage
        localStorage.setItem(
          'homiebites_all_addresses',
          JSON.stringify(response.data)
        );
        localStorage.setItem(
          'homiebites_addresses_cache_time',
          Date.now().toString()
        );
        return response.data;
      }
    } catch (err) {
      console.error('Error loading addresses:', err);
      // Try to use stale cache if available
      const cachedData = localStorage.getItem('homiebites_all_addresses');
      if (cachedData) {
        try {
          return JSON.parse(cachedData);
        } catch (e) {
          // Invalid cache
        }
      }
    }
    return [];
  };

  // Get suggestions from cached addresses (instant, no API call)
  const getCachedAddressSuggestions = (query, allAddresses) => {
    if (!query || query.trim().length === 0) {
      return [];
    }

    const queryLower = query.trim().toLowerCase();
    const filtered = allAddresses.filter((addr) => {
      const addrLower = addr.toLowerCase();
      return addrLower.includes(queryLower);
    });

    // Sort by relevance
    filtered.sort((a, b) => {
      const aLower = a.toLowerCase();
      const bLower = b.toLowerCase();

      // Exact match gets highest priority
      if (aLower === queryLower && bLower !== queryLower) return -1;
      if (aLower !== queryLower && bLower === queryLower) return 1;

      // Starts with gets second priority
      const aStarts = aLower.startsWith(queryLower);
      const bStarts = bLower.startsWith(queryLower);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;

      // Then sort by position of match (earlier is better)
      const aIndex = aLower.indexOf(queryLower);
      const bIndex = bLower.indexOf(queryLower);
      if (aIndex !== bIndex) return aIndex - bIndex;

      // Finally alphabetically
      return aLower.localeCompare(bLower);
    });

    return filtered.slice(0, 10);
  };

  // Extract only address part from full address string (remove names from start or end)
  const extractAddressOnly = (fullAddress) => {
    if (!fullAddress) return '';

    const trimmed = fullAddress.trim();
    if (!trimmed) return '';

    // Split by spaces
    const parts = trimmed.split(/\s+/);

    // Find the first part that contains numbers or dashes (address identifier)
    let addressStartIndex = -1;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      // Address parts typically contain numbers, dashes, or are short address keywords
      if (
        /\d/.test(part) ||
        /[-/]/.test(part) ||
        /^(Block|Flat|House|Building|Apt|Unit|No|#)$/i.test(part)
      ) {
        addressStartIndex = i;
        break;
      }
    }

    // If no address identifier found, try to find from end
    if (addressStartIndex === -1) {
      for (let i = parts.length - 1; i >= 0; i--) {
        const part = parts[i];
        if (/\d/.test(part) || /[-/]/.test(part)) {
          addressStartIndex = i;
          break;
        }
      }
    }

    // If still no address found, return original
    if (addressStartIndex === -1) {
      return trimmed;
    }

    // Now collect address parts starting from the address identifier
    const addressParts = [];
    let foundAddressPart = false;

    for (let i = addressStartIndex; i < parts.length; i++) {
      const part = parts[i];

      // If part contains numbers or dashes, it's definitely part of address
      if (/\d/.test(part) || /[-/]/.test(part)) {
        addressParts.push(part);
        foundAddressPart = true;
      }
      // If part is all letters
      else if (/^[A-Za-z]+$/.test(part)) {
        // If we've found address parts, check if this could be a name
        if (foundAddressPart) {
          // Long word (> 3 chars) after address parts is likely a name - stop
          if (part.length > 3) {
            break;
          }
          // Short word might be part of address (like "Block", "Flat")
          addressParts.push(part);
        } else {
          // Before address parts, could be name or address keyword
          // Short words (<= 5) might be address keywords
          if (
            part.length <= 5 &&
            /^(Block|Flat|House|Building|Apt|Unit|No|#)$/i.test(part)
          ) {
            addressParts.push(part);
          }
          // Otherwise skip (likely name at start)
        }
      }
      // Other characters (punctuation, etc.) - include if we have address context
      else {
        if (foundAddressPart || addressParts.length > 0) {
          addressParts.push(part);
        }
      }
    }

    // If we found address parts, return them
    if (addressParts.length > 0) {
      return addressParts.join(' ');
    }

    // Fallback: return original if we couldn't parse
    return trimmed;
  };

  // Get address suggestions instantly from cache (no API call needed)
  const getAddressSuggestions = (query) => {
    const searchQuery = query ? query.trim() : '';

    // Don't show suggestions for empty input - only when user is typing
    if (!searchQuery || searchQuery.length === 0) {
      setAddressSuggestions([]);
      setAddressSuggestionsFull([]);
      setShowAddressSuggestions(false);
      return;
    }

    // Use cached addresses for instant suggestions
    const cachedAddresses = allAddressesRef.current;
    if (cachedAddresses.length > 0) {
      const filtered = getCachedAddressSuggestions(
        searchQuery,
        cachedAddresses
      );

      if (filtered.length > 0) {
        // Store full addresses (with names) for selection
        setAddressSuggestionsFull(filtered);
        // Extract only address part (remove names) for display
        const addressesOnly = filtered.map((addr) => extractAddressOnly(addr));
        setAddressSuggestions(addressesOnly);
        setShowAddressSuggestions(true);
      } else {
        setAddressSuggestions([]);
        setAddressSuggestionsFull([]);
        setShowAddressSuggestions(false);
      }
    } else {
      // Cache not loaded yet, fetch from API as fallback
      fetchAddressSuggestionsFromAPI(query);
    }
  };

  // Fallback: Fetch from API if cache is not available
  const fetchAddressSuggestionsFromAPI = async (query) => {
    const searchQuery = query ? query.trim() : '';

    if (!searchQuery || searchQuery.length === 0) {
      return;
    }

    // Cancel any previous request
    if (addressAbortControllerRef.current) {
      addressAbortControllerRef.current.abort();
    }

    // Create new AbortController for this request
    const abortController = new AbortController();
    addressAbortControllerRef.current = abortController;

    try {
      // Pass abort signal to API request
      const response = await api.getAddressSuggestions(
        searchQuery,
        abortController.signal
      );

      // Check if request was aborted
      if (abortController.signal.aborted) {
        return;
      }

      if (response.success && response.data) {
        // Store full addresses (with names) for selection
        setAddressSuggestionsFull(response.data);
        // Extract only address part (remove names) for display
        const addressesOnly = response.data.map((addr) =>
          extractAddressOnly(addr)
        );
        setAddressSuggestions(addressesOnly);
        setShowAddressSuggestions(addressesOnly.length > 0);
      } else {
        setAddressSuggestions([]);
        setAddressSuggestionsFull([]);
        setShowAddressSuggestions(false);
      }
    } catch (err) {
      // Ignore abort errors
      if (err.name === 'AbortError' || abortController.signal.aborted) {
        return;
      }
      console.error('Error fetching address suggestions:', err);
      setAddressSuggestions([]);
      setAddressSuggestionsFull([]);
      setShowAddressSuggestions(false);
    } finally {
      // Clear abort controller if this was the latest request
      if (addressAbortControllerRef.current === abortController) {
        addressAbortControllerRef.current = null;
      }
    }
  };

  // Real-time address search - instant updates on every keystroke (from cache)
  const handleAddressChange = (value) => {
    setDeliveryAddress(value);
    if (validationErrors.deliveryAddress) {
      setValidationErrors((prev) => ({
        ...prev,
        deliveryAddress: undefined,
      }));
    }

    // Clear any pending timeout
    if (addressSearchTimeoutRef.current) {
      clearTimeout(addressSearchTimeoutRef.current);
      addressSearchTimeoutRef.current = null;
    }

    // Get suggestions instantly from cache (no API call, no delay)
    getAddressSuggestions(value);
  };

  const handleAddressSuggestionSelect = (address) => {
    setDeliveryAddress(address);
    setShowAddressSuggestions(false);
    setAddressSuggestions([]);
    if (validationErrors.deliveryAddress) {
      setValidationErrors((prev) => ({
        ...prev,
        deliveryAddress: undefined,
      }));
    }
  };

  const updateQuantity = (itemId, change) => {
    // Get current state and calculate new quantity
    const currentQuantity = orderItems[itemId] || 0;
    const newQuantity = currentQuantity + change;

    if (newQuantity < 0) return; // Invalid operation

    const item = galleryItems.find((i) => i.id === itemId);
    const willRemove = newQuantity === 0;
    const willAdd = change > 0;

    // Update state first
    setOrderItems((prev) => {
      if (newQuantity === 0) {
        // eslint-disable-next-line no-unused-vars
        const { [itemId]: _removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [itemId]: newQuantity };
    });

    // Show notifications after state update (deferred to avoid render-phase update)
    // Using setTimeout ensures this runs after the current render cycle completes
    setTimeout(() => {
      if (willRemove && item) {
        info(`${item.name} removed from order`);
      } else if (willAdd && item) {
        info(`${item.name} added to order`);
      }
    }, 0);
  };

  const getTotalPrice = () => {
    return Object.entries(orderItems).reduce((total, [itemId, quantity]) => {
      const item = galleryItems.find((i) => i.id === itemId);
      return total + (item ? item.price * quantity : 0);
    }, 0);
  };

  const getDeliveryCharge = () => {
    const total = getTotalPrice();
    if (deliveryMode === 'pickup' || deliveryMode === 'outside') {
      return 0;
    }
    // Home delivery: free above ₹100, ₹20 below ₹100
    return total >= 100 ? 0 : 20;
  };

  const getGrandTotal = () => {
    return getTotalPrice() + getDeliveryCharge();
  };

  const validateOrderForm = () => {
    const errors = {};

    // Customer Name validation
    if (!customerName || !customerName.trim()) {
      errors.customerName =
        t('order.errors.nameRequired') || 'Customer name is required';
    } else if (customerName.trim().length < 2) {
      errors.customerName =
        t('order.errors.nameMinLength') || 'Name must be at least 2 characters';
    }

    // Phone number not required - will be obtained from WhatsApp

    // Delivery Address validation (required for home delivery and outside delivery)
    if (deliveryMode === 'home' || deliveryMode === 'outside') {
      if (!deliveryAddress || !deliveryAddress.trim()) {
        errors.deliveryAddress =
          t('order.errors.addressRequired') || 'Address is required';
      } else if (deliveryAddress.trim().length < 5) {
        errors.deliveryAddress =
          t('order.errors.addressMinLength') ||
          'Address must be at least 5 characters';
      }
    }
    // No address required for pickup

    // Delivery Date validation (DD/MM/YYYY format)
    if (!displayDate || !displayDate.trim()) {
      errors.deliveryDate =
        t('order.errors.dateRequired') || 'Delivery date is required';
    } else {
      const parsedDate = parseDateFromDDMMYYYY(displayDate);
      if (!parsedDate) {
        errors.deliveryDate =
          t('order.errors.dateInvalid') ||
          'Please enter date in DD/MM/YYYY format (e.g., 22/01/2026)';
      } else {
        const selectedDate = new Date(parsedDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (isNaN(selectedDate.getTime())) {
          errors.deliveryDate =
            t('order.errors.dateInvalid') || 'Please enter a valid date';
        } else if (selectedDate < today) {
          errors.deliveryDate =
            t('order.errors.datePast') || 'Delivery date cannot be in the past';
        }
      }
    }

    // Delivery Time validation (only for home delivery)
    if (deliveryMode === 'home' && !deliveryTime) {
      errors.deliveryTime =
        t('order.errors.timeRequired') || 'Delivery time slot is required';
    }
    // No time slot required for pickup or outside delivery

    // Preferred Delivery Time validation (mandatory for all orders)
    if (!preferredDeliveryTime || !preferredDeliveryTime.trim()) {
      errors.preferredDeliveryTime =
        t('order.errors.preferredTimeRequired') ||
        'Preferred delivery time is required';
    } else {
      // Validate time format (HH:MM)
      const timePattern = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timePattern.test(preferredDeliveryTime.trim())) {
        errors.preferredDeliveryTime =
          t('order.errors.preferredTimeInvalid') ||
          'Please enter time in HH:MM format (e.g., 08:30)';
      }
    }

    // Items validation - check visible items only
    const visibleItems = getVisibleItems();
    const visibleItemIds = new Set(visibleItems.map((item) => item.id));
    const totalQuantity = Object.entries(orderItems)
      .filter(([itemId]) => visibleItemIds.has(itemId))
      .reduce((sum, [, qty]) => sum + qty, 0);
    if (totalQuantity === 0) {
      errors.items =
        t('order.errors.itemsRequired') || 'Please select at least one item';
    }

    // Minimum order amount validation
    const totalAmount = getTotalPrice();
    if (deliveryMode === 'home' && totalAmount < 70) {
      errors.minimumOrder =
        t('order.errors.minimumOrderHome') ||
        'Minimum order of ₹70 required for home delivery. Please select pickup option for orders below ₹70.';
    }

    return errors;
  };

  const proceedToWhatsApp = async (orderData) => {
    // This function is called after confirmation
    const {
      customerName,
      addressText,
      formattedDate,
      deliveryTime,
      preferredDeliveryTime,
      deliveryMode,
      selectedItems,
      totalAmount,
      deliveryCharge,
      grandTotal,
      deliveryModeText,
      timeLabel,
      parsedDateStr,
      orderItemsData,
    } = orderData;

    // Save order to database
    try {
      const orderDataForAPI = {
        date: parsedDateStr,
        customerName: customerName.trim(),
        deliveryAddress: addressText,
        deliveryTime: deliveryTime,
        preferredDeliveryTime: preferredDeliveryTime,
        deliveryMode: deliveryMode,
        items: orderItemsData,
        orderItems: orderItemsData,
        quantity: orderItemsData.reduce((sum, item) => sum + item.quantity, 0),
        totalAmount: totalAmount,
        grandTotal: grandTotal,
        paymentMode: 'Online',
      };

      const response = await api.createWebsiteOrder(orderDataForAPI);

      if (!response.success) {
        console.error('Failed to save order:', response.error);
        info('Order saved with issues. Please contact support if needed.');
      }
    } catch (err) {
      console.error('Error saving order:', err);
      if (process.env.NODE_ENV === 'development') {
        console.error('Order save error details:', err);
      }
    }

    // Format preferred time for display
    const [hours, minutes] = preferredDeliveryTime.split(':');
    const hour12 = parseInt(hours) % 12 || 12;
    const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
    const preferredTimeFormatted = `${hour12}:${minutes} ${ampm}`;

    const message = `🍽️ *NEW ORDER*

*Customer:* ${customerName}
*${deliveryMode === 'pickup' ? 'Pickup' : deliveryMode === 'outside' ? 'Pickup' : 'Delivery'} Mode:* ${deliveryModeText}
${deliveryMode === 'pickup' ? '' : `*Address:* ${addressText}`}

*Date:* ${formattedDate}
${deliveryMode === 'home' ? `*Time Slot:* ${timeLabel}` : ''}
*Preferred Time:* ${preferredTimeFormatted} (±10 minutes)

*Items:*
${selectedItems.map((item) => `• ${item}`).join('\n')}

*Total:* ₹${totalAmount}
${deliveryMode === 'pickup' ? '' : deliveryCharge > 0 ? `*Delivery:* ₹${deliveryCharge}` : '*Delivery:* FREE'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*Grand Total: ₹${grandTotal}*

Please confirm. Thank you! 🙏`;

    window.open(getWhatsAppLink(message), '_blank', 'noopener');
    success(
      t('order.orderPlaced') ||
        'Order sent to WhatsApp! Our team will confirm shortly.'
    );
    onClose();
  };

  const handleWhatsAppOrder = async () => {
    // Validate form data
    const errors = validateOrderForm();

    if (hasValidationErrors(errors)) {
      const firstError = getFirstError(errors);
      error(firstError || 'Please fix the errors in the form');
      setValidationErrors(errors);
      return;
    }

    const visibleItems = getVisibleItems();
    const visibleItemIds = new Set(visibleItems.map((item) => item.id));
    const selectedItems = Object.entries(orderItems)
      .filter(([itemId]) => visibleItemIds.has(itemId))
      .map(([itemId, quantity]) => {
        const item = galleryItems.find((i) => i.id === itemId);
        return item
          ? `${item.name} x${quantity} (₹${item.price * quantity})`
          : null;
      })
      .filter(Boolean);

    if (selectedItems.length === 0) {
      error(
        t('order.selectItems') || 'Please select at least one item to order.'
      );
      return;
    }

    // Format delivery date (use displayDate if available, otherwise parse deliveryDate)
    const dateToFormat = displayDate || formatDateToDDMMYYYY(deliveryDate);
    const parsedDateStr = parseDateFromDDMMYYYY(dateToFormat) || deliveryDate;
    const dateObj = new Date(parsedDateStr);
    const formattedDate = dateObj.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Format delivery time label for WhatsApp message (full format)
    const timeLabels = {
      morning: 'Morning (7:00 AM – 10:00 AM)',
      noon: 'Noon (12:00 PM – 3:00 PM)',
      night: 'Night (7:00 PM – 9:00 PM)',
    };
    const timeLabel = timeLabels[deliveryTime] || deliveryTime;

    // Calculate delivery charge
    const totalAmount = getTotalPrice();
    const deliveryCharge = getDeliveryCharge();
    const grandTotal = getGrandTotal();

    const deliveryModeText =
      deliveryMode === 'pickup'
        ? 'Self-Pickup'
        : deliveryMode === 'outside'
          ? 'Main Gate Pickup (Outside Panchsheel Greens-1)'
          : 'Home Delivery';
    const addressText =
      deliveryMode === 'pickup'
        ? 'Self-Pickup (A1 Tower)'
        : deliveryMode === 'outside'
          ? `Main Gate Pickup - Panchsheel Greens-1 (Original Address: ${deliveryAddress})`
          : deliveryAddress;

    // Prepare order items for API
    const orderItemsData = Object.entries(orderItems)
      .filter(([itemId]) => visibleItemIds.has(itemId))
      .map(([itemId, quantity]) => {
        const item = galleryItems.find((i) => i.id === itemId);
        return item
          ? {
              id: itemId,
              name: item.name,
              quantity: quantity,
              price: item.price,
            }
          : null;
      })
      .filter(Boolean);

    // Prepare order data for confirmation modal
    const orderDataForConfirmation = {
      customerName,
      deliveryAddress: addressText,
      displayDate: formattedDate,
      deliveryTime,
      preferredDeliveryTime,
      deliveryMode,
      selectedItems,
      totalAmount,
      deliveryCharge,
      grandTotal,
      deliveryModeText,
      addressText,
      formattedDate,
      timeLabel,
      parsedDateStr,
      orderItemsData,
    };

    // Show confirmation modal instead of directly opening WhatsApp
    setPendingOrderData(orderDataForConfirmation);
    setShowConfirmModal(true);
  };

  if (!isOpen) return null;

  return (
    <div className="order-modal-overlay" onClick={onClose}>
      <div className="order-modal" onClick={(e) => e.stopPropagation()}>
        <div className="order-modal-announcement">
          {t('header.announcement') || 'Home delivery on orders ₹100 and above'}
        </div>
        <div className="order-modal-content">
          <button className="order-modal-close" onClick={onClose}>
            <Icon name="xmark" />
          </button>
          <h2>
            <Icon name="whatsapp" /> {t('order.sendWhatsApp')}
          </h2>

          {/* Kitchen Status Message */}
          {!kitchenStatus.isOpen && kitchenStatus.message && (
            <div
              className="kitchen-closed-banner"
              style={{
                backgroundColor: '#fee2e2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '20px',
                color: '#991b1b',
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
              >
                <Icon
                  name="exclamation-triangle"
                  style={{
                    fontSize: 'var(--admin-fs-xl, 20px)',
                    color: '#dc2626',
                  }}
                />
                <div>
                  <strong style={{ display: 'block', marginBottom: '4px' }}>
                    Kitchen is Closed
                  </strong>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 'var(--admin-fs-base, 14px)',
                    }}
                  >
                    {kitchenStatus.message}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="order-form-section">
            <h3>{t('order.customerInfo') || 'Customer Information'}</h3>
            {/* 1. Name */}
            <div className="form-group">
              <label>{t('order.customerName') || 'Full Name'} *</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => {
                  setCustomerName(e.target.value);
                  if (validationErrors.customerName) {
                    setValidationErrors((prev) => ({
                      ...prev,
                      customerName: undefined,
                    }));
                  }
                }}
                placeholder={
                  t('order.customerNamePlaceholder') || 'Enter your full name'
                }
                className={validationErrors.customerName ? 'error' : ''}
                disabled={!kitchenStatus.isOpen}
              />
              {validationErrors.customerName && (
                <span className="error-message">
                  {validationErrors.customerName}
                </span>
              )}
            </div>
            {/* 2. Address */}
            {(deliveryMode === 'home' || deliveryMode === 'outside') && (
              <div className="form-group address-autocomplete-wrapper">
                <label>
                  {deliveryMode === 'outside'
                    ? t('order.originalAddress') ||
                      'Original Address (for reference)'
                    : t('order.deliveryAddress') || 'Delivery Address'}{' '}
                  *
                </label>
                <div className="address-input-container">
                  <textarea
                    value={deliveryAddress}
                    onChange={(e) => handleAddressChange(e.target.value)}
                    onFocus={() => {
                      if (!kitchenStatus.isOpen) return; // Don't show suggestions if kitchen is closed
                      // Only show suggestions if user has typed something
                      if (
                        deliveryAddress &&
                        deliveryAddress.trim().length > 0
                      ) {
                        if (addressSuggestions.length === 0) {
                          // Clear any pending timeout and get suggestions from cache
                          if (addressSearchTimeoutRef.current) {
                            clearTimeout(addressSearchTimeoutRef.current);
                            addressSearchTimeoutRef.current = null;
                          }
                          getAddressSuggestions(deliveryAddress);
                        } else {
                          setShowAddressSuggestions(true);
                        }
                      } else {
                        // Don't show suggestions for empty input
                        setAddressSuggestions([]);
                        setAddressSuggestionsFull([]);
                        setShowAddressSuggestions(false);
                      }
                    }}
                    onBlur={(e) => {
                      // Delay hiding to allow click on suggestion
                      setTimeout(() => {
                        setShowAddressSuggestions(false);
                      }, 200);
                    }}
                    placeholder={
                      t('order.addressPlaceholder') ||
                      'A1-405, Panchsheel Greens'
                    }
                    rows="3"
                    className={validationErrors.deliveryAddress ? 'error' : ''}
                    disabled={!kitchenStatus.isOpen}
                  />
                  {showAddressSuggestions && addressSuggestions.length > 0 && (
                    <div className="address-suggestions-dropdown">
                      {addressSuggestions.map((addressDisplay, index) => {
                        // Get the full address (with name) for selection
                        const fullAddress =
                          addressSuggestionsFull[index] || addressDisplay;
                        return (
                          <button
                            key={index}
                            type="button"
                            className="address-suggestion-item"
                            onClick={() =>
                              handleAddressSuggestionSelect(fullAddress)
                            }
                            onMouseDown={(e) => e.preventDefault()}
                          >
                            <Icon name="location-dot" />
                            <span>{addressDisplay}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
                {validationErrors.deliveryAddress && (
                  <span className="error-message">
                    {validationErrors.deliveryAddress}
                  </span>
                )}
                {deliveryMode === 'outside' && (
                  <p
                    className="helper-text"
                    style={{
                      marginTop: '4px',
                      fontSize: 'var(--admin-fs-sm, 12px)',
                      color: '#666',
                    }}
                  >
                    {t('order.outsideAddressHelper') ||
                      'Note: Please provide your original address for reference. Order will be handed over at the main gate of Panchsheel Greens-1 only (no home delivery for outside orders).'}
                  </p>
                )}
              </div>
            )}
            {/* 3. Delivery Mode */}
            <div className="form-group">
              <label>{t('order.deliveryMode') || 'Delivery Mode'} *</label>
              <div className="delivery-mode-selector">
                <button
                  type="button"
                  className={`btn btn-ghost ${deliveryMode === 'home' ? 'active' : ''}`}
                  onClick={() => {
                    if (!kitchenStatus.isOpen) return;
                    setDeliveryMode('home');
                    setValidationErrors((prev) => ({
                      ...prev,
                      minimumOrder: undefined,
                      deliveryMode: undefined,
                    }));
                  }}
                  disabled={!kitchenStatus.isOpen}
                >
                  <Icon name="truck" />
                  {t('order.homeDelivery') || 'Home Delivery'}
                </button>
                <button
                  type="button"
                  className={`btn btn-ghost ${deliveryMode === 'pickup' ? 'active' : ''}`}
                  onClick={() => {
                    if (!kitchenStatus.isOpen) return;
                    setDeliveryMode('pickup');
                    setValidationErrors((prev) => ({
                      ...prev,
                      minimumOrder: undefined,
                      deliveryMode: undefined,
                    }));
                  }}
                  disabled={!kitchenStatus.isOpen}
                >
                  <Icon name="walking" />
                  {t('order.pickup') || 'Self-Pickup'}
                </button>
                <button
                  type="button"
                  className={`btn btn-ghost ${deliveryMode === 'outside' ? 'active' : ''}`}
                  onClick={() => {
                    if (!kitchenStatus.isOpen) return;
                    setDeliveryMode('outside');
                    setValidationErrors((prev) => ({
                      ...prev,
                      minimumOrder: undefined,
                      deliveryMode: undefined,
                    }));
                  }}
                  disabled={!kitchenStatus.isOpen}
                >
                  <Icon name="gate" />
                  {t('order.outsideDelivery') || 'Outside Panchsheel Greens-1'}
                </button>
              </div>
              {validationErrors.deliveryMode && (
                <span className="error-message">
                  {validationErrors.deliveryMode}
                </span>
              )}
              {validationErrors.minimumOrder && (
                <span className="error-message">
                  {validationErrors.minimumOrder}
                </span>
              )}
            </div>
            {/* 4. Date (DD/MM/YYYY format) */}
            <div className="form-group">
              <label>{t('order.deliveryDate') || 'Delivery Date'} *</label>
              <input
                type="text"
                value={displayDate}
                onChange={(e) => {
                  if (!kitchenStatus.isOpen) return;
                  let value = e.target.value;
                  // Allow only digits and slashes
                  value = value.replace(/[^\d/]/g, '');
                  // Auto-format as user types (DD/MM/YYYY)
                  if (value.length <= 10) {
                    // Remove extra slashes
                    const parts = value.split('/').filter((p) => p);
                    if (parts.length > 0 && parts[0].length > 2) {
                      parts[0] = parts[0].substring(0, 2);
                    }
                    if (parts.length > 1 && parts[1].length > 2) {
                      parts[1] = parts[1].substring(0, 2);
                    }
                    if (parts.length > 2 && parts[2].length > 4) {
                      parts[2] = parts[2].substring(0, 4);
                    }
                    // Reconstruct with slashes
                    let formatted = parts[0] || '';
                    if (parts.length > 1) formatted += '/' + parts[1];
                    if (parts.length > 2) formatted += '/' + parts[2];
                    setDisplayDate(formatted);
                    // Parse and set internal date format
                    const parsed = parseDateFromDDMMYYYY(formatted);
                    if (parsed) {
                      setDeliveryDate(parsed);
                    }
                  }
                  if (validationErrors.deliveryDate) {
                    setValidationErrors((prev) => ({
                      ...prev,
                      deliveryDate: undefined,
                    }));
                  }
                }}
                placeholder="DD/MM/YYYY (e.g., 22/01/2026)"
                maxLength="10"
                className={validationErrors.deliveryDate ? 'error' : ''}
                disabled={!kitchenStatus.isOpen}
              />
              {validationErrors.deliveryDate && (
                <span className="error-message">
                  {validationErrors.deliveryDate}
                </span>
              )}
            </div>
            {/* 5. Time Slot (only for home delivery) */}
            {deliveryMode === 'home' && (
              <div className="form-group">
                <label>
                  {t('order.deliveryTime') || 'Delivery Time Slot'} *
                </label>
                <select
                  value={deliveryTime}
                  onChange={(e) => {
                    if (!kitchenStatus.isOpen) return;
                    setDeliveryTime(e.target.value);
                    if (validationErrors.deliveryTime) {
                      setValidationErrors((prev) => ({
                        ...prev,
                        deliveryTime: undefined,
                      }));
                    }
                  }}
                  className={`${validationErrors.deliveryTime ? 'error' : ''} ${!deliveryTime ? 'placeholder-selected' : ''}`}
                  disabled={!kitchenStatus.isOpen}
                >
                  <option value="">
                    {t('order.selectTime') || 'Select time slot'}
                  </option>
                  <option value="morning" title="Morning (7:00 AM – 10:00 AM)">
                    {t('order.timeMorning') || 'Morning: 7-10 AM'}
                  </option>
                  <option value="noon" title="Noon (12:00 PM – 3:00 PM)">
                    {t('order.timeNoon') || 'Noon: 12-3 PM'}
                  </option>
                  <option value="night" title="Night (7:00 PM – 9:00 PM)">
                    {t('order.timeNight') || 'Night: 7-9 PM'}
                  </option>
                </select>
                {validationErrors.deliveryTime && (
                  <span className="error-message">
                    {validationErrors.deliveryTime}
                  </span>
                )}
              </div>
            )}

            {/* 6. Preferred Delivery Time (mandatory for all orders) */}
            <div className="form-group">
              <label>
                {t('order.preferredDeliveryTime') || 'Preferred Delivery Time'}{' '}
                *
                <span
                  className="helper-text-inline"
                  style={{
                    marginLeft: '8px',
                    fontSize: 'var(--admin-fs-sm, 12px)',
                    fontWeight: 'normal',
                  }}
                >
                  (e.g., 08:30, 14:00)
                </span>
              </label>
              <input
                type="time"
                value={preferredDeliveryTime}
                onChange={(e) => {
                  if (!kitchenStatus.isOpen) return;
                  setPreferredDeliveryTime(e.target.value);
                  if (validationErrors.preferredDeliveryTime) {
                    setValidationErrors((prev) => ({
                      ...prev,
                      preferredDeliveryTime: undefined,
                    }));
                  }
                }}
                className={
                  validationErrors.preferredDeliveryTime ? 'error' : ''
                }
                disabled={!kitchenStatus.isOpen}
                placeholder="HH:MM"
              />
              {validationErrors.preferredDeliveryTime && (
                <span className="error-message">
                  {validationErrors.preferredDeliveryTime}
                </span>
              )}
              <p
                className="helper-text"
                style={{
                  marginTop: '4px',
                  fontSize: 'var(--admin-fs-sm, 12px)',
                  color: '#666',
                }}
              >
                {t('order.preferredTimeHelper') ||
                  'Please note: Delivery may arrive 10 minutes earlier or later than your preferred time.'}
              </p>
            </div>
          </div>

          <div className="order-form-section">
            <div className="order-items-header">
              <h3>{t('order.orderItems') || 'Select Items'}</h3>
              {!loading &&
                galleryItems.length > 0 &&
                getAvailableItemsForDropdown().length > 0 && (
                  <div className="add-more-container">
                    <button
                      className="btn btn-ghost btn-small"
                      onClick={() => {
                        if (!kitchenStatus.isOpen) return;
                        setShowAddMoreDropdown(!showAddMoreDropdown);
                      }}
                      type="button"
                      aria-label="Add more items"
                      disabled={!kitchenStatus.isOpen}
                    >
                      <Icon name="plus" />
                      {t('order.addMore') || 'Add More'}
                    </button>
                    {showAddMoreDropdown && (
                      <div className="add-more-dropdown">
                        {getAvailableItemsForDropdown().map((item) => (
                          <button
                            key={item.id}
                            className="add-more-item"
                            onClick={() => handleAddItem(item.id)}
                            type="button"
                          >
                            <span className="add-more-item-name">
                              {item.name}
                            </span>
                            <span className="add-more-item-price">
                              ₹ {item.price}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
            </div>
            {loading ? (
              <InlineLoader
                message={t('common.loading') || 'Loading items...'}
              />
            ) : galleryItems.length === 0 ? (
              <div className="order-items-empty">
                {t('order.noItems') || 'No items available at the moment.'}
              </div>
            ) : getVisibleItems().length === 0 ? (
              <div className="order-items-empty">
                {getDefaultItems().length === 0
                  ? t('order.noItems') || 'No items available at the moment.'
                  : deliveryMode === 'home' && !deliveryTime
                    ? t('order.selectTimeFirst') ||
                      'Please select a delivery time slot to see available items.'
                    : t('order.noItemsForTimeSlot') ||
                      'No items available for the selected time slot. Please try another time slot or add items manually.'}
              </div>
            ) : (
              <>
                {deliveryMode === 'home' && deliveryTime && (
                  <div className="order-time-slot-info">
                    <Icon name="info-circle" />
                    <span>
                      {t('order.showingItemsFor') || 'Showing items for'}{' '}
                      {deliveryTime === 'morning'
                        ? t('order.timeMorning') || 'Morning'
                        : deliveryTime === 'noon'
                          ? t('order.timeNoon') || 'Noon'
                          : t('order.timeNight') || 'Night'}
                    </span>
                  </div>
                )}
                <div className="order-items-list">
                  {getVisibleItems().map((item) => {
                    const quantity = orderItems[item.id] || 0;
                    return (
                      <div key={item.id} className="order-item">
                        <div className="order-item-header">
                          <span className="order-item-name">{item.name}</span>
                          <div className="order-item-controls">
                            <button
                              className="btn btn-qty"
                              onClick={() => updateQuantity(item.id, -1)}
                              disabled={quantity === 0 || !kitchenStatus.isOpen}
                              aria-label="Decrease quantity"
                            >
                              <Icon name="minus" />
                            </button>
                            <span className="qty-value">{quantity}</span>
                            <button
                              className="btn btn-qty"
                              onClick={() => updateQuantity(item.id, 1)}
                              disabled={!kitchenStatus.isOpen}
                              aria-label="Increase quantity"
                            >
                              <Icon name="plus" />
                            </button>
                          </div>
                        </div>
                        <div className="order-item-info">
                          <span className="order-item-price">
                            ₹ {item.price}
                          </span>
                          {item.category && (
                            <span className="order-item-category">
                              {item.category}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
            {validationErrors.items && (
              <span className="error-message">{validationErrors.items}</span>
            )}
          </div>

          <div className="order-summary">
            <div className="order-summary-details">
              {getTotalPrice() > 0 && (
                <>
                  <div className="order-summary-row">
                    <span>{t('order.subtotal') || 'Subtotal'}:</span>
                    <span>₹ {getTotalPrice()}</span>
                  </div>
                  <div className="order-summary-row">
                    <span>
                      {deliveryMode === 'pickup'
                        ? t('order.pickupCharge') || 'Pickup Charge'
                        : t('order.deliveryCharge') || 'Delivery Charge'}
                      :
                    </span>
                    <span>
                      {deliveryMode === 'pickup' ? (
                        <span className="free-delivery">
                          {t('order.freeDelivery') || 'FREE'}
                        </span>
                      ) : getDeliveryCharge() === 0 ? (
                        <span className="free-delivery">
                          {t('order.freeDelivery') || 'FREE'}
                        </span>
                      ) : (
                        `₹${getDeliveryCharge()}`
                      )}
                    </span>
                  </div>
                  {deliveryMode === 'home' &&
                    getTotalPrice() > 0 &&
                    getTotalPrice() < 100 && (
                      <div className="order-minimum-notice">
                        {(
                          t('order.addMoreForFreeDelivery') ||
                          'Add ₹ {amount} more for free delivery'
                        ).replace('{amount}', String(100 - getTotalPrice()))}
                      </div>
                    )}
                  {deliveryMode === 'home' &&
                    getTotalPrice() > 0 &&
                    getTotalPrice() < 70 && (
                      <div className="order-minimum-warning">
                        {t('order.minimumOrderWarning') ||
                          'Minimum order of ₹70 required for home delivery. Please select pickup option for orders below ₹70.'}
                      </div>
                    )}
                  <div className="order-summary-total">
                    <strong>
                      {t('order.grandTotal') || 'Grand Total'}: ₹
                      {getGrandTotal()}
                    </strong>
                  </div>
                </>
              )}
            </div>
            <button
              className="btn btn-primary btn-large"
              onClick={handleWhatsAppOrder}
              disabled={
                loading || galleryItems.length === 0 || !kitchenStatus.isOpen
              }
              style={{
                opacity: !kitchenStatus.isOpen ? 0.6 : 1,
                cursor: !kitchenStatus.isOpen ? 'not-allowed' : 'pointer',
              }}
            >
              <Icon name="whatsapp" />{' '}
              {t('order.sendWhatsApp') || 'Send Order via WhatsApp'}
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && pendingOrderData && (
        <div className="order-modal-overlay" style={{ zIndex: 10000 }}>
          <div
            className="order-modal"
            style={{ maxWidth: '500px', zIndex: 10001 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="order-modal-content">
              <button
                className="order-modal-close"
                onClick={() => {
                  setShowConfirmModal(false);
                  setPendingOrderData(null);
                }}
              >
                <Icon name="xmark" />
              </button>
              <h2>
                <Icon
                  name="check-circle"
                  style={{ color: '#10b981', marginRight: '8px' }}
                />
                {t('order.confirmOrder') || 'Confirm Order'}
              </h2>

              <div style={{ marginBottom: '20px' }}>
                <div
                  style={{
                    backgroundColor: '#fef3c7',
                    border: '1px solid #fbbf24',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '20px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                    }}
                  >
                    <Icon
                      name="info-circle"
                      style={{
                        color: '#f59e0b',
                        fontSize: 'var(--admin-fs-lg, 18px)',
                        marginTop: '2px',
                      }}
                    />
                    <div>
                      <strong
                        style={{
                          display: 'block',
                          marginBottom: '8px',
                          color: '#92400e',
                        }}
                      >
                        {t('order.deliveryTimeDisclaimer') ||
                          'Delivery Time Disclaimer'}
                      </strong>
                      <p
                        style={{
                          margin: 0,
                          fontSize: 'var(--admin-fs-base, 14px)',
                          color: '#78350f',
                          lineHeight: '1.5',
                        }}
                      >
                        {t('order.deliveryTimeDisclaimerText') ||
                          'Please note that your order may arrive up to 10 minutes earlier or later than your preferred delivery time due to traffic conditions and order volume. We appreciate your understanding.'}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: '#f9fafb',
                    borderRadius: '8px',
                    padding: '16px',
                    border: '1px solid #e5e7eb',
                  }}
                >
                  <h3
                    style={{
                      marginTop: 0,
                      marginBottom: '12px',
                      fontSize: 'var(--admin-fs-md, 16px)',
                    }}
                  >
                    {t('order.orderSummary') || 'Order Summary'}
                  </h3>
                  <div
                    style={{
                      fontSize: 'var(--admin-fs-base, 14px)',
                      lineHeight: '1.8',
                    }}
                  >
                    <div>
                      <strong>Customer:</strong> {pendingOrderData.customerName}
                    </div>
                    <div>
                      <strong>Address:</strong> {pendingOrderData.addressText}
                    </div>
                    <div>
                      <strong>Date:</strong> {pendingOrderData.formattedDate}
                    </div>
                    {pendingOrderData.deliveryMode === 'home' && (
                      <div>
                        <strong>Time Slot:</strong> {pendingOrderData.timeLabel}
                      </div>
                    )}
                    <div>
                      <strong>Preferred Time:</strong>{' '}
                      {(() => {
                        const [hours, minutes] =
                          pendingOrderData.preferredDeliveryTime.split(':');
                        const hour12 = parseInt(hours) % 12 || 12;
                        const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
                        return `${hour12}:${minutes} ${ampm}`;
                      })()}{' '}
                      (±10 minutes)
                    </div>
                    <div
                      style={{
                        marginTop: '8px',
                        paddingTop: '8px',
                        borderTop: '1px solid #e5e7eb',
                      }}
                    >
                      <strong>Total:</strong> ₹ {pendingOrderData.grandTotal}
                    </div>
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'flex-end',
                }}
              >
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowConfirmModal(false);
                    setPendingOrderData(null);
                  }}
                  style={{ padding: '12px 24px' }}
                >
                  {t('order.cancel') || 'Cancel'}
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setShowConfirmModal(false);
                    proceedToWhatsApp(pendingOrderData);
                    setPendingOrderData(null);
                  }}
                  style={{ padding: '12px 24px' }}
                >
                  <Icon name="whatsapp" style={{ marginRight: '8px' }} />
                  {t('order.confirmAndSend') || 'Confirm & Send to WhatsApp'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderModal;
