'use client';

import { Home, Search, Star, Settings } from 'lucide-react';
import { useNotesStore } from '@/store/notes';

export default function MobileBottomNav() {
    const { setIsEditorOpen, setCurrentNote } = useNotesStore();

    const handleNewNote = () => {
        setCurrentNote(null);
        setIsEditorOpen(true);
    };

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-white/10">
            <div className="flex items-center justify-around h-16 px-4">
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="flex flex-col items-center gap-1 text-primary transition-colors"
                >
                    <Home className="w-5 h-5" />
                    <span className="text-[10px] font-medium">Home</span>
                </button>

                <button
                    onClick={() => document.querySelector('input[type="text"]')?.focus()}
                    className="flex flex-col items-center gap-1 text-zinc-400 hover:text-white transition-colors"
                >
                    <Search className="w-5 h-5" />
                    <span className="text-[10px] font-medium">Search</span>
                </button>

                <button
                    onClick={handleNewNote}
                    className="flex flex-col items-center gap-1 text-zinc-400 hover:text-white transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="text-[10px] font-medium">New Note</span>
                </button>

                <button
                    className="flex flex-col items-center gap-1 text-zinc-400 hover:text-white transition-colors"
                    title="Coming soon"
                >
                    <Star className="w-5 h-5" />
                    <span className="text-[10px] font-medium">Favorites</span>
                </button>

                <button
                    className="flex flex-col items-center gap-1 text-zinc-400 hover:text-white transition-colors"
                    title="Coming soon"
                >
                    <Settings className="w-5 h-5" />
                    <span className="text-[10px] font-medium">Settings</span>
                </button>
            </div>
        </nav>
    );
}
