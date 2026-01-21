'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { ArrowLeft, Moon, Sun, LogOut } from 'lucide-react';
import { useThemeStore } from '@/store/theme';
import AetherBackground from '@/components/layout/aether-background';

export default function SettingsPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const { theme, toggleTheme } = useThemeStore();

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

    const handleSignOut = async () => {
        await auth.signOut();
        router.push('/');
    };

    if (!user) return null;

    return (
        <>
            <AetherBackground />

            <div className="relative z-10 min-h-screen p-4 md:p-8 pb-28 md:pb-8">
                {/* Header */}
                <div className="max-w-3xl mx-auto mb-8">
                    <button
                        onClick={() => router.back()}
                        className="mb-4 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back</span>
                    </button>

                    <h1 className="text-white text-3xl md:text-4xl font-bold mb-2">Settings</h1>
                    <p className="text-zinc-400">Customize your experience</p>
                </div>

                {/* Settings Sections */}
                <div className="max-w-3xl mx-auto space-y-6">
                    {/* Appearance */}
                    <div className="glass-card rounded-2xl p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Appearance</h2>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {theme === 'dark' ? (
                                    <Moon className="w-5 h-5 text-zinc-400" />
                                ) : (
                                    <Sun className="w-5 h-5 text-zinc-400" />
                                )}
                                <div>
                                    <p className="text-white font-medium">Theme</p>
                                    <p className="text-sm text-zinc-500">
                                        {theme === 'dark' ? 'Dark mode' : 'Light mode'}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={toggleTheme}
                                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${theme === 'dark' ? 'bg-primary' : 'bg-zinc-600'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-7' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>
                    </div>

                    {/* Account */}
                    <div className="glass-card rounded-2xl p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Account</h2>

                        <div className="flex items-center gap-4 mb-4">
                            {user.photoURL && (
                                <img
                                    src={user.photoURL}
                                    alt="Profile"
                                    className="w-16 h-16 rounded-full"
                                />
                            )}
                            <div>
                                <p className="text-white font-medium">{user.displayName || 'User'}</p>
                                <p className="text-sm text-zinc-500">{user.email}</p>
                            </div>
                        </div>

                        <button
                            onClick={handleSignOut}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                        </button>
                    </div>

                    {/* About */}
                    <div className="glass-card rounded-2xl p-6">
                        <h2 className="text-xl font-bold text-white mb-4">About</h2>
                        <p className="text-zinc-400">Ethereal Notes</p>
                        <p className="text-sm text-zinc-500 mt-1">Version 1.0.0</p>
                    </div>
                </div>
            </div>
        </>
    );
}
