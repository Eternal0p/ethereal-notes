'use client';

import { useEffect, useMemo, useState } from 'react';
import type { User } from 'firebase/auth';
import {
  collection,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useNotesStore } from '@/store/notes';
import type { Note } from '@/lib/types';
import Sidebar from '@/components/layout/sidebar';
import MobileHeader from '@/components/layout/mobile-header';
import MobileBottomNav from '@/components/layout/mobile-bottom-nav';
import AetherBackground from '@/components/layout/aether-background';
import NoteEditor from '@/components/notes/note-editor';
import NotesGrid from './notes-grid';
import { AnimatePresence } from 'framer-motion';
import { Search, Plus, Eye, EyeOff } from 'lucide-react';
import { MobileSidebar } from '@/components/layout/mobile-sidebar';
import MorningBriefing from '@/components/dashboard/morning-briefing';
import { useZenMode } from '@/hooks/use-zen-mode';
import dynamic from 'next/dynamic';

// Lazy load Hyperspeed only on desktop
const Hyperspeed = dynamic(() => import('@/components/shared/Hyperspeed'), {
  ssr: false,
});

type NotesDashboardProps = {
  user: User;
};

export default function NotesDashboard({ user }: NotesDashboardProps) {
  const { setNotes, notes, selectedTags, setIsEditorOpen, setCurrentNote, setIsReadOnly } = useNotesStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { isZenMode, toggleZenMode } = useZenMode();

  useEffect(() => {
    if (!user) return;

    // Query without orderBy to avoid composite index requirement
    const q = query(
      collection(db, `users/${user.uid}/notes`),
      where('isDeleted', '==', false)
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const notesData: Note[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          notesData.push({
            id: doc.id,
            title: data.title,
            content: data.content,
            excerpt: data.excerpt,
            tags: data.tags || [],
            color: data.color,
            colSpan: data.colSpan || 1,
            rowSpan: data.rowSpan || 1,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            userId: data.userId,
          });
        });
        // Sort notes by updatedAt in memory (descending)
        notesData.sort((a, b) => {
          const aTime = a.updatedAt instanceof Object && 'seconds' in a.updatedAt ? a.updatedAt.seconds : 0;
          const bTime = b.updatedAt instanceof Object && 'seconds' in b.updatedAt ? b.updatedAt.seconds : 0;
          return bTime - aTime;
        });
        console.log(`Loaded ${notesData.length} notes from Firestore`);
        setNotes(notesData);
      },
      (error) => {
        console.error('Error fetching notes:', error);
      }
    );

    return () => unsubscribe();
  }, [user, setNotes]);

  // Filter notes by selected tags and search query
  const filteredNotes = useMemo(() => {
    let filtered = notes;

    // Filter by tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(note =>
        selectedTags.every(selectedTag => note.tags?.includes(selectedTag))
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query) ||
        note.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [notes, selectedTags, searchQuery]);

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Get current date/time string
  const getDateTime = () => {
    const now = new Date();
    const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const day = days[now.getDay()];
    const month = months[now.getMonth()];
    const date = now.getDate();
    const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    return `${day}, ${month} ${date} • ${time}`;
  };

  const handleNewNote = () => {
    setCurrentNote(null);
    setIsReadOnly(false); // Ensure edit mode for new notes
    setIsEditorOpen(true);
  };

  // Get all unique tags from notes
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    notes.forEach(note => {
      note.tags?.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [notes]);

  return (
    <>
      {/* Use Hyperspeed background on desktop (>= 768px), fallback to Aether on mobile */}
      <div className="hidden md:block fixed inset-0 z-0">
        <Hyperspeed />
      </div>
      <div className="md:hidden fixed inset-0 z-0">
        <AetherBackground />
      </div>

      <MorningBriefing notes={notes} userName={user.displayName || 'User'} />

      <div className={`relative z-10 flex h-screen w-full overflow-hidden ${isZenMode ? 'zen-mode' : ''}`}>
        <div className={isZenMode ? 'zen-hide' : ''}>
          <Sidebar user={user} />
        </div>

        <main className="flex-1 h-full overflow-y-auto overflow-x-hidden relative scroll-smooth p-4 md:p-8 pb-28 md:pb-8">
          {/* Mobile header removed - using bottom nav only */}

          {/* Header Section */}
          <header className="max-w-5xl mx-auto w-full mb-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-white text-3xl md:text-4xl font-bold tracking-tight leading-tight">
                  {getGreeting()}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-500">{user.displayName?.split(' ')[0] || 'there'}</span>
                </h1>
                <p className="text-zinc-500 text-sm mt-1 font-mono tracking-wide">{getDateTime()}</p>
              </div>

              <div className="flex items-center gap-3">
                {/* Zen Mode Toggle */}
                <button
                  onClick={toggleZenMode}
                  className={`p-2 rounded-lg transition-all ${isZenMode
                    ? 'text-primary bg-primary/10 hover:bg-primary/20'
                    : 'text-zinc-400 hover:text-white hover:bg-white/10'
                    }`}
                  title={`${isZenMode ? 'Exit' : 'Enter'} Zen Mode (Ctrl+\\)`}
                >
                  {isZenMode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>

                {/* Search Bar */}
                <div className="relative group w-full md:w-80">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="w-5 h-5 text-zinc-500 group-focus-within:text-primary transition-colors" />
                  </div>
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full rounded-xl border-none bg-zinc-800/40 py-3 pl-10 pr-4 text-sm text-zinc-200 placeholder-zinc-500 focus:ring-1 focus:ring-primary/50 focus:bg-zinc-800/60 transition-all backdrop-blur-md shadow-inner"
                    placeholder="Search notes, tags, or ideas..."
                    type="text"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-[10px] text-zinc-600 border border-zinc-700 rounded px-1.5 py-0.5 font-mono">⌘K</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Chips */}
            <div className={`flex gap-3 overflow-x-auto pb-2 no-scrollbar ${isZenMode ? 'zen-hide' : ''}`}>
              <button
                onClick={() => setSearchQuery('')}
                className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors whitespace-nowrap shadow-sm ${searchQuery === '' && selectedTags.length === 0
                  ? 'bg-zinc-800/80 text-white border-zinc-700'
                  : 'bg-zinc-800/30 text-zinc-400 border-transparent hover:border-zinc-700 hover:text-zinc-200'
                  }`}
              >
                All Notes
              </button>
              {allTags.filter(tag => tag && tag.trim() && tag.toLowerCase() !== 'enter').slice(0, 5).map((tag) => (
                <button
                  key={tag}
                  className="px-4 py-1.5 rounded-full bg-zinc-800/30 text-zinc-400 text-xs font-medium border border-transparent hover:border-zinc-700 hover:text-zinc-200 transition-colors whitespace-nowrap"
                >
                  {tag}
                </button>
              ))}
            </div>
          </header>

          {/* Notes Grid */}
          <div className="max-w-5xl mx-auto w-full">
            <AnimatePresence>
              <NotesGrid notes={filteredNotes} />
            </AnimatePresence>
          </div>
        </main>

        {/* Floating Action Button (Glass Pill) */}
        <div className="fixed bottom-20 right-6 md:bottom-10 md:right-10 z-50">
          <button
            onClick={handleNewNote}
            className="glass-pill-button group flex items-center gap-2 pl-4 pr-5 py-3 rounded-full text-white transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="w-5 h-5 text-white group-hover:rotate-90 transition-transform" />
            <span className="font-medium text-sm tracking-wide text-white">New Note</span>
          </button>
        </div>

        <MobileBottomNav />
        <NoteEditor />
      </div>
    </>
  );
}
