'use client';

import { useEffect, useRef } from 'react';
import { useNotification } from '../contexts/NotificationContext';

const NotificationWrapper = () => {
  const { notifications, removeNotification } = useNotification();
  const containerRef = useRef(null);

  // Auto-scroll to latest notification
  useEffect(() => {
    if (containerRef.current && notifications.length > 0) {
      const container = containerRef.current;
      container.scrollTop = container.scrollHeight;
    }
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

  return (
    <div className='admin-notification-container' ref={containerRef}>
      {notifications.map((notification, index) => (
        <div
          key={notification.id}
          className={`admin-notification admin-notification-${notification.type}`}
          style={{
            animationDelay: `${index * 0.05}s`,
          }}
          onClick={() => removeNotification(notification.id)}
        >
          <div className='admin-notification-content'>
            <div className='admin-notification-icon'>
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
            aria-label='Close notification'
          >
            <i className='fa-solid fa-xmark'></i>
          </button>
          {notification.duration > 0 && (
            <div className='admin-notification-progress'>
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
