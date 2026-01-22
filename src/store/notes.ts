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
  toggleTag: (tag: string) => void;
  isReadOnly: boolean;
  setIsReadOnly: (isReadOnly: boolean) => void;
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
  toggleTag: (tag: string) => set((state) => {
    const isSelected = state.selectedTags.includes(tag);
    if (isSelected) {
      return { selectedTags: state.selectedTags.filter(t => t !== tag) };
    } else {
      return { selectedTags: [...state.selectedTags, tag] };
    }
  }),
  isReadOnly: false,
  setIsReadOnly: (isReadOnly) => set({ isReadOnly }),
}));
