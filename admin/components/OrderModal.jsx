import {
  calculateTotalAmount,
  extractBillingMonth,
  extractBillingYear,
  formatBillingMonth,
  formatCurrency,
  formatReferenceMonth,
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
  if (!show) return null;

  const handleAddressChange = (value) => {
    if (editingOrder) {
      onEditingOrderChange({ ...editingOrder, deliveryAddress: value });
    } else {
      onNewOrderChange('deliveryAddress', value);
      // Show suggestions as user types
      const query = String(value).trim().toLowerCase();
      if (query.length > 0) {
        const filtered = getUniqueAddresses(orders).filter((addr) =>
          addr.toLowerCase().includes(query)
        );
        setAddressSuggestions(filtered);
        setShowAddressSuggestions(filtered.length > 0);
      } else {
        setShowAddressSuggestions(false);
      }
    }
  };

  const handleAddressFocus = () => {
    if (!editingOrder) {
      const query = String(newOrder.deliveryAddress || '').trim().toLowerCase();
      if (query.length > 0) {
        const filtered = getUniqueAddresses(orders).filter((addr) =>
          addr.toLowerCase().includes(query)
        );
        setAddressSuggestions(filtered);
        setShowAddressSuggestions(filtered.length > 0);
      } else {
        // Show all addresses when field is empty and focused
        const allAddresses = getUniqueAddresses(orders);
        setAddressSuggestions(allAddresses.slice(0, 20));
        setShowAddressSuggestions(allAddresses.length > 0);
      }
    }
  };

  const handleAddressBlur = () => {
    // Delay hiding suggestions to allow click on suggestion item
    setTimeout(() => setShowAddressSuggestions(false), 200);
  };

  const handleSuggestionClick = (addr) => {
    onNewOrderChange('deliveryAddress', addr);
    setShowAddressSuggestions(false);
    // Auto-fill unit price when address is selected
    const lastPrice = getLastUnitPriceForAddress(orders, addr);
    if (lastPrice) {
      onNewOrderChange('unitPrice', lastPrice);
    }
  };

  // Calculate derived fields for display
  const orderDate = editingOrder
    ? new Date(editingOrder.date)
    : new Date(newOrder.date);
  const billingMonth = extractBillingMonth(orderDate);
  const billingYear = extractBillingYear(orderDate);
  const billingMonthFormatted =
    billingMonth && billingYear ? formatBillingMonth(billingMonth, billingYear) : '';
  const referenceMonthFormatted =
    billingMonth && billingYear ? formatReferenceMonth(billingMonth, billingYear) : '';

  return (
    <div className='modal-overlay' onClick={onClose}>
      <div className='modal-content' onClick={(e) => e.stopPropagation()}>
        <div className='modal-header'>
          <h2>{editingOrder ? 'Edit Order' : 'Add New Order'}</h2>
          <button className='modal-close' onClick={onClose}>
            <i className='fa-solid fa-times'></i>
          </button>
        </div>
        <div className='modal-body'>
          <div className='form-group'>
            <label>
              Date *{' '}
              <span
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--admin-text-light)',
                  fontWeight: 'normal',
                }}
              >
                (Default: Today)
              </span>
            </label>
            <input
              type='date'
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
              onChange={(e) =>
                editingOrder
                  ? onEditingOrderChange({ ...editingOrder, date: e.target.value })
                  : onNewOrderChange('date', e.target.value)
              }
              required
            />
          </div>
          <div className='form-group' style={{ position: 'relative' }}>
            <label>Delivery Address *:</label>
            <input
              type='text'
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
                className='address-suggestions admin-address-dropdown'
                style={{ maxHeight: '200px', overflowY: 'auto', zIndex: 1000 }}
              >
                <div
                  style={{
                    padding: '0.5rem',
                    fontSize: '0.85rem',
                    color: 'var(--admin-text-light)',
                    borderBottom: '1px solid var(--admin-border)',
                  }}
                >
                  {addressSuggestions.length} suggestion{addressSuggestions.length !== 1 ? 's' : ''}{' '}
                  found
                </div>
                {addressSuggestions.slice(0, 15).map((addr, idx) => (
                  <div
                    key={idx}
                    className='admin-address-suggestion-item'
                    onClick={() => handleSuggestionClick(addr)}
                    onMouseDown={(e) => e.preventDefault()} // Prevent blur before click
                  >
                    <i
                      className='fa-solid fa-map-marker-alt'
                      style={{ marginRight: '0.5rem', color: 'var(--admin-accent)' }}
                    ></i>
                    {addr}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className='form-row'>
            <div className='form-group'>
              <label>Qty.:</label>
              <input
                type='number'
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
              />
            </div>
            <div className='form-group'>
              <label>Unit Price (₹):</label>
              <input
                type='number'
                value={editingOrder ? editingOrder.unitPrice : newOrder.unitPrice}
                onChange={(e) =>
                  editingOrder
                    ? onEditingOrderChange({
                        ...editingOrder,
                        unitPrice: parseFloat(e.target.value) || 0,
                      })
                    : onNewOrderChange('unitPrice', e.target.value)
                }
                min='0'
                step='0.01'
              />
            </div>
            <div className='form-group'>
              <label>Total Amount (₹):</label>
              <input
                type='text'
                value={formatCurrency(
                  calculateTotalAmount(
                    editingOrder
                      ? editingOrder.quantity || 1
                      : newOrder.quantity || 1,
                    editingOrder ? editingOrder.unitPrice || 0 : newOrder.unitPrice || 0
                  )
                )}
                readOnly
                className='admin-readonly-input'
                style={{
                  fontWeight: 'bold',
                }}
                title='Auto-calculated: Quantity × Unit Price'
              />
            </div>
          </div>
          <div className='form-row'>
            <div className='form-group'>
              <label>Status *:</label>
              <div
                style={{
                  display: 'flex',
                  gap: '0.75rem',
                  alignItems: 'center',
                }}
              >
                <button
                  type='button'
                  className={`btn ${
                    (editingOrder ? editingOrder.status : newOrder.status || '').toLowerCase() === 'paid'
                      ? 'btn-primary'
                      : 'btn-ghost'
                  }`}
                  onClick={() => {
                    if (editingOrder) {
                      onEditingOrderChange({ ...editingOrder, status: 'Paid' });
                    } else {
                      onNewOrderChange('status', 'Paid');
                    }
                  }}
                  style={{ flex: 1 }}
                >
                  Paid
                </button>
                <button
                  type='button'
                  className={`btn ${
                    (editingOrder ? editingOrder.status : newOrder.status || '').toLowerCase() === 'unpaid'
                      ? 'btn-special danger'
                      : 'btn-ghost'
                  }`}
                  onClick={() => {
                    if (editingOrder) {
                      onEditingOrderChange({ ...editingOrder, status: 'Unpaid' });
                    } else {
                      onNewOrderChange('status', 'Unpaid');
                    }
                  }}
                  style={{ flex: 1 }}
                >
                  Unpaid
                </button>
              </div>
            </div>
            <div className='form-group'>
              <label>Payment Mode:</label>
              <select
                value={editingOrder ? editingOrder.paymentMode : newOrder.paymentMode}
                onChange={(e) =>
                  editingOrder
                    ? onEditingOrderChange({ ...editingOrder, paymentMode: e.target.value })
                    : onNewOrderChange('paymentMode', e.target.value)
                }
              >
                <option value=''>-- Select --</option>
                <option value='Online'>Online</option>
                <option value='Cash'>Cash</option>
                <option value='UPI'>UPI</option>
              </select>
            </div>
          </div>
          {/* Derived fields - Display only (never stored) */}
          <div className='form-row admin-auto-fields-row'>
            <div className='form-group'>
              <label>Billing Month (auto):</label>
              <input
                type='text'
                value={billingMonthFormatted}
                readOnly
                className='admin-readonly-input'
                title='Auto-calculated from date'
              />
            </div>
            <div className='form-group'>
              <label>Reference Month (auto):</label>
              <input
                type='text'
                value={referenceMonthFormatted}
                readOnly
                className='admin-readonly-input'
                title='Auto-calculated from date'
              />
            </div>
            <div className='form-group'>
              <label>Year (auto):</label>
              <input
                type='text'
                value={billingYear || ''}
                readOnly
                className='admin-readonly-input'
                title='Auto-calculated from date'
              />
            </div>
          </div>
        </div>
        <div className='modal-footer'>
          <button className='btn btn-ghost' onClick={onClose}>
            Cancel
          </button>
          <button className='btn btn-primary' onClick={onSave}>
            <i className='fa-solid fa-save'></i> {editingOrder ? 'Update Order' : 'Save Order'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;

