'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { ArrowLeft, Star } from 'lucide-react';
import { useNotesStore } from '@/store/notes';
import NoteCard from '@/components/notes/note-card';
import AetherBackground from '@/components/layout/aether-background';

export default function FavoritesPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const notes = useNotesStore((state) => state.notes);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                router.push('/');
            }
        });
        return () => unsubscribe();
    }, [router]);

    // For now, show all notes. Later we can add a 'favorite' field to notes
    const favoriteNotes = notes;

    if (!user) return null;

    return (
        <>
            <AetherBackground />

            <div className="relative z-10 min-h-screen p-4 md:p-8 pb-28 md:pb-8">
                {/* Header */}
                <div className="max-w-5xl mx-auto mb-8">
                    <button
                        onClick={() => router.back()}
                        className="mb-4 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back</span>
                    </button>

                    <div className="flex items-center gap-3 mb-2">
                        <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
                        <h1 className="text-white text-3xl md:text-4xl font-bold">Favorites</h1>
                    </div>
                    <p className="text-zinc-400">Your starred notes</p>
                </div>

                {/* Notes Grid */}
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
            </div>
        </>
    );
}
