import { useMemo, useState } from 'react';
import EmptyState from './EmptyState.jsx';
import PremiumLoader from './PremiumLoader.jsx';
import { formatDate, parseOrderDate } from './utils/dateUtils.js';
import {
  formatCurrency,
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
      <div className="action-bar action-bar-spaced">
        <div className="search-container">
          <i className="fa-solid fa-search search-icon"></i>
          <input
            type="text"
            className="search-input"
            placeholder="Search by address, order ID, or customer name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="search-clear"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              <i className="fa-solid fa-times"></i>
            </button>
          )}
        </div>
        <div className="action-buttons-group">
          <span className="orders-count">
            {todayOrders.length} order{todayOrders.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <div className="dashboard-card">
        {todayOrders.length === 0 ? (
          <EmptyState
            icon="fa-calendar-day"
            title="No orders for today"
            message={
              searchQuery
                ? 'No orders match your search criteria.'
                : "You don't have any orders for today yet."
            }
          />
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Address</th>
                  <th>Date</th>
                  <th>Mode</th>
                  <th>Quantity</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {todayOrders.map((order) => {
                  const orderDate = parseOrderDate(order.date || order.order_date || null);
                  const totalAmount = order.totalAmount || order.total || 0;
                  const status = order.status || order.paymentStatus || 'Pending';
                  
                  return (
                    <tr key={order._id || order.orderId || order.id}>
                      <td>
                        <strong>#{order.orderId || 'N/A'}</strong>
                      </td>
                      <td>{order.customerName || 'N/A'}</td>
                      <td className="address-cell">
                        {order.deliveryAddress || order.customerAddress || order.address || 'N/A'}
                      </td>
                      <td>
                        {orderDate ? formatDate(orderDate) : 'N/A'}
                      </td>
                      <td>{order.mode || 'N/A'}</td>
                      <td>{order.quantity || 1}</td>
                      <td>
                        <strong>{formatCurrency(totalAmount)}</strong>
                      </td>
                      <td>
                        <span
                          className={`status-badge status-${status.toLowerCase()}`}
                        >
                          {status}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons-group">
                          <button
                            className="btn btn-primary btn-small"
                            onClick={() => handleAccept(order)}
                            title="Accept and add to system"
                          >
                            <i className="fa-solid fa-check"></i> Accept
                          </button>
                          <button
                            className="btn btn-secondary btn-small"
                            onClick={() => handleCancel(order)}
                            title="Cancel order"
                          >
                            <i className="fa-solid fa-times"></i> Cancel
                          </button>
                          <button
                            className="btn btn-danger btn-small"
                            onClick={() => handleDelete(order)}
                            title="Delete order"
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodayOrderTab;
