import { useEffect, useState } from 'react';
import './AdminDashboard.css';

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Listen for custom notification events
    const handleNotification = (e) => {
      const { message, type = 'success', duration = 5000 } = e.detail;
      addNotification(message, type, duration);
    };

    window.addEventListener('adminNotification', handleNotification);
    return () => window.removeEventListener('adminNotification', handleNotification);
  }, []);

  const addNotification = (message, type, duration) => {
    const id = Date.now() + Math.random();
    setNotifications((prev) => [...prev, { id, message, type, duration }]);

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  if (notifications.length === 0) return null;

  return (
    <div className='admin-notification-container'>
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`admin-notification admin-notification-${notification.type}`}
          onClick={() => removeNotification(notification.id)}
        >
          <div className='admin-notification-icon'>
            {notification.type === 'success' && <i className='fa-solid fa-check-circle'></i>}
            {notification.type === 'error' && <i className='fa-solid fa-exclamation-circle'></i>}
            {notification.type === 'warning' && (
              <i className='fa-solid fa-exclamation-triangle'></i>
            )}
            {notification.type === 'info' && <i className='fa-solid fa-info-circle'></i>}
          </div>
          <div className='admin-notification-message'>{notification.message}</div>
          <button
            className='admin-notification-close'
            onClick={(e) => {
              e.stopPropagation();
              removeNotification(notification.id);
            }}
          >
            <i className='fa-solid fa-times'></i>
          </button>
        </div>
      ))}
    </div>
  );
};

// Helper function to show notifications
export const showNotification = (message, type = 'success', duration = 5000) => {
  window.dispatchEvent(
    new CustomEvent('adminNotification', {
      detail: { message, type, duration },
    })
  );
};

export default NotificationSystem;
