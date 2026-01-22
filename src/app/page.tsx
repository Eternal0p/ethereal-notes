'use client';

import { useAuth } from '@/hooks/use-auth';
import LoginView from '@/components/auth/login-view';
import NotesDashboard from '@/components/notes/notes-dashboard';
import MorningBriefingModal from '@/components/notes/morning-briefing-modal';
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
  const [showBriefing, setShowBriefing] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Check if briefing should be shown (once per day)
  useEffect(() => {
    if (!user || !mounted) return;

    const lastShown = localStorage.getItem('morning-briefing-last-shown');
    const today = new Date().toDateString();

    if (lastShown !== today) {
      // Show briefing after a short delay
      const timer = setTimeout(() => {
        setShowBriefing(true);
        localStorage.setItem('morning-briefing-last-shown', today);
      }, 1500); // 1.5 second delay

      return () => clearTimeout(timer);
    }
  }, [user, mounted]);

  if (loading || !mounted) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <main className="relative min-h-screen bg-zinc-950 text-white">
      {!user && <EtherealBackground />}
      {user ? (
        <>
          <NotesDashboard user={user} />
          <MorningBriefingModal
            open={showBriefing}
            onClose={() => setShowBriefing(false)}
          />
        </>
      ) : (
        <LoginView />
      )}
    </main>
  );
}
