'use client';

import { motion } from 'framer-motion';
import type { Note } from '@/lib/types';
import NoteCard from './note-card';

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
      className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5"
    >
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
    </motion.div>
  );
}
