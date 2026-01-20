'use client';

import { motion } from 'framer-motion';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Note } from '@/lib/types';
import { useNotesStore } from '@/store/notes';

type NoteCardProps = {
  note: Note;
};

const cardVariants = {
  initial: {
    opacity: 0,
    y: 50,
    scale: 0.95
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: {
      duration: 0.2
    }
  },
};

export default function NoteCard({ note }: NoteCardProps) {
  const { setCurrentNote, setIsEditorOpen } = useNotesStore();
  const { color, colSpan = 1, rowSpan = 1, tags = [] } = note;

  const handleCardClick = () => {
    setCurrentNote(note);
    setIsEditorOpen(true);
  };

  const displayTags = tags.slice(0, 3);
  const remainingTags = tags.length - 3;

  return (
    <motion.div
      variants={cardVariants}
      layout
      className="break-inside-avoid"
      style={{
        gridColumn: `span ${colSpan}`,
        gridRow: `span ${rowSpan}`,
      }}
    >
      <motion.div
        whileHover={{ y: -5, transition: { type: 'spring', stiffness: 200, damping: 20 } }}
      >
        <Card
          onClick={handleCardClick}
          className="cursor-pointer border-white/5 bg-card/30 backdrop-blur-md transition-all duration-300 ease-in-out hover:border-white/20"
          style={{ '--card-accent': color } as React.CSSProperties}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-zinc-100">
              {color && (
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: color }}
                />
              )}
              {note.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <CardDescription className="text-zinc-400">
              {note.excerpt || 'No summary available.'}
            </CardDescription>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {displayTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs px-2 py-0.5"
                  >
                    {tag}
                  </Badge>
                ))}
                {remainingTags > 0 && (
                  <Badge
                    variant="secondary"
                    className="bg-zinc-500/10 text-zinc-400 border border-zinc-500/20 text-xs px-2 py-0.5"
                  >
                    +{remainingTags} more
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

