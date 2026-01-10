import { useCallback, useEffect, useRef, useState } from 'react';
import { parseOrderDate } from './utils/dateUtils.js';
import {
  calculateTotalAmount,
  extractBillingMonth,
  extractBillingYear,
  formatBillingMonth,
  formatCurrency,
  getLastOrderForAddress,
} from './utils/orderUtils.js';

const OrderModal = ({
  show,
  editingOrder,
  newOrder,
  orders,
  addressSuggestions,
  showAddressSuggestions,
  onClose,
  onSave,
  onNewOrderChange,
  onEditingOrderChange,
  setAddressSuggestions,
  setShowAddressSuggestions,
}) => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({}); // Track which fields have been interacted with
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [autoPopulatedAddress, setAutoPopulatedAddress] = useState(null);
  const [isClickingSuggestion, setIsClickingSuggestion] = useState(false);
  const dropdownRef = useRef(null);
  const selectedAddressRef = useRef(null); // Store selected address to prevent clearing
  const addressDebounceTimerRef = useRef(null);

  // Generate OrderID preview (format: HB-Feb'24-02-000079)
  // Format: HB-[MonthAbbr]'[YY]-[MM]-[Sequence]
  // Where MM is month number (01-12), not day
  // Shows next number from the very last record
  const generateOrderIdPreview = () => {
    if (editingOrder) return editingOrder.orderId || 'N/A';
    if (!newOrder.date) return 'HB-XXX-XX-XXXXXX';

    try {
      // Parse date from DD/MM/YYYY or YYYY-MM-DD format
      let date;
      if (typeof newOrder.date === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(newOrder.date)) {
        // DD/MM/YYYY format
        const [day, month, year] = newOrder.date.split('/').map(Number);
        date = new Date(year, month - 1, day);
      } else {
        date = parseOrderDate(newOrder.date);
      }

      if (!date || isNaN(date.getTime())) {
        return 'HB-XXX-XX-XXXXXX';
      }

      const monthAbbr = date.toLocaleString('en-US', { month: 'short' });
      const year = date.getFullYear().toString().slice(-2);
      const monthNum = String(date.getMonth() + 1).padStart(2, '0'); // Month number (01-12)

      // Find the maximum sequence number from ALL orders (not just alphabetically last)
      // Use a fresh copy of orders to ensure we have the latest data
      const currentOrders = orders || [];
      if (currentOrders.length > 0) {
        let maxSequence = 0;

        // Extract sequence numbers from all orders and find the maximum
        currentOrders.forEach((order) => {
          if (order.orderId) {
            // Extract sequence number from order ID (format: HB-Feb'24-02-000079)
            const match = order.orderId.match(/HB-\w+'?\d{2}-\d{2}-(\d+)$/);
            if (match && match[1]) {
              const seq = parseInt(match[1], 10);
              if (seq > maxSequence) {
                maxSequence = seq;
              }
            }
          }
        });

        if (maxSequence > 0) {
          const nextSequence = String(maxSequence + 1).padStart(6, '0');
          return `HB-${monthAbbr}'${year}-${monthNum}-${nextSequence}`;
        }
      }

      return `HB-${monthAbbr}'${year}-${monthNum}-000001`;
    } catch (e) {
      return 'HB-XXX-XX-XXXXXX';
    }
  };

  // Check for duplicate address on same day
  useEffect(() => {
    if (!show || editingOrder || !newOrder.date || !newOrder.deliveryAddress) {
      setDuplicateWarning(null);
      return;
    }

    const orderDate = new Date(newOrder.date);
    const startOfDay = new Date(orderDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(orderDate);
    endOfDay.setHours(23, 59, 59, 999);

    const duplicate = orders.find((o) => {
      try {
        const oDate = new Date(o.date || o.order_date || 0);
        const addr = o.deliveryAddress || o.customerAddress || o.address;
        return (
          oDate >= startOfDay &&
          oDate <= endOfDay &&
          addr &&
          addr.toLowerCase().trim() === newOrder.deliveryAddress.toLowerCase().trim()
        );
      } catch (e) {
        return false;
      }
    });

    if (duplicate) {
      setDuplicateWarning({
        address: newOrder.deliveryAddress,
        mode: duplicate.mode || 'N/A',
      });
    } else {
      setDuplicateWarning(null);
    }
  }, [show, editingOrder, newOrder.date, newOrder.deliveryAddress, orders]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (addressDebounceTimerRef.current) {
        clearTimeout(addressDebounceTimerRef.current);
      }
    };
  }, []);

  // Smart defaults based on time and context
  useEffect(() => {
    if (!show || editingOrder) {
      // Reset auto-populated address when modal closes or editing
      setAutoPopulatedAddress(null);
      // Clear debounce timer
      if (addressDebounceTimerRef.current) {
        clearTimeout(addressDebounceTimerRef.current);
      }
      return;
    }

    // Don't set any defaults - form should start empty for new orders
    // User will fill all fields manually
  }, [show, editingOrder]);

  // Validate form fields
  const validateForm = useCallback(
    (orderToValidate = null) => {
      const errors = {};
      const order = orderToValidate || editingOrder || newOrder;

      if (!order.date) {
        errors.date = 'Date is required';
      } else {
        let dateToValidate = order.date;
        if (typeof order.date === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(order.date)) {
          // Convert DD/MM/YYYY to YYYY-MM-DD for validation
          dateToValidate = parseDateFromInput(order.date);
          if (!dateToValidate) {
            errors.date = 'Invalid date format. Please use DD/MM/YYYY format (e.g., 01/08/2026)';
          }
        }

        if (dateToValidate) {
          const date = parseOrderDate(dateToValidate);
          if (!date || isNaN(date.getTime())) {
            errors.date = 'Invalid date format. Please use DD/MM/YYYY format (e.g., 01/08/2026)';
          } else {
            // Check if date is in the future
            const today = new Date();
            today.setHours(23, 59, 59, 999);
            if (date > today) {
              errors.date = 'Cannot select future date';
            }
          }
        }
      }

      if (!order.deliveryAddress || order.deliveryAddress.trim().length < 3) {
        errors.deliveryAddress = 'Address must be at least 3 characters';
      } else if (!/^[A-Z0-9\-/\s]+$/i.test(order.deliveryAddress)) {
        errors.deliveryAddress = 'Invalid address format';
      }

      if (!order.quantity || order.quantity < 1) {
        errors.quantity = 'Quantity must be at least 1';
      } else if (order.quantity > 50) {
        errors.quantity = 'Quantity cannot exceed 50';
      }

      if (!order.unitPrice || order.unitPrice < 10) {
        errors.unitPrice = 'Unit price must be at least ₹10';
      } else if (order.unitPrice > 1000) {
        errors.unitPrice = 'Unit price cannot exceed ₹1000';
      }

      const calculatedTotal = (order.quantity || 1) * (order.unitPrice || 0);
      if (order.totalAmount && Math.abs(order.totalAmount - calculatedTotal) > 0.01) {
        errors.totalAmount = 'Total amount mismatch';
      }

      if (!order.mode) {
        errors.mode = 'Mode is required';
      }

      const normalizedStatus = order.status ? String(order.status).trim() : '';
      if (!normalizedStatus) {
        errors.status = 'Status is required';
      } else if (!['Paid', 'Unpaid'].includes(normalizedStatus)) {
        errors.status = 'Status must be either Paid or Unpaid';
      }

      // Payment mode is optional - can be None, Cash, Online, or empty
      const normalizedPaymentMode = order.paymentMode ? String(order.paymentMode).trim() : '';
      if (normalizedPaymentMode && !['None', 'Cash', 'Online'].includes(normalizedPaymentMode)) {
        errors.paymentMode = 'Payment mode must be None, Cash, or Online';
      }

      setFormErrors(errors);
      return Object.keys(errors).length === 0;
    },
    [editingOrder, newOrder]
  );

  // Real-time validation - only for fields that have been touched
  useEffect(() => {
    if (!show) {
      setFormErrors({});
      setTouchedFields({});
      return;
    }

    const order = editingOrder || newOrder;
    if (!order || Object.keys(touchedFields).length === 0) {
      return;
    }

    // Debounce validation to avoid too frequent updates
    const timer = setTimeout(() => {
      const errors = {};
      const orderToValidate = order;

      if (touchedFields.date && !orderToValidate.date) {
        errors.date = 'Date is required';
      }

      if (touchedFields.deliveryAddress) {
        if (!orderToValidate.deliveryAddress || orderToValidate.deliveryAddress.trim().length < 3) {
          errors.deliveryAddress = 'Address must be at least 3 characters';
        } else if (!/^[A-Z0-9\-/\s]+$/i.test(orderToValidate.deliveryAddress)) {
          errors.deliveryAddress = 'Invalid address format';
        }
      }

      if (touchedFields.quantity) {
        if (!orderToValidate.quantity || orderToValidate.quantity < 1) {
          errors.quantity = 'Quantity must be at least 1';
        } else if (orderToValidate.quantity > 50) {
          errors.quantity = 'Quantity cannot exceed 50';
        }
      }

      if (touchedFields.unitPrice) {
        if (!orderToValidate.unitPrice || orderToValidate.unitPrice < 10) {
          errors.unitPrice = 'Unit price must be at least ₹10';
        } else if (orderToValidate.unitPrice > 1000) {
          errors.unitPrice = 'Unit price cannot exceed ₹1000';
        }
      }

      if (touchedFields.mode && !orderToValidate.mode) {
        errors.mode = 'Mode is required';
      }

      if (touchedFields.status) {
        const normalizedStatus = orderToValidate.status
          ? String(orderToValidate.status).trim()
          : '';
        if (!normalizedStatus) {
          errors.status = 'Status is required';
        } else if (!['Paid', 'Unpaid'].includes(normalizedStatus)) {
          errors.status = 'Status must be either Paid or Unpaid';
        }
      }

      setFormErrors(errors);
    }, 300);

    return () => clearTimeout(timer);
  }, [
    show,
    touchedFields,
    editingOrder?.date,
    editingOrder?.deliveryAddress,
    editingOrder?.quantity,
    editingOrder?.unitPrice,
    editingOrder?.mode,
    editingOrder?.status,
    newOrder?.date,
    newOrder?.deliveryAddress,
    newOrder?.quantity,
    newOrder?.unitPrice,
    newOrder?.mode,
    newOrder?.status,
  ]);

  // Track form changes
  useEffect(() => {
    if (show && !editingOrder) {
      setHasUnsavedChanges(
        !!(newOrder.date || newOrder.deliveryAddress || newOrder.quantity || newOrder.unitPrice)
      );
    }
  }, [show, editingOrder, newOrder]);

  const handleClose = () => {
    if (hasUnsavedChanges && !editingOrder) {
      if (window.confirm('You have unsaved changes. Are you sure you want to close?')) {
        setHasUnsavedChanges(false);
        setFormErrors({});
        setTouchedFields({});
        setDuplicateWarning(null);
        setAutoPopulatedAddress(null);
        onClose();
      }
    } else {
      setHasUnsavedChanges(false);
      setFormErrors({});
      setDuplicateWarning(null);
      setAutoPopulatedAddress(null);
      onClose();
    }
  };

  const handleSave = async () => {
    // Prevent multiple simultaneous saves
    if (isSaving) {
      return;
    }

    // Normalize status and paymentMode before validation (trim whitespace)
    // Use current state values to ensure we have all fields
    const orderToValidate = editingOrder || newOrder;
    const normalizedOrder = {
      ...orderToValidate,
      // Ensure we have all required fields from current state
      date: orderToValidate.date || newOrder.date,
      deliveryAddress: orderToValidate.deliveryAddress || newOrder.deliveryAddress,
      quantity: orderToValidate.quantity || newOrder.quantity,
      unitPrice: orderToValidate.unitPrice || newOrder.unitPrice,
      mode: orderToValidate.mode || newOrder.mode,
      status: orderToValidate.status || newOrder.status,
      paymentMode: orderToValidate.paymentMode || newOrder.paymentMode,
      orderId: orderToValidate.orderId || newOrder.orderId,
    };

    // Normalize status to ensure consistency
    if (normalizedOrder.status) {
      normalizedOrder.status = String(normalizedOrder.status).trim();
      // Also update paymentStatus for consistency with database schema
      if (normalizedOrder.status === 'Paid' || normalizedOrder.status.toLowerCase() === 'paid') {
        normalizedOrder.paymentStatus = 'Paid';
      } else if (normalizedOrder.status === 'Unpaid' || normalizedOrder.status.toLowerCase() === 'unpaid') {
        normalizedOrder.paymentStatus = 'Pending'; // Database default for unpaid
      } else {
        normalizedOrder.paymentStatus = normalizedOrder.paymentStatus || 'Pending';
      }
    }
    
    // Normalize paymentMode (trim whitespace, allow empty string for 'None')
    if (normalizedOrder.paymentMode !== undefined && normalizedOrder.paymentMode !== null) {
      if (normalizedOrder.paymentMode === '' || normalizedOrder.paymentMode === 'None') {
        normalizedOrder.paymentMode = ''; // Empty string is allowed
      } else {
        normalizedOrder.paymentMode = String(normalizedOrder.paymentMode).trim();
      }
    }

    // Update state with normalized values
    if (
      normalizedOrder.status !== orderToValidate.status ||
      normalizedOrder.paymentMode !== orderToValidate.paymentMode
    ) {
      if (editingOrder) {
        onEditingOrderChange(normalizedOrder);
      } else {
        Object.keys(normalizedOrder).forEach((key) => {
          if (normalizedOrder[key] !== orderToValidate[key]) {
            onNewOrderChange(key, normalizedOrder[key]);
          }
        });
      }
    }

    // Convert date from DD/MM/YYYY to YYYY-MM-DD before validation and saving
    if (
      !editingOrder &&
      normalizedOrder.date &&
      typeof normalizedOrder.date === 'string' &&
      /^\d{2}\/\d{2}\/\d{4}$/.test(normalizedOrder.date)
    ) {
      const backendDate = parseDateFromInput(normalizedOrder.date);
      if (backendDate) {
        normalizedOrder.date = backendDate;
        onNewOrderChange('date', backendDate);
      }
    }

    // Auto-set order ID for new records if not already set
    // Generate fresh ID at save time to prevent duplicates from rapid clicks
    if (!editingOrder) {
      // Use current orders list to check for duplicates
      const currentOrders = orders || [];
      let generatedId = generateOrderIdPreview();

      if (generatedId && generatedId !== 'HB-XXX-XX-XXXXXX') {
        // Check if this ID already exists in orders (prevent duplicate)
        let idExists = currentOrders.some((o) => o.orderId === generatedId);

        // If ID exists, increment sequence until we find a unique one
        if (idExists) {
          const match = generatedId.match(/^(HB-\w+'?\d{2}-\d{2}-)(\d+)$/);
          if (match) {
            const prefix = match[1];
            let currentSeq = parseInt(match[2], 10);
            let attempts = 0;
            const maxAttempts = 1000; // Prevent infinite loop

            // Keep incrementing until we find a unique ID
            while (idExists && attempts < maxAttempts) {
              currentSeq++;
              generatedId = `${prefix}${String(currentSeq).padStart(6, '0')}`;
              idExists = currentOrders.some((o) => o.orderId === generatedId);
              attempts++;
            }

            if (attempts >= maxAttempts) {
              throw new Error('Unable to generate unique order ID. Please try again.');
            }
          }
        }

        // Set the unique order ID
        normalizedOrder.orderId = generatedId;
        onNewOrderChange('orderId', generatedId);
      } else {
        throw new Error('Unable to generate order ID. Please check the date field.');
      }
    }

    setTouchedFields({
      date: true,
      deliveryAddress: true,
      quantity: true,
      unitPrice: true,
      mode: true,
      status: true,
      paymentMode: true,
    });

    // Validate with normalized order
    if (!validateForm(normalizedOrder)) {
      return;
    }
    if (
      duplicateWarning &&
      !window.confirm(
        `⚠️ Warning: ${duplicateWarning.address} already has an order today (${duplicateWarning.mode})\nDo you want to add another order?`
      )
    ) {
      return;
    }

    // Double-check: Ensure we're not already saving
    if (isSaving) {
      return;
    }

    setIsSaving(true);
    setSaveSuccess(false);

    try {
      // Pass the normalized order data to onSave
      if (editingOrder) {
        const cleanOrderData = {};
        
        // Define allowed fields that can be updated
        const allowedFields = {
          date: normalizedOrder.date,
          deliveryAddress: normalizedOrder.deliveryAddress,
          quantity: normalizedOrder.quantity,
          unitPrice: normalizedOrder.unitPrice,
          mode: normalizedOrder.mode,
          status: normalizedOrder.status,
          paymentStatus: normalizedOrder.paymentStatus,
          paymentMode: normalizedOrder.paymentMode, // Can be empty string
          notes: normalizedOrder.notes,
          customerName: normalizedOrder.customerName,
          addressId: normalizedOrder.addressId,
        };
        
        Object.keys(allowedFields).forEach(key => {
          const value = allowedFields[key];
          if (value !== undefined) {
            if (key === 'paymentMode' || key === 'notes' || key === 'customerName' || key === 'addressId') {
              // These fields can be empty strings
              cleanOrderData[key] = value === null ? '' : value;
            } else {
              cleanOrderData[key] = value;
            }
          }
        });
        
        // Include billingMonth/billingYear if they exist (from date calculation)
        if (normalizedOrder.billingMonth !== undefined) {
          cleanOrderData.billingMonth = normalizedOrder.billingMonth;
        }
        if (normalizedOrder.billingYear !== undefined) {
          cleanOrderData.billingYear = normalizedOrder.billingYear;
        }
        
        await onSave(editingOrder.orderId || editingOrder._id, cleanOrderData);
        // Close modal after editing
        setTimeout(() => {
          setIsSaving(false);
          onClose();
        }, 500);
      } else {
        // For new orders, ensure order ID is set before saving
        if (!normalizedOrder.orderId) {
          throw new Error('Order ID is required. Please try again.');
        }

        // Final check: Verify order ID doesn't exist (race condition protection)
        const currentOrders = orders || [];
        const finalIdCheck = currentOrders.some((o) => o.orderId === normalizedOrder.orderId);
        if (finalIdCheck) {
          throw new Error('Order ID already exists. Please try again.');
        }

        await onSave(normalizedOrder);

        // Show success message briefly
        setSaveSuccess(true);

        // Form reset is handled by AdminDashboard after data refresh
        // Just clear local state and show success
        setTimeout(() => {
          setSaveSuccess(false);
          setIsSaving(false);
          setFormErrors({});
          setTouchedFields({});
          setDuplicateWarning(null);
          setAutoPopulatedAddress(null);
          selectedAddressRef.current = null;
        }, 1500);
      }
    } catch (error) {
      setIsSaving(false);
      setSaveSuccess(false);

      // Show error to user
      if (error.message) {
        alert(error.message);
      }

      // Keep button disabled briefly after error to prevent rapid retries
      setTimeout(() => {
        // Button will be re-enabled after timeout
      }, 2000);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    if (!show) return;

    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 's') {
          e.preventDefault();
          handleSave();
        }
      }
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [show, hasUnsavedChanges]);

  if (!show) return null;

  // Enhanced address suggestions with frequency and recent orders
  // Show top 5 addresses: top 5 when empty, or top 5 matching when typing
  const getAddressSuggestions = (query) => {
    const queryLower = query.trim().toLowerCase();

    // Calculate address frequency for all addresses
    const addressFrequency = {};
    orders.forEach((order) => {
      const addr = order.deliveryAddress || order.customerAddress || order.address;
      if (addr) {
        addressFrequency[addr] = (addressFrequency[addr] || 0) + 1;
      }
    });

    if (!queryLower) {
      // Show top 5 most frequently used addresses when empty
      return Object.entries(addressFrequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([addr]) => addr);
    }

    // When typing, filter and rank by relevance, show top 5 matching addresses
    const allAddresses = Object.keys(addressFrequency);
    const filtered = allAddresses
      .filter((addr) => addr.toLowerCase().includes(queryLower))
      .map((addr) => {
        // Calculate relevance score
        const exactMatch = addr.toLowerCase() === queryLower ? 100 : 0;
        const startsWith = addr.toLowerCase().startsWith(queryLower) ? 50 : 0;
        const frequency = addressFrequency[addr] || 0;

        return {
          address: addr,
          score: exactMatch + startsWith + frequency,
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((item) => item.address);

    return filtered;
  };

  const handleAddressChange = (value) => {
    // Don't process if we're in the middle of clicking a suggestion
    // UNLESS the value is being cleared (empty string) - then allow it
    if (isClickingSuggestion && value.trim().length > 0) {
      return;
    }

    setTouchedFields((prev) => ({ ...prev, deliveryAddress: true }));

    if (editingOrder) {
      onEditingOrderChange({ ...editingOrder, deliveryAddress: value });
    } else {
      onNewOrderChange('deliveryAddress', value);
      // Show enhanced suggestions as user types (or top 5 when empty)
      const suggestions = getAddressSuggestions(value);
      setAddressSuggestions(suggestions);
      // Show suggestions if there are any (including when empty for top 5)
      setShowAddressSuggestions(suggestions.length > 0);

      // Debounce auto-population to avoid triggering on every keystroke
      // Clear previous timer
      if (addressDebounceTimerRef.current) {
        clearTimeout(addressDebounceTimerRef.current);
      }

      // Set new timer to check after user stops typing (800ms)
      addressDebounceTimerRef.current = setTimeout(() => {
        const normalizedValue = value.trim().toLowerCase();

        // Reset auto-populated address if user clears the address
        if (normalizedValue.length < 3) {
          if (autoPopulatedAddress) {
            setAutoPopulatedAddress(null);
          }
          return;
        }

        if (normalizedValue !== autoPopulatedAddress) {
          // Check if this address exists in orders
          const lastOrder = getLastOrderForAddress(orders, normalizedValue);
          if (lastOrder) {
            // Verify exact match (case-insensitive)
            const lastOrderAddress = String(
              lastOrder.deliveryAddress || lastOrder.customerAddress || lastOrder.address || ''
            )
              .trim()
              .toLowerCase();

            if (lastOrderAddress === normalizedValue) {
              // Mark this address as auto-populated (for tracking only)
              setAutoPopulatedAddress(normalizedValue);
              // Don't auto-populate any other fields - only address
            }
          } else {
            // No previous order found - clear auto-populated state
            if (autoPopulatedAddress) {
              setAutoPopulatedAddress(null);
            }
          }
        }
      }, 800); // Wait 800ms after user stops typing
    }
  };

  const handleAddressFocus = () => {
    if (!editingOrder) {
      const query = String(newOrder.deliveryAddress || '').trim();
      const suggestions = getAddressSuggestions(query);
      setAddressSuggestions(suggestions);
      setShowAddressSuggestions(suggestions.length > 0);
    }
  };

  const handleAddressBlur = () => {
    setTouchedFields((prev) => ({ ...prev, deliveryAddress: true }));

    // Simple timeout - if clicking on suggestion, flag will prevent hiding
    // Use longer timeout to ensure click handler has finished
    setTimeout(() => {
      if (!isClickingSuggestion) {
        setShowAddressSuggestions(false);

        // Auto-fill last order details when leaving address field
        if (!editingOrder && newOrder.deliveryAddress) {
          const normalizedValue = newOrder.deliveryAddress.trim().toLowerCase();

          if (normalizedValue.length >= 3 && normalizedValue !== autoPopulatedAddress) {
            const lastOrder = getLastOrderForAddress(orders, normalizedValue);
            if (lastOrder) {
              // Verify exact match (case-insensitive)
              const lastOrderAddress = String(
                lastOrder.deliveryAddress || lastOrder.customerAddress || lastOrder.address || ''
              )
                .trim()
                .toLowerCase();

              if (lastOrderAddress === normalizedValue) {
                setAutoPopulatedAddress(normalizedValue);
                // Don't auto-populate any other fields - only address
              }
            }
          }
        }
      }
    }, 300);
  };

  const handleSuggestionClick = (addr) => {
    const normalizedAddr = addr.trim().toLowerCase();
    const trimmedAddr = addr.trim();

    // Store in ref to prevent clearing
    selectedAddressRef.current = trimmedAddr;

    // Set flag FIRST to prevent blur handler from interfering
    setIsClickingSuggestion(true);
    onNewOrderChange('deliveryAddress', trimmedAddr);

    setAutoPopulatedAddress(normalizedAddr);

    // Focus the input FIRST to prevent blur issues
    const input = document.getElementById('delivery-address-input');
    if (input) {
      // Focus immediately to prevent blur
      input.focus();
    }

    // Delay hiding suggestions to ensure state update has propagated
    // This prevents the address from being cleared when dropdown disappears
    setTimeout(() => {
      setShowAddressSuggestions(false);

      // Safety check: Ensure address is still set after hiding
      if (input && selectedAddressRef.current) {
        const currentValue = editingOrder
          ? editingOrder.deliveryAddress || ''
          : newOrder.deliveryAddress || '';

        // If address was cleared, restore it
        if (!currentValue || currentValue !== selectedAddressRef.current) {
          onNewOrderChange('deliveryAddress', selectedAddressRef.current);
          // Also update input directly as backup
          if (input) {
            input.value = selectedAddressRef.current;
          }
        }
      }
    }, 150);

    // Keep flag set longer to prevent any blur interference
    setTimeout(() => {
      setIsClickingSuggestion(false);
    }, 500);

    // Don't auto-populate any fields - only set the address
    // User will fill other fields manually
  };

  // Get address order history for suggestions
  const getAddressOrderInfo = (addr) => {
    const addressOrders = orders.filter(
      (o) => (o.deliveryAddress || o.customerAddress || o.address) === addr
    );
    const lastOrder = addressOrders[addressOrders.length - 1];
    return {
      count: addressOrders.length,
      lastPrice: lastOrder
        ? lastOrder.unitPrice || lastOrder.totalAmount / (lastOrder.quantity || 1)
        : null,
      // Never use createdAt (today's date) as fallback - only use actual order date
      lastDate: lastOrder ? lastOrder.date || lastOrder.order_date || null : null,
    };
  };

  // Helper function to convert YYYY-MM-DD to DD/MM/YYYY
  const formatDateForInput = (dateValue) => {
    if (!dateValue) return '';
    try {
      const date = parseOrderDate(dateValue);
      if (!date) {
        // Try parsing as DD/MM/YYYY string
        if (typeof dateValue === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(dateValue)) {
          return dateValue;
        }
        return '';
      }
      const day = String(date.getUTCDate()).padStart(2, '0');
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const year = date.getUTCFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return '';
    }
  };

  // Helper function to convert DD/MM/YYYY to YYYY-MM-DD for backend
  const parseDateFromInput = (dateStr) => {
    if (!dateStr) return '';
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
      const [day, month, year] = dateStr.split('/').map(Number);
      if (day >= 1 && day <= 31 && month >= 1 && month <= 12 && year >= 2000 && year <= 2100) {
        return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      }
    }
    // If already in YYYY-MM-DD format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return dateStr;
    }
    return '';
  };

  // Get current date value for input (DD/MM/YYYY format)
  const getCurrentDateValue = () => {
    if (editingOrder) {
      if (editingOrder.date) {
        return formatDateForInput(editingOrder.date);
      }
      if (editingOrder.order_date) {
        return formatDateForInput(editingOrder.order_date);
      }
      return formatDateForInput(new Date());
    } else {
      if (newOrder.date) {
        // If it's already in DD/MM/YYYY format, return as is
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(newOrder.date)) {
          return newOrder.date;
        }
        // Otherwise format it
        return formatDateForInput(newOrder.date);
      }
      return formatDateForInput(new Date());
    }
  };

  // Calculate derived fields for display
  const getOrderDateForCalculation = () => {
    if (editingOrder) {
      return parseOrderDate(editingOrder.date || editingOrder.order_date);
    } else {
      // Convert DD/MM/YYYY to Date object for calculation
      const dateStr = newOrder.date;
      if (dateStr && /^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
        const backendDate = parseDateFromInput(dateStr);
        return parseOrderDate(backendDate);
      }
      return parseOrderDate(dateStr);
    }
  };

  const orderDate = getOrderDateForCalculation();
  const billingMonth = orderDate ? extractBillingMonth(orderDate) : null;
  const billingYear = orderDate ? extractBillingYear(orderDate) : null;
  const billingMonthFormatted =
    billingMonth && billingYear ? formatBillingMonth(billingMonth, billingYear) : '';

  return (
    <div className='modal-overlay' onClick={onClose}>
      <div className='modal-container' onClick={(e) => e.stopPropagation()}>
        <div className='modal-header'>
          <h2>{editingOrder ? 'Edit Order' : 'Add New Order'}</h2>
          <button className='modal-close' onClick={onClose}>
            <i className='fa-solid fa-times'></i>
          </button>
        </div>
        <div className='modal-body'>
          <div className='form-group'>
            <label className={editingOrder?.dateNeedsReview ? 'required error' : 'required'}>
              <i className='fa-solid fa-calendar mr-2'></i>
              Date
              {editingOrder?.dateNeedsReview && (
                <span className='error-text ml-2'>⚠️ Invalid Date Format - Please Correct</span>
              )}
            </label>
            {editingOrder?.dateNeedsReview && editingOrder?.originalDateString && (
              <div className='badge badge-warning mb-2 p-3'>
                <strong>Original Invalid Date:</strong> {editingOrder.originalDateString}
                <br />
                <span className='helper-text mt-1 block'>
                  Please select the correct date below. This will clear the error flag.
                </span>
              </div>
            )}
            <input
              type='text'
              className={`input-field ${editingOrder?.dateNeedsReview ? 'error' : ''}`}
              value={getCurrentDateValue()}
              onChange={(e) => {
                const inputValue = e.target.value;
                // Allow user to type DD/MM/YYYY format
                // Remove any non-digit characters except /
                const cleaned = inputValue.replace(/[^\d/]/g, '');

                // Auto-format as user types: DD/MM/YYYY
                let formatted = cleaned;
                if (cleaned.length > 2 && !cleaned.includes('/')) {
                  formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
                }
                if (formatted.length > 5 && formatted.split('/').length === 2) {
                  formatted = formatted.slice(0, 5) + '/' + formatted.slice(5, 9);
                }

                // Limit to DD/MM/YYYY format (10 characters)
                if (formatted.length <= 10) {
                  if (editingOrder) {
                    // Convert to YYYY-MM-DD for backend storage
                    const backendDate = parseDateFromInput(formatted);
                    onEditingOrderChange({
                      ...editingOrder,
                      date: backendDate || formatted, // Store formatted if parsing fails (will validate later)
                      dateNeedsReview: false,
                      originalDateString: undefined,
                    });
                  } else {
                    // Store in DD/MM/YYYY format for display, convert to YYYY-MM-DD on save
                    onNewOrderChange('date', formatted);
                  }
                }
              }}
              onBlur={(e) => {
                // Validate and format on blur
                const inputValue = e.target.value.trim();
                if (inputValue) {
                  const backendDate = parseDateFromInput(inputValue);
                  if (backendDate) {
                    // Valid date, convert back to DD/MM/YYYY for display
                    const formatted = formatDateForInput(backendDate);
                    if (editingOrder) {
                      onEditingOrderChange({
                        ...editingOrder,
                        date: backendDate,
                        dateNeedsReview: false,
                      });
                    } else {
                      onNewOrderChange('date', formatted);
                    }
                  } else {
                    // Invalid date format
                    if (editingOrder) {
                      onEditingOrderChange({
                        ...editingOrder,
                        dateNeedsReview: true,
                        originalDateString: inputValue,
                      });
                    }
                  }
                }
              }}
              placeholder='DD/MM/YYYY'
              required
              maxLength={10}
              pattern='\\d{2}/\\d{2}/\\d{4}'
            />
            <span className='helper-text'>Format: DD/MM/YYYY (e.g., 01/08/2026)</span>
            {formErrors.date && <span className='error-text'>{formErrors.date}</span>}
          </div>
          <div className='form-group' style={{ position: 'relative' }}>
            <label className='required'>
              <i className='fa-solid fa-home mr-2'></i>
              Delivery Address
            </label>
            <input
              type='text'
              className={`input-field ${formErrors.deliveryAddress ? 'error' : ''}`}
              value={
                editingOrder
                  ? editingOrder.deliveryAddress || ''
                  : newOrder.deliveryAddress || selectedAddressRef.current || ''
              }
              onChange={(e) => {
                // Clear ref when user manually types
                if (!isClickingSuggestion) {
                  selectedAddressRef.current = null;
                }
                handleAddressChange(e.target.value);
              }}
              onFocus={handleAddressFocus}
              onBlur={handleAddressBlur}
              placeholder='Start typing address (e.g., A3-1206)'
              required
              autoComplete='off'
              id='delivery-address-input'
            />
            {showAddressSuggestions && addressSuggestions.length > 0 && !editingOrder && (
              <div
                ref={dropdownRef}
                className='address-suggestions-dropdown'
                onMouseDown={(e) => {
                  // Prevent input blur when clicking anywhere in dropdown
                  e.preventDefault();
                }}
                style={{
                  maxHeight: '300px',
                  overflowY: 'auto',
                  zIndex: 1000,
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  marginTop: '4px',
                  background: 'var(--admin-bg, #ffffff)',
                  border: '1px solid var(--admin-border, #cbd5e1)',
                  borderRadius: '12px',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.08)',
                }}
              >
                <div
                  className='address-suggestions-header'
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid var(--admin-border, #cbd5e1)',
                    background: 'var(--admin-accent-light, rgba(68, 144, 49, 0.05))',
                    fontWeight: '600',
                    fontSize: '13px',
                    color: 'var(--admin-text-secondary, #475569)',
                  }}
                >
                  <i className='fa-solid fa-lightbulb mr-2'></i>
                  {addressSuggestions.length} suggestion{addressSuggestions.length !== 1 ? 's' : ''}{' '}
                  found
                </div>
                {addressSuggestions.map((addr, idx) => {
                  const info = getAddressOrderInfo(addr);
                  return (
                    <button
                      key={idx}
                      type='button'
                      className='address-suggestion-item'
                      onMouseDown={(e) => {
                        // MouseDown fires before blur - prevent blur
                        setIsClickingSuggestion(true);
                        e.preventDefault(); // Prevent input blur
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleSuggestionClick(addr);
                      }}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        cursor: 'pointer',
                        border: 'none',
                        background: 'transparent',
                        textAlign: 'left',
                        borderBottom:
                          idx < addressSuggestions.length - 1
                            ? '1px solid var(--admin-border, #e2e8f0)'
                            : 'none',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          'var(--admin-accent-light, rgba(68, 144, 49, 0.1))';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                        <i
                          className='fa-solid fa-map-marker-alt'
                          style={{ color: 'var(--admin-accent, #449031)', fontSize: '16px' }}
                        ></i>
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              fontWeight: '600',
                              color: 'var(--admin-text-primary, #1e293b)',
                              marginBottom: '4px',
                            }}
                          >
                            {addr}
                          </div>
                          <div
                            style={{
                              fontSize: '12px',
                              color: 'var(--admin-text-secondary, #475569)',
                              display: 'flex',
                              gap: '12px',
                              alignItems: 'center',
                            }}
                          >
                            {info.count > 0 && (
                              <span>
                                <i
                                  className='fa-solid fa-shopping-cart'
                                  style={{ marginRight: '4px' }}
                                ></i>
                                {info.count} order{info.count !== 1 ? 's' : ''}
                              </span>
                            )}
                            {info.lastPrice && (
                              <span>
                                <i
                                  className='fa-solid fa-rupee-sign'
                                  style={{ marginRight: '4px' }}
                                ></i>
                                Last: ₹{info.lastPrice}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <i
                        className='fa-solid fa-chevron-right'
                        style={{ color: 'var(--admin-text-light, #64748b)', fontSize: '12px' }}
                      ></i>
                    </button>
                  );
                })}
              </div>
            )}
            {touchedFields.deliveryAddress && formErrors.deliveryAddress && (
              <span className='error-text'>{formErrors.deliveryAddress}</span>
            )}
            {duplicateWarning && (
              <div className='badge badge-warning mt-2 p-3'>
                <strong>⚠️ Warning:</strong> {duplicateWarning.address} already has an order today (
                {duplicateWarning.mode})
                <br />
                <span className='helper-text mt-1 block'>Do you want to add another order?</span>
              </div>
            )}
          </div>
          <div className='form-row'>
            <div className='form-group'>
              <label className='required'>
                <i className='fa-solid fa-hashtag mr-2'></i>
                Quantity
              </label>
              <input
                type='number'
                className={`input-field ${formErrors.quantity ? 'error' : ''}`}
                value={editingOrder ? editingOrder.quantity : newOrder.quantity}
                onChange={(e) =>
                  editingOrder
                    ? onEditingOrderChange({
                        ...editingOrder,
                        quantity: parseInt(e.target.value) || 1,
                      })
                    : onNewOrderChange('quantity', e.target.value)
                }
                min='1'
                max='50'
              />
              {formErrors.quantity && <span className='error-text'>{formErrors.quantity}</span>}
            </div>
            <div className='form-group'>
              <label className='required'>
                <i className='fa-solid fa-rupee-sign mr-2'></i>
                Unit Price (₹)
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type='number'
                  className={`input-field ${formErrors.unitPrice ? 'error' : ''}`}
                  value={editingOrder ? editingOrder.unitPrice : newOrder.unitPrice}
                  onChange={(e) =>
                    editingOrder
                      ? onEditingOrderChange({
                          ...editingOrder,
                          unitPrice: parseFloat(e.target.value) || 0,
                        })
                      : onNewOrderChange('unitPrice', e.target.value)
                  }
                  min='10'
                  max='1000'
                  step='0.01'
                />
              </div>
              {formErrors.unitPrice && <span className='error-text'>{formErrors.unitPrice}</span>}
            </div>
            <div className='form-group mobile-hide-auto-field'>
              <label>
                <i className='fa-solid fa-lock mr-2'></i>
                Total Amount
              </label>
              <input
                type='text'
                value={`₹${formatCurrency(
                  calculateTotalAmount(
                    editingOrder ? editingOrder.quantity || 1 : newOrder.quantity || 1,
                    editingOrder ? editingOrder.unitPrice || 0 : newOrder.unitPrice || 0
                  )
                )}`}
                readOnly
                className='input-field'
                style={{
                  fontWeight: '700',
                  fontSize: '16px',
                  background: 'var(--admin-accent-light, rgba(68, 144, 49, 0.05))',
                  borderColor: 'var(--admin-accent-light, rgba(68, 144, 49, 0.2))',
                  cursor: 'not-allowed',
                  color: 'var(--admin-accent, #449031)',
                }}
                title='Auto-calculated: Quantity × Unit Price'
              />
            </div>
          </div>
          <div className='form-row'>
            <div className='form-group'>
              <label className='required'>
                <i className='fa-solid fa-check-circle mr-2'></i>
                Status
              </label>
              <select
                className={`input-field ${formErrors.status ? 'error' : ''}`}
                value={editingOrder ? editingOrder.status || 'Unpaid' : newOrder.status || 'Unpaid'}
                onChange={(e) =>
                  editingOrder
                    ? onEditingOrderChange({
                        ...editingOrder,
                        status: e.target.value,
                      })
                    : onNewOrderChange('status', e.target.value)
                }
                required
              >
                <option value=''>Select Status</option>
                <option value='Unpaid'>Unpaid</option>
                <option value='Paid'>Paid</option>
              </select>
              {formErrors.status && <span className='error-text'>{formErrors.status}</span>}
            </div>
            <div className='form-group'>
              <label className='required'>
                <i className='fa-solid fa-utensils mr-2'></i>
                Mode
              </label>
              <select
                className={`input-field ${formErrors.mode ? 'error' : ''}`}
                value={editingOrder ? editingOrder.mode || 'Lunch' : newOrder.mode || 'Lunch'}
                onChange={(e) =>
                  editingOrder
                    ? onEditingOrderChange({
                        ...editingOrder,
                        mode: e.target.value,
                      })
                    : onNewOrderChange('mode', e.target.value)
                }
                required
              >
                <option value='Lunch'>Lunch</option>
                <option value='Dinner'>Dinner</option>
                <option value='Breakfast'>Breakfast</option>
              </select>
              {formErrors.mode && <span className='error-text'>{formErrors.mode}</span>}
            </div>
            <div className='form-group'>
              <label>
                <i className='fa-solid fa-credit-card mr-2'></i>
                Payment Mode
              </label>
              <select
                className={`input-field ${formErrors.paymentMode ? 'error' : ''}`}
                value={editingOrder ? editingOrder.paymentMode || '' : newOrder.paymentMode || ''}
                onChange={(e) =>
                  editingOrder
                    ? onEditingOrderChange({
                        ...editingOrder,
                        paymentMode: e.target.value,
                      })
                    : onNewOrderChange('paymentMode', e.target.value)
                }
              >
                <option value=''>-- Select Payment Mode --</option>
                <option value='None'>None</option>
                <option value='Cash'>Cash</option>
                <option value='Online'>Online</option>
              </select>
              {formErrors.paymentMode && (
                <span className='error-text'>{formErrors.paymentMode}</span>
              )}
            </div>
          </div>
          {/* OrderID Display/Input */}
          <div className='form-group mobile-hide-auto-field'>
            <label>
              <i className='fa-solid fa-hashtag mr-2'></i>
              Order ID
            </label>
            {editingOrder ? (
              <input
                type='text'
                className={`input-field ${formErrors.orderId ? 'error' : ''}`}
                value={editingOrder.orderId || ''}
                onChange={(e) =>
                  onEditingOrderChange({
                    ...editingOrder,
                    orderId: e.target.value,
                  })
                }
                placeholder="Enter Order ID (e.g., HB-Feb'24-05-000001)"
              />
            ) : (
              <input
                type='text'
                className='input-field'
                value={generateOrderIdPreview()}
                readOnly
                style={{
                  backgroundColor: 'var(--admin-bg-secondary, #f8fafc)',
                  cursor: 'not-allowed',
                  fontFamily: 'monospace',
                }}
              />
            )}
            <span className='helper-text'>
              {editingOrder ? '(Editable)' : '(Auto-generated - Next number from last record)'}
            </span>
            {formErrors.orderId && <span className='error-text'>{formErrors.orderId}</span>}
          </div>
          {/* Derived fields - Display only (never stored) */}
          <div className='form-row admin-auto-fields-row mobile-hide-auto-field'>
            <div className='form-group'>
              <label>Billing Month (auto)</label>
              <input
                type='text'
                value={billingMonthFormatted}
                readOnly
                className='input-field bg-gray-100 cursor-not-allowed'
                title='Auto-calculated from date'
              />
            </div>
            <div className='form-group'>
              <label>Year (auto)</label>
              <input
                type='text'
                value={billingYear || ''}
                readOnly
                className='input-field bg-gray-100 cursor-not-allowed'
                title='Auto-calculated from date'
              />
            </div>
          </div>
        </div>
        <div className='modal-footer'>
          <button
            className='btn btn-primary'
            onClick={handleSave}
            disabled={Object.keys(formErrors).length > 0 || isSaving || saveSuccess}
          >
            {isSaving ? (
              <>
                <i className='fa-solid fa-spinner fa-spin'></i> Saving...
              </>
            ) : saveSuccess ? (
              <>
                <i className='fa-solid fa-check'></i> Order {editingOrder ? 'Updated' : 'Added'}!
              </>
            ) : (
              <>
                <i className='fa-solid fa-save'></i> {editingOrder ? 'Update Order' : 'Save Order'}
              </>
            )}
          </button>
          <button className='btn btn-ghost' onClick={handleClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
