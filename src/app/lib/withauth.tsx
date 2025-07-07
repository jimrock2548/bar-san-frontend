// src/app/lib/withAuth.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function withAuth(Component: any) {
  return function AuthenticatedComponent(props: any) {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login'); // ไม่มี token ให้เด้งไป login
      }
    }, [router]);

    return <Component {...props} />;
  };
}
