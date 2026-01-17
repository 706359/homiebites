'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AdminDashboard from '../../../components/admin/AdminDashboard';
import { NotificationProvider } from '../../../components/admin/contexts/NotificationContext.jsx';
import NotificationWrapper from '../../../components/admin/NotificationWrapper.jsx';
import '../../../styles/globals.css';
import '../../../components/admin/styles/index.css';
import ErrorBoundary from '../../../components/ErrorBoundary';
import FontSettingsLoader from '../../../components/FontSettingsLoader';

export default function AdminDashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // Verify token on page mount
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('homiebites_token');
    const isAdmin = localStorage.getItem('homiebites_admin') === 'true';

    if (!token || !isAdmin) {
      // Redirect to login if no valid token/admin status
      router.replace('/admin');
      return;
    }

    // Additional: Check token expiration if metadata exists
    try {
      const tokenMeta = localStorage.getItem('homiebites_token_meta');
      if (tokenMeta) {
        const meta = JSON.parse(tokenMeta);
        if (meta.expiresAt && new Date(meta.expiresAt) < new Date()) {
          // Token expired
          localStorage.removeItem('homiebites_token');
          localStorage.removeItem('homiebites_admin');
          localStorage.removeItem('homiebites_user');
          router.replace('/admin');
        }
      }
    } catch (e) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Error checking token expiration:', e);
      }
    }
  }, [router]);

  return (
    <ErrorBoundary>
      <NotificationProvider>
        <FontSettingsLoader />
        <AdminDashboard />
        <NotificationWrapper />
      </NotificationProvider>
    </ErrorBoundary>
  );
}
