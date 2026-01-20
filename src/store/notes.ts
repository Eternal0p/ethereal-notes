import { create } from 'zustand';
import type { Note } from '@/lib/types';

type NotesState = {
  notes: Note[];
  setNotes: (notes: Note[]) => void;
  isEditorOpen: boolean;
  setIsEditorOpen: (isOpen: boolean) => void;
  currentNote: Note | null;
  setCurrentNote: (note: Note | null) => void;
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
};

export const useNotesStore = create<NotesState>((set) => ({
  notes: [],
  setNotes: (notes) => set({ notes }),
  isEditorOpen: false,
  setIsEditorOpen: (isOpen) => set({ isEditorOpen: isOpen }),
  currentNote: null,
  setCurrentNote: (note) => set({ currentNote: note }),
  selectedTags: [],
  setSelectedTags: (tags) => set({ selectedTags: tags }),
}));
