'use client';

import { useEffect, useRef } from 'react';
import { useNotification } from './contexts/NotificationContext.jsx';

const NotificationWrapper = () => {
  const { notifications, removeNotification } = useNotification();
  const containerRef = useRef(null);
  const notificationRefs = useRef(new Map());

  // Auto-scroll to latest notification with smooth behavior
  useEffect(() => {
    if (containerRef.current && notifications.length > 0) {
      const container = containerRef.current;
      // Smooth scroll to bottom
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [notifications]);

  // Add entrance animation delay based on position
  useEffect(() => {
    notifications.forEach((notification, index) => {
      const element = notificationRefs.current.get(notification.id);
      if (element) {
        element.style.animationDelay = `${index * 0.05}s`;
      }
    });
  }, [notifications]);

  if (!notifications || notifications.length === 0) {
    return null;
  }

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return 'fa-circle-check';
      case 'error':
        return 'fa-circle-exclamation';
      case 'warning':
        return 'fa-triangle-exclamation';
      case 'info':
        return 'fa-circle-info';
      default:
        return 'fa-circle-info';
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
    // Only dismiss on click if it's not an error (errors should require explicit close)
    const notification = notifications.find((n) => n.id === id);
    if (notification && notification.type !== 'error') {
      removeNotification(id);
    }
  };

  return (
    <div
      className='admin-notification-container'
      ref={containerRef}
      role='region'
      aria-label='Notifications'
      aria-live='polite'
      aria-atomic='false'
    >
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
          className={`admin-notification admin-notification-${notification.type}`}
          role='alert'
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
          <div className='admin-notification-content'>
            <div className='admin-notification-icon' aria-hidden='true'>
              <i className={`fa-solid ${getIcon(notification.type)}`}></i>
            </div>
            <div className='admin-notification-body'>
              <div className='admin-notification-message'>{notification.message}</div>
            </div>
          </div>
          <button
            className='admin-notification-close'
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
            type='button'
          >
            <i className='fa-solid fa-xmark' aria-hidden='true'></i>
          </button>
          {notification.duration > 0 && (
            <div className='admin-notification-progress' aria-hidden='true'>
              <div
                className='admin-notification-progress-bar'
                style={{
                  animationDuration: `${notification.duration}ms`,
                }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default NotificationWrapper;
