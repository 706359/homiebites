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
    // Check for both lowercase and uppercase Admin role
    const userRole = user ? JSON.parse(user).role : null;
    const isAdminRole = userRole && (userRole.toLowerCase() === 'admin' || userRole === 'Admin');
    if (admin === 'true' || isAdminRole) {
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
