'use client';

import { useEffect, useMemo } from 'react';
import type { User } from 'firebase/auth';
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useNotesStore } from '@/store/notes';
import type { Note } from '@/lib/types';
import Sidebar from '@/components/layout/sidebar';
import NoteEditor from '@/components/notes/note-editor';
import NotesGrid from './notes-grid';
import { AnimatePresence } from 'framer-motion';

type NotesDashboardProps = {
  user: User;
};

export default function NotesDashboard({ user }: NotesDashboardProps) {
  const { setNotes, notes, selectedTags } = useNotesStore();

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, `users/${user.uid}/notes`),
      where('isDeleted', '==', false),
      orderBy('updatedAt', 'desc')
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
        console.log(`Loaded ${notesData.length} notes from Firestore`);
        setNotes(notesData);
      },
      (error) => {
        console.error('Error fetching notes:', error);
      }
    );

    return () => unsubscribe();
  }, [user, setNotes]);

  // Filter notes by selected tags
  const filteredNotes = useMemo(() => {
    if (selectedTags.length === 0) return notes;

    return notes.filter(note =>
      selectedTags.every(selectedTag => note.tags?.includes(selectedTag))
    );
  }, [notes, selectedTags]);

  return (
    <div className="flex">
      <Sidebar user={user} />
      <main className="flex-1">
        <div className="p-4 sm:p-8">
          <div className="mb-8">
            <h1 className="font-headline text-4xl font-bold">My Notes</h1>
            {selectedTags.length > 0 && (
              <p className="mt-2 text-sm text-zinc-400">
                Filtered by: {selectedTags.join(', ')} ({filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'})
              </p>
            )}
          </div>
          <AnimatePresence>
            <NotesGrid notes={filteredNotes} />
          </AnimatePresence>
        </div>
        {/* Mobile FAB for New Note */}
        <button
          onClick={() => { useNotesStore.getState().setCurrentNote(null); useNotesStore.getState().setIsEditorOpen(true); }}
          className="md:hidden fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500 text-white shadow-lg hover:bg-indigo-600 transition-colors"
          aria-label="New Note"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </main>
      <NoteEditor />
    </div>
  );
}
