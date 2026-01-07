import { useEffect, useState } from 'react';
import {
  calculateTotalAmount,
  extractBillingMonth,
  extractBillingYear,
  formatBillingMonth,
  formatCurrency,
  getLastUnitPriceForAddress,
  getUniqueAddresses,
} from '../utils/orderUtils.js';

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
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Generate OrderID preview (format: HB-Jan'25-15-000079)
  // Shows next number from the very last record
  const generateOrderIdPreview = () => {
    if (editingOrder) return editingOrder.orderId || 'N/A';
    if (!newOrder.date) return 'HB-XXX-XX-XXXXXX';

    try {
      const date = new Date(newOrder.date);
      const month = date.toLocaleString('en-US', { month: 'short' });
      const year = date.getFullYear().toString().slice(-2);
      const day = date.getDate().toString().padStart(2, '0');

      // Find the last order and extract its sequence number
      if (orders && orders.length > 0) {
        // Sort orders by date descending, then by orderId descending to get the very last one
        const sortedOrders = [...orders].sort((a, b) => {
          const dateA = new Date(a.date || a.createdAt || a.order_date || 0);
          const dateB = new Date(b.date || b.createdAt || b.order_date || 0);
          if (dateB.getTime() !== dateA.getTime()) {
            return dateB.getTime() - dateA.getTime();
          }
          // If dates are same, sort by orderId
          const idA = (a.orderId || '').toString();
          const idB = (b.orderId || '').toString();
          return idB.localeCompare(idA);
        });

        const lastOrder = sortedOrders[0];
        if (lastOrder && lastOrder.orderId) {
          // Extract sequence number from last order ID (format: HB-Jan'25-15-000079)
          const match = lastOrder.orderId.match(/HB-\w+'?\d{2}-\d{2}-(\d+)$/);
          if (match && match[1]) {
            const lastSequence = parseInt(match[1], 10);
            const nextSequence = String(lastSequence + 1).padStart(6, '0');
            return `HB-${month}'${year}-${day}-${nextSequence}`;
          }
        }
      }

      // Fallback: Count orders for this day + 1
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const todayOrders = orders.filter((o) => {
        try {
          const oDate = new Date(o.date || o.createdAt || o.order_date);
          return oDate >= startOfDay && oDate <= endOfDay;
        } catch {
          return false;
        }
      });

      const sequence = String(todayOrders.length + 1).padStart(6, '0');
      return `HB-${month}'${year}-${day}-${sequence}`;
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
        const oDate = new Date(o.createdAt || o.date || o.order_date);
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

  // Smart defaults based on time and context
  useEffect(() => {
    if (!show || editingOrder) return;

    // Set default mode based on time if not set
    if (!newOrder.mode) {
      const now = new Date();
      const hour = now.getHours();
      const defaultMode = hour < 15 ? 'Lunch' : 'Dinner';
      onNewOrderChange('mode', defaultMode);
    }

    // Set default status to Unpaid if not set
    if (!newOrder.status) {
      onNewOrderChange('status', 'Unpaid');
    }

    // Payment mode defaults to empty (no default)
    // Don't set a default for paymentMode
  }, [show, editingOrder]);

  // Validate form fields
  const validateForm = () => {
    const errors = {};
    const order = editingOrder || newOrder;

    if (!order.date) {
      errors.date = 'Date is required';
    } else {
      const selectedDate = new Date(order.date);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (selectedDate > today) {
        errors.date = 'Cannot select future date';
      }
    }

    if (!order.deliveryAddress || order.deliveryAddress.trim().length < 3) {
      errors.deliveryAddress = 'Address must be at least 3 characters';
    } else if (!/^[A-Z0-9\-\/\s]+$/i.test(order.deliveryAddress)) {
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

    if (!order.status) {
      errors.status = 'Status is required';
    } else if (!['Paid', 'Unpaid'].includes(order.status)) {
      errors.status = 'Status must be either Paid or Unpaid';
    }

    if (!order.paymentMode) {
      errors.paymentMode = 'Payment mode is required';
    } else if (!['Cash', 'Online'].includes(order.paymentMode)) {
      errors.paymentMode = 'Payment mode must be either Cash or Online';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

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
        setDuplicateWarning(null);
        onClose();
      }
    } else {
      setHasUnsavedChanges(false);
      setFormErrors({});
      setDuplicateWarning(null);
      onClose();
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
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

    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await onSave();
      setSaveSuccess(true);
      // Reset success state after 2 seconds
      setTimeout(() => {
        setSaveSuccess(false);
        setIsSaving(false);
      }, 2000);
    } catch (error) {
      setIsSaving(false);
      setSaveSuccess(false);
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
  const getAddressSuggestions = (query) => {
    const allAddresses = getUniqueAddresses(orders);
    const queryLower = query.trim().toLowerCase();

    if (!queryLower) {
      // Show most frequently used addresses when empty
      const addressFrequency = {};
      orders.forEach((order) => {
        const addr = order.deliveryAddress || order.customerAddress || order.address;
        if (addr) {
          addressFrequency[addr] = (addressFrequency[addr] || 0) + 1;
        }
      });

      return Object.entries(addressFrequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20)
        .map(([addr]) => addr);
    }

    // Filter and rank by relevance
    const filtered = allAddresses
      .filter((addr) => addr.toLowerCase().includes(queryLower))
      .map((addr) => {
        // Calculate relevance score
        const exactMatch = addr.toLowerCase() === queryLower ? 100 : 0;
        const startsWith = addr.toLowerCase().startsWith(queryLower) ? 50 : 0;
        const frequency = orders.filter(
          (o) => (o.deliveryAddress || o.customerAddress || o.address) === addr
        ).length;

        return {
          address: addr,
          score: exactMatch + startsWith + frequency,
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 20)
      .map((item) => item.address);

    return filtered;
  };

  const handleAddressChange = (value) => {
    if (editingOrder) {
      onEditingOrderChange({ ...editingOrder, deliveryAddress: value });
    } else {
      onNewOrderChange('deliveryAddress', value);
      // Show enhanced suggestions as user types
      const suggestions = getAddressSuggestions(value);
      setAddressSuggestions(suggestions);
      setShowAddressSuggestions(suggestions.length > 0 && value.trim().length > 0);
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
    // Delay hiding suggestions to allow click on suggestion item
    setTimeout(() => setShowAddressSuggestions(false), 250);
  };

  const handleSuggestionClick = (addr) => {
    onNewOrderChange('deliveryAddress', addr);
    setShowAddressSuggestions(false);
    // Auto-fill unit price when address is selected
    const lastPrice = getLastUnitPriceForAddress(orders, addr);
    if (lastPrice) {
      onNewOrderChange('unitPrice', lastPrice);
    }
    // Auto-fill mode based on time if not set
    if (!newOrder.mode) {
      const now = new Date();
      const hour = now.getHours();
      const defaultMode = hour < 15 ? 'Lunch' : 'Dinner';
      onNewOrderChange('mode', defaultMode);
    }
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
      lastDate: lastOrder ? lastOrder.date || lastOrder.createdAt || lastOrder.order_date : null,
    };
  };

  // Calculate derived fields for display
  const orderDate = editingOrder ? new Date(editingOrder.date) : new Date(newOrder.date);
  const billingMonth = extractBillingMonth(orderDate);
  const billingYear = extractBillingYear(orderDate);
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
              type='date'
              className={`input-field ${editingOrder?.dateNeedsReview ? 'error' : ''}`}
              value={
                editingOrder
                  ? editingOrder.date ||
                    editingOrder.order_date ||
                    new Date().toISOString().split('T')[0]
                  : newOrder.date &&
                    typeof newOrder.date === 'string' &&
                    newOrder.date.includes('/')
                  ? newOrder.date.split('/').reverse().join('-')
                  : newOrder.date || new Date().toISOString().split('T')[0]
              }
              onChange={(e) => {
                const newDate = e.target.value;
                if (editingOrder) {
                  // Clear dateNeedsReview flag when user edits the date
                  onEditingOrderChange({
                    ...editingOrder,
                    date: newDate,
                    dateNeedsReview: false,
                    originalDateString: undefined,
                  });
                } else {
                  onNewOrderChange('date', newDate);
                }
              }}
              required
              max={new Date().toISOString().split('T')[0]}
            />
            <span className='helper-text'>(Default: Today)</span>
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
              value={editingOrder ? editingOrder.deliveryAddress : newOrder.deliveryAddress}
              onChange={(e) => handleAddressChange(e.target.value)}
              onFocus={handleAddressFocus}
              onBlur={handleAddressBlur}
              placeholder='Start typing address (e.g., A3-1206)'
              required
              autoComplete='off'
            />
            {showAddressSuggestions && addressSuggestions.length > 0 && !editingOrder && (
              <div
                className='address-suggestions-dropdown'
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
                {addressSuggestions.slice(0, 20).map((addr, idx) => {
                  const info = getAddressOrderInfo(addr);
                  return (
                    <div
                      key={idx}
                      className='address-suggestion-item'
                      onClick={() => handleSuggestionClick(addr)}
                      onMouseDown={(e) => e.preventDefault()}
                      style={{
                        padding: '12px 16px',
                        cursor: 'pointer',
                        borderBottom:
                          idx < addressSuggestions.slice(0, 20).length - 1
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
                    </div>
                  );
                })}
              </div>
            )}
            {formErrors.deliveryAddress && (
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
              <div style={{ position: 'relative' }}>
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
                {!editingOrder && (
                  <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
                    {[1, 2, 3, 5, 10].map((qty) => (
                      <button
                        key={qty}
                        type='button'
                        className='btn btn-ghost btn-small'
                        onClick={() => onNewOrderChange('quantity', qty)}
                        style={{ fontSize: '12px', padding: '4px 10px', minWidth: 'auto' }}
                      >
                        {qty}
                      </button>
                    ))}
                  </div>
                )}
              </div>
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
                {!editingOrder && newOrder.deliveryAddress && (
                  <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
                    {(() => {
                      const lastPrice = getLastUnitPriceForAddress(
                        orders,
                        newOrder.deliveryAddress
                      );
                      const commonPrices = [50, 75, 100, 120, 150, 200];
                      const prices = lastPrice
                        ? [lastPrice, ...commonPrices.filter((p) => p !== lastPrice)]
                        : commonPrices;
                      return prices.slice(0, 6).map((price) => (
                        <button
                          key={price}
                          type='button'
                          className={`btn btn-small ${
                            price === lastPrice ? 'btn-primary' : 'btn-ghost'
                          }`}
                          onClick={() => onNewOrderChange('unitPrice', price)}
                          style={{ fontSize: '12px', padding: '4px 10px', minWidth: 'auto' }}
                          title={price === lastPrice ? 'Last used price for this address' : ''}
                        >
                          ₹{price}
                          {price === lastPrice && (
                            <i
                              className='fa-solid fa-clock-rotate-left ml-1'
                              style={{ fontSize: '10px' }}
                            ></i>
                          )}
                        </button>
                      ));
                    })()}
                  </div>
                )}
              </div>
              {formErrors.unitPrice && <span className='error-text'>{formErrors.unitPrice}</span>}
            </div>
            <div className='form-group'>
              <label>
                <i className='fa-solid fa-lock mr-2'></i>
                Total Amount <span className='helper-text'>(Auto)</span>
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
                <option value='Snacks'>Snacks</option>
                <option value='Breakfast'>Breakfast</option>
              </select>
              {formErrors.mode && <span className='error-text'>{formErrors.mode}</span>}
            </div>
            <div className='form-group'>
              <label className='required'>
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
                required
              >
                <option value=''>-- Select Payment Mode --</option>
                <option value='Cash'>Cash</option>
                <option value='Online'>Online</option>
              </select>
              {formErrors.paymentMode && (
                <span className='error-text'>{formErrors.paymentMode}</span>
              )}
            </div>
          </div>
          {/* OrderID Display */}
          {!editingOrder && (
            <div className='form-group'>
              <label>Order ID</label>
              <input
                type='text'
                value={generateOrderIdPreview()}
                readOnly
                className='input-field font-mono text-sm bg-gray-100 cursor-not-allowed'
              />
              <span className='helper-text'>(Auto-generated)</span>
            </div>
          )}
          {/* Derived fields - Display only (never stored) */}
          <div className='form-row admin-auto-fields-row'>
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
          <button className='btn btn-ghost' onClick={handleClose}>
            Cancel
          </button>
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
                <i className='fa-solid fa-save'></i>{' '}
                {editingOrder ? 'Update Order' : 'Save Order'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
