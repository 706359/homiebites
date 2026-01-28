'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AdminLogin from '../../components/admin/AdminLogin';
import { NotificationProvider } from '../../components/admin/contexts/NotificationContext.jsx';
import NotificationWrapper from '../../components/admin/NotificationWrapper.jsx';
import FontSettingsLoader from '../../components/FontSettingsLoader';
import { checkSessionAndClearIfExpired } from '../../lib/auth-admin.js';

export default function Admin() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let cancelled = false;
    (async () => {
      const expired = await checkSessionAndClearIfExpired();
      if (cancelled || expired) return;

      const admin = localStorage.getItem('homiebites_admin');
      const user = localStorage.getItem('homiebites_user');

      const userRole = user ? JSON.parse(user).role : null;
      const isAdminRole =
        userRole &&
        (userRole.toLowerCase() === 'admin' || userRole === 'Admin');
      if (admin === 'true' || isAdminRole) {
        router.replace('/admin/dashboard');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  const handleLoginSuccess = () => {
    router.replace('/admin/dashboard');
  };

  return (
    <NotificationProvider>
      <FontSettingsLoader />
      <AdminLogin onLoginSuccess={handleLoginSuccess} />
      <NotificationWrapper />
    </NotificationProvider>
  );
}
