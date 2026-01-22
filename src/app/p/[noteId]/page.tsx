'use client';

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Note } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export default function PublicNotePage({ params }: { params: { noteId: string } }) {
    const [note, setNote] = useState<Note | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPublicNote = async () => {
            try {
                // We need to search across all users for this public note
                // For simplicity, we'll use a direct document path if we store userId in the note
                // Alternative: Use Firebase Storage or a separate public notes collection

                // For now, this is a simplified version - in production you'd need
                // a proper public notes index
                const noteRef = doc(db, `publicNotes/${params.noteId}`);
                const noteDoc = await getDoc(noteRef);

                if (!noteDoc.exists() || !noteDoc.data()?.isPublic) {
                    notFound();
                    return;
                }

                setNote({
                    id: noteDoc.id,
                    ...noteDoc.data()
                } as Note);
            } catch (error) {
                console.error('Error loading public note:', error);
                notFound();
            } finally {
                setLoading(false);
            }
        };

        loadPublicNote();
    }, [params.noteId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-dark">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    if (!note) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-background-dark">
            {/* Aether background with floating shapes */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
                <div className="floating-shape bg-primary/20 w-96 h-96 rounded-full blur-3xl" />
                <div className="floating-shape bg-pink-500/20 w-80 h-80 rounded-full blur-3xl" style={{ animationDelay: '2s' }} />
                <div className="floating-shape bg-cyan-500/20 w-72 h-72 rounded-full blur-3xl" style={{ animationDelay: '4s' }} />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
                <div className="glass-card p-8 md:p-12 rounded-2xl">
                    {/* Note title */}
                    <h1 className="text-4xl font-bold text-white mb-6">{note.title}</h1>

                    {/* Note metadata */}
                    <div className="flex flex-wrap gap-2 mb-8 pb-6 border-b border-white/10">
                        {note.tags && note.tags.length > 0 && (
                            <>
                                {note.tags.map((tag, idx) => (
                                    <span
                                        key={idx}
                                        className="px-3 py-1 bg-white/5 text-zinc-400 text-sm 
                               font-mono rounded-lg border border-white/10"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </>
                        )}
                    </div>

                    {/* Note content */}
                    <div
                        className="prose prose-invert prose-lg max-w-none
                       prose-headings:text-white prose-p:text-zinc-300
                       prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                       prose-strong:text-white prose-code:text-primary"
                        dangerouslySetInnerHTML={{
                            __html: note.contentHtml || `<p>${note.content}</p>`
                        }}
                    />

                    {/* Footer */}
                    <div className="mt-12 pt-6 border-t border-white/10 text-center">
                        <p className="text-sm text-zinc-500">
                            Powered by <span className="text-primary font-medium">Ethereal Notes</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
