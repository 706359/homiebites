// Tab 9: Notifications - Following FULL_DASHBOARD_PLAN.md structure
// This file has been recreated from scratch to match the plan exactly

import { useState } from 'react';
import PremiumLoader from './PremiumLoader.jsx';
import { formatDateMonthDay, parseOrderDate } from '../utils/dateUtils.js';
import { isPendingStatus } from '../utils/orderUtils.js';

// Get time ago helper
function getTimeAgo(date) {
  if (!date) return 'N/A';
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 60) return `${minutes} mins ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  return formatDateMonthDay(date);
}

const NotificationsTab = ({
  orders = [],
  showNotification,
  loading = false,
  onViewOrder,
  onMarkAsPaid,
  onSendReminder,
}) => {
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'payments', 'orders', 'system'
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    notifyNewOrders: true,
    notifyPaymentReceived: true,
    notifyPaymentOverdue: true,
    notifyDailySummary: true,
    notifyWeeklyReport: false,
    notifyLowOrderDays: false,
    deliveryInApp: true,
    deliveryEmail: true,
    deliverySMS: false,
  });

  // Generate notifications from orders (mock - in real app would come from API)
  const notifications = [];

  // Recent orders notifications
  const recentOrders = orders.slice(0, 10).reverse();
  recentOrders.forEach((order) => {
    const orderDate = parseOrderDate(order.createdAt || order.date || order.order_date);
    if (!orderDate) return;
    const timeAgo = getTimeAgo(orderDate);
    notifications.push({
      id: `order-${order._id || order.orderId}`,
      type: 'order',
      title: 'New Order Received',
      message: `Order #${order.orderId || 'N/A'} from ${
        order.deliveryAddress || order.customerAddress || order.address || 'N/A'
      }`,
      details: `Amount: ₹${order.total || order.totalAmount || 0} | Mode: ${
        order.mode || 'N/A'
      } | Status: ${order.status || 'N/A'}`,
      timeAgo,
      read: false,
      action: 'viewOrder',
      orderId: order._id || order.orderId,
    });
  });

  // Pending payments notifications
  const pendingOrders = orders.filter((o) => isPendingStatus(o.status));
  pendingOrders.slice(0, 10).forEach((order) => {
    const orderDate = parseOrderDate(order.createdAt || order.date || order.order_date);
    if (!orderDate) return;
    const daysPending = Math.floor((new Date() - orderDate) / (1000 * 60 * 60 * 24));
    if (daysPending > 3) {
      const timeAgo = getTimeAgo(orderDate);
      notifications.push({
        id: `payment-${order._id || order.orderId}`,
        type: 'payment',
        title: 'Payment Overdue',
        message: `Order #${order.orderId || 'N/A'} pending for ${daysPending} days`,
        details: `Amount: ₹${order.total || order.totalAmount || 0} from ${
          order.deliveryAddress || order.customerAddress || order.address || 'N/A'
        }`,
        timeAgo,
        read: false,
        action: 'sendReminder',
        orderId: order._id || order.orderId,
        daysPending,
      });
    }
  });

  // System notifications (mock)
  notifications.push({
    id: 'system-1',
    type: 'system',
    title: 'Daily Summary Generated',
    message: 'Total orders: 9 | Revenue: ₹1,800',
    details: 'Generated Today 9AM',
    timeAgo: 'Today 9AM',
    read: false,
    action: 'viewReport',
  });

  notifications.push({
    id: 'system-2',
    type: 'system',
    title: 'Low Order Day Yesterday',
    message: 'Only 3 orders received yesterday',
    details: 'Consider sending promotional messages',
    timeAgo: 'Yesterday',
    read: false,
    action: 'viewDetails',
  });

  // Filter notifications
  const filteredNotifications = notifications.filter((notif) => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notif.read;
    if (filter === 'payments') return notif.type === 'payment';
    if (filter === 'orders') return notif.type === 'order';
    if (filter === 'system') return notif.type === 'system';
    return true;
  });

  // Counts
  const unreadCount = notifications.filter((n) => !n.read).length;
  const paymentCount = notifications.filter((n) => n.type === 'payment').length;
  const orderCount = notifications.filter((n) => n.type === 'order').length;
  const systemCount = notifications.filter((n) => n.type === 'system').length;

  // Handle mark as read
  const handleMarkAsRead = (id) => {
    // In real app, would update via API
    if (showNotification) showNotification('Notification marked as read', 'success');
  };

  // Handle mark all as read
  const handleMarkAllAsRead = () => {
    // In real app, would update via API
    if (showNotification) showNotification('All notifications marked as read', 'success');
  };

  // Handle notification action
  const handleAction = (notif) => {
    switch (notif.action) {
      case 'viewOrder':
        if (onViewOrder) onViewOrder(notif.orderId);
        break;
      case 'sendReminder':
        if (onSendReminder) onSendReminder(notif.orderId);
        break;
      case 'markAsPaid':
        if (showConfirmation && onMarkAsPaid) {
          const order = orders.find((o) => (o._id || o.orderId) === notif.orderId);
          const orderInfo = order
            ? `Order ${order.orderId || notif.orderId} for ${order.deliveryAddress || order.customerAddress || 'N/A'}`
            : `Order ${notif.orderId}`;
          showConfirmation({
            title: 'Mark as Paid',
            message: `Are you sure you want to mark ${orderInfo} as paid?`,
            type: 'info',
            confirmText: 'Mark as Paid',
            onConfirm: () => {
              onMarkAsPaid(notif.orderId);
            },
          });
        } else if (onMarkAsPaid) {
          onMarkAsPaid(notif.orderId);
        }
        break;
      case 'viewReport':
        // Navigate to reports
        break;
      case 'viewDetails':
        // Show details
        break;
    }
  };

  // Get notification icon
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order':
        return 'fa-solid fa-shopping-cart';
      case 'payment':
        return 'fa-solid fa-money-bill-wave';
      case 'system':
        return 'fa-solid fa-info-circle';
      default:
        return 'fa-solid fa-bell';
    }
  };

  // Get notification color
  const getNotificationColor = (type) => {
    switch (type) {
      case 'order':
        return 'var(--admin-accent)';
      case 'payment':
        return 'var(--admin-warning)';
      case 'system':
        return 'var(--admin-info)';
      default:
        return 'var(--admin-text-secondary)';
    }
  };

  if (loading) {
    return (
      <div className='admin-content'>
        <div className='dashboard-header'>
          <h2>Notifications</h2>
        </div>
        <PremiumLoader message="Loading notifications..." size="large" />
      </div>
    );
  }

  return (
    <div className='admin-content'>
      {/* HEADER */}
      <div className='dashboard-header'>
        <div>
          <h2>Notifications {unreadCount > 0 && `(${unreadCount} unread)`}</h2>
          <p>Stay updated with your business activities</p>
        </div>
        <div className='action-buttons-group'>
          <button className='btn btn-secondary btn-small' onClick={handleMarkAllAsRead}>
            Mark All as Read
          </button>
          <button className='btn btn-ghost btn-small' onClick={() => setShowSettingsModal(true)}>
            <i className='fa-solid fa-cog'></i> Settings
          </button>
        </div>
      </div>

      {/* FILTER TABS */}
      <div className='action-bar' style={{ marginBottom: '24px', flexWrap: 'wrap', gap: '8px' }}>
        <button
          className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-ghost'} btn-small`}
          onClick={() => setFilter('all')}
        >
          All ({notifications.length})
        </button>
        <button
          className={`btn ${filter === 'unread' ? 'btn-primary' : 'btn-ghost'} btn-small`}
          onClick={() => setFilter('unread')}
        >
          Unread ({unreadCount})
        </button>
        <button
          className={`btn ${filter === 'payments' ? 'btn-primary' : 'btn-ghost'} btn-small`}
          onClick={() => setFilter('payments')}
        >
          Payments ({paymentCount})
        </button>
        <button
          className={`btn ${filter === 'orders' ? 'btn-primary' : 'btn-ghost'} btn-small`}
          onClick={() => setFilter('orders')}
        >
          Orders ({orderCount})
        </button>
        <button
          className={`btn ${filter === 'system' ? 'btn-primary' : 'btn-ghost'} btn-small`}
          onClick={() => setFilter('system')}
        >
          System ({systemCount})
        </button>
      </div>

      {/* NOTIFICATION LIST */}
      <div className='dashboard-card'>
        {filteredNotifications.length === 0 ? (
          <div className='empty-state' style={{ padding: '48px', textAlign: 'center' }}>
            <i
              className='fa-solid fa-bell-slash'
              style={{ fontSize: '64px', color: 'var(--admin-text-light)', marginBottom: '16px' }}
            ></i>
            <p>No notifications</p>
            <p style={{ color: 'var(--admin-text-light)', fontSize: '0.9rem' }}>
              You're all caught up!
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                className='dashboard-card'
                style={{
                  padding: '16px',
                  border: `2px solid ${
                    notif.read ? 'transparent' : getNotificationColor(notif.type)
                  }`,
                  background: notif.read ? 'var(--admin-glass-bg)' : 'var(--admin-glass-overlay)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
                onClick={() => handleAction(notif)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateX(4px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateX(0)';
                  e.currentTarget.style.boxShadow = '';
                }}
              >
                <div style={{ display: 'flex', gap: '16px', alignItems: 'start' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: `${getNotificationColor(notif.type)}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <i
                      className={getNotificationIcon(notif.type)}
                      style={{ fontSize: '24px', color: getNotificationColor(notif.type) }}
                    ></i>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'start',
                        marginBottom: '8px',
                      }}
                    >
                      <div>
                        <h4 style={{ marginBottom: '4px', fontSize: '1rem', fontWeight: '600' }}>
                          {notif.title}
                        </h4>
                        <p style={{ color: 'var(--admin-text)', marginBottom: '4px' }}>
                          {notif.message}
                        </p>
                        <p style={{ color: 'var(--admin-text-secondary)', fontSize: '0.85rem' }}>
                          {notif.details}
                        </p>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-end',
                          gap: '8px',
                        }}
                      >
                        <span style={{ color: 'var(--admin-text-light)', fontSize: '0.75rem' }}>
                          {notif.timeAgo}
                        </span>
                        {!notif.read && (
                          <span
                            className='badge badge-info'
                            style={{ fontSize: '0.7rem', padding: '2px 8px' }}
                          >
                            Unread
                          </span>
                        )}
                      </div>
                    </div>
                    <div className='action-buttons-group' style={{ marginTop: '12px' }}>
                      {notif.action === 'viewOrder' && (
                        <button
                          className='btn btn-primary btn-small'
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAction(notif);
                          }}
                        >
                          View Order
                        </button>
                      )}
                      {notif.action === 'sendReminder' && (
                        <>
                          <button
                            className='btn btn-secondary btn-small'
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAction(notif);
                            }}
                          >
                            Send Reminder
                          </button>
                          <button
                            className='btn btn-success btn-small'
                            onClick={(e) => {
                              e.stopPropagation();
                              if (showConfirmation && onMarkAsPaid) {
                                const order = orders.find((o) => (o._id || o.orderId) === notif.orderId);
                                const orderInfo = order
                                  ? `Order ${order.orderId || notif.orderId} for ${order.deliveryAddress || order.customerAddress || 'N/A'}`
                                  : `Order ${notif.orderId}`;
                                showConfirmation({
                                  title: 'Mark as Paid',
                                  message: `Are you sure you want to mark ${orderInfo} as paid?`,
                                  type: 'info',
                                  confirmText: 'Mark as Paid',
                                  onConfirm: () => {
                                    onMarkAsPaid(notif.orderId);
                                  },
                                });
                              } else if (onMarkAsPaid) {
                                onMarkAsPaid(notif.orderId);
                              }
                            }}
                          >
                            Mark as Paid
                          </button>
                        </>
                      )}
                      {notif.action === 'viewReport' && (
                        <button
                          className='btn btn-secondary btn-small'
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAction(notif);
                          }}
                        >
                          View Report
                        </button>
                      )}
                      {notif.action === 'viewDetails' && (
                        <button
                          className='btn btn-secondary btn-small'
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAction(notif);
                          }}
                        >
                          View Details
                        </button>
                      )}
                      <button
                        className='btn btn-ghost btn-small'
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsRead(notif.id);
                        }}
                      >
                        Mark as Read
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* NOTIFICATION SETTINGS MODAL */}
      {showSettingsModal && (
        <div className='modal-overlay' onClick={() => setShowSettingsModal(false)}>
          <div className='modal-container' onClick={(e) => e.stopPropagation()}>
            <div className='modal-header'>
              <h2>Notification Settings</h2>
              <button className='modal-close' onClick={() => setShowSettingsModal(false)}>
                <i className='fa-solid fa-times'></i>
              </button>
            </div>
            <div className='modal-body'>
              <div className='form-grid'>
                <div className='form-group' style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontWeight: '600', marginBottom: '12px', display: 'block' }}>
                    Notify me about:
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type='checkbox'
                        checked={notificationSettings.notifyNewOrders}
                        onChange={(e) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            notifyNewOrders: e.target.checked,
                          })
                        }
                      />
                      <span>New orders</span>
                    </label>
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type='checkbox'
                        checked={notificationSettings.notifyPaymentReceived}
                        onChange={(e) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            notifyPaymentReceived: e.target.checked,
                          })
                        }
                      />
                      <span>Payment received</span>
                    </label>
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type='checkbox'
                        checked={notificationSettings.notifyPaymentOverdue}
                        onChange={(e) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            notifyPaymentOverdue: e.target.checked,
                          })
                        }
                      />
                      <span>Payment overdue (&gt;3 days)</span>
                    </label>
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type='checkbox'
                        checked={notificationSettings.notifyDailySummary}
                        onChange={(e) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            notifyDailySummary: e.target.checked,
                          })
                        }
                      />
                      <span>Daily summary</span>
                    </label>
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type='checkbox'
                        checked={notificationSettings.notifyWeeklyReport}
                        onChange={(e) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            notifyWeeklyReport: e.target.checked,
                          })
                        }
                      />
                      <span>Weekly report</span>
                    </label>
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type='checkbox'
                        checked={notificationSettings.notifyLowOrderDays}
                        onChange={(e) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            notifyLowOrderDays: e.target.checked,
                          })
                        }
                      />
                      <span>Low order days</span>
                    </label>
                  </div>
                </div>
                <div className='form-group' style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontWeight: '600', marginBottom: '12px', display: 'block' }}>
                    Delivery method:
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type='checkbox'
                        checked={notificationSettings.deliveryInApp}
                        onChange={(e) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            deliveryInApp: e.target.checked,
                          })
                        }
                      />
                      <span>In-app</span>
                    </label>
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type='checkbox'
                        checked={notificationSettings.deliveryEmail}
                        onChange={(e) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            deliveryEmail: e.target.checked,
                          })
                        }
                      />
                      <span>Email</span>
                    </label>
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type='checkbox'
                        checked={notificationSettings.deliverySMS}
                        onChange={(e) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            deliverySMS: e.target.checked,
                          })
                        }
                      />
                      <span>SMS</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className='modal-footer'>
              <button className='btn btn-ghost' onClick={() => setShowSettingsModal(false)}>
                Cancel
              </button>
              <button
                className='btn btn-primary'
                onClick={() => {
                  // In real app, would save via API
                  if (showNotification) showNotification('Notification settings saved', 'success');
                  setShowSettingsModal(false);
                }}
              >
                <i className='fa-solid fa-save'></i> Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsTab;
