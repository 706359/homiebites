'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AdminLogin from '../../../admin/AdminLogin';

export default function Admin() {
  const router = useRouter();

  useEffect(() => {
    // Check if already logged in
    const admin = localStorage.getItem('homiebites_admin');
    const user = localStorage.getItem('homiebites_user');
    if (admin === 'true' || (user && JSON.parse(user).role === 'admin')) {
      router.push('/admin/dashboard');
    }
  }, [router]);

  const handleLoginSuccess = () => {
    router.push('/admin/dashboard');
  };

  return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
}

