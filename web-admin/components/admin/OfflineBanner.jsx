'use client';

import { useEffect, useState } from 'react';

const NETWORK_ERROR_PATTERN = /network|connect|unable to connect|not available|fetch|internet|connection refused|failed to fetch/i;

const OfflineBanner = ({ connectionError, onRetry, onBackOnline, showNotification }) => {
  const [isOffline, setIsOffline] = useState(
    typeof navigator !== 'undefined' ? !navigator.onLine : false
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => {
      if (isOffline && showNotification) {
        showNotification('Back online. Refreshing data…', 'success', 3000);
      }
      if (typeof onBackOnline === 'function') {
        onBackOnline();
      }
      setIsOffline(false);
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, [isOffline, onBackOnline, showNotification]);

  const showConnectionError = connectionError && NETWORK_ERROR_PATTERN.test(connectionError);
  const visible = isOffline || showConnectionError;
  if (!visible) return null;

  const isOfflineState = isOffline;

  return (
    <div
      className='offline-banner'
      role='alert'
      aria-live='polite'
    >
      <div className='offline-banner__inner'>
        <i className={`fa-solid ${isOfflineState ? 'fa-wifi' : 'fa-cloud-exclamation'}`} aria-hidden />
        <span>
          {isOfflineState
            ? "You're offline. Some features may be unavailable."
            : 'Connection problem. Check your connection and try again.'}
        </span>
        {showConnectionError && !isOfflineState && onRetry && (
          <button
            type='button'
            className='btn btn-ghost btn-small offline-banner__retry'
            onClick={() => onRetry()}
          >
            <i className='fa-solid fa-rotate-right' aria-hidden /> Retry
          </button>
        )}
      </div>
    </div>
  );
};

export default OfflineBanner;
