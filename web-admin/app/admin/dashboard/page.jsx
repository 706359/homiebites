'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AdminDashboard from '../../../components/admin/AdminDashboard';
import { NotificationProvider } from '../../../components/admin/contexts/NotificationContext.jsx';
import NotificationWrapper from '../../../components/admin/NotificationWrapper.jsx';
import ErrorBoundary from '../../../components/ErrorBoundary';
import FontSettingsLoader from '../../../components/FontSettingsLoader';
import { checkSessionAndClearIfExpired } from '../../../lib/auth-admin.js';
import '../../../styles/globals.css';

export default function AdminDashboardPage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('homiebites_token');
    const isAdmin = localStorage.getItem('homiebites_admin') === 'true';

    if (!token || !isAdmin) {
      router.replace('/admin');
      return;
    }

    if (checkSessionAndClearIfExpired()) {
      router.replace('/admin');
      return;
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
