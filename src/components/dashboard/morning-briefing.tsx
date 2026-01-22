'use client';

import { useEffect, useState } from 'react';
import type { Note } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sparkles, TrendingUp, Star, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

type MorningBriefingProps = {
    notes: Note[];
    userName: string;
};

export default function MorningBriefing({ notes, userName }: MorningBriefingProps) {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Check if we should show the briefing
        const lastShown = localStorage.getItem('morningBriefing LastShown');
        const today = new Date().toDateString();

        if (lastShown !== today && notes.length > 0) {
            setIsOpen(true);
        }
    }, [notes]);

    const handleClose = () => {
        // Mark as shown for today
        const today = new Date().toDateString();
        localStorage.setItem('morningBriefingLastShown', today);
        setIsOpen(false);
    };

    // Calculate stats
    const totalNotes = notes.length;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const notesToday = notes.filter(note => {
        const updatedAt = note.updatedAt instanceof Object && 'seconds' in note.updatedAt
            ? new Date(note.updatedAt.seconds * 1000)
            : new Date();
        return updatedAt >= today;
    });

    const recentNotes = notes
        .sort((a, b) => {
            const aTime = a.updatedAt instanceof Object && 'seconds' in a.updatedAt ? a.updatedAt.seconds : 0;
            const bTime = b.updatedAt instanceof Object && 'seconds' in b.updatedAt ? b.updatedAt.seconds : 0;
            return bTime - aTime;
        })
        .slice(0, 3);

    // Find notes to revisit (not edited in 7+ days, with multiple tags)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const suggestedNotes = notes
        .filter(note => {
            const updatedAt = note.updatedAt instanceof Object && 'seconds' in note.updatedAt
                ? new Date(note.updatedAt.seconds * 1000)
                : new Date();
            return updatedAt < sevenDaysAgo && note.tags && note.tags.length > 1;
        })
        .slice(0, 2);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="glass-panel border-white/10 max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-primary" />
                        {getGreeting()}, {userName.split(' ')[0] || 'there'}!
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                    {/* Stats Section */}
                    <div className="grid grid-cols-2 gap-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="glass-card rounded-xl p-4"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                                    <TrendingUp className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-xs text-zinc-500">Total Notes</p>
                                    <p className="text-2xl font-bold text-white">{totalNotes}</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="glass-card rounded-xl p-4"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                                    <Clock className="w-5 h-5 text-green-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-zinc-500">Edited Today</p>
                                    <p className="text-2xl font-bold text-white">{notesToday.length}</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Recent Activity */}
                    {recentNotes.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                <Star className="w-5 h-5 text-yellow-500" />
                                Recent Activity
                            </h3>
                            <div className="space-y-2">
                                {recentNotes.map((note, index) => (
                                    <div
                                        key={note.id}
                                        className="glass-card rounded-lg p-3 hover:bg-white/5 transition-colors cursor-pointer"
                                    >
                                        <p className="text-sm font-medium text-white line-clamp-1">{note.title}</p>
                                        {note.excerpt && (
                                            <p className="text-xs text-zinc-500 mt-1 line-clamp-1">{note.excerpt}</p>
                                        )}
                                        {note.tags && note.tags.length > 0 && (
                                            <div className="flex gap-1 mt-2">
                                                {note.tags.slice(0, 3).map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-700/50 text-zinc-400"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Suggested to Revisit */}
                    {suggestedNotes.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-primary" />
                                Suggested to Revisit
                            </h3>
                            <div className="space-y-2">
                                {suggestedNotes.map((note) => (
                                    <div
                                        key={note.id}
                                        className="glass-card rounded-lg p-3 hover:bg-white/5 transition-colors cursor-pointer border border-primary/20"
                                    >
                                        <p className="text-sm font-medium text-white line-clamp-1">{note.title}</p>
                                        {note.excerpt && (
                                            <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{note.excerpt}</p>
                                        )}
                                        <p className="text-[10px] text-zinc-600 mt-2">
                                            Not edited in 7+ days
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* CTA */}
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        onClick={handleClose}
                        className="w-full glass-pill-button py-3 rounded-xl text-white font-medium transition-all hover:scale-[1.02] active:scale-95"
                    >
                        Start Creating
                    </motion.button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
