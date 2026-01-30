import { useCallback, useEffect, useRef, useState } from 'react';
import { useAutoKeyboardAvoidance } from '../../hooks/useKeyboardAvoidance';
import { Spinner } from '../loaders/LoaderComponents';
import Icon from '../ui/Icon.jsx';
import {
  handleFocusTrapKeydown,
  useModalFocus,
} from './hooks/useModalFocus.js';
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
  showConfirmation,
}) => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [autoPopulatedAddress, setAutoPopulatedAddress] = useState(null);
  const [isClickingSuggestion, setIsClickingSuggestion] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const selectedAddressRef = useRef(null);
  const suggestionButtonRefs = useRef([]);
  const addressDebounceTimerRef = useRef(null);
  const dateInputRef = useRef(null);
  const datePickerRef = useRef(null);
  const persistedDateRef = useRef(null);
  const lastOrderIdRef = useRef(null);
  const initialOrderRef = useRef(null);
  const containerRef = useRef(null);

  useModalFocus(show, containerRef);
  useAutoKeyboardAvoidance({
    containerSelector: '.modal-container',
    inputSelector: 'input, textarea, select',
  });

  const generateOrderIdPreview = () => {
    if (editingOrder) return editingOrder.orderId || 'N/A';
    if (!newOrder.date) return 'HB-XXX-XX-XXXXXX';

    try {
      let date;
      if (
        typeof newOrder.date === 'string' &&
        /^\d{2}\/\d{2}\/\d{4}$/.test(newOrder.date)
      ) {
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
      const monthNum = String(date.getMonth() + 1).padStart(2, '0');

      const currentOrders = orders || [];
      if (currentOrders.length > 0) {
        let maxSequence = 0;

        currentOrders.forEach((order) => {
          if (order.orderId) {
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
          addr.toLowerCase().trim() ===
            newOrder.deliveryAddress.toLowerCase().trim()
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

  useEffect(() => {
    return () => {
      if (addressDebounceTimerRef.current) {
        clearTimeout(addressDebounceTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!show || editingOrder) {
      setAutoPopulatedAddress(null);

      if (addressDebounceTimerRef.current) {
        clearTimeout(addressDebounceTimerRef.current);
      }
      return;
    }
  }, [show, editingOrder]);

  const validateForm = useCallback(
    (orderToValidate = null) => {
      const errors = {};
      const order = orderToValidate || editingOrder || newOrder;

      if (!order.date) {
        errors.date = 'Date is required';
      } else {
        let dateToValidate = order.date;
        if (
          typeof order.date === 'string' &&
          /^\d{2}\/\d{2}\/\d{4}$/.test(order.date)
        ) {
          dateToValidate = parseDateFromInput(order.date);
          if (!dateToValidate) {
            errors.date =
              'Invalid date format. Please use DD/MM/YYYY format (e.g., 01/08/2026)';
          }
        }

        if (dateToValidate) {
          const date = parseOrderDate(dateToValidate);
          if (!date || isNaN(date.getTime())) {
            errors.date =
              'Invalid date format. Please use DD/MM/YYYY format (e.g., 01/08/2026)';
          } else {
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

      // Allow totalAmount to differ from quantity*unitPrice (manual overrides from Excel, etc.)

      if (!order.mode) {
        errors.mode = 'Mode is required';
      }

      const normalizedStatus = order.status ? String(order.status).trim() : '';
      if (!normalizedStatus) {
        errors.status = 'Status is required';
      } else if (!['Paid', 'Unpaid'].includes(normalizedStatus)) {
        errors.status = 'Status must be either Paid or Unpaid';
      }

      const normalizedPaymentMode = order.paymentMode
        ? String(order.paymentMode).trim()
        : '';
      if (
        normalizedPaymentMode &&
        !['None', 'Cash', 'Online'].includes(normalizedPaymentMode)
      ) {
        errors.paymentMode = 'Payment mode must be None, Cash, or Online';
      }

      setFormErrors(errors);
      return Object.keys(errors).length === 0;
    },
    [editingOrder, newOrder]
  );

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

    const timer = setTimeout(() => {
      const errors = {};
      const orderToValidate = order;

      if (touchedFields.date && !orderToValidate.date) {
        errors.date = 'Date is required';
      }

      if (touchedFields.deliveryAddress) {
        if (
          !orderToValidate.deliveryAddress ||
          orderToValidate.deliveryAddress.trim().length < 3
        ) {
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

  // Track initial order state when modal opens
  useEffect(() => {
    if (show && !editingOrder) {
      // Store initial state when modal first opens (only once per modal open)
      if (initialOrderRef.current === null) {
        initialOrderRef.current = JSON.parse(JSON.stringify(newOrder));
        setHasUnsavedChanges(false); // Reset when modal first opens
      }
    } else {
      // Reset when modal closes
      initialOrderRef.current = null;
      setHasUnsavedChanges(false);
    }
  }, [show, editingOrder]);

  // Check for unsaved changes whenever newOrder changes
  useEffect(() => {
    if (show && !editingOrder && initialOrderRef.current) {
      // Compare current state with initial state
      const initial = initialOrderRef.current;
      const hasChanges = !!(
        (newOrder.deliveryAddress &&
          newOrder.deliveryAddress.trim() !== '' &&
          newOrder.deliveryAddress.trim() !==
            (initial.deliveryAddress || '').trim()) ||
        newOrder.quantity !== initial.quantity ||
        newOrder.unitPrice !== initial.unitPrice ||
        newOrder.mode !== initial.mode ||
        newOrder.status !== initial.status ||
        newOrder.paymentMode !== initial.paymentMode ||
        newOrder.date !== initial.date
      );
      setHasUnsavedChanges(hasChanges);
    }
  }, [show, editingOrder, newOrder]);

  const handleClose = () => {
    // Check if there are unsaved changes
    const hasChanges = hasUnsavedChanges && !editingOrder;

    if (hasChanges && showConfirmation) {
      // Show custom confirmation modal
      showConfirmation({
        title: 'Unsaved Changes',
        message: 'You have unsaved changes. Are you sure you want to close?',
        type: 'warning',
        confirmText: 'Close',
        cancelText: 'Cancel',
        onConfirm: () => {
          setHasUnsavedChanges(false);
          setFormErrors({});
          setTouchedFields({});
          setDuplicateWarning(null);
          setAutoPopulatedAddress(null);
          persistedDateRef.current = null;
          initialOrderRef.current = null;
          onClose();
        },
      });
      return; // Important: return here to prevent closing
    }

    // Close without confirmation if no unsaved changes
    setHasUnsavedChanges(false);
    setFormErrors({});
    setTouchedFields({});
    setDuplicateWarning(null);
    setAutoPopulatedAddress(null);
    persistedDateRef.current = null;
    initialOrderRef.current = null;
    onClose();
  };

  const handleSave = async () => {
    if (isSaving) {
      return;
    }

    const orderToValidate = editingOrder || newOrder;

    const normalizedOrder = editingOrder
      ? { ...editingOrder }
      : { ...newOrder };

    if (
      normalizedOrder.quantity === null ||
      normalizedOrder.quantity === undefined
    ) {
      normalizedOrder.quantity = 1;
    }
    if (
      normalizedOrder.unitPrice === null ||
      normalizedOrder.unitPrice === undefined
    ) {
      normalizedOrder.unitPrice = 0;
    }
    if (!normalizedOrder.mode) {
      normalizedOrder.mode = 'Lunch';
    }
    if (!normalizedOrder.status) {
      normalizedOrder.status = 'Unpaid';
    }
    if (normalizedOrder.date === null || normalizedOrder.date === undefined) {
      normalizedOrder.date = '';
    }
    if (
      normalizedOrder.deliveryAddress === null ||
      normalizedOrder.deliveryAddress === undefined
    ) {
      normalizedOrder.deliveryAddress = '';
    }
    if (
      normalizedOrder.paymentMode === null ||
      normalizedOrder.paymentMode === undefined
    ) {
      normalizedOrder.paymentMode = '';
    }
    if (
      normalizedOrder.orderId === null ||
      normalizedOrder.orderId === undefined
    ) {
      normalizedOrder.orderId = '';
    }

    if (normalizedOrder.status) {
      normalizedOrder.status = String(normalizedOrder.status).trim();

      if (
        normalizedOrder.status === 'Paid' ||
        normalizedOrder.status.toLowerCase() === 'paid'
      ) {
        normalizedOrder.paymentStatus = 'Paid';
      } else if (
        normalizedOrder.status === 'Unpaid' ||
        normalizedOrder.status.toLowerCase() === 'unpaid'
      ) {
        normalizedOrder.paymentStatus = 'Pending';
      } else {
        normalizedOrder.paymentStatus =
          normalizedOrder.paymentStatus || 'Pending';
      }
    }

    if (
      normalizedOrder.paymentMode !== undefined &&
      normalizedOrder.paymentMode !== null
    ) {
      if (
        normalizedOrder.paymentMode === '' ||
        normalizedOrder.paymentMode === 'None'
      ) {
        normalizedOrder.paymentMode = '';
      } else {
        normalizedOrder.paymentMode = String(
          normalizedOrder.paymentMode
        ).trim();
      }
    }

    let finalDate = normalizedOrder.date;
    if (
      normalizedOrder.date &&
      typeof normalizedOrder.date === 'string' &&
      /^\d{2}\/\d{2}\/\d{4}$/.test(normalizedOrder.date)
    ) {
      const backendDate = parseDateFromInput(normalizedOrder.date);
      if (backendDate) {
        finalDate = backendDate;
        normalizedOrder.date = backendDate;
      }
    } else if (
      normalizedOrder.date &&
      typeof normalizedOrder.date === 'string' &&
      /^\d{4}-\d{2}-\d{2}$/.test(normalizedOrder.date)
    ) {
      finalDate = normalizedOrder.date;
    }

    normalizedOrder.date = finalDate;

    if (!editingOrder) {
      const currentOrders = orders || [];
      let generatedId = generateOrderIdPreview();

      if (generatedId && generatedId !== 'HB-XXX-XX-XXXXXX') {
        let idExists = currentOrders.some((o) => o.orderId === generatedId);

        if (idExists) {
          const match = generatedId.match(/^(HB-\w+'?\d{2}-\d{2}-)(\d+)$/);
          if (match) {
            const prefix = match[1];
            let currentSeq = parseInt(match[2], 10);
            let attempts = 0;
            const maxAttempts = 1000;

            while (idExists && attempts < maxAttempts) {
              currentSeq++;
              generatedId = `${prefix}${String(currentSeq).padStart(6, '0')}`;
              idExists = currentOrders.some((o) => o.orderId === generatedId);
              attempts++;
            }

            if (attempts >= maxAttempts) {
              throw new Error(
                'Unable to generate unique order ID. Please try again.'
              );
            }
          }
        }

        normalizedOrder.orderId = generatedId;
        onNewOrderChange('orderId', generatedId);
      } else {
        throw new Error(
          'Unable to generate order ID. Please check the date field.'
        );
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

    if (!validateForm(normalizedOrder)) {
      return;
    }
    if (duplicateWarning) {
      if (showConfirmation) {
        showConfirmation({
          title: 'Duplicate Order Warning',
          message: `${duplicateWarning.address} already has an order today (${duplicateWarning.mode}). Do you want to add another order?`,
          type: 'warning',
          confirmText: 'Add Order',
          cancelText: 'Cancel',
          onConfirm: async () => {
            await proceedWithSave(normalizedOrder);
          },
        });
        return;
      } else {
        // Fallback: proceed without confirmation if showConfirmation is not available
        // This should not happen in normal usage, but prevents blocking the save
        await proceedWithSave(normalizedOrder);
        return;
      }
    }

    await proceedWithSave(normalizedOrder);
  };

  const proceedWithSave = async (normalizedOrder) => {
    if (isSaving) {
      return;
    }

    setIsSaving(true);
    setSaveSuccess(false);

    try {
      if (editingOrder) {
        const cleanOrderData = {};

        const allowedFields = {
          orderId: normalizedOrder.orderId,
          date: normalizedOrder.date,
          deliveryAddress: normalizedOrder.deliveryAddress,
          quantity: normalizedOrder.quantity,
          unitPrice: normalizedOrder.unitPrice,
          mode: normalizedOrder.mode,
          status: normalizedOrder.status,
          paymentStatus: normalizedOrder.paymentStatus,
          paymentMode: normalizedOrder.paymentMode,
          notes: normalizedOrder.notes,
          customerName: normalizedOrder.customerName,
          addressId: normalizedOrder.addressId,
        };

        Object.keys(allowedFields).forEach((key) => {
          const value = allowedFields[key];

          if (value !== undefined) {
            if (
              key === 'paymentMode' ||
              key === 'notes' ||
              key === 'customerName' ||
              key === 'addressId'
            ) {
              cleanOrderData[key] = value === null ? '' : String(value);
            } else if (key === 'orderId') {
              cleanOrderData[key] = value || '';
            } else {
              cleanOrderData[key] = value;
            }
          } else if (
            key === 'paymentMode' ||
            key === 'notes' ||
            key === 'customerName' ||
            key === 'addressId'
          ) {
            cleanOrderData[key] = '';
          }
        });

        const editOrderDate = parseOrderDate(normalizedOrder.date);
        if (editOrderDate) {
          cleanOrderData.billingMonth = extractBillingMonth(editOrderDate);
          cleanOrderData.billingYear = extractBillingYear(editOrderDate);
        } else if (normalizedOrder.billingMonth !== undefined) {
          cleanOrderData.billingMonth = normalizedOrder.billingMonth;
        }
        if (normalizedOrder.billingYear !== undefined && !editOrderDate) {
          cleanOrderData.billingYear = normalizedOrder.billingYear;
        }

        // Use stored totalAmount/total if present, otherwise calculate from quantity * unitPrice
        // This allows manual overrides (e.g., when totalAmount should be different from calculated value)
        let finalTotalAmount = null;

        // Check totalAmount first
        if (
          normalizedOrder.totalAmount !== undefined &&
          normalizedOrder.totalAmount !== null
        ) {
          const parsed = parseFloat(String(normalizedOrder.totalAmount));
          if (!isNaN(parsed) && isFinite(parsed) && parsed >= 0) {
            finalTotalAmount = parsed;
          }
        }

        // Fallback to total field if totalAmount is not available
        if (
          finalTotalAmount === null &&
          normalizedOrder.total !== undefined &&
          normalizedOrder.total !== null
        ) {
          const parsed = parseFloat(String(normalizedOrder.total));
          if (!isNaN(parsed) && isFinite(parsed) && parsed >= 0) {
            finalTotalAmount = parsed;
          }
        }

        // Only calculate if totalAmount/total is not present
        if (finalTotalAmount === null) {
          finalTotalAmount = calculateTotalAmount(
            normalizedOrder.quantity || 1,
            normalizedOrder.unitPrice || 0
          );
        }

        cleanOrderData.totalAmount = finalTotalAmount;

        await onSave(editingOrder.orderId || editingOrder._id, cleanOrderData);

        setSaveSuccess(true);
        setIsSaving(false);

        onClose();
      } else {
        if (!normalizedOrder.orderId) {
          throw new Error('Order ID is required. Please try again.');
        }

        const currentOrders = orders || [];
        const finalIdCheck = currentOrders.some(
          (o) => o.orderId === normalizedOrder.orderId
        );
        if (finalIdCheck) {
          throw new Error('Order ID already exists. Please try again.');
        }

        await onSave(normalizedOrder);

        setSaveSuccess(true);

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

      if (error.message) {
        alert(error.message);
      }

      setTimeout(() => {}, 2000);
    }
  };

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
        return;
      }
      handleFocusTrapKeydown(e, containerRef.current);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [show, hasUnsavedChanges]);

  if (!show) return null;

  const getAddressSuggestions = (query) => {
    const queryLower = (query || '').trim().toLowerCase();

    const addressFrequency = {};
    orders.forEach((order) => {
      const addr =
        order.deliveryAddress || order.customerAddress || order.address;
      if (addr && addr.trim()) {
        addressFrequency[addr] = (addressFrequency[addr] || 0) + 1;
      }
    });

    if (!queryLower) {
      return Object.entries(addressFrequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([addr]) => addr);
    }

    const allAddresses = Object.keys(addressFrequency);
    const filtered = allAddresses
      .filter((addr) => {
        const addrLower = addr.toLowerCase().trim();
        return addrLower.includes(queryLower);
      })
      .map((addr) => {
        const addrLower = addr.toLowerCase().trim();

        const exactMatch = addrLower === queryLower ? 1000 : 0;
        const startsWith = addrLower.startsWith(queryLower) ? 500 : 0;
        const frequency = addressFrequency[addr] || 0;

        const lengthBonus = Math.max(0, 100 - addr.length);

        return {
          address: addr,
          score: exactMatch + startsWith + frequency + lengthBonus,
        };
      })
      .sort((a, b) => b.score - a.score)
      .map((item) => item.address);

    return filtered;
  };

  const handleAddressChange = (value) => {
    if (isClickingSuggestion && value.trim().length > 0) {
      return;
    }

    setTouchedFields((prev) => ({ ...prev, deliveryAddress: true }));

    if (editingOrder) {
      onEditingOrderChange('deliveryAddress', value);
    } else {
      onNewOrderChange('deliveryAddress', value);

      const suggestions = getAddressSuggestions(value);
      setAddressSuggestions(suggestions);

      setShowAddressSuggestions(suggestions.length > 0);
      setHighlightedIndex(-1);

      if (addressDebounceTimerRef.current) {
        clearTimeout(addressDebounceTimerRef.current);
      }

      addressDebounceTimerRef.current = setTimeout(() => {
        const normalizedValue = value.trim().toLowerCase();

        if (normalizedValue.length < 3) {
          if (autoPopulatedAddress) {
            setAutoPopulatedAddress(null);
          }
          return;
        }

        if (normalizedValue !== autoPopulatedAddress) {
          const lastOrder = getLastOrderForAddress(orders, normalizedValue);
          if (lastOrder) {
            const lastOrderAddress = String(
              lastOrder.deliveryAddress ||
                lastOrder.customerAddress ||
                lastOrder.address ||
                ''
            )
              .trim()
              .toLowerCase();

            if (lastOrderAddress === normalizedValue) {
              setAutoPopulatedAddress(normalizedValue);
            }
          } else {
            if (autoPopulatedAddress) {
              setAutoPopulatedAddress(null);
            }
          }
        }
      }, 800);
    }
  };

  const handleAddressFocus = () => {
    if (!editingOrder) {
      const query = String(newOrder.deliveryAddress || '').trim();
      const suggestions = getAddressSuggestions(query);
      setAddressSuggestions(suggestions);
      setShowAddressSuggestions(suggestions.length > 0);
      setHighlightedIndex(-1);
    }
  };

  const handleAddressBlur = () => {
    setTouchedFields((prev) => ({ ...prev, deliveryAddress: true }));

    setTimeout(() => {
      if (!isClickingSuggestion) {
        setShowAddressSuggestions(false);
        setHighlightedIndex(-1);

        if (!editingOrder && newOrder.deliveryAddress) {
          const normalizedValue = newOrder.deliveryAddress.trim().toLowerCase();

          if (
            normalizedValue.length >= 3 &&
            normalizedValue !== autoPopulatedAddress
          ) {
            const lastOrder = getLastOrderForAddress(orders, normalizedValue);
            if (lastOrder) {
              const lastOrderAddress = String(
                lastOrder.deliveryAddress ||
                  lastOrder.customerAddress ||
                  lastOrder.address ||
                  ''
              )
                .trim()
                .toLowerCase();

              if (lastOrderAddress === normalizedValue) {
                setAutoPopulatedAddress(normalizedValue);
              }
            }
          }
        }
      }
    }, 300);
  };

  const selectSuggestion = (addr) => {
    const normalizedAddr = addr.trim().toLowerCase();
    const trimmedAddr = addr.trim();

    selectedAddressRef.current = trimmedAddr;

    setIsClickingSuggestion(true);
    onNewOrderChange('deliveryAddress', trimmedAddr);

    setAutoPopulatedAddress(normalizedAddr);
    setHighlightedIndex(-1);

    const input = document.getElementById('delivery-address-input');
    if (input) {
      input.focus();
    }

    setTimeout(() => {
      setShowAddressSuggestions(false);

      if (input && selectedAddressRef.current) {
        const currentValue = editingOrder
          ? editingOrder.deliveryAddress || ''
          : newOrder.deliveryAddress || '';

        if (!currentValue || currentValue !== selectedAddressRef.current) {
          onNewOrderChange('deliveryAddress', selectedAddressRef.current);

          if (input) {
            input.value = selectedAddressRef.current;
          }
        }
      }
    }, 150);

    setTimeout(() => {
      setIsClickingSuggestion(false);
    }, 500);
  };

  const handleSuggestionClick = (addr) => {
    selectSuggestion(addr);
  };

  const getAddressOrderInfo = (addr) => {
    const addressOrders = orders.filter(
      (o) => (o.deliveryAddress || o.customerAddress || o.address) === addr
    );
    const lastOrder = addressOrders[addressOrders.length - 1];
    return {
      count: addressOrders.length,
      lastPrice: lastOrder
        ? lastOrder.unitPrice ||
          lastOrder.totalAmount / (lastOrder.quantity || 1)
        : null,

      lastDate: lastOrder
        ? lastOrder.date || lastOrder.order_date || null
        : null,
    };
  };

  const scrollIntoView = (index) => {
    if (suggestionButtonRefs.current[index] && dropdownRef.current) {
      const button = suggestionButtonRefs.current[index];
      const dropdown = dropdownRef.current;
      const buttonTop = button.offsetTop;
      const buttonBottom = buttonTop + button.offsetHeight;
      const dropdownTop = dropdown.scrollTop;
      const dropdownBottom = dropdownTop + dropdown.clientHeight;

      if (buttonTop < dropdownTop) {
        dropdown.scrollTop = buttonTop;
      } else if (buttonBottom > dropdownBottom) {
        dropdown.scrollTop = buttonBottom - dropdown.clientHeight;
      }
    }
  };

  const formatDateForInput = (dateValue) => {
    if (!dateValue) return '';
    try {
      const date = parseOrderDate(dateValue);
      if (!date) {
        if (
          typeof dateValue === 'string' &&
          /^\d{2}\/\d{2}\/\d{4}$/.test(dateValue)
        ) {
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

  const parseDateFromInput = (dateStr) => {
    if (!dateStr) return '';
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
        return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      }
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return dateStr;
    }
    return '';
  };

  useEffect(() => {
    if (show) {
      const currentOrderId = editingOrder
        ? editingOrder._id || editingOrder.orderId
        : null;

      if (currentOrderId && lastOrderIdRef.current !== currentOrderId) {
        lastOrderIdRef.current = currentOrderId;
        persistedDateRef.current = null;
      }

      if (
        persistedDateRef.current === null ||
        persistedDateRef.current === undefined ||
        persistedDateRef.current === ''
      ) {
        if (editingOrder) {
          if (editingOrder.date) {
            if (
              typeof editingOrder.date === 'string' &&
              editingOrder.date.includes('/')
            ) {
              persistedDateRef.current = editingOrder.date;
            } else {
              persistedDateRef.current = formatDateForInput(editingOrder.date);
            }
          } else if (editingOrder.order_date) {
            persistedDateRef.current = formatDateForInput(
              editingOrder.order_date
            );
          } else {
            persistedDateRef.current = formatDateForInput(new Date());
          }
        } else {
          if (newOrder.date) {
            if (
              typeof newOrder.date === 'string' &&
              newOrder.date.includes('/')
            ) {
              persistedDateRef.current = newOrder.date;
            } else {
              persistedDateRef.current = formatDateForInput(newOrder.date);
            }
          } else {
            persistedDateRef.current = formatDateForInput(new Date());
          }
        }
      }
    } else {
      persistedDateRef.current = null;
      lastOrderIdRef.current = null;
    }
  }, [show, editingOrder?._id, editingOrder?.orderId]);

  const getCurrentDateValue = () => {
    if (persistedDateRef.current) {
      return persistedDateRef.current;
    }

    if (editingOrder) {
      if (editingOrder.date) {
        if (
          typeof editingOrder.date === 'string' &&
          editingOrder.date.includes('/')
        ) {
          return editingOrder.date;
        }

        return formatDateForInput(editingOrder.date);
      }
      if (editingOrder.order_date) {
        return formatDateForInput(editingOrder.order_date);
      }
      return formatDateForInput(new Date());
    } else {
      if (newOrder.date) {
        if (typeof newOrder.date === 'string' && newOrder.date.includes('/')) {
          return newOrder.date;
        }

        return formatDateForInput(newOrder.date);
      }
      return formatDateForInput(new Date());
    }
  };

  const getOrderDateForCalculation = () => {
    if (editingOrder) {
      return parseOrderDate(editingOrder.date || editingOrder.order_date);
    } else {
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
    billingMonth && billingYear
      ? formatBillingMonth(billingMonth, billingYear)
      : '';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        ref={containerRef}
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-modal-title"
      >
        <div className="modal-header">
          <h2 id="order-modal-title">
            {editingOrder ? 'Edit Order' : 'Add New Order'}
          </h2>
          <button
            type="button"
            className="btn btn-ghost btn-icon modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            <Icon name="times" />
          </button>
        </div>
        <div className="modal-body">
          <div className="form-row">
            <div className="form-group">
              <label>
                <Icon name="hashtag" className="mr-2" />
                Order ID
              </label>
              {editingOrder ? (
                <input
                  type="text"
                  className={`input-field ${formErrors.orderId ? 'error' : ''}`}
                  value={editingOrder.orderId || ''}
                  onChange={(e) =>
                    onEditingOrderChange('orderId', e.target.value)
                  }
                  placeholder="Enter Order ID (e.g., HB-Feb'24-05-000001)"
                />
              ) : (
                <input
                  type="text"
                  className="input-field order-id-preview"
                  value={generateOrderIdPreview()}
                  readOnly
                  title="Auto-generated on save"
                />
              )}
              <span className="helper-text">
                {editingOrder ? '(Editable)' : '(Auto-generated)'}
              </span>
              {formErrors.orderId && (
                <span className="error-text">{formErrors.orderId}</span>
              )}
            </div>
            <div className="form-group">
              <label
                className={
                  editingOrder?.dateNeedsReview ? 'required error' : 'required'
                }
              >
                Date
                {editingOrder?.dateNeedsReview && (
                  <span className="error-text ml-2">
                    ⚠️ Invalid Date Format - Please Correct
                  </span>
                )}
              </label>
              {editingOrder?.dateNeedsReview &&
                editingOrder?.originalDateString && (
                  <div className="badge badge-warning mb-2 p-3">
                    <strong>Original Invalid Date:</strong>{' '}
                    {editingOrder.originalDateString}
                    <br />
                    <span className="helper-text mt-1 block">
                      Please select the correct date below. This will clear the
                      error flag.
                    </span>
                  </div>
                )}
              <div className="date-input-wrapper">
                <input
                  ref={dateInputRef}
                  type="text"
                  className={`input-field ${editingOrder?.dateNeedsReview ? 'error' : ''}`}
                  value={getCurrentDateValue()}
                  onChange={(e) => {
                    const inputValue = e.target.value;

                    if (inputValue === '') {
                      persistedDateRef.current = '';

                      if (editingOrder) {
                        onEditingOrderChange('date', '');
                        onEditingOrderChange('dateNeedsReview', false);
                        onEditingOrderChange('originalDateString', undefined);
                      } else {
                        onNewOrderChange('date', '');
                      }
                      return;
                    }

                    const cleaned = inputValue.replace(/[^\d/]/g, '');

                    let formatted = cleaned;

                    if (cleaned.length > 2 && !cleaned.includes('/')) {
                      formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
                    }
                    if (
                      formatted.length > 5 &&
                      formatted.split('/').length === 2
                    ) {
                      formatted =
                        formatted.slice(0, 5) + '/' + formatted.slice(5, 9);
                    }

                    if (formatted.length <= 10) {
                      persistedDateRef.current = formatted;

                      if (editingOrder) {
                        const backendDate = parseDateFromInput(formatted);
                        onEditingOrderChange('date', backendDate || formatted);
                        onEditingOrderChange('dateNeedsReview', false);
                        onEditingOrderChange('originalDateString', undefined);
                      } else {
                        onNewOrderChange('date', formatted);
                      }
                    }
                  }}
                  onBlur={(e) => {
                    const inputValue = e.target.value.trim();
                    if (inputValue) {
                      const backendDate = parseDateFromInput(inputValue);
                      if (backendDate) {
                        const formatted = formatDateForInput(backendDate);

                        persistedDateRef.current = formatted;

                        if (editingOrder) {
                          onEditingOrderChange('date', backendDate);
                          onEditingOrderChange('dateNeedsReview', false);
                        } else {
                          onNewOrderChange('date', formatted);
                        }
                      } else {
                        persistedDateRef.current = inputValue;

                        if (editingOrder) {
                          onEditingOrderChange('dateNeedsReview', true);
                          onEditingOrderChange(
                            'originalDateString',
                            inputValue
                          );
                        }
                      }
                    } else {
                      persistedDateRef.current = '';
                    }
                  }}
                  placeholder="DD/MM/YYYY"
                  required
                  maxLength={10}
                  pattern="\\d{2}/\\d{2}/\\d{4}"
                />
                <input
                  ref={datePickerRef}
                  type="date"
                  className="date-picker-input"
                  value={(() => {
                    const currentValue = getCurrentDateValue();
                    if (
                      currentValue &&
                      /^\d{2}\/\d{2}\/\d{4}$/.test(currentValue)
                    ) {
                      const backendDate = parseDateFromInput(currentValue);
                      return backendDate || '';
                    }
                    return '';
                  })()}
                  max={new Date().toISOString().split('T')[0]}
                  onChange={(e) => {
                    const selectedDate = e.target.value;
                    if (selectedDate) {
                      const formatted = formatDateForInput(selectedDate);

                      persistedDateRef.current = formatted;

                      if (editingOrder) {
                        onEditingOrderChange('date', selectedDate);
                        onEditingOrderChange('dateNeedsReview', false);
                        onEditingOrderChange('originalDateString', undefined);
                      } else {
                        onNewOrderChange('date', formatted);
                      }
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (datePickerRef.current?.showPicker) {
                      datePickerRef.current.showPicker();
                    } else {
                      datePickerRef.current?.click();
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onFocus={(e) => {
                    e.stopPropagation();
                  }}
                  className="order-modal-calendar-btn"
                  title="Choose date from calendar"
                >
                  <Icon name="calendar-days" />
                </button>
              </div>
              <span className="helper-text">Format: DD/MM/YYYY</span>
              {formErrors.date && (
                <span className="error-text">{formErrors.date}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group form-group-relative">
              <label className="required">
                <Icon name="home" className="mr-2" />
                Delivery Address
              </label>
              <input
                type="text"
                className={`input-field ${formErrors.deliveryAddress ? 'error' : ''}`}
                value={
                  editingOrder
                    ? editingOrder.deliveryAddress || ''
                    : newOrder.deliveryAddress ||
                      selectedAddressRef.current ||
                      ''
                }
                onChange={(e) => {
                  if (!isClickingSuggestion) {
                    selectedAddressRef.current = null;
                  }
                  handleAddressChange(e.target.value);
                }}
                onFocus={handleAddressFocus}
                onBlur={handleAddressBlur}
                onKeyDown={(e) => {
                  if (
                    !showAddressSuggestions ||
                    addressSuggestions.length === 0 ||
                    editingOrder
                  ) {
                    if (e.key === 'Escape' && showAddressSuggestions) {
                      e.preventDefault();
                      setShowAddressSuggestions(false);
                      setHighlightedIndex(-1);
                    }
                    return;
                  }

                  switch (e.key) {
                    case 'ArrowDown':
                      e.preventDefault();
                      e.stopPropagation();
                      setHighlightedIndex((prev) => {
                        const nextIndex =
                          prev < addressSuggestions.length - 1 ? prev + 1 : 0;
                        scrollIntoView(nextIndex);
                        return nextIndex;
                      });
                      break;
                    case 'ArrowUp':
                      e.preventDefault();
                      e.stopPropagation();
                      setHighlightedIndex((prev) => {
                        if (prev <= 0) {
                          const nextIndex = addressSuggestions.length - 1;
                          scrollIntoView(nextIndex);
                          return nextIndex;
                        }
                        const nextIndex = prev - 1;
                        scrollIntoView(nextIndex);
                        return nextIndex;
                      });
                      break;
                    case 'Enter':
                      e.preventDefault();
                      e.stopPropagation();
                      if (
                        highlightedIndex >= 0 &&
                        highlightedIndex < addressSuggestions.length
                      ) {
                        const selectedAddr =
                          addressSuggestions[highlightedIndex];
                        if (selectedAddr) {
                          selectSuggestion(selectedAddr);
                        }
                      } else if (addressSuggestions.length > 0) {
                        const firstAddr = addressSuggestions[0];
                        if (firstAddr) {
                          selectSuggestion(firstAddr);
                        }
                      }
                      break;
                    case 'Escape':
                      e.preventDefault();
                      e.stopPropagation();
                      setShowAddressSuggestions(false);
                      setHighlightedIndex(-1);
                      break;
                    case 'Tab':
                      if (
                        highlightedIndex >= 0 &&
                        highlightedIndex < addressSuggestions.length
                      ) {
                        const selectedAddr =
                          addressSuggestions[highlightedIndex];
                        if (selectedAddr) {
                          selectSuggestion(selectedAddr);
                        }
                      }
                      break;
                    default:
                      break;
                  }
                }}
                placeholder="Start typing address (e.g., A3-1206)"
                required
                autoComplete="off"
                id="delivery-address-input"
                aria-autocomplete="list"
                aria-expanded={showAddressSuggestions}
                aria-controls="address-suggestions-list"
                aria-activedescendant={
                  highlightedIndex >= 0
                    ? `address-suggestion-${highlightedIndex}`
                    : undefined
                }
                aria-label="Delivery Address"
                aria-describedby={
                  formErrors.deliveryAddress
                    ? 'delivery-address-error'
                    : undefined
                }
                role="combobox"
              />
              {showAddressSuggestions &&
                addressSuggestions.length > 0 &&
                !editingOrder && (
                  <div
                    ref={dropdownRef}
                    id="address-suggestions-list"
                    className="address-suggestions-dropdown positioned"
                    role="listbox"
                    aria-label="Address suggestions"
                    aria-live="polite"
                    aria-atomic="false"
                    onMouseDown={(e) => {
                      e.preventDefault();
                    }}
                  >
                    <div
                      className="address-suggestions-header"
                      role="status"
                      aria-live="polite"
                    >
                      <Icon
                        name="lightbulb"
                        className="mr-2"
                        aria-hidden="true"
                      />
                      <span>
                        {addressSuggestions.length} suggestion
                        {addressSuggestions.length !== 1 ? 's' : ''} found
                      </span>
                    </div>
                    {addressSuggestions.map((addr, idx) => {
                      const info = getAddressOrderInfo(addr);
                      const isHighlighted = idx === highlightedIndex;
                      return (
                        <button
                          key={`${addr}-${idx}`}
                          id={`address-suggestion-${idx}`}
                          ref={(el) => {
                            suggestionButtonRefs.current[idx] = el;
                          }}
                          type="button"
                          role="option"
                          aria-selected={isHighlighted}
                          aria-label={`${addr}, ${info.count} previous orders, last order ₹${info.lastPrice || 0}`}
                          tabIndex={-1}
                          onMouseDown={(e) => {
                            setIsClickingSuggestion(true);
                            e.preventDefault();
                          }}
                          onMouseEnter={() => {
                            setHighlightedIndex(idx);
                          }}
                          onMouseLeave={() => {
                            setHighlightedIndex((prev) =>
                              prev === idx ? -1 : prev
                            );
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleSuggestionClick(addr);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              e.stopPropagation();
                              handleSuggestionClick(addr);
                            }
                          }}
                          className={`address-suggestion-item button-style order-modal-address-suggestion ${
                            isHighlighted
                              ? 'address-suggestion-highlighted'
                              : ''
                          }`}
                        >
                          <div className="address-suggestion-content">
                            <Icon
                              name="map-marker-alt"
                              className="address-suggestion-icon"
                            />
                            <div className="address-suggestion-content-wrapper">
                              <div className="address-suggestion-title">
                                {addr}
                              </div>
                              <div className="address-suggestion-info">
                                {info.count > 0 && (
                                  <span>
                                    <Icon name="shopping-cart" />
                                    {info.count} order
                                    {info.count !== 1 ? 's' : ''}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="address-suggestion-right">
                            {info.lastPrice && (
                              <span className="address-suggestion-last-price">
                                Rs Last: ₹{info.lastPrice}
                              </span>
                            )}
                            <Icon
                              name="chevron-right"
                              className="address-suggestion-chevron"
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              {touchedFields.deliveryAddress && formErrors.deliveryAddress && (
                <span className="error-text">{formErrors.deliveryAddress}</span>
              )}
              {duplicateWarning && (
                <div className="badge badge-warning mt-2 p-3">
                  <strong>⚠️ Warning:</strong> {duplicateWarning.address}{' '}
                  already has an order today ({duplicateWarning.mode})
                  <br />
                  <span className="helper-text mt-1 block">
                    Do you want to add another order?
                  </span>
                </div>
              )}
            </div>
            <div className="form-group">
              <label className="required">
                <Icon name="utensils" className="mr-2" />
                Mode
              </label>
              <select
                className={`input-field ${formErrors.mode ? 'error' : ''}`}
                value={
                  editingOrder
                    ? editingOrder.mode || 'Lunch'
                    : newOrder.mode || 'Lunch'
                }
                onChange={(e) =>
                  editingOrder
                    ? onEditingOrderChange('mode', e.target.value)
                    : onNewOrderChange('mode', e.target.value)
                }
                required
              >
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Breakfast">Breakfast</option>
              </select>
              {formErrors.mode && (
                <span className="error-text">{formErrors.mode}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="required">
                <Icon name="hashtag" className="mr-2" />
                Quantity
              </label>
              <input
                type="number"
                className={`input-field ${formErrors.quantity ? 'error' : ''}`}
                value={editingOrder ? editingOrder.quantity : newOrder.quantity}
                onChange={(e) =>
                  editingOrder
                    ? onEditingOrderChange(
                        'quantity',
                        parseInt(e.target.value) || 1
                      )
                    : onNewOrderChange('quantity', e.target.value)
                }
                min="1"
                max="50"
              />
              {formErrors.quantity && (
                <span className="error-text">{formErrors.quantity}</span>
              )}
            </div>
            <div className="form-group">
              <label className="required">
                <Icon name="check-circle" className="mr-2" />
                Status
              </label>
              <select
                className={`input-field ${formErrors.status ? 'error' : ''}`}
                value={
                  editingOrder
                    ? editingOrder.status || 'Unpaid'
                    : newOrder.status || 'Unpaid'
                }
                onChange={(e) =>
                  editingOrder
                    ? onEditingOrderChange('status', e.target.value)
                    : onNewOrderChange('status', e.target.value)
                }
                required
              >
                <option value="">Select Status</option>
                <option value="Unpaid">Unpaid</option>
                <option value="Paid">Paid</option>
              </select>
              {formErrors.status && (
                <span className="error-text">{formErrors.status}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="required">
                <Icon name="rupee-sign" className="mr-2" />
                Unit Price (₹)
              </label>
              <input
                type="number"
                className={`input-field ${formErrors.unitPrice ? 'error' : ''}`}
                value={
                  editingOrder ? editingOrder.unitPrice : newOrder.unitPrice
                }
                onChange={(e) =>
                  editingOrder
                    ? onEditingOrderChange(
                        'unitPrice',
                        parseFloat(e.target.value) || 0
                      )
                    : onNewOrderChange('unitPrice', e.target.value)
                }
                min="10"
                max="1000"
                step="0.01"
              />
              {formErrors.unitPrice && (
                <span className="error-text">{formErrors.unitPrice}</span>
              )}
            </div>
            <div className="form-group">
              <label>
                <Icon name="credit-card" className="mr-2" />
                Payment Mode
              </label>
              <select
                className={`input-field ${formErrors.paymentMode ? 'error' : ''}`}
                value={
                  editingOrder
                    ? editingOrder.paymentMode || ''
                    : newOrder.paymentMode || ''
                }
                onChange={(e) =>
                  editingOrder
                    ? onEditingOrderChange('paymentMode', e.target.value)
                    : onNewOrderChange('paymentMode', e.target.value)
                }
              >
                <option value="">-- Select Payment Mode --</option>
                <option value="None">None</option>
                <option value="Cash">Cash</option>
                <option value="Online">Online</option>
              </select>
              {formErrors.paymentMode && (
                <span className="error-text">{formErrors.paymentMode}</span>
              )}
            </div>
          </div>
        </div>
        <div className="order-form-total">
          <span className="order-form-total-label">Total Amount</span>
          {editingOrder ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: 600 }}>₹</span>
              <input
                type="number"
                className={`input-field ${formErrors.totalAmount ? 'error' : ''}`}
                style={{ width: '120px' }}
                min="0"
                step="1"
                value={
                  editingOrder.totalAmount !== undefined &&
                  editingOrder.totalAmount !== null &&
                  editingOrder.totalAmount !== ''
                    ? Number(editingOrder.totalAmount)
                    : calculateTotalAmount(
                        editingOrder.quantity || 1,
                        editingOrder.unitPrice || 0
                      )
                }
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  onEditingOrderChange(
                    'totalAmount',
                    !isNaN(v) && v >= 0 ? v : ''
                  );
                }}
                title="Editable – use value from Excel when different from qty × rate"
              />
              <span className="helper-text" style={{ margin: 0 }}>
                (editable – use Excel value when different from qty × rate)
              </span>
            </div>
          ) : (
            <span className="order-form-total-value">
              ₹
              {formatCurrency(
                (() => {
                  const order = newOrder;
                  if (
                    order.totalAmount !== undefined &&
                    order.totalAmount !== null
                  ) {
                    const parsed = parseFloat(String(order.totalAmount));
                    if (!isNaN(parsed) && isFinite(parsed) && parsed >= 0)
                      return parsed;
                  }
                  if (order.total !== undefined && order.total !== null) {
                    const parsed = parseFloat(String(order.total));
                    if (!isNaN(parsed) && isFinite(parsed) && parsed >= 0)
                      return parsed;
                  }
                  return calculateTotalAmount(
                    order.quantity || 1,
                    order.unitPrice || 0
                  );
                })()
              )}
            </span>
          )}
        </div>
        <div className="modal-footer">
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={
              Object.keys(formErrors).length > 0 || isSaving || saveSuccess
            }
          >
            {isSaving ? (
              <>
                <Spinner type="circular" size="small" /> Saving...
              </>
            ) : saveSuccess ? (
              <>
                <Icon name="check" /> Order {editingOrder ? 'Updated' : 'Added'}
                !
              </>
            ) : (
              <>
                <Icon name="save" />{' '}
                {editingOrder ? 'Update Order' : 'Save Order'}
              </>
            )}
          </button>
          <button className="btn btn-ghost" onClick={handleClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
