'use client';

import { useEffect, useRef } from 'react';
import Icon from '../ui/Icon.jsx';
import { useNotification } from './contexts/NotificationContext.jsx';

const NotificationWrapper = () => {
  const { notifications, removeNotification } = useNotification();
  const containerRef = useRef(null);
  const notificationRefs = useRef(new Map());

  useEffect(() => {
    if (containerRef.current && notifications.length > 0) {
      const container = containerRef.current;

      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [notifications]);

  useEffect(() => {
    notifications.forEach((notification, index) => {
      const element = notificationRefs.current.get(notification.id);
      if (element) {
        // Stagger animation for multiple notifications
        element.style.animationDelay = `${index * 0.1}s`;
        // Remove exiting class if notification is still active
        element.classList.remove('notification-exiting');
      }
    });
  }, [notifications]);

  if (!notifications || notifications.length === 0) {
    return null;
  }

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return 'circle-check';
      case 'error':
        return 'circle-exclamation';
      case 'warning':
        return 'triangle-exclamation';
      case 'info':
        return 'circle-info';
      default:
        return 'circle-info';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'success':
        return 'Success';
      case 'error':
        return 'Error';
      case 'warning':
        return 'Warning';
      case 'info':
        return 'Info';
      default:
        return 'Notification';
    }
  };

  const handleNotificationClick = (id) => {
    const notification = notifications.find((n) => n.id === id);
    if (notification && notification.type !== 'error') {
      removeNotification(id);
    }
  };

  return (
    <div
      className="admin-notification-container toast-container admin-notification-enterprise"
      ref={containerRef}
      role="region"
      aria-label="Notifications"
      aria-live="polite"
      aria-atomic="false"
    >
      <div className="admin-notification-stack-header" aria-hidden="true">
        <span className="admin-notification-stack-title">Notifications</span>
        <span className="admin-notification-stack-count">{notifications.length}</span>
      </div>
      {notifications.map((notification) => (
        <div
          key={notification.id}
          ref={(el) => {
            if (el) {
              notificationRefs.current.set(notification.id, el);
            } else {
              notificationRefs.current.delete(notification.id);
            }
          }}
          className={`admin-notification admin-notification-${notification.type} toast toast-${notification.type}`}
          role="alert"
          aria-live={notification.type === 'error' ? 'assertive' : 'polite'}
          onClick={() => handleNotificationClick(notification.id)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleNotificationClick(notification.id);
            } else if (e.key === 'Escape') {
              removeNotification(notification.id);
            }
          }}
          tabIndex={0}
          aria-label={`${getTypeLabel(notification.type)} notification: ${notification.message}`}
        >
          <div className="admin-notification-content">
            <div className="admin-notification-icon" aria-hidden="true">
              <Icon name={getIcon(notification.type)} />
            </div>
            <div className="admin-notification-body">
              <span
                className={`admin-notification-type admin-notification-type--${notification.type}`}
                aria-hidden="true"
              >
                {getTypeLabel(notification.type)}
              </span>
              <div className="admin-notification-message">
                {notification.message}
              </div>
            </div>
          </div>
          <button
            className="admin-notification-close"
            onClick={(e) => {
              e.stopPropagation();
              removeNotification(notification.id);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                removeNotification(notification.id);
              }
            }}
            aria-label={`Close ${getTypeLabel(notification.type)} notification`}
            type="button"
          >
            <Icon name="xmark" aria-hidden="true" />
          </button>
          {notification.duration > 0 && (
            <div className="admin-notification-progress" aria-hidden="true">
              <div className="admin-notification-progress-bar" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default NotificationWrapper;
