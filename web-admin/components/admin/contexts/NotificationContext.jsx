'use client';

import { createContext, useCallback, useContext, useRef, useState } from 'react';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const timeoutsRef = useRef(new Map());
  const lastNotificationRef = useRef(new Map()); 

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    
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

      
      if (lastTime && now - lastTime < 2000) {
        return null; 
      }

      lastNotificationRef.current.set(key, now);

      const id = Date.now() + Math.random();
      const notification = {
        id,
        message: typeof message === 'string' ? message : String(message),
        type, 
        duration: duration > 0 ? duration : 0, 
      };

      setNotifications((prev) => {
        
        const maxNotifications = 5;
        const updated = [...prev, notification];
        if (updated.length > maxNotifications) {
          
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
