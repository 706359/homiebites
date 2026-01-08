'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AdminLogin from '../../../admin/AdminLogin';
import NotificationWrapper from '../../components/NotificationWrapper';
import { NotificationProvider } from '../../contexts/NotificationContext';

export default function Admin() {
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
