'use client';

import { auth } from '@/lib/firebase';
import Image from 'next/image';
import Link from 'next/link';
import {
    Home,
    Star,
    Archive,
    Settings,
    Search,
    LogOut,
} from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import type { User } from 'firebase/auth';
import { useState } from 'react';
import SettingsDialog from './settings-dialog';
import { X } from 'lucide-react';

type MobileSidebarProps = {
    isOpen: boolean;
    onClose: () => void;
    user: User;
};

export function MobileSidebar({ isOpen, onClose, user }: MobileSidebarProps) {
    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="md:hidden fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Sidebar */}
            <aside className={`md:hidden fixed left-0 top-0 bottom-0 w-72 glass-panel z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <div className="h-full flex flex-col p-6">
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="self-end mb-4 w-10 h-10 flex items-center justify-center rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* User Profile */}
                    <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/10">
                        {user.photoURL && (
                            <Image
                                src={user.photoURL}
                                alt="Profile"
                                width={48}
                                height={48}
                                className="rounded-full"
                            />
                        )}
                        <div>
                            <p className="text-white font-semibold">{user.displayName || 'User'}</p>
                            <p className="text-sm text-zinc-400">{user.email}</p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-2">
                        <Link
                            href="/"
                            onClick={onClose}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-300 hover:text-white hover:bg-white/5 transition-all"
                        >
                            <Home className="w-5 h-5" />
                            <span>Home</span>
                        </Link>

                        <Link
                            href="/search"
                            onClick={onClose}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-300 hover:text-white hover:bg-white/5 transition-all"
                        >
                            <Search className="w-5 h-5" />
                            <span>Search</span>
                        </Link>

                        <Link
                            href="/favorites"
                            onClick={onClose}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-300 hover:text-white hover:bg-white/5 transition-all"
                        >
                            <Star className="w-5 h-5" />
                            <span>Favorites</span>
                        </Link>

                        <Link
                            href="/settings"
                            onClick={onClose}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-300 hover:text-white hover:bg-white/5 transition-all"
                        >
                            <Settings className="w-5 h-5" />
                            <span>Settings</span>
                        </Link>
                    </nav>

                    {/* Sign Out */}
                    <button
                        onClick={() => auth.signOut()}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
