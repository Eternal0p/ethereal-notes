import { create } from 'zustand';

export type Theme = 'dark' | 'light';
export type GridLayout = 'grid' | 'masonry';

type SettingsState = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    defaultNoteColor: string;
    setDefaultNoteColor: (color: string) => void;
    gridLayout: GridLayout;
    setGridLayout: (layout: GridLayout) => void;
};

export const useSettingsStore = create<SettingsState>((set) => ({
    theme: 'dark',
    setTheme: (theme) => set({ theme }),
    defaultNoteColor: '#6366f1',
    setDefaultNoteColor: (color) => set({ defaultNoteColor: color }),
    gridLayout: 'grid',
    setGridLayout: (layout) => set({ gridLayout: layout }),
}));
