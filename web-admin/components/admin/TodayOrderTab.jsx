import { useMemo, useState } from 'react';
import PremiumLoader from './PremiumLoader.jsx';
import { formatDate, parseOrderDate } from './utils/dateUtils.js';
import {
  formatCurrency,
  getOrderAmount,
  sortOrdersByOrderId,
} from './utils/orderUtils.js';

const TodayOrderTab = ({
  orders = [],
  onAcceptOrder,
  onCancelOrder,
  onDeleteOrder,
  loading = false,
  showNotification,
  showConfirmation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter orders for today
  const todayOrders = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const filtered = (Array.isArray(orders) ? orders : []).filter((order) => {
      try {
        const orderDate = parseOrderDate(order.date || order.order_date || null);
        if (!orderDate) return false;
        
        const orderDateMidnight = new Date(orderDate);
        orderDateMidnight.setHours(0, 0, 0, 0);
        
        return orderDateMidnight.getTime() === today.getTime();
      } catch (e) {
        return false;
      }
    });

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      return filtered.filter((order) => {
        const address = (order.deliveryAddress || order.customerAddress || order.address || '').toLowerCase();
        const orderId = (order.orderId || '').toLowerCase();
        const customerName = (order.customerName || '').toLowerCase();
        return address.includes(query) || orderId.includes(query) || customerName.includes(query);
      });
    }

    return sortOrdersByOrderId(filtered);
  }, [orders, searchQuery]);

  // Calculate total amount for today's orders
  const totalAmount = useMemo(() => {
    return todayOrders.reduce((sum, order) => sum + getOrderAmount(order), 0);
  }, [todayOrders]);

  const handleAccept = (order) => {
    if (showConfirmation) {
      showConfirmation({
        title: 'Accept Order',
        message: `Are you sure you want to accept Order #${order.orderId || 'N/A'} from ${order.deliveryAddress || order.customerAddress || 'N/A'}? This will add it to the system and record it.`,
        type: 'info',
        confirmText: 'Accept',
        onConfirm: async () => {
          if (onAcceptOrder) {
            await onAcceptOrder(order);
          }
        },
      });
    } else if (onAcceptOrder) {
      onAcceptOrder(order);
    }
  };

  const handleCancel = (order) => {
    if (showConfirmation) {
      showConfirmation({
        title: 'Cancel Order',
        message: `Are you sure you want to cancel Order #${order.orderId || 'N/A'} from ${order.deliveryAddress || order.customerAddress || 'N/A'}? This action cannot be undone.`,
        type: 'warning',
        confirmText: 'Cancel Order',
        onConfirm: async () => {
          if (onCancelOrder) {
            await onCancelOrder(order);
          }
        },
      });
    } else if (onCancelOrder) {
      onCancelOrder(order);
    }
  };

  const handleDelete = (order) => {
    if (showConfirmation) {
      showConfirmation({
        title: 'Delete Order',
        message: `Are you sure you want to delete Order #${order.orderId || 'N/A'} from ${order.deliveryAddress || order.customerAddress || 'N/A'}? This action cannot be undone.`,
        type: 'danger',
        confirmText: 'Delete',
        onConfirm: async () => {
          if (onDeleteOrder) {
            await onDeleteOrder(order._id || order.orderId || order.id);
          }
        },
      });
    } else if (onDeleteOrder) {
      onDeleteOrder(order._id || order.orderId || order.id);
    }
  };

  if (loading) {
    return (
      <div className="admin-content">
        <PremiumLoader message="Loading today's orders..." size="large" />
      </div>
    );
  }

  const today = new Date();
  const todayFormatted = formatDate(today);

  return (
    <div className="admin-content">
      <div className="kitchen-tab">
        {/* Stats row – theme colors only */}
        <div className="kitchen-tab-stats">
          <div className="stat-card">
            <i className="fa-solid fa-clipboard-list"></i>
            <div>
              <h3>{todayOrders.length}</h3>
              <p>{todayOrders.length === 1 ? 'Order' : 'Orders'} for Today</p>
            </div>
          </div>
          <div className="stat-card">
            <i className="fa-solid fa-rupee-sign"></i>
            <div>
              <h3>{formatCurrency(totalAmount)}</h3>
              <p>Total Amount</p>
            </div>
          </div>
        </div>

        {/* Actions: search left, summary right */}
        <div className="kitchen-tab-actions">
          <div className="kitchen-tab-actions-left">
            <div className="search-input-wrapper" style={{ minWidth: 200, flex: '1 1 280px', maxWidth: 360 }}>
              <input
                type="text"
                className="input-field search-input-with-icon"
                placeholder="Search by address, order ID, or customer name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="kitchen-tab-actions-right">
            <span className="table-info-text">
              {todayOrders.length} {todayOrders.length === 1 ? 'order' : 'orders'}
            </span>
          </div>
        </div>

        {/* Table or empty state */}
        <div className="kitchen-tab-card">
          {todayOrders.length === 0 ? (
            <div className="kitchen-tab-empty">
              <i className="fa-solid fa-calendar-day kitchen-tab-empty-icon" aria-hidden />
              <h3 className="kitchen-tab-empty-title">No orders for today</h3>
              <p className="kitchen-tab-empty-desc">
                {searchQuery
                  ? 'No orders match your search criteria.'
                  : "You don't have any orders for today yet."}
              </p>
            </div>
          ) : (
            <>
              <div className="orders-table-container">
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th className="col-orderid">Order ID</th>
                      <th>Customer Address</th>
                      <th>Date</th>
                      <th className="col-mode">Mode</th>
                      <th>Quantity</th>
                      <th>Amount</th>
                      <th className="col-status">Status</th>
                      <th style={{ textAlign: 'center', width: '280px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {todayOrders.map((order) => {
                      const orderDate = parseOrderDate(order.date || order.order_date || null);
                      const rowAmount = getOrderAmount(order);
                      const status = order.status || order.paymentStatus || 'Pending';
                      const isPaid = status.toLowerCase() === 'paid';
                      return (
                        <tr key={order._id || order.orderId || order.id}>
                          <td>
                            <span className="badge badge-info" style={{ fontWeight: '600' }}>
                              <i className="fa-solid fa-hashtag" style={{ marginRight: '4px' }}></i>
                              {order.orderId || 'N/A'}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <i className="fa-solid fa-location-dot" style={{ color: 'var(--admin-accent)', fontSize: 'var(--admin-fs-base)' }}></i>
                              <span className="order-row-address">{order.deliveryAddress || order.customerAddress || order.address || 'N/A'}</span>
                            </div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <i className="fa-solid fa-calendar" style={{ color: 'var(--admin-text-secondary)', fontSize: 'var(--admin-fs-sm)' }}></i>
                              <span className="order-row-date">{orderDate ? formatDate(orderDate) : 'N/A'}</span>
                            </div>
                          </td>
                          <td><span className="badge">{order.mode || 'N/A'}</span></td>
                          <td style={{ textAlign: 'center' }}>
                            <span className="badge badge-info">{order.quantity || 1}</span>
                          </td>
                          <td>
                            <span className="order-row-price" style={{ color: 'var(--admin-success)' }}>
                              {formatCurrency(rowAmount)}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${isPaid ? 'badge-success' : 'badge-warning'}`}>
                              <i className={`fa-solid ${isPaid ? 'fa-check-circle' : 'fa-clock'}`} style={{ marginRight: '4px' }}></i>
                              {status}
                            </span>
                          </td>
                          <td style={{ textAlign: 'center', minWidth: '280px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', flexWrap: 'nowrap', whiteSpace: 'nowrap' }}>
                              <button className="btn btn-small" onClick={() => handleAccept(order)} title="Accept and add to system" style={{ background: 'var(--admin-success)', color: 'white', border: 'none', whiteSpace: 'nowrap', flexShrink: 0 }}>
                                <i className="fa-solid fa-check"></i>
                                <span style={{ marginLeft: '6px' }}>Accept</span>
                              </button>
                              <button className="btn btn-small" onClick={() => handleCancel(order)} title="Cancel order" style={{ background: 'var(--admin-warning)', color: 'white', border: 'none', whiteSpace: 'nowrap', flexShrink: 0 }}>
                                <i className="fa-solid fa-times"></i>
                                <span style={{ marginLeft: '6px' }}>Cancel</span>
                              </button>
                              <button className="btn btn-small" onClick={() => handleDelete(order)} title="Delete order" style={{ background: 'var(--admin-danger)', color: 'white', border: 'none', whiteSpace: 'nowrap', flexShrink: 0, minWidth: '40px' }}>
                                <i className="fa-solid fa-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr style={{ backgroundColor: 'var(--admin-bg-secondary)', borderTop: '2px solid var(--admin-border)', fontWeight: '600' }}>
                      <td colSpan="5" style={{ textAlign: 'right', padding: '16px 20px' }}><strong>Total:</strong></td>
                      <td style={{ padding: '16px 20px' }}>
                        <span className="order-row-price" style={{ color: 'var(--admin-success)', fontSize: 'var(--admin-fs-md)', fontWeight: '700' }}>
                          {formatCurrency(totalAmount)}
                        </span>
                      </td>
                      <td colSpan="2"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodayOrderTab;
