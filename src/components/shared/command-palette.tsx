'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import {
    Home,
    Plus,
    Search,
    Moon,
    Sun,
    Settings,
    Tags,
    Star,
    X
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useNotesStore } from '@/store/notes';

type CommandPaletteProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export default function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
    const router = useRouter();
    const { theme, setTheme } = useTheme();
    const { setIsEditorOpen } = useNotesStore();
    const [search, setSearch] = useState('');

    // Close on Escape
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onOpenChange(false);
            }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, [onOpenChange]);

    const handleCommand = (command: string) => {
        onOpenChange(false);

        switch (command) {
            case 'home':
                router.push('/');
                break;
            case 'new-note':
                setIsEditorOpen(true);
                break;
            case 'search':
                router.push('/search');
                break;
            case 'favorites':
                router.push('/favorites');
                break;
            case 'tags':
                router.push('/tags');
                break;
            case 'settings':
                router.push('/settings');
                break;
            case 'toggle-theme':
                setTheme(theme === 'dark' ? 'light' : 'dark');
                break;
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => onOpenChange(false)}
            />

            {/* Command Palette */}
            <Command
                className="relative w-full max-w-2xl mx-4 rounded-2xl border border-white/10 
                   bg-gradient-to-br from-zinc-900/95 to-zinc-950/95 
                   backdrop-blur-2xl shadow-2xl overflow-hidden"
                value={search}
                onValueChange={setSearch}
            >
                <div className="flex items-center border-b border-white/10 px-4">
                    <Search className="w-5 h-5 text-zinc-400 mr-3" />
                    <Command.Input
                        placeholder="Type a command or search..."
                        className="flex-1 bg-transparent border-0 py-4 text-zinc-100 placeholder:text-zinc-500 
                       focus:outline-none text-base"
                    />
                    <button
                        onClick={() => onOpenChange(false)}
                        className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                    >
                        <X className="w-4 h-4 text-zinc-400" />
                    </button>
                </div>

                <Command.List className="max-h-[400px] overflow-y-auto p-2">
                    <Command.Empty className="py-8 text-center text-zinc-500 text-sm">
                        No results found.
                    </Command.Empty>

                    <Command.Group heading="Navigation" className="text-zinc-400 text-xs font-medium px-3 py-2">
                        <CommandItem
                            onSelect={() => handleCommand('home')}
                            icon={<Home className="w-4 h-4" />}
                            label="Go to Home"
                            shortcut="⌘H"
                        />
                        <CommandItem
                            onSelect={() => handleCommand('search')}
                            icon={<Search className="w-4 h-4" />}
                            label="Search Notes"
                            shortcut="⌘S"
                        />
                        <CommandItem
                            onSelect={() => handleCommand('favorites')}
                            icon={<Star className="w-4 h-4" />}
                            label="Favorites"
                            shortcut="⌘F"
                        />
                        <CommandItem
                            onSelect={() => handleCommand('tags')}
                            icon={<Tags className="w-4 h-4" />}
                            label="Tag Dashboard"
                        />
                        <CommandItem
                            onSelect={() => handleCommand('settings')}
                            icon={<Settings className="w-4 h-4" />}
                            label="Settings"
                        />
                    </Command.Group>

                    <Command.Separator className="h-px bg-white/10 my-2" />

                    <Command.Group heading="Actions" className="text-zinc-400 text-xs font-medium px-3 py-2">
                        <CommandItem
                            onSelect={() => handleCommand('new-note')}
                            icon={<Plus className="w-4 h-4" />}
                            label="Create New Note"
                            shortcut="⌘N"
                        />
                        <CommandItem
                            onSelect={() => handleCommand('toggle-theme')}
                            icon={theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                            label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
                            shortcut="⌘T"
                        />
                    </Command.Group>
                </Command.List>
            </Command>
        </div>
    );
}

// Command Item Component
type CommandItemProps = {
    onSelect: () => void;
    icon: React.ReactNode;
    label: string;
    shortcut?: string;
};

function CommandItem({ onSelect, icon, label, shortcut }: CommandItemProps) {
    return (
        <Command.Item
            onSelect={onSelect}
            className="flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer
                 text-zinc-300 hover:bg-white/5 hover:text-white
                 transition-colors aria-selected:bg-primary/10 aria-selected:text-primary"
        >
            <div className="text-zinc-400">{icon}</div>
            <span className="flex-1 text-sm font-medium">{label}</span>
            {shortcut && (
                <span className="text-xs text-zinc-500 font-mono bg-zinc-800/50 px-2 py-1 rounded">
                    {shortcut}
                </span>
            )}
        </Command.Item>
    );
}
