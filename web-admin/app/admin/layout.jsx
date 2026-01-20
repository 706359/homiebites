'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
/* Admin CSS: loads index (vars, layout) + all modules. Static import so it is in the /admin route chunk and applies before paint. */
import '../../components/admin/styles/adminStyles.js';
import { clearAdminFontSize, parseFontSize, applyAdminFontSize } from '../../components/admin/utils/fontSize.js';

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  /* html.admin-active: needed for index.css overflow, font-size. This layout only mounts for /admin. */
  useEffect(() => {
    document.documentElement.classList.add('admin-active');
    return () => document.documentElement.classList.remove('admin-active');
  }, []);

  /* Apply saved font size as early as possible when entering /admin */
  useEffect(() => {
    if (typeof pathname === 'string' && pathname.startsWith('/admin')) {
      const v = parseFontSize(typeof localStorage !== 'undefined' ? localStorage.getItem('homiebites_font_size') : null);
      applyAdminFontSize(v ?? 16);
    }
  }, [pathname]);

  useEffect(() => {
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

  useEffect(() => {
    return () => { clearAdminFontSize(); };
  }, []);

  return <>{children}</>;
}
