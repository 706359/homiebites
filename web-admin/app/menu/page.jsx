'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function MenuPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home page with gallery hash
    router.replace('/#gallery');
  }, [router]);

  return null;
}
