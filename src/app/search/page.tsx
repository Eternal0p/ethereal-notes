'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { ArrowLeft, Search as SearchIcon } from 'lucide-react';
import { useNotesStore } from '@/store/notes';
import NoteCard from '@/components/notes/note-card';
import AetherBackground from '@/components/layout/aether-background';

export default function SearchPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
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

    const filteredNotes = notes.filter(note => {
        const query = searchQuery.toLowerCase();
        return (
            note.title.toLowerCase().includes(query) ||
            note.content.toLowerCase().includes(query) ||
            note.tags?.some(tag => tag.toLowerCase().includes(query))
        );
    });

    if (!user) return null;

    return (
        <>
            <AetherBackground />

            <div className="relative z-10 min-h-screen p-4 md:p-8">
                {/* Header */}
                <div className="max-w-5xl mx-auto mb-8">
                    <button
                        onClick={() => router.back()}
                        className="mb-4 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back</span>
                    </button>

                    <h1 className="text-white text-3xl md:text-4xl font-bold mb-6">Search Notes</h1>

                    {/* Search Input */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <SearchIcon className="w-5 h-5 text-zinc-500 group-focus-within:text-primary transition-colors" />
                        </div>
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full rounded-xl border-none bg-zinc-800/40 py-4 pl-12 pr-4 text-lg text-zinc-200 placeholder-zinc-500 focus:ring-2 focus:ring-primary/50 focus:bg-zinc-800/60 transition-all backdrop-blur-md shadow-inner"
                            placeholder="Search by title, content, or tags..."
                            type="text"
                            autoFocus
                        />
                    </div>
                </div>

                {/* Results */}
                <div className="max-w-5xl mx-auto">
                    {searchQuery && (
                        <p className="text-zinc-400 mb-4">
                            Found {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'}
                        </p>
                    )}

                    <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
                        {searchQuery ? (
                            filteredNotes.length > 0 ? (
                                filteredNotes.map((note) => <NoteCard key={note.id} note={note} />)
                            ) : (
                                <div className="col-span-full text-center py-12">
                                    <p className="text-zinc-500 text-lg">No notes found</p>
                                </div>
                            )
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <p className="text-zinc-500 text-lg">Start typing to search...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
