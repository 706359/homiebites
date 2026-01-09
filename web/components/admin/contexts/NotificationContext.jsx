'use client';

import { createContext, useCallback, useContext, useRef, useState } from 'react';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const timeoutsRef = useRef(new Map());
  const lastNotificationRef = useRef(new Map()); // Track last notification by message+type

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    // Clear timeout if exists
    const timeoutId = timeoutsRef.current.get(id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutsRef.current.delete(id);
    }
  }, []);

  const showNotification = useCallback(
    (message, type = 'info', duration = 5000) => {
      const now = Date.now();
      const key = `${message}-${type}`;
      const lastTime = lastNotificationRef.current.get(key);

      // Prevent duplicate notifications with same message and type within 2 seconds
      if (lastTime && now - lastTime < 2000) {
        return null; // Don't show duplicate
      }

      lastNotificationRef.current.set(key, now);

      const id = Date.now() + Math.random();
      const notification = {
        id,
        message: typeof message === 'string' ? message : String(message),
        type, // 'success', 'error', 'warning', 'info'
        duration: duration > 0 ? duration : 0, // 0 means no auto-dismiss
      };

      setNotifications((prev) => {
        // Limit to maximum 5 notifications at once
        const maxNotifications = 5;
        const updated = [...prev, notification];
        if (updated.length > maxNotifications) {
          // Remove oldest notification
          const oldest = updated.shift();
          const timeoutId = timeoutsRef.current.get(oldest.id);
          if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutsRef.current.delete(oldest.id);
          }
        }
        return updated;
      });

      if (duration > 0) {
        const timeoutId = setTimeout(() => {
          removeNotification(id);
        }, duration);
        timeoutsRef.current.set(id, timeoutId);
      }

      return id;
    },
    [removeNotification]
  );

  const success = useCallback(
    (message, duration) => showNotification(message, 'success', duration),
    [showNotification]
  );

  const error = useCallback(
    (message, duration) => showNotification(message, 'error', duration),
    [showNotification]
  );

  const warning = useCallback(
    (message, duration) => showNotification(message, 'warning', duration),
    [showNotification]
  );

  const info = useCallback(
    (message, duration) => showNotification(message, 'info', duration),
    [showNotification]
  );

  const value = {
    notifications,
    showNotification,
    removeNotification,
    success,
    error,
    warning,
    info,
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
