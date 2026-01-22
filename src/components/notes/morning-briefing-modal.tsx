'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Coffee, TrendingUp, Clock, X } from 'lucide-react';
import { useNotesStore } from '@/store/notes';
import type { Note } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';

type MorningBriefingModalProps = {
    open: boolean;
    onClose: () => void;
};

export default function MorningBriefingModal({ open, onClose }: MorningBriefingModalProps) {
    const { notes } = useNotesStore();
    const router = useRouter();
    const [recentNotes, setRecentNotes] = useState<Note[]>([]);
    const [unvisitedNotes, setUnvisitedNotes] = useState<Note[]>([]);
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        if (!open) return;

        // Generate time-based greeting
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good Morning');
        else if (hour < 17) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');

        // Get 3 most recently updated notes
        const recent = notes
            .filter(n => !n.isDeleted)
            .sort((a, b) => {
                const aTime = a.updatedAt && typeof a.updatedAt === 'object' && 'seconds' in a.updatedAt
                    ? a.updatedAt.seconds
                    : 0;
                const bTime = b.updatedAt && typeof b.updatedAt === 'object' && 'seconds' in b.updatedAt
                    ? b.updatedAt.seconds
                    : 0;
                return bTime - aTime;
            })
            .slice(0, 3);

        setRecentNotes(recent);

        // Get notes not opened in a while (simulated with localStorage)
        const unvisited = notes
            .filter(n => {
                if (n.isDeleted) return false;
                const lastOpened = localStorage.getItem(`note-${n.id}-lastOpened`);
                if (!lastOpened) return true;
                const daysSince = (Date.now() - Number(lastOpened)) / (1000 * 60 * 60 * 24);
                return daysSince > 7;
            })
            .slice(0, 3);

        setUnvisitedNotes(unvisited);
    }, [open, notes]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-2xl glass-card p-8 rounded-2xl border border-white/10">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                    <X className="w-5 h-5 text-zinc-400" />
                </button>

                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <Coffee className="w-8 h-8 text-primary" />
                    <div>
                        <h2 className="text-2xl font-bold text-white">{greeting}!</h2>
                        <p className="text-sm text-zinc-400">Here's your daily briefing</p>
                    </div>
                </div>

                {/* Recent activity */}
                {recentNotes.length > 0 && (
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <TrendingUp className="w-4 h-4 text-primary" />
                            <h3 className="text-sm font-medium text-zinc-300">Recently Updated</h3>
                        </div>
                        <div className="space-y-2">
                            {recentNotes.map(note => (
                                <NotePreviewCard
                                    key={note.id}
                                    note={note}
                                    onClick={() => {
                                        router.push(`/?note=${note.id}`);
                                        localStorage.setItem(`note-${note.id}-lastOpened`, Date.now().toString());
                                        onClose();
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Unvisited notes */}
                {unvisitedNotes.length > 0 && (
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Clock className="w-4 h-4 text-amber-400" />
                            <h3 className="text-sm font-medium text-zinc-300">You Haven't Checked These</h3>
                        </div>
                        <div className="space-y-2">
                            {unvisitedNotes.map(note => (
                                <NotePreviewCard
                                    key={note.id}
                                    note={note}
                                    onClick={() => {
                                        router.push(`/?note=${note.id}`);
                                        localStorage.setItem(`note-${note.id}-lastOpened`, Date.now().toString());
                                        onClose();
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {recentNotes.length === 0 && unvisitedNotes.length === 0 && (
                    <div className="text-center py-8 text-zinc-500">
                        <p>No notes to show. Start creating!</p>
                    </div>
                )}
            </div>
        </div>
    );
}

// Note preview card component
function NotePreviewCard({ note, onClick }: { note: Note; onClick: () => void }) {
    const timestamp = note.updatedAt && typeof note.updatedAt === 'object' && 'seconds' in note.updatedAt
        ? new Date(note.updatedAt.seconds * 1000)
        : new Date();

    return (
        <div
            onClick={onClick}
            className="p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer 
                 transition-all border border-transparent hover:border-white/10"
        >
            <h4 className="text-sm font-medium text-zinc-200 mb-1">{note.title}</h4>
            {note.excerpt && (
                <p className="text-xs text-zinc-500 line-clamp-1 mb-2">{note.excerpt}</p>
            )}
            <div className="flex items-center justify-between">
                {note.tags && note.tags.length > 0 && (
                    <div className="flex gap-1">
                        {note.tags.slice(0, 2).map((tag, idx) => (
                            <span
                                key={idx}
                                className="px-1.5 py-0.5 bg-white/5 text-zinc-400 text-[10px] 
                           font-mono rounded"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
                <span className="text-xs text-zinc-600">
                    {formatDistanceToNow(timestamp, { addSuffix: true })}
                </span>
            </div>
        </div>
    );
}
