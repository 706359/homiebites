import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

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
    (message, type = "info", duration = 5000) => {
      const now = Date.now();
      const key = `${message}-${type}`;
      const lastTime = lastNotificationRef.current.get(key);

      // Prevent duplicate notifications with same message and type within 1 second
      if (lastTime && now - lastTime < 1000) {
        return null; // Don't show duplicate
      }

      lastNotificationRef.current.set(key, now);

      const id = Date.now() + Math.random();
      const notification = {
        id,
        message,
        type, // 'success', 'error', 'warning', 'info'
        duration,
      };

      setNotifications((prev) => [...prev, notification]);

      if (duration > 0) {
        const timeoutId = setTimeout(() => {
          removeNotification(id);
          lastNotificationRef.current.delete(key);
        }, duration);
        timeoutsRef.current.set(id, timeoutId);
      }

      return id;
    },
    [removeNotification],
  );

  const clearAll = useCallback(() => {
    // Clear all timeouts
    timeoutsRef.current.forEach((timeoutId) => {
      clearTimeout(timeoutId);
    });
    timeoutsRef.current.clear();
    lastNotificationRef.current.clear();
    setNotifications([]);
  }, []);

  // Convenience methods
  const success = useCallback(
    (message, duration) => {
      return showNotification(message, "success", duration);
    },
    [showNotification],
  );

  const error = useCallback(
    (message, duration) => {
      return showNotification(message, "error", duration);
    },
    [showNotification],
  );

  const warning = useCallback(
    (message, duration) => {
      return showNotification(message, "warning", duration);
    },
    [showNotification],
  );

  const info = useCallback(
    (message, duration) => {
      return showNotification(message, "info", duration);
    },
    [showNotification],
  );

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        showNotification,
        removeNotification,
        clearAll,
        success,
        error,
        warning,
        info,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider");
  }
  return context;
};
