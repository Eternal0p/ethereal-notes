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
import { directSearchNotes, fuzzySearchNotes } from '@/lib/search-utils';

export default function SearchPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [useFuzzy, setUseFuzzy] = useState(true); // Fuzzy by default
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

    // Filter out deleted notes
    const activeNotes = notes.filter(n => !n.isDeleted);

    // Use fuzzy or direct search based on toggle
    const searchResults = useFuzzy
        ? fuzzySearchNotes(activeNotes, searchQuery)
        : directSearchNotes(activeNotes, searchQuery);

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

                    <h1 className="text-white text-3xl md:text-4xl font-bold mb-2">Search Notes</h1>

                    {/* Search Mode Toggle */}
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-sm text-zinc-500">Search Mode:</span>
                        <button
                            onClick={() => setUseFuzzy(!useFuzzy)}
                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${useFuzzy
                                ? 'bg-primary/20 text-primary border border-primary/50'
                                : 'bg-zinc-800/40 text-zinc-400 border border-white/10'
                                }`}
                        >
                            {useFuzzy ? '🔮 Smart Search' : '🔍 Exact Match'}
                        </button>
                        <span className="text-xs text-zinc-600">
                            {useFuzzy ? 'Finds related content' : 'Exact text matching'}
                        </span>
                    </div>

                    {/* Search Input */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <SearchIcon className="w-5 h-5 text-zinc-500 group-focus-within:text-primary transition-colors" />
                        </div>
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full rounded-xl border-none bg-zinc-800/40 py-4 pl-12 pr-4 text-lg text-zinc-200 placeholder-zinc-500 focus:ring-2 focus:ring-primary/50 focus:bg-zinc-800/60 transition-all backdrop-blur-md shadow-inner"
                            placeholder="Search by title, content, tags, or keywords..."
                            type="text"
                            autoFocus
                        />
                    </div>
                </div>

                {/* Results */}
                <div className="max-w-5xl mx-auto">
                    {searchQuery && (
                        <>
                            {searchResults.length > 0 ? (
                                <>
                                    <div className="flex items-center justify-between mb-4">
                                        <p className="text-zinc-400">
                                            Found {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'}
                                        </p>
                                        <span className="text-xs text-zinc-600">
                                            {useFuzzy ? '(Smart Search)' : '(Exact Match)'}
                                        </span>
                                    </div>
                                    <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
                                        {searchResults.map((note) => <NoteCard key={note.id} note={note} />)}
                                    </div>
                                </>
                            ) : (
                                <div className="col-span-full text-center py-12">
                                    <p className="text-zinc-500 text-lg">No notes found</p>
                                    <p className="text-zinc-600 text-sm mt-2">
                                        {useFuzzy
                                            ? 'Try using exact match or different keywords'
                                            : 'Try using smart search for related content'
                                        }
                                    </p>
                                </div>
                            )}
                        </>
                    )}

                    {!searchQuery && (
                        <div className="col-span-full text-center py-12">
                            <p className="text-zinc-500 text-lg">Start typing to search...</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
