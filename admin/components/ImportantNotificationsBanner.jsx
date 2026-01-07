import { useMemo } from 'react';
import { parseOrderDate } from '../utils/dateUtils.js';
import { isPendingStatus, formatCurrency } from '../utils/orderUtils.js';

const ImportantNotificationsBanner = ({
  orders = [],
  onDismiss,
  onViewOrder,
  onViewPendingAmounts,
  dismissedNotifications = [],
}) => {
  // Calculate important notifications
  const importantNotifications = useMemo(() => {
    const notifications = [];
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // 1. Overdue payments (pending > 7 days)
    const overdueOrders = orders.filter((order) => {
      if (!isPendingStatus(order.status)) return false;
      const orderDate = parseOrderDate(order.createdAt || order.date || order.order_date);
      if (!orderDate) return false;
      return orderDate < sevenDaysAgo;
    });

    if (overdueOrders.length > 0) {
      const totalOverdue = overdueOrders.reduce(
        (sum, o) => sum + parseFloat(o.total || o.totalAmount || 0),
        0
      );
      notifications.push({
        id: 'overdue-payments',
        type: 'danger',
        icon: 'fa-exclamation-triangle',
        title: 'Overdue Payments',
        message: `${overdueOrders.length} order${overdueOrders.length > 1 ? 's' : ''} overdue (${formatCurrency(totalOverdue)})`,
        action: 'viewPending',
        priority: 1,
      });
    }

    // 2. Urgent payments (pending 3-7 days)
    const threeDaysAgo = new Date(now);
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    const urgentOrders = orders.filter((order) => {
      if (!isPendingStatus(order.status)) return false;
      const orderDate = parseOrderDate(order.createdAt || order.date || order.order_date);
      if (!orderDate) return false;
      return orderDate >= threeDaysAgo && orderDate < sevenDaysAgo;
    });

    if (urgentOrders.length > 0) {
      const totalUrgent = urgentOrders.reduce(
        (sum, o) => sum + parseFloat(o.total || o.totalAmount || 0),
        0
      );
      notifications.push({
        id: 'urgent-payments',
        type: 'warning',
        icon: 'fa-clock',
        title: 'Urgent Payments',
        message: `${urgentOrders.length} order${urgentOrders.length > 1 ? 's' : ''} pending payment (${formatCurrency(totalUrgent)})`,
        action: 'viewPending',
        priority: 2,
      });
    }

    // 3. High value pending orders (> ₹500)
    const highValuePending = orders.filter((order) => {
      if (!isPendingStatus(order.status)) return false;
      const amount = parseFloat(order.total || order.totalAmount || 0);
      return amount > 500;
    });

    if (highValuePending.length > 0) {
      const totalHighValue = highValuePending.reduce(
        (sum, o) => sum + parseFloat(o.total || o.totalAmount || 0),
        0
      );
      notifications.push({
        id: 'high-value-pending',
        type: 'info',
        icon: 'fa-money-bill-wave',
        title: 'High Value Pending',
        message: `${highValuePending.length} high-value order${highValuePending.length > 1 ? 's' : ''} pending (${formatCurrency(totalHighValue)})`,
        action: 'viewPending',
        priority: 3,
      });
    }

    // Filter out dismissed notifications
    return notifications
      .filter((notif) => !dismissedNotifications.includes(notif.id))
      .sort((a, b) => a.priority - b.priority);
  }, [orders, dismissedNotifications]);

  if (importantNotifications.length === 0) return null;

  const getNotificationStyles = (type) => {
    switch (type) {
      case 'danger':
        return {
          background: 'rgba(220, 38, 38, 0.08)',
          borderColor: 'var(--admin-danger, #dc2626)',
          iconColor: 'var(--admin-danger, #dc2626)',
          textColor: 'var(--admin-danger, #dc2626)',
        };
      case 'warning':
        return {
          background: 'rgba(245, 158, 11, 0.08)',
          borderColor: 'var(--admin-warning, #f59e0b)',
          iconColor: 'var(--admin-warning, #f59e0b)',
          textColor: 'var(--admin-warning, #f59e0b)',
        };
      default: // info
        return {
          background: 'rgba(68, 144, 49, 0.08)',
          borderColor: 'var(--admin-accent, #449031)',
          iconColor: 'var(--admin-accent, #449031)',
          textColor: 'var(--admin-accent, #449031)',
        };
    }
  };

  return (
    <div className="important-notifications-banner">
      {importantNotifications.map((notif) => {
        const styles = getNotificationStyles(notif.type);
        return (
          <div
            key={notif.id}
            className="important-notification-item"
            style={{
              background: styles.background,
              borderLeft: `4px solid ${styles.borderColor}`,
            }}
          >
            <div className="important-notification-content">
              <div className="important-notification-icon" style={{ color: styles.iconColor }}>
                <i className={`fa-solid ${notif.icon}`}></i>
              </div>
              <div className="important-notification-text">
                <div className="important-notification-title" style={{ color: styles.textColor }}>
                  {notif.title}
                </div>
                <div className="important-notification-message">{notif.message}</div>
              </div>
            </div>
            <div className="important-notification-actions">
              {notif.action === 'viewPending' && onViewPendingAmounts && (
                <button
                  className="btn btn-primary btn-small"
                  onClick={() => onViewPendingAmounts()}
                  style={{ marginRight: '8px' }}
                >
                  View Details
                </button>
              )}
              {onDismiss && (
                <button
                  className="btn btn-ghost btn-small"
                  onClick={() => onDismiss(notif.id)}
                  title="Dismiss"
                >
                  <i className="fa-solid fa-times"></i>
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ImportantNotificationsBanner;

