'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AdminLogin from '../../components/admin/AdminLogin';
import NotificationWrapper from '../../components/admin/NotificationWrapper.jsx';
import FontSettingsLoader from '../../components/FontSettingsLoader';
import { NotificationProvider } from '../../components/admin/contexts/NotificationContext.jsx';
import { checkSessionAndClearIfExpired } from '../../lib/auth-admin.js';

export default function Admin() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (checkSessionAndClearIfExpired()) return;

    const admin = localStorage.getItem('homiebites_admin');
    const user = localStorage.getItem('homiebites_user');

    const userRole = user ? JSON.parse(user).role : null;
    const isAdminRole =
      userRole && (userRole.toLowerCase() === 'admin' || userRole === 'Admin');
    if (admin === 'true' || isAdminRole) {
      router.replace('/admin/dashboard');
    }
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
