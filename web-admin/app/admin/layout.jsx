'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    // Only register PWA on admin pages
    if (!pathname || !pathname.startsWith('/admin')) {
      return;
    }

    // Load admin-specific manifest
    const manifestLink = document.querySelector('link[rel="manifest"]');
    if (manifestLink) {
      manifestLink.setAttribute('href', '/admin-manifest.json');
    } else {
      const link = document.createElement('link');
      link.rel = 'manifest';
      link.href = '/admin-manifest.json';
      document.head.appendChild(link);
    }

    // Register service worker for admin only
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/admin-sw.js', { scope: '/admin/' })
        .then((registration) => {
          if (process.env.NODE_ENV === 'development') {
            console.log('Admin Service Worker registered:', registration);
          }
        })
        .catch((error) => {
          if (process.env.NODE_ENV === 'development') {
            console.log('Service Worker registration failed:', error);
          }
        });
    }
  }, [pathname]);

  return <>{children}</>;
}
