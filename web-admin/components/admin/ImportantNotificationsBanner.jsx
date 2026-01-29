import { useMemo } from 'react';
import Icon from '../ui/Icon.jsx';
import { parseOrderDate } from './utils/dateUtils.js';
import {
  formatCurrency,
  getOrderAmount,
  getOverdueOrders,
  getTotalRevenue,
  isPendingStatus,
} from './utils/orderUtils.js';

const ImportantNotificationsBanner = ({
  orders = [],
  onDismiss,
  onViewOrder,
  onViewPendingAmounts,
  dismissedNotifications = [],
}) => {
  const importantNotifications = useMemo(() => {
    const notifications = [];
    const now = new Date();

    const overdueOrders = getOverdueOrders(orders);
    if (overdueOrders.length > 0) {
      const totalOverdue = getTotalRevenue(overdueOrders);
      notifications.push({
        id: 'overdue-payments',
        type: 'danger',
        icon: 'exclamation-triangle',
        title: 'Overdue Payments',
        message: `${overdueOrders.length} order${
          overdueOrders.length > 1 ? 's' : ''
        } overdue (${formatCurrency(totalOverdue)})`,
        action: 'viewPending',
        priority: 1,
      });
    }

    const threeDaysAgo = new Date(now);
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const urgentOrders = orders.filter((order) => {
      if (!isPendingStatus(order.status, order.paymentStatus)) return false;

      const orderDate = parseOrderDate(order.date || order.order_date || null);
      if (!orderDate) return false;
      return orderDate >= threeDaysAgo && orderDate < sevenDaysAgo;
    });

    if (urgentOrders.length > 0) {
      const totalUrgent = getTotalRevenue(urgentOrders);
      notifications.push({
        id: 'urgent-payments',
        type: 'warning',
        icon: 'clock',
        title: 'Urgent Payments',
        message: `${urgentOrders.length} order${
          urgentOrders.length > 1 ? 's' : ''
        } pending payment (${formatCurrency(totalUrgent)})`,
        action: 'viewPending',
        priority: 2,
      });
    }

    const highValuePending = orders.filter(
      (order) =>
        isPendingStatus(order.status, order.paymentStatus) &&
        getOrderAmount(order) > 500
    );
    if (highValuePending.length > 0) {
      const totalHighValue = getTotalRevenue(highValuePending);
      notifications.push({
        id: 'high-value-pending',
        type: 'info',
        icon: 'money-bill-wave',
        title: 'High Value Pending',
        message: `${highValuePending.length} high-value order${
          highValuePending.length > 1 ? 's' : ''
        } pending (${formatCurrency(totalHighValue)})`,
        action: 'viewPending',
        priority: 3,
      });
    }

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
      default:
        return {
          background: 'rgba(68, 144, 49, 0.08)',
          borderColor: 'var(--admin-accent, #449031)',
          iconColor: 'var(--admin-accent, #449031)',
          textColor: 'var(--admin-accent, #449031)',
        };
    }
  };

  return (
    <section
      className="important-notifications-banner"
      role="region"
      aria-label="Important notifications"
    >
      {importantNotifications.map((notif) => {
        const styles = getNotificationStyles(notif.type);
        return (
          <div key={notif.id} className="important-notification-item">
            <div className="important-notification-content">
              <div className="important-notification-icon" aria-hidden="true">
                <Icon name={notif.icon} />
              </div>
              <div className="important-notification-text">
                <div className="important-notification-title">
                  {notif.title}
                </div>
                <div className="important-notification-message">
                  {notif.message}
                </div>
              </div>
            </div>
            <div className="important-notification-actions">
              {notif.action === 'viewPending' && onViewPendingAmounts && (
                <button
                  type="button"
                  className="btn btn-primary btn-small mr-md"
                  onClick={() => onViewPendingAmounts()}
                  aria-label={`View details for ${notif.title}`}
                >
                  View Details
                </button>
              )}
              {onDismiss && (
                <button
                  type="button"
                  className="btn btn-ghost btn-small"
                  onClick={() => onDismiss(notif.id)}
                  title="Dismiss"
                  aria-label={`Dismiss ${notif.title}`}
                >
                  <Icon name="times" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default ImportantNotificationsBanner;
