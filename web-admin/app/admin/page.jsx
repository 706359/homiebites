'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AdminLogin from '../../components/admin/AdminLogin';
import NotificationWrapper from '../../components/admin/NotificationWrapper.jsx';
import { NotificationProvider } from '../../components/admin/contexts/NotificationContext.jsx';

export default function Admin() {
  const router = useRouter();

  useEffect(() => {
    // Check if already logged in
    const admin = localStorage.getItem('homiebites_admin');
    const user = localStorage.getItem('homiebites_user');
    if (admin === 'true' || (user && (JSON.parse(user).role?.toLowerCase() === 'admin' || JSON.parse(user).role === 'Admin'))) {
      router.replace('/admin/dashboard');
    }
  }, [router]);

  const handleLoginSuccess = () => {
    // Login success is handled by AdminLogin component with window.location.href
    // This callback is kept for compatibility but redirect happens in AdminLogin
    router.replace('/admin/dashboard');
  };

  return (
    <NotificationProvider>
      <AdminLogin onLoginSuccess={handleLoginSuccess} />
      <NotificationWrapper />
    </NotificationProvider>
  );
}
