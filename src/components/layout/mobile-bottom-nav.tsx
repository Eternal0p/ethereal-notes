'use client';

import Link from 'next/link';
import { Home, Search, Star, Settings, Plus } from 'lucide-react';
import { useNotesStore } from '@/store/notes';
import { usePathname } from 'next/navigation';

export default function MobileBottomNav() {
    const { setIsEditorOpen, setCurrentNote } = useNotesStore();
    const pathname = usePathname();

    const handleNewNote = () => {
        setCurrentNote(null);
        setIsEditorOpen(true);
    };

    const isActive = (path: string) => pathname === path;

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-white/10">
            <div className="flex items-center justify-around h-16 px-4">
                <Link
                    href="/"
                    className={`flex flex-col items-center gap-1 transition-colors ${isActive('/') ? 'text-primary' : 'text-zinc-400 hover:text-white'
                        }`}
                >
                    <Home className="w-5 h-5" />
                    <span className="text-[10px] font-medium">Home</span>
                </Link>

                <Link
                    href="/search"
                    className={`flex flex-col items-center gap-1 transition-colors ${isActive('/search') ? 'text-primary' : 'text-zinc-400 hover:text-white'
                        }`}
                >
                    <Search className="w-5 h-5" />
                    <span className="text-[10px] font-medium">Search</span>
                </Link>

                <button
                    onClick={handleNewNote}
                    className="flex flex-col items-center gap-1 text-zinc-400 hover:text-white transition-colors -mt-2"
                >
                    <div className="bg-primary rounded-full p-3 shadow-glow">
                        <Plus className="w-6 h-6 text-white" />
                    </div>
                </button>

                <Link
                    href="/favorites"
                    className={`flex flex-col items-center gap-1 transition-colors ${isActive('/favorites') ? 'text-primary' : 'text-zinc-400 hover:text-white'
                        }`}
                >
                    <Star className="w-5 h-5" />
                    <span className="text-[10px] font-medium">Favorites</span>
                </Link>

                <Link
                    href="/settings"
                    className={`flex flex-col items-center gap-1 transition-colors ${isActive('/settings') ? 'text-primary' : 'text-zinc-400 hover:text-white'
                        }`}
                >
                    <Settings className="w-5 h-5" />
                    <span className="text-[10px] font-medium">Settings</span>
                </Link>
            </div>
        </nav>
    );
}
