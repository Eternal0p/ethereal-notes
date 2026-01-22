'use client';

import { useEffect, useState } from 'react';
import { Link } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { Note } from '@/lib/types';
import { getBacklinks, getLinkContext } from '@/lib/firebase-utils';
import { auth } from '@/lib/firebase';
import { formatDistanceToNow } from 'date-fns';

type BacklinksPanelProps = {
    noteId: string;
};

export default function BacklinksPanel({ noteId }: BacklinksPanelProps) {
    const [backlinks, setBacklinks] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const user = auth.currentUser;

    useEffect(() => {
        if (!user || !noteId) return;

        const loadBacklinks = async () => {
            try {
                const links = await getBacklinks(user.uid, noteId);
                setBacklinks(links);
            } catch (error) {
                console.error('Error loading backlinks:', error);
            } finally {
                setLoading(false);
            }
        };

        loadBacklinks();
    }, [noteId, user]);

    if (loading) {
        return (
            <div className="mt-8 pt-8 border-t border-white/10">
                <div className="flex items-center gap-2 text-zinc-500 text-sm">
                    <Link className="w-4 h-4 animate-pulse" />
                    <span>Loading linked notes...</span>
                </div>
            </div>
        );
    }

    if (backlinks.length === 0) {
        return null;
    }

    return (
        <div className="mt-8 pt-8 border-t border-white/10">
            <div className="flex items-center gap-2 mb-4">
                <Link className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-medium text-zinc-400">
                    Linked Here ({backlinks.length})
                </h3>
            </div>

            <div className="space-y-3">
                {backlinks.map((note) => {
                    const timestamp = note.updatedAt && typeof note.updatedAt === 'object' && 'seconds' in note.updatedAt
                        ? new Date(note.updatedAt.seconds * 1000)
                        : new Date();

                    return (
                        <div
                            key={note.id}
                            className="glass-card p-4 rounded-xl cursor-pointer group
                         hover:bg-white/5 transition-all"
                            onClick={() => router.push(`/?note=${note.id}`)}
                        >
                            {/* Note title */}
                            <div className="flex items-start justify-between gap-3">
                                <h4 className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">
                                    {note.title}
                                </h4>
                                <span className="text-xs text-zinc-600 font-mono whitespace-nowrap">
                                    {formatDistanceToNow(timestamp, { addSuffix: true })}
                                </span>
                            </div>

                            {/* Excerpt */}
                            {note.excerpt && (
                                <p className="text-xs text-zinc-500 mt-2 line-clamp-2">
                                    {note.excerpt}
                                </p>
                            )}

                            {/* Tags */}
                            {note.tags && note.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                    {note.tags.slice(0, 3).map((tag, idx) => (
                                        <span
                                            key={idx}
                                            className="px-2 py-0.5 bg-white/5 text-zinc-400 text-[10px] 
                                 font-mono rounded-md"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                    {note.tags.length > 3 && (
                                        <span className="text-xs text-zinc-600">
                                            +{note.tags.length - 3}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
