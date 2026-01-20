'use client';

import { motion } from 'framer-motion';
import type { Note } from '@/lib/types';
import NoteCard from './note-card';
import { useSettingsStore } from '@/store/settings';

type NotesGridProps = {
  notes: Note[];
};

const containerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function NotesGrid({ notes }: NotesGridProps) {
  const gridLayout = useSettingsStore((state) => state.gridLayout);

  if (notes.length === 0) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold text-zinc-300">No notes yet</h2>
        <p className="text-zinc-500">Click "New Note" to get started.</p>
      </div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className={gridLayout === 'masonry'
        ? "columns-1 gap-6 md:columns-2 lg:columns-3 xl:columns-4"
        : "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-[200px]"
      }
    >
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
    </motion.div>
  );
}
