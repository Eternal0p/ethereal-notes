'use client';

import Link from 'next/link';
import { Home, Star, Archive, Settings } from 'lucide-react';

export default function MobileBottomNav() {
    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-white/10">
            <div className="flex items-center justify-around h-16 px-4">
                <Link href="/" className="flex flex-col items-center gap-1 text-primary transition-colors">
                    <Home className="w-5 h-5" />
                    <span className="text-[10px] font-medium">Home</span>
                </Link>

                <Link href="/search" className="flex flex-col items-center gap-1 text-zinc-400 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span className="text-[10px] font-medium">Search</span>
                </Link>

                <Link href="/favorites" className="flex flex-col items-center gap-1 text-zinc-400 hover:text-white transition-colors">
                    <Star className="w-5 h-5" />
                    <span className="text-[10px] font-medium">Favorites</span>
                </Link>

                <Link href="/settings" className="flex flex-col items-center gap-1 text-zinc-400 hover:text-white transition-colors">
                    <Settings className="w-5 h-5" />
                    <span className="text-[10px] font-medium">Settings</span>
                </Link>
            </div>
        </nav>
    );
}
