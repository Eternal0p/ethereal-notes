'use client';

import { auth } from '@/lib/firebase';
import {
  LogOut,
  PlusCircle,
  Tag,
  Settings,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { User } from 'firebase/auth';
import { motion } from 'framer-motion';
import { useNotesStore } from '@/store/notes';
import { useMemo, useState } from 'react';
import SettingsDialog from './settings-dialog';

type SidebarProps = {
  user: User;
};

export default function Sidebar({ user }: SidebarProps) {
  const { setIsEditorOpen, setCurrentNote, notes, selectedTags, setSelectedTags } = useNotesStore();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleNewNote = () => {
    setCurrentNote(null);
    setIsEditorOpen(true);
  };

  // Extract all unique tags from all notes
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    notes.forEach(note => {
      note.tags?.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [notes]);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const clearTagFilter = () => {
    setSelectedTags([]);
  };

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="hidden md:flex h-screen w-64 flex-col justify-between border-r border-white/5 bg-card/30 p-4 backdrop-blur-md"
    >
      <div className="flex-1 space-y-6 overflow-y-auto">
        <div className="mb-8 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-0.5">
            <div className="h-full w-full rounded-full bg-background p-0.5">
              <Avatar className="h-full w-full">
                <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User'} />
                <AvatarFallback className="flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-sm font-semibold">
                  {user.displayName?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
          <div>
            <p className="font-semibold text-zinc-100">{user.displayName}</p>
            <p className="text-xs text-zinc-400">{user.email}</p>
          </div>
        </div>

        <Button
          onClick={handleNewNote}
          className="w-full justify-start bg-transparent text-zinc-300 hover:bg-white/5 hover:text-white"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> New Note
        </Button>

        {allTags.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-zinc-400">
                <Tag className="h-4 w-4" />
                Tags
              </div>
              {selectedTags.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearTagFilter}
                  className="h-6 px-2 text-xs text-zinc-500 hover:text-zinc-300"
                >
                  Clear
                </Button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {allTags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  onClick={() => toggleTag(tag)}
                  className={`cursor-pointer text-xs transition-all ${selectedTags.includes(tag)
                    ? 'bg-indigo-500/30 text-indigo-200 border-indigo-500/50'
                    : 'bg-zinc-700/30 text-zinc-400 border-zinc-700/50 hover:bg-zinc-700/50'
                    }`}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => setSettingsOpen(true)}
                variant="ghost"
                size="icon"
                className="text-zinc-400 hover:bg-white/5 hover:text-white"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Settings</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => auth.signOut()}
                variant="ghost"
                size="icon"
                className="text-zinc-400 hover:bg-white/5 hover:text-white"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Sign Out</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <SettingsDialog user={user} open={settingsOpen} onOpenChange={setSettingsOpen} />
    </motion.aside>
  );
}
