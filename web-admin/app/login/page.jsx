'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AdminLogin from '../../components/admin/AdminLogin';
import NotificationWrapper from '../../components/admin/NotificationWrapper.jsx';
import { NotificationProvider } from '../../components/admin/contexts/NotificationContext.jsx';

export default function Login() {
  const router = useRouter();

  useEffect(() => {
    // Check if already logged in
    const admin = localStorage.getItem('homiebites_admin');
    const user = localStorage.getItem('homiebites_user');
    if (admin === 'true' || (user && JSON.parse(user).role === 'admin')) {
      router.replace('/admin/dashboard');
    }
  }, [router]);

  const handleLoginSuccess = () => {
    router.replace('/admin/dashboard');
  };

  return (
    <NotificationProvider>
      <AdminLogin onLoginSuccess={handleLoginSuccess} />
      <NotificationWrapper />
    </NotificationProvider>
  );
}

