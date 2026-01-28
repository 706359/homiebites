import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  checkSessionAndClearIfExpired,
  getSessionExpiresAt,
  logout,
} from '../../../lib/auth-admin.js';
import { useNotification } from '../contexts/NotificationContext.jsx';

/**
 * Enterprise-level session management hook
 *
 * Features:
 * - Inactivity timeout (default: 30 minutes)
 * - Absolute session timeout (24 hours)
 * - Activity tracking (mouse, keyboard, clicks, scrolls, touch)
 * - Session refresh on activity
 * - Warning before timeout (5 minutes before)
 * - Automatic logout on timeout
 */
export const useSessionManager = (options = {}) => {
  const {
    inactivityTimeout = 30 * 60 * 1000, // 30 minutes
    warningTime = 5 * 60 * 1000, // 5 minutes before timeout
    onSessionExpired = null,
    onSessionWarning = null,
  } = options;

  const router = useRouter();
  const { showNotification } = useNotification();
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isSessionActive, setIsSessionActive] = useState(true);

  const inactivityTimerRef = useRef(null);
  const warningTimerRef = useRef(null);
  const absoluteTimeoutRef = useRef(null);
  const absoluteCheckIntervalRef = useRef(null);
  const lastActivityRef = useRef(Date.now());
  const warningShownRef = useRef(false);
  const sessionRefreshIntervalRef = useRef(null);

  /**
   * Refresh session expiration time
   */
  const refreshSession = useCallback(() => {
    if (typeof window === 'undefined') return;

    try {
      const tokenMeta = localStorage.getItem('homiebites_token_meta');
      if (!tokenMeta) return;

      const meta = JSON.parse(tokenMeta);
      if (!meta) return;

      // Update expiration time
      const newExpiresAt = getSessionExpiresAt();
      localStorage.setItem(
        'homiebites_token_meta',
        JSON.stringify({ ...meta, expiresAt: newExpiresAt })
      );

      // Reset inactivity timer
      lastActivityRef.current = Date.now();
      warningShownRef.current = false;

      // Clear existing timers
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      if (warningTimerRef.current) {
        clearTimeout(warningTimerRef.current);
      }

      // Hide warning modal if shown
      if (showWarningModal) {
        setShowWarningModal(false);
      }

      // Restart inactivity timer
      startInactivityTimer();
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[SessionManager] Error refreshing session:', error);
      }
    }
  }, [showWarningModal]);

  /**
   * Handle user activity - refresh session
   */
  const handleActivity = useCallback(() => {
    if (!isSessionActive) return;

    const now = Date.now();
    const timeSinceLastActivity = now - lastActivityRef.current;

    // Only refresh if significant time has passed (avoid excessive refreshes)
    if (timeSinceLastActivity > 60000) {
      // 1 minute
      refreshSession();
    } else {
      lastActivityRef.current = now;
    }
  }, [isSessionActive, refreshSession]);

  /**
   * Start inactivity timer
   */
  const startInactivityTimer = useCallback(() => {
    // Clear existing timer
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    // Calculate warning time
    const warningTimeout = inactivityTimeout - warningTime;

    // Set warning timer
    if (warningTimeout > 0) {
      warningTimerRef.current = setTimeout(() => {
        if (!warningShownRef.current) {
          warningShownRef.current = true;
          setTimeRemaining(warningTime);
          setShowWarningModal(true);

          if (onSessionWarning) {
            onSessionWarning(warningTime);
          }

          showNotification({
            type: 'warning',
            message: `Your session will expire in ${Math.floor(warningTime / 60000)} minutes due to inactivity.`,
            duration: 10000,
          });
        }
      }, warningTimeout);
    }

    // Set inactivity timeout
    inactivityTimerRef.current = setTimeout(() => {
      handleSessionExpired('inactivity');
    }, inactivityTimeout);
  }, [inactivityTimeout, warningTime, onSessionWarning, showNotification]);

  /**
   * Handle session expiration
   */
  const handleSessionExpired = useCallback(
    async (reason = 'timeout') => {
      setIsSessionActive(false);
      setShowWarningModal(false);

      // Clear all timers
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      if (warningTimerRef.current) {
        clearTimeout(warningTimerRef.current);
      }
      if (absoluteTimeoutRef.current) {
        clearTimeout(absoluteTimeoutRef.current);
      }
      if (sessionRefreshIntervalRef.current) {
        clearInterval(sessionRefreshIntervalRef.current);
      }

      // Show notification
      const reasonMessage =
        reason === 'inactivity'
          ? 'Session expired due to inactivity'
          : reason === 'absolute'
            ? 'Session expired'
            : 'Session expired';

      showNotification({
        type: 'error',
        message: reasonMessage + '. Please login again.',
        duration: 5000,
      });

      // Call custom handler if provided
      if (onSessionExpired) {
        onSessionExpired(reason);
      }

      // Perform logout
      try {
        await logout();
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('[SessionManager] Error during logout:', error);
        }
      }

      // Redirect to login
      window.location.href = '/admin';
    },
    [onSessionExpired, showNotification]
  );

  /**
   * Check absolute session timeout (24 hours). Returns Promise<boolean>.
   */
  const checkAbsoluteTimeout = useCallback(async () => {
    if (typeof window === 'undefined') return false;

    try {
      const expired = await checkSessionAndClearIfExpired();
      if (expired) {
        handleSessionExpired('absolute');
        return true;
      }
      return false;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error(
          '[SessionManager] Error checking absolute timeout:',
          error
        );
      }
      return false;
    }
  }, [handleSessionExpired]);

  /**
   * Extend session (called when user clicks "Stay Logged In")
   */
  const extendSession = useCallback(() => {
    refreshSession();
    setShowWarningModal(false);
    setTimeRemaining(null);
    warningShownRef.current = false;

    showNotification({
      type: 'success',
      message: 'Session extended. You will remain logged in.',
      duration: 3000,
    });
  }, [refreshSession, showNotification]);

  /**
   * Logout immediately
   */
  const logoutNow = useCallback(async () => {
    setIsSessionActive(false);
    setShowWarningModal(false);

    // Clear all timers
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current);
    }
    if (absoluteTimeoutRef.current) {
      clearTimeout(absoluteTimeoutRef.current);
    }
    if (sessionRefreshIntervalRef.current) {
      clearInterval(sessionRefreshIntervalRef.current);
    }

    try {
      await logout();
      showNotification({
        type: 'success',
        message: 'Logged out successfully',
        duration: 2000,
      });
      await new Promise((resolve) => setTimeout(resolve, 500));
      window.location.href = '/admin';
    } catch (error) {
      console.error('[SessionManager] Error during logout:', error);
      await logout();
      window.location.href = '/admin';
    }
  }, [showNotification]);

  // Initialize session management
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let cancelled = false;
    const teardownRef = { current: null };

    (async () => {
      // Check if session is already expired (await: returns boolean)
      const expired = await checkAbsoluteTimeout();
      if (cancelled || expired) return;

      // Set initial activity time
      lastActivityRef.current = Date.now();

      // Start inactivity timer
      startInactivityTimer();

      // Check absolute timeout every minute
      absoluteCheckIntervalRef.current = setInterval(() => {
        checkAbsoluteTimeout().then((expired) => {
          if (expired && absoluteCheckIntervalRef.current) {
            clearInterval(absoluteCheckIntervalRef.current);
            absoluteCheckIntervalRef.current = null;
          }
        });
      }, 60000); // Check every minute

      // Activity event listeners
      const activityEvents = [
        'mousedown',
        'mousemove',
        'keypress',
        'scroll',
        'touchstart',
        'click',
        'keydown',
      ];

      const throttledHandleActivity = (() => {
        let lastCall = 0;
        const throttleDelay = 1000; // Throttle to once per second

        return () => {
          const now = Date.now();
          if (now - lastCall >= throttleDelay) {
            lastCall = now;
            handleActivity();
          }
        };
      })();

      activityEvents.forEach((event) => {
        window.addEventListener(event, throttledHandleActivity, {
          passive: true,
        });
      });

      // Register cleanup so useEffect return can run it on unmount
      teardownRef.current = () => {
        activityEvents.forEach((event) => {
          window.removeEventListener(event, throttledHandleActivity);
        });
        if (absoluteCheckIntervalRef.current) {
          clearInterval(absoluteCheckIntervalRef.current);
          absoluteCheckIntervalRef.current = null;
        }
        if (inactivityTimerRef.current) {
          clearTimeout(inactivityTimerRef.current);
          inactivityTimerRef.current = null;
        }
        if (warningTimerRef.current) {
          clearTimeout(warningTimerRef.current);
          warningTimerRef.current = null;
        }
        if (absoluteTimeoutRef.current) {
          clearTimeout(absoluteTimeoutRef.current);
          absoluteTimeoutRef.current = null;
        }
      };
    })();

    // Cleanup on unmount
    return () => {
      cancelled = true;
      if (teardownRef.current) teardownRef.current();
    };
  }, [
    startInactivityTimer,
    handleActivity,
    checkAbsoluteTimeout,
    showWarningModal,
    inactivityTimeout,
    handleSessionExpired,
  ]);

  // Update time remaining when warning modal is shown
  useEffect(() => {
    if (!showWarningModal) return;

    const interval = setInterval(() => {
      const remaining =
        inactivityTimeout - (Date.now() - lastActivityRef.current);
      if (remaining > 0) {
        setTimeRemaining(Math.max(0, remaining));
      } else {
        handleSessionExpired('inactivity');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [showWarningModal, inactivityTimeout, handleSessionExpired]);

  return {
    isSessionActive,
    showWarningModal,
    timeRemaining,
    extendSession,
    logoutNow,
    refreshSession,
  };
};
