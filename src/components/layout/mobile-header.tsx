'use client';

import Image from 'next/image';
import { Menu } from 'lucide-react';
import type { User } from 'firebase/auth';

type MobileHeaderProps = {
    user: User;
    onMenuClick?: () => void;
};

export default function MobileHeader({ user, onMenuClick }: MobileHeaderProps) {
    return (
        <div className="md:hidden flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10">
                    {user.photoURL ? (
                        <Image
                            src={user.photoURL}
                            alt="User Avatar"
                            width={32}
                            height={32}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-primary flex items-center justify-center text-white text-sm font-bold">
                            {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                        </div>
                    )}
                </div>
                <span className="text-white font-bold text-lg tracking-tight">Ethereal</span>
            </div>
            <button
                onClick={onMenuClick}
                className="text-white p-2 glass-panel rounded-lg hover:bg-white/5 transition-colors"
            >
                <Menu className="w-5 h-5" />
            </button>
        </div>
    );
}
