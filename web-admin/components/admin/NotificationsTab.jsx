import { useState } from 'react';
import { formatDateMonthDay, parseOrderDate } from './utils/dateUtils.js';
import { isPendingStatus } from './utils/orderUtils.js';
import PremiumLoader from './PremiumLoader.jsx';

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
  setActiveTab,
  showConfirmation,
}) => {
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'payments', 'orders', 'system'
  const [readNotifications, setReadNotifications] = useState(new Set());
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

  // Generate notifications from orders - REAL DATA
  const notifications = [];
  const now = new Date();

  // Calculate overdue threshold (45 days like PendingAmountsTab)
  const fortyFiveDaysAgo = new Date(now);
  fortyFiveDaysAgo.setDate(fortyFiveDaysAgo.getDate() - 45);
  fortyFiveDaysAgo.setHours(0, 0, 0, 0);

  // Overdue payments notifications (most urgent - show first)
  const pendingOrders = orders.filter((o) => isPendingStatus(o.status));
  const overduePayments = pendingOrders
    .map((order) => {
      try {
        const orderDate = parseOrderDate(order.date || order.order_date || null);
        if (!orderDate) return null;
        const orderDateMidnight = new Date(orderDate);
        orderDateMidnight.setHours(0, 0, 0, 0);
        const daysPending = Math.floor((now - orderDateMidnight) / (1000 * 60 * 60 * 24));
        const isOverdue = orderDateMidnight < fortyFiveDaysAgo;
        const isUrgent = daysPending > 7;
        return { order, orderDate, daysPending, isOverdue, isUrgent };
      } catch (e) {
        return null;
      }
    })
    .filter((item) => item && (item.isOverdue || item.isUrgent))
    .sort((a, b) => b.daysPending - a.daysPending)
    .slice(0, 15); // Show up to 15 overdue/urgent payments

  overduePayments.forEach(({ order, orderDate, daysPending, isOverdue }) => {
    const timeAgo = getTimeAgo(orderDate);
    const address = order.deliveryAddress || order.customerAddress || order.address || 'N/A';
    notifications.push({
      id: `payment-${order._id || order.orderId}`,
      type: 'payment',
      title: isOverdue ? 'Payment Overdue' : 'Payment Pending',
      message: `Order #${order.orderId || 'N/A'} from ${address}`,
      details: `₹${order.total || order.totalAmount || 0} • ${daysPending} days pending`,
      timeAgo,
      read: false,
      action: isOverdue ? 'viewPendingPayments' : 'sendReminder',
      orderId: order._id || order.orderId,
      daysPending,
      isOverdue,
    });
  });

  // Recent orders notifications (last 7 days, limit to 10)
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentOrders = orders
    .filter((order) => {
      const orderDate = parseOrderDate(order.date || order.order_date || null);
      return orderDate && orderDate >= sevenDaysAgo;
    })
    .sort((a, b) => {
      const dateA = parseOrderDate(a.date || a.order_date || null);
      const dateB = parseOrderDate(b.date || b.order_date || null);
      return (dateB || new Date(0)) - (dateA || new Date(0));
    })
    .slice(0, 10);

  recentOrders.forEach((order) => {
    const orderDate = parseOrderDate(order.date || order.order_date || null);
    if (!orderDate) return;
    const timeAgo = getTimeAgo(orderDate);
    notifications.push({
      id: `order-${order._id || order.orderId}`,
      type: 'order',
      title: 'New Order Received',
      message: `Order #${order.orderId || 'N/A'} from ${
        order.deliveryAddress || order.customerAddress || order.address || 'N/A'
      }`,
      details: `₹${order.total || order.totalAmount || 0} • ${order.mode || 'N/A'} • ${
        order.status || 'N/A'
      }`,
      timeAgo,
      read: false,
      action: 'viewOrder',
      orderId: order._id || order.orderId,
    });
  });

  // Sort notifications: overdue payments first, then by date (newest first)
  notifications.sort((a, b) => {
    if (a.isOverdue && !b.isOverdue) return -1;
    if (!a.isOverdue && b.isOverdue) return 1;
    // For same type, sort by time (newer first)
    const timeA = a.timeAgo.includes('mins') ? 0 : a.timeAgo.includes('hour') ? 1 : 2;
    const timeB = b.timeAgo.includes('mins') ? 0 : b.timeAgo.includes('hour') ? 1 : 2;
    return timeA - timeB;
  });

  // Mark notifications as read based on state
  const notificationsWithReadState = notifications.map((notif) => ({
    ...notif,
    read: readNotifications.has(notif.id) || notif.read,
  }));

  // Filter notifications
  const filteredNotifications = notificationsWithReadState.filter((notif) => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notif.read;
    if (filter === 'payments') return notif.type === 'payment';
    if (filter === 'orders') return notif.type === 'order';
    if (filter === 'system') return notif.type === 'system';
    return true;
  });

  // Counts
  const unreadCount = notificationsWithReadState.filter((n) => !n.read).length;
  const paymentCount = notifications.filter((n) => n.type === 'payment').length;
  const orderCount = notifications.filter((n) => n.type === 'order').length;
  const systemCount = notifications.filter((n) => n.type === 'system').length;

  // Handle mark as read
  const handleMarkAsRead = (id) => {
    setReadNotifications((prev) => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
    if (showNotification) showNotification('Notification marked as read', 'success');
  };

  // Handle mark all as read
  const handleMarkAllAsRead = () => {
    const allIds = notifications.map((n) => n.id);
    setReadNotifications(new Set(allIds));
    if (showNotification) showNotification('All notifications marked as read', 'success');
  };

  // Handle notification action
  const handleAction = (notif) => {
    switch (notif.action) {
      case 'viewOrder':
        if (onViewOrder) {
          onViewOrder(notif.orderId);
        } else if (setActiveTab) {
          setActiveTab('allOrdersData');
        }
        break;
      case 'viewPendingPayments':
        if (setActiveTab) {
          setActiveTab('pendingAmounts');
          if (showNotification) {
            showNotification('Showing overdue payments', 'info');
          }
        }
        break;
      case 'sendReminder':
        if (onSendReminder) {
          onSendReminder(notif.orderId);
        } else if (setActiveTab) {
          setActiveTab('pendingAmounts');
        }
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
        if (setActiveTab) setActiveTab('reports');
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
        <PremiumLoader message='Loading notifications...' size='large' />
      </div>
    );
  }

  return (
    <div className='admin-content'>
      {/* HEADER */}
      <div className='dashboard-header'>
        <div>{unreadCount > 0 && <h2>Notifications ({unreadCount} unread)</h2>}</div>
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
      <div className='action-bar action-bar-spaced'>
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
              You&apos;re all caught up!
            </p>
          </div>
        ) : (
          <div className='notification-grid-4-col'>
            {filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`notification-card-grid ${notif.read ? 'read' : 'unread'} ${notif.isOverdue ? 'overdue' : ''}`}
                onClick={() => handleAction(notif)}
              >
                <div className='notification-card-grid-header'>
                  <div className='notification-card-grid-icon'>
                    <i
                      className={getNotificationIcon(notif.type)}
                      style={{ color: getNotificationColor(notif.type) }}
                    ></i>
                  </div>
                  {!notif.read && <span className='notification-badge-unread-grid'>New</span>}
                </div>
                <div className='notification-card-grid-content'>
                  <h4 className='notification-card-grid-title'>{notif.title}</h4>
                  <p className='notification-card-grid-message'>{notif.message}</p>
                  <p className='notification-card-grid-details'>{notif.details}</p>
                  <div className='notification-card-grid-footer'>
                    <span className='notification-card-grid-time'>{notif.timeAgo}</span>
                    <div className='notification-card-grid-actions'>
                      {notif.action === 'viewPendingPayments' && (
                        <button
                          className='btn btn-primary btn-small btn-full'
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAction(notif);
                          }}
                        >
                          View Payments
                        </button>
                      )}
                      {notif.action === 'viewOrder' && (
                        <button
                          className='btn btn-primary btn-small btn-full'
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAction(notif);
                          }}
                        >
                          View Order
                        </button>
                      )}
                      {notif.action === 'sendReminder' && (
                        <button
                          className='btn btn-secondary btn-small btn-full'
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAction(notif);
                          }}
                        >
                          Send Reminder
                        </button>
                      )}
                      <button
                        className='btn btn-ghost btn-small btn-full'
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsRead(notif.id);
                        }}
                        title='Mark as Read'
                      >
                        <i className='fa-solid fa-check'></i> Read
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
