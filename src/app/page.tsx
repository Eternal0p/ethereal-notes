'use client';

import { useAuth } from '@/hooks/use-auth';
import LoginView from '@/components/auth/login-view';
import NotesDashboard from '@/components/notes/notes-dashboard';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

// Lazy load the heavy 3D background component
const EtherealBackground = dynamic(
  () => import('@/components/shared/ethereal-background'),
  {
    ssr: false,
    loading: () => <div className="fixed inset-0 bg-zinc-950" />
  }
);

export default function Home() {
  const { user, loading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (loading || !mounted) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <main className="relative min-h-screen bg-zinc-950 text-white">
      <EtherealBackground />
      {user ? <NotesDashboard user={user} /> : <LoginView />}
    </main>
  );
}
