'use client';

import { useAuth } from '@/hooks/use-auth';
import { useNotesStore } from '@/store/notes';
import { Star } from 'lucide-react';
import NoteCard from '@/components/notes/note-card';
import AetherBackground from '@/components/layout/aether-background';
import Sidebar from '@/components/layout/sidebar';

export default function FavoritesPage() {
    const { user } = useAuth();
    const notes = useNotesStore((state) => state.notes);

    if (!user) return null;

    const favoriteNotes = notes.filter((n: any) => n.isFavorite);

    return (
        <div className="flex h-screen w-full bg-black text-white overflow-hidden">
            <div className="fixed inset-0 z-0 pointer-events-none">
                <AetherBackground />
            </div>

            <Sidebar user={user} />

            <main className="flex-1 relative z-10 overflow-y-auto p-4 md:p-8 pb-28 md:pb-8">
                <div className="max-w-5xl mx-auto mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
                        <h1 className="text-3xl md:text-4xl font-bold">Favorites</h1>
                    </div>
                    <p className="text-zinc-400">Your starred notes</p>
                </div>

                <div className="max-w-5xl mx-auto">
                    {favoriteNotes.length > 0 ? (
                        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
                            {favoriteNotes.map((note) => (
                                <NoteCard key={note.id} note={note} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Star className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-zinc-300 mb-2">No favorites yet</h2>
                            <p className="text-zinc-500">Star notes to see them here</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
