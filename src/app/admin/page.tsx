"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import AdminPanelClient from '@/components/AdminPanelClient';

export default function AdminPage() {
  const user = useStore((s) => s.user);
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push('/login');
    else if (user.role != 'ADMIN') router.push('/');
  }, [user, router]);

  if (!user || user.role !== 'ADMIN') return <div className="min-h-screen flex items-center justify-center">Redirecting…</div>;

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-primary-darker to-primary-dark">
      <div className="max-w-6xl mx-auto">
        <AdminPanelClient />
      </div>
    </div>
  );
}
