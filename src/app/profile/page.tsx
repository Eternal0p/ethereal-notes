'use client';

import { useNotesStore } from '@/store/notes';
import { useAuth } from '@/hooks/use-auth';
import AetherBackground from '@/components/layout/aether-background';
import { motion } from 'framer-motion';
import { Mail, Calendar, Hash, FileText, Star, Shield } from 'lucide-react';
import Sidebar from '@/components/layout/sidebar';

export default function ProfilePage() {
    const { user } = useAuth();
    const { notes } = useNotesStore();

    if (!user) return null;

    // Calculate stats
    const totalNotes = notes.length;
    const favoriteCount = notes.filter((n: any) => n.isFavorite).length;
    const uniqueTags = new Set<string>();
    notes.forEach(note => note.tags?.forEach(tag => uniqueTags.add(tag)));

    const joinDate = new Date(user.metadata.creationTime || Date.now()).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
    });

    return (
        <div className="flex h-screen w-full bg-black text-white overflow-hidden">
            {/* Background (Consistent with dashboard) */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <AetherBackground />
            </div>

            <Sidebar user={user} />

            <main className="flex-1 relative z-10 overflow-y-auto p-4 md:p-8">
                <div className="max-w-2xl mx-auto space-y-8">

                    <header className="mb-8">
                        <h1 className="text-3xl font-bold mb-2">My Profile</h1>
                        <p className="text-zinc-400">Manage your account and preferences</p>
                    </header>

                    {/* Profile Card */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="glass-panel rounded-2xl p-8 relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-primary/20 to-purple-600/20 z-0"></div>

                        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-6 pt-12">
                            <div className="w-24 h-24 rounded-full border-4 border-black bg-zinc-800 items-center justify-center flex text-3xl font-bold shadow-xl">
                                {user.photoURL ? (
                                    <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    (user.displayName || 'U').charAt(0).toUpperCase()
                                )}
                            </div>
                            <div className="text-center md:text-left flex-1 mb-2">
                                <h2 className="text-2xl font-bold">{user.displayName || 'Anonymous User'}</h2>
                                <div className="flex items-center justify-center md:justify-start gap-2 text-zinc-400 mt-1">
                                    <Mail className="w-4 h-4" />
                                    <span>{user.email}</span>
                                </div>
                            </div>
                            <div className="mb-2">
                                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
                                    Free Plan
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="glass-card p-4 rounded-xl text-center">
                            <div className="w-10 h-10 mx-auto bg-zinc-800/50 rounded-full flex items-center justify-center mb-3">
                                <FileText className="w-5 h-5 text-blue-400" />
                            </div>
                            <div className="text-2xl font-bold">{totalNotes}</div>
                            <div className="text-xs text-zinc-500 uppercase tracking-wider">Total Notes</div>
                        </div>
                        <div className="glass-card p-4 rounded-xl text-center">
                            <div className="w-10 h-10 mx-auto bg-zinc-800/50 rounded-full flex items-center justify-center mb-3">
                                <Star className="w-5 h-5 text-yellow-400" />
                            </div>
                            <div className="text-2xl font-bold">{favoriteCount}</div>
                            <div className="text-xs text-zinc-500 uppercase tracking-wider">Favorites</div>
                        </div>
                        <div className="glass-card p-4 rounded-xl text-center">
                            <div className="w-10 h-10 mx-auto bg-zinc-800/50 rounded-full flex items-center justify-center mb-3">
                                <Hash className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div className="text-2xl font-bold">{uniqueTags.size}</div>
                            <div className="text-xs text-zinc-500 uppercase tracking-wider">Unique Tags</div>
                        </div>
                        <div className="glass-card p-4 rounded-xl text-center">
                            <div className="w-10 h-10 mx-auto bg-zinc-800/50 rounded-full flex items-center justify-center mb-3">
                                <Calendar className="w-5 h-5 text-purple-400" />
                            </div>
                            <div className="text-sm font-medium mt-1">{joinDate}</div>
                            <div className="text-xs text-zinc-500 uppercase tracking-wider mt-1">Member Since</div>
                        </div>
                    </div>

                    {/* Account Details */}
                    <div className="glass-card rounded-xl p-6 space-y-6">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Shield className="w-5 h-5 text-zinc-400" />
                            Account Security
                        </h3>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-3 border-b border-white/5">
                                <div>
                                    <div className="font-medium">UserId</div>
                                    <div className="text-xs text-zinc-500 font-mono mt-1">{user.uid}</div>
                                </div>
                                <button
                                    className="text-xs text-primary hover:underline cursor-pointer"
                                    onClick={() => navigator.clipboard.writeText(user.uid)}
                                >
                                    Copy
                                </button>
                            </div>

                            <div className="flex justify-between items-center py-3 border-b border-white/5">
                                <div>
                                    <div className="font-medium">Provider</div>
                                    <div className="text-sm text-zinc-400">Google Authentication</div>
                                </div>
                                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                            </div>

                            <div className="flex justify-between items-center py-3">
                                <div>
                                    <div className="font-medium">Data Export</div>
                                    <div className="text-sm text-zinc-400">Download all your notes as JSON</div>
                                </div>
                                <button className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sm font-medium transition-colors border border-white/5">
                                    Request Export
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
