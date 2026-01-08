'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AdminLogin from '../../AdminLogin';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect if already authenticated
    const token = localStorage.getItem('homiebites_token');
    const admin = localStorage.getItem('homiebites_admin');

    if (token && admin === 'true') {
      router.replace('/dashboard');
    }
  }, [router]);

  const handleLoginSuccess = () => {
    router.replace('/dashboard');
  };

  return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
}
