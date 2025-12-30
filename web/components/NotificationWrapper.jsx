import { useEffect, useState } from 'react';
import { useNotification } from '../contexts/NotificationContext';
import './NotificationWrapper.css';

const NotificationWrapper = () => {
  const { notifications, removeNotification } = useNotification();
  const [visibleNotifications, setVisibleNotifications] = useState([]);

  useEffect(() => {
    // Animate notifications in
    setVisibleNotifications(notifications.map((n) => n.id));
  }, [notifications]);

  if (notifications.length === 0) return null;

  const handleRemove = (id) => {
    setVisibleNotifications((prev) => prev.filter((nId) => nId !== id));
    setTimeout(() => removeNotification(id), 300);
  };

  return (
    <div className='notification-container'>
      {notifications.map((notification) => {
        const isVisible = visibleNotifications.includes(notification.id);
        return (
          <div
            key={notification.id}
            className={`notification notification-${notification.type} ${isVisible ? 'notification-visible' : 'notification-hidden'}`}
            onClick={() => handleRemove(notification.id)}
          >
            <div className='notification-backdrop'></div>
            <div className='notification-body'>
              <div className='notification-icon-wrapper'>
                <div className='notification-icon'>
                  {notification.type === 'success' && <i className='fa-solid fa-check-circle'></i>}
                  {notification.type === 'error' && (
                    <i className='fa-solid fa-exclamation-circle'></i>
                  )}
                  {notification.type === 'warning' && (
                    <i className='fa-solid fa-exclamation-triangle'></i>
                  )}
                  {notification.type === 'info' && <i className='fa-solid fa-info-circle'></i>}
                </div>
                <div className='notification-progress-bar'>
                  <div
                    className='notification-progress-fill'
                    style={{
                      animationDuration: `${notification.duration || 5000}ms`,
                      animationPlayState: 'running',
                    }}
                  ></div>
                </div>
              </div>
              <div className='notification-content'>
                <p className='notification-message'>{notification.message}</p>
              </div>
              <button
                className='notification-close'
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(notification.id);
                }}
                aria-label='Close notification'
              >
                <i className='fa-solid fa-xmark'></i>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NotificationWrapper;
