'use client';

import { motion } from 'framer-motion';
import type { Note } from '@/lib/types';
import { useNotesStore } from '@/store/notes';
import { formatDistanceToNow } from 'date-fns';

type NoteCardProps = {
  note: Note;
};

const cardVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20,
    },
  },
};

// Map colors to shadow colors
const colorShadows: Record<string, string> = {
  '#6262f3': 'shadow-[0_0_8px_rgba(98,98,243,0.4)]',
  '#ec4899': 'shadow-[0_0_8px_rgba(236,72,153,0.4)]',
  '#22c55e': 'shadow-[0_0_8px_rgba(34,197,94,0.4)]',
  '#f97316': 'shadow-[0_0_8px_rgba(249,115,22,0.4)]',
  '#06b6d4': 'shadow-[0_0_8px_rgba(6,182,212,0.4)]',
};

export default function NoteCard({ note }: NoteCardProps) {
  const { setCurrentNote, setIsEditorOpen } = useNotesStore();
  const { color, tags = [] } = note;

  const handleCardClick = () => {
    setCurrentNote(note);
    setIsEditorOpen(true);
  };

  // Get time since last update
  const getTimeAgo = () => {
    if (!note.updatedAt) return '';
    const timestamp = note.updatedAt instanceof Object && 'seconds' in note.updatedAt
      ? new Date(note.updatedAt.seconds * 1000)
      : new Date();
    return formatDistanceToNow(timestamp, { addSuffix: true });
  };

  // Strip HTML tags for excerpt display
  const getPlainTextExcerpt = () => {
    const html = (note as any).contentHtml || note.content;
    const div = document.createElement('div');
    div.innerHTML = html;
    const text = div.textContent || div.innerText || '';
    return text.substring(0, 120) + (text.length > 120 ? '...' : '');
  };

  const categoryTag = tags[0] || 'Note';
  const colorValue = color || '#6262f3';
  const shadowClass = colorShadows[colorValue] || 'shadow-[0_0_8px_rgba(98,98,243,0.4)]';

  return (
    <motion.div
      variants={cardVariants}
      className="break-inside-avoid mb-5"
      onClick={handleCardClick}
    >
      <div className="glass-card rounded-2xl p-5 cursor-pointer group">
        {/* Header with category tag */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${shadowClass}`}
              style={{ backgroundColor: colorValue }}
            ></span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
              {categoryTag}
            </span>
          </div>
          <span className="text-zinc-600 hover:text-zinc-400 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-white mb-2 leading-tight">
          {note.title}
        </h3>

        {/* Content Preview */}
        <p className="text-sm text-zinc-400 leading-relaxed mb-4 line-clamp-3">
          {getPlainTextExcerpt()}
        </p>

        {/* Footer with tags and timestamp */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800/50 text-zinc-400 border border-zinc-700/50"
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800/50 text-zinc-400 border border-zinc-700/50">
                +{tags.length - 3} more
              </span>
            )}
          </div>
        )}

        <div className="flex items-center gap-3 border-t border-white/5 pt-3">
          <span className="text-xs text-zinc-600 font-mono">
            Updated {getTimeAgo()}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
