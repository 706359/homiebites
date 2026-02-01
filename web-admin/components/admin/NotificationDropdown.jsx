'use client';

import { useEffect, useRef } from 'react';
import Icon from '../ui/Icon.jsx';
import { parseOrderDate } from './utils/dateUtils.js';
import {
  formatCurrency,
  getOrderAmount,
  isPendingStatus,
} from './utils/orderUtils.js';

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
  if (days < 30) return `${days} days ago`;
  return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? 's' : ''} ago`;
}

function starRating(rating) {
  if (rating == null) return '—';
  const n = Math.min(5, Math.max(1, Math.round(Number(rating))));
  return `${n}${String.fromCodePoint(0x2b50)}`; // n + ⭐
}

const NotificationDropdown = ({
  orders = [],
  reviews = [],
  isOpen,
  onClose,
  onViewOrder,
  onViewPendingAmounts,
  onViewReviews,
}) => {
  const dropdownRef = useRef(null);

  // Ensure orders is an array
  const ordersArray = Array.isArray(orders) ? orders : [];
  const reviewsArray = Array.isArray(reviews) ? reviews : [];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen, onClose]);

  // Filter notifications: >30 days unpaid OR website orders
  const notifications = [];
  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  thirtyDaysAgo.setHours(0, 0, 0, 0);

  // Debug: Log orders count
  if (process.env.NODE_ENV === 'development') {
    console.log('[NotificationDropdown] Total orders:', ordersArray.length);
  }

  // 1. Unpaid orders > 30 days
  const overdueUnpaidOrders = ordersArray
    .filter((order) => {
      // Check if payment is pending
      const isPending = isPendingStatus(order.status, order.paymentStatus);
      if (!isPending) return false;

      try {
        const orderDate = parseOrderDate(
          order.date || order.order_date || null
        );
        if (!orderDate) return false;

        const orderDateMidnight = new Date(orderDate);
        orderDateMidnight.setHours(0, 0, 0, 0);

        const isOver30Days = orderDateMidnight < thirtyDaysAgo;

        if (process.env.NODE_ENV === 'development' && isOver30Days) {
          const daysPending = Math.floor(
            (now - orderDateMidnight) / (1000 * 60 * 60 * 24)
          );
          console.log('[NotificationDropdown] Found overdue order:', {
            orderId: order.orderId,
            daysPending,
            status: order.status,
            paymentStatus: order.paymentStatus,
          });
        }

        return isOver30Days;
      } catch (e) {
        if (process.env.NODE_ENV === 'development') {
          console.warn(
            '[NotificationDropdown] Error parsing order date:',
            e,
            order
          );
        }
        return false;
      }
    })
    .map((order) => {
      try {
        const orderDate = parseOrderDate(
          order.date || order.order_date || null
        );
        const orderDateMidnight = new Date(orderDate);
        orderDateMidnight.setHours(0, 0, 0, 0);
        const daysPending = Math.floor(
          (now - orderDateMidnight) / (1000 * 60 * 60 * 24)
        );

        return {
          order,
          orderDate,
          daysPending,
          type: 'overdue',
        };
      } catch (e) {
        return null;
      }
    })
    .filter((item) => item !== null)
    .sort((a, b) => b.daysPending - a.daysPending);

  overdueUnpaidOrders.forEach(({ order, orderDate, daysPending }) => {
    const timeAgo = getTimeAgo(orderDate);
    const address =
      order.deliveryAddress || order.customerAddress || order.address || 'N/A';
    const amount = getOrderAmount(order);

    const customerName =
      order.customerName || order.customer_name || address.split(',')[0]?.trim() || 'Customer';
    notifications.push({
      id: `overdue-${order._id || order.orderId}`,
      type: 'overdue',
      alertTypeLabel: 'Payment pending',
      icon: 'exclamation-triangle',
      title: 'Payment Overdue',
      message: `Order #${order.orderId || 'N/A'} from ${address}`,
      summary: `${customerName} (${formatCurrency(amount)})`,
      details: `${formatCurrency(amount)} • ${daysPending} days pending`,
      timeAgo,
      orderId: order._id || order.orderId,
      order,
    });
  });

  // 2. Website orders (recent ones, last 7 days)
  // Exclude Excel uploads - only show actual website/API orders
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const websiteOrders = ordersArray
    .filter((order) => {
      // Exclude Excel uploads explicitly
      if (order.source === 'excel') {
        return false;
      }

      // Check if order is from website or API
      // Only use paymentMode as fallback if source is not set (legacy orders)
      const isWebsiteOrder =
        order.source === 'website' ||
        order.source === 'api' ||
        (!order.source &&
          order.paymentMode &&
          order.paymentMode.toLowerCase() === 'online');

      if (!isWebsiteOrder) return false;

      try {
        const orderDate = parseOrderDate(
          order.date || order.order_date || null
        );
        if (!orderDate) return false;
        const isRecent = orderDate >= sevenDaysAgo;

        if (process.env.NODE_ENV === 'development' && isRecent) {
          console.log('[NotificationDropdown] Found website order:', {
            orderId: order.orderId,
            source: order.source,
            paymentMode: order.paymentMode,
          });
        }

        return isRecent;
      } catch (e) {
        if (process.env.NODE_ENV === 'development') {
          console.warn(
            '[NotificationDropdown] Error parsing website order date:',
            e,
            order
          );
        }
        return false;
      }
    })
    .map((order) => {
      try {
        const orderDate = parseOrderDate(
          order.date || order.order_date || null
        );
        return { order, orderDate };
      } catch (e) {
        return null;
      }
    })
    .filter((item) => item !== null)
    .sort((a, b) => b.orderDate - a.orderDate)
    .slice(0, 10); // Limit to 10 most recent

  websiteOrders.forEach(({ order, orderDate }) => {
    const timeAgo = getTimeAgo(orderDate);
    const address =
      order.deliveryAddress || order.customerAddress || order.address || 'N/A';
    const amount = getOrderAmount(order);

    const customerName =
      order.customerName || order.customer_name || address.split(',')[0]?.trim() || 'Customer';
    notifications.push({
      id: `website-${order._id || order.orderId}`,
      type: 'website',
      alertTypeLabel: 'New order',
      icon: 'globe',
      title: 'New Website Order',
      message: `Order #${order.orderId || 'N/A'} from ${address}`,
      summary: `${customerName} (${formatCurrency(amount)})`,
      details: `${formatCurrency(amount)} • ${order.mode || 'N/A'} • ${order.status || 'N/A'}`,
      timeAgo,
      orderId: order._id || order.orderId,
      order,
    });
  });

  // 3. Reviews needing response (unapproved)
  const unapprovedReviews = reviewsArray
    .filter((r) => r.isApproved === false)
    .slice(0, 5)
    .map((r) => {
      const createdAt = r.createdAt ? new Date(r.createdAt) : null;
      return { review: r, createdAt };
    })
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

  unapprovedReviews.forEach(({ review, createdAt }) => {
    const timeAgo = getTimeAgo(createdAt);
    const name = review.userName?.trim() || 'Customer';
    const ratingStr = starRating(review.rating);
    notifications.push({
      id: `review-${review._id}`,
      type: 'review',
      alertTypeLabel: 'Review needs response',
      icon: 'message-square',
      title: 'Review needs response',
      message: review.comment ? `${review.comment.slice(0, 60)}${review.comment.length > 60 ? '…' : ''}` : 'New review',
      summary: `${name} (${ratingStr})`,
      details: ratingStr,
      timeAgo,
      review,
    });
  });

  notifications.sort((a, b) => {
    const order = { overdue: 0, review: 1, website: 2 };
    const ai = order[a.type] ?? 2;
    const bi = order[b.type] ?? 2;
    return ai - bi;
  });

  // Debug: Log final notifications count
  if (process.env.NODE_ENV === 'development') {
    console.log('[NotificationDropdown] Final notifications:', {
      total: notifications.length,
      overdue: notifications.filter((n) => n.type === 'overdue').length,
      website: notifications.filter((n) => n.type === 'website').length,
    });
  }

  // Escape to close (enterprise a11y)
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="notification-dropdown"
      ref={dropdownRef}
      role="dialog"
      aria-label="Notifications"
      aria-modal="false"
    >
      <div className="notification-dropdown-header">
        <h3
          id="notification-dropdown-title"
          className="notification-dropdown-title"
        >
          Notifications
        </h3>
        <button
          type="button"
          className="notification-dropdown-close"
          onClick={onClose}
          aria-label="Close notifications"
          title="Close"
        >
          <Icon name="times" aria-hidden="true" />
        </button>
      </div>

      <div
        className="notification-dropdown-content"
        aria-labelledby="notification-dropdown-title"
      >
        {notifications.length === 0 ? (
          <div className="notification-dropdown-empty" role="status">
            <Icon name="bell-slash" aria-hidden="true" />
            <p>No new notifications</p>
            <span>All caught up!</span>
          </div>
        ) : (
          <ul
            className="notification-dropdown-list"
            role="list"
            aria-label="Notification list"
          >
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className={`notification-item notification-item-${notification.type}`}
                role="button"
                tabIndex={0}
                onClick={() => {
                  if (notification.type === 'overdue' && onViewPendingAmounts) {
                    onViewPendingAmounts();
                  } else if (notification.type === 'review' && onViewReviews) {
                    onViewReviews();
                  } else if (onViewOrder && notification.orderId) {
                    onViewOrder(notification.order);
                  }
                  onClose();
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (
                      notification.type === 'overdue' &&
                      onViewPendingAmounts
                    ) {
                      onViewPendingAmounts();
                    } else if (notification.type === 'review' && onViewReviews) {
                      onViewReviews();
                    } else if (onViewOrder && notification.orderId) {
                      onViewOrder(notification.order);
                    }
                    onClose();
                  }
                }}
              >
                <div className="notification-item-icon">
                  <Icon name={notification.icon} />
                </div>
                <div className="notification-item-content">
                  <div className="notification-item-header">
                    <span
                      className={`notification-item-alert-type notification-item-alert-type--${notification.type}`}
                      aria-label={`Alert type: ${notification.alertTypeLabel || notification.title}`}
                    >
                      {notification.alertTypeLabel || notification.title}
                    </span>
                    <span className="notification-item-time">
                      {notification.timeAgo}
                    </span>
                  </div>
                  <p className="notification-item-summary">
                    {notification.summary || notification.message}
                  </p>
                  <p className="notification-item-details">
                    {notification.details}
                  </p>
                </div>
                {(notification.type === 'overdue' || notification.type === 'review') && (
                  <div className="notification-item-badge" aria-hidden="true">
                    <Icon name={notification.type === 'overdue' ? 'exclamation' : 'message-square'} />
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {notifications.length > 0 && (
        <div className="notification-dropdown-footer">
          {notifications.some((n) => n.type === 'overdue') && (
            <button
              type="button"
              className="btn btn-small btn-section-link notification-dropdown-action"
              onClick={() => {
                if (onViewPendingAmounts) {
                  onViewPendingAmounts();
                }
                onClose();
              }}
              aria-label="View all pending amounts"
            >
              <Icon name="exclamation-triangle" />
              View All Pending Amounts{' '}
              <span className="section-link-arrow" aria-hidden="true">
                →
              </span>
            </button>
          )}
          {notifications.some((n) => n.type === 'review') && onViewReviews && (
            <button
              type="button"
              className="btn btn-small btn-section-link notification-dropdown-action"
              onClick={() => {
                onViewReviews();
                onClose();
              }}
              aria-label="View reviews needing response"
            >
              <Icon name="message-square" />
              Reviews Needing Response{' '}
              <span className="section-link-arrow" aria-hidden="true">
                →
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
