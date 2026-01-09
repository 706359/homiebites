import { useCallback, useEffect, useRef, useState } from "react";

const NotificationSystem = () => {
  const [currentNotification, setCurrentNotification] = useState(null);
  const queueRef = useRef([]);
  const timeoutRef = useRef(null);
  const currentNotificationRef = useRef(null);

  // Process queue function that can access latest state via refs
  const processQueue = useCallback(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // If there's already a notification showing, don't process queue yet
    if (currentNotificationRef.current) {
      return;
    }

    // Get next notification from queue
    if (queueRef.current.length === 0) {
      return;
    }

    const nextNotification = queueRef.current.shift();
    if (!nextNotification) {
      return;
    }

    // Set current notification
    currentNotificationRef.current = nextNotification;
    setCurrentNotification(nextNotification);

    // Calculate delay before showing next notification
    // For info notifications during operations, show next one after a shorter delay
    const delayBeforeNext = nextNotification.type === "info" ? 800 : 1200;

    // Remove current notification after its duration
    if (nextNotification.duration > 0) {
      timeoutRef.current = setTimeout(() => {
        currentNotificationRef.current = null;
        setCurrentNotification(null);

        // After a small delay, process next notification in queue
        setTimeout(() => {
          processQueue();
        }, delayBeforeNext);
      }, nextNotification.duration);
    } else {
      // If duration is 0 (persistent), wait a bit before showing next
      setTimeout(() => {
        currentNotificationRef.current = null;
        setCurrentNotification(null);
        setTimeout(() => {
          processQueue();
        }, delayBeforeNext);
      }, 3000); // Default 3 seconds for persistent notifications
    }
  }, []);

  useEffect(() => {
    // Listen for custom notification events
    const handleNotification = (e) => {
      const { message, type = "success", duration = 5000 } = e.detail;
      const notification = {
        message,
        type,
        duration,
        id: Date.now() + Math.random(),
      };

      // Add to queue
      queueRef.current.push(notification);

      // Try to process queue
      processQueue();
    };

    window.addEventListener("adminNotification", handleNotification);
    return () => {
      window.removeEventListener("adminNotification", handleNotification);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [processQueue]);

  // Update ref when currentNotification changes
  useEffect(() => {
    currentNotificationRef.current = currentNotification;
  }, [currentNotification]);

  // Process queue when currentNotification becomes null
  useEffect(() => {
    if (!currentNotification && queueRef.current.length > 0) {
      // Small delay to ensure smooth transition
      const timer = setTimeout(() => {
        processQueue();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentNotification, processQueue]);

  const removeNotification = (id) => {
    if (currentNotification && currentNotification.id === id) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      currentNotificationRef.current = null;
      setCurrentNotification(null);

      // Process next notification after a brief delay
      setTimeout(() => {
        processQueue();
      }, 500);
    }
  };

  // Show only current notification
  const notificationsToShow = currentNotification ? [currentNotification] : [];

  if (notificationsToShow.length === 0) return null;

  return (
    <div className="admin-notification-container">
      {notificationsToShow.map((notification) => (
        <div
          key={notification.id}
          className={`admin-notification admin-notification-${notification.type}`}
          onClick={() => removeNotification(notification.id)}
          style={{
            animation: "slideInRight 0.3s ease",
          }}
        >
          <div className="admin-notification-icon">
            {notification.type === "success" && (
              <i className="fa-solid fa-check-circle"></i>
            )}
            {notification.type === "error" && (
              <i className="fa-solid fa-exclamation-circle"></i>
            )}
            {notification.type === "warning" && (
              <i className="fa-solid fa-exclamation-triangle"></i>
            )}
            {notification.type === "info" && (
              <i className="fa-solid fa-info-circle"></i>
            )}
          </div>
          <div className="admin-notification-message">
            {notification.message}
          </div>
          <button
            className="admin-notification-close"
            onClick={(e) => {
              e.stopPropagation();
              removeNotification(notification.id);
            }}
          >
            <i className="fa-solid fa-times"></i>
          </button>
        </div>
      ))}
    </div>
  );
};

// Helper function to show notifications
export const showNotification = (
  message,
  type = "success",
  duration = 5000,
) => {
  window.dispatchEvent(
    new CustomEvent("adminNotification", {
      detail: { message, type, duration },
    }),
  );
};

export default NotificationSystem;
