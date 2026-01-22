'use client';

import { Maximize2, Minimize2 } from 'lucide-react';
import { useZenModeStore } from '@/store/zen-mode';

export default function ZenModeToggle() {
    const { isZenMode, toggleZenMode } = useZenModeStore();

    return (
        <button
            onClick={toggleZenMode}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors text-zinc-400 hover:text-white"
            title={isZenMode ? 'Exit Zen Mode' : 'Enter Zen Mode'}
        >
            {isZenMode ? (
                <Minimize2 className="w-5 h-5" />
            ) : (
                <Maximize2 className="w-5 h-5" />
            )}
        </button>
    );
}
