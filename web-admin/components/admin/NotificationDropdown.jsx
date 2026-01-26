'use client';

import { useEffect, useRef } from 'react';
import { parseOrderDate } from './utils/dateUtils.js';
import { formatCurrency, isPendingStatus } from './utils/orderUtils.js';

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

const NotificationDropdown = ({
  orders = [],
  isOpen,
  onClose,
  onViewOrder,
  onViewPendingAmounts,
}) => {
  const dropdownRef = useRef(null);
  
  // Ensure orders is an array
  const ordersArray = Array.isArray(orders) ? orders : [];

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
        const orderDate = parseOrderDate(order.date || order.order_date || null);
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
          console.warn('[NotificationDropdown] Error parsing order date:', e, order);
        }
        return false;
      }
    })
    .map((order) => {
      try {
        const orderDate = parseOrderDate(order.date || order.order_date || null);
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
    const amount = order.total || order.totalAmount || 0;
    
    notifications.push({
      id: `overdue-${order._id || order.orderId}`,
      type: 'overdue',
      icon: 'fa-exclamation-triangle',
      title: 'Payment Overdue',
      message: `Order #${order.orderId || 'N/A'} from ${address}`,
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
      const isWebsiteOrder = order.source === 'website' || 
                            order.source === 'api' ||
                            (!order.source && order.paymentMode && order.paymentMode.toLowerCase() === 'online');
      
      if (!isWebsiteOrder) return false;
      
      try {
        const orderDate = parseOrderDate(order.date || order.order_date || null);
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
          console.warn('[NotificationDropdown] Error parsing website order date:', e, order);
        }
        return false;
      }
    })
    .map((order) => {
      try {
        const orderDate = parseOrderDate(order.date || order.order_date || null);
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
    const amount = order.total || order.totalAmount || 0;
    
    notifications.push({
      id: `website-${order._id || order.orderId}`,
      type: 'website',
      icon: 'fa-globe',
      title: 'New Website Order',
      message: `Order #${order.orderId || 'N/A'} from ${address}`,
      details: `${formatCurrency(amount)} • ${order.mode || 'N/A'} • ${order.status || 'N/A'}`,
      timeAgo,
      orderId: order._id || order.orderId,
      order,
    });
  });

  // Sort: overdue first, then by time
  notifications.sort((a, b) => {
    if (a.type === 'overdue' && b.type !== 'overdue') return -1;
    if (a.type !== 'overdue' && b.type === 'overdue') return 1;
    return 0;
  });

  // Debug: Log final notifications count
  if (process.env.NODE_ENV === 'development') {
    console.log('[NotificationDropdown] Final notifications:', {
      total: notifications.length,
      overdue: notifications.filter(n => n.type === 'overdue').length,
      website: notifications.filter(n => n.type === 'website').length,
    });
  }

  if (!isOpen) return null;

  return (
    <div className="notification-dropdown" ref={dropdownRef}>
      <div className="notification-dropdown-header">
        <h3 className="notification-dropdown-title">Notifications</h3>
        <button
          className="notification-dropdown-close"
          onClick={onClose}
          aria-label="Close notifications"
        >
          <i className="fa-solid fa-times"></i>
        </button>
      </div>
      
      <div className="notification-dropdown-content">
        {notifications.length === 0 ? (
          <div className="notification-dropdown-empty">
            <i className="fa-solid fa-bell-slash"></i>
            <p>No new notifications</p>
            <span>All caught up!</span>
          </div>
        ) : (
          <div className="notification-dropdown-list">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`notification-item notification-item-${notification.type}`}
                onClick={() => {
                  if (notification.type === 'overdue' && onViewPendingAmounts) {
                    onViewPendingAmounts();
                  } else if (onViewOrder && notification.orderId) {
                    onViewOrder(notification.order);
                  }
                  onClose();
                }}
              >
                <div className="notification-item-icon">
                  <i className={`fa-solid ${notification.icon}`}></i>
                </div>
                <div className="notification-item-content">
                  <div className="notification-item-header">
                    <h4 className="notification-item-title">{notification.title}</h4>
                    <span className="notification-item-time">{notification.timeAgo}</span>
                  </div>
                  <p className="notification-item-message">{notification.message}</p>
                  <p className="notification-item-details">{notification.details}</p>
                </div>
                {notification.type === 'overdue' && (
                  <div className="notification-item-badge">
                    <i className="fa-solid fa-exclamation"></i>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {notifications.length > 0 && (
        <div className="notification-dropdown-footer">
          {notifications.some((n) => n.type === 'overdue') && (
            <button
              className="notification-dropdown-action"
              onClick={() => {
                if (onViewPendingAmounts) {
                  onViewPendingAmounts();
                }
                onClose();
              }}
            >
              <i className="fa-solid fa-exclamation-triangle"></i>
              View All Pending Amounts
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
