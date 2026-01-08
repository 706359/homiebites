'use client';

import { useEffect } from 'react';
import { NotificationProvider } from '../contexts/NotificationContext';
import NotificationWrapper from '../components/NotificationWrapper';

export default function AdminLayoutClient({ children }) {
  useEffect(() => {
    // Register service worker for PWA
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      process.env.NODE_ENV === 'production'
    ) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('[PWA] Service Worker registered:', registration.scope);
            
            // Check for updates
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    // New service worker available
                    console.log('[PWA] New service worker available');
                    // Optionally show update notification to user
                  }
                });
              }
            });
          })
          .catch((error) => {
            console.error('[PWA] Service Worker registration failed:', error);
          });
      });
    }
  }, []);

  return (
    <NotificationProvider>
      {children}
      <NotificationWrapper />
    </NotificationProvider>
  );
}

