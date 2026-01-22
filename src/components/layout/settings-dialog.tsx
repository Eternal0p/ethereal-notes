'use client';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useSettingsStore } from '@/store/settings';
import { useThemeStore } from '@/store/theme';
import type { User } from 'firebase/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type SettingsDialogProps = {
    user: User;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

const colors = [
    { name: 'Indigo', value: '#6366f1' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Green', value: '#22c55e' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Cyan', value: '#06b6d4' },
];

export default function SettingsDialog({ user, open, onOpenChange }: SettingsDialogProps) {
    const { defaultNoteColor, setDefaultNoteColor, gridLayout, setGridLayout } = useSettingsStore();
    const { theme, setTheme } = useThemeStore();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="border-white/10 bg-background/80 backdrop-blur-xl sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-zinc-100">Settings</DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        Customize your notes app experience
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* User Info */}
                    <div className="rounded-lg border border-white/5 bg-white/5 p-4">
                        <Label className="text-sm font-semibold text-zinc-400">Account</Label>
                        <div className="mt-3 flex items-center gap-3">
                            <Avatar className="h-12 w-12">
                                <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User'} />
                                <AvatarFallback>{user.displayName?.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium text-zinc-100">{user.displayName}</p>
                                <p className="text-sm text-zinc-400">{user.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Theme */}
                    <div className="space-y-3">
                        <Label className="text-sm font-semibold text-zinc-400">Theme</Label>
                        <div className="flex items-center justify-between rounded-lg border border-white/5 bg-white/5 p-4">
                            <div>
                                <p className="font-medium text-zinc-100">Dark Mode</p>
                                <p className="text-sm text-zinc-400">
                                    {theme === 'dark' ? 'Enabled' : 'Disabled'}
                                </p>
                            </div>
                            <Switch
                                checked={theme === 'dark'}
                                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                            />
                        </div>
                    </div>

                    {/* Default Note Color */}
                    <div className="space-y-3">
                        <Label className="text-sm font-semibold text-zinc-400">Default Note Color</Label>
                        <div className="flex gap-3">
                            {colors.map((color) => (
                                <button
                                    key={color.value}
                                    onClick={() => setDefaultNoteColor(color.value)}
                                    className={`h-10 w-10 rounded-full border-2 transition-all ${defaultNoteColor === color.value
                                        ? 'border-white scale-110'
                                        : 'border-transparent hover:scale-105'
                                        }`}
                                    title={color.name}
                                >
                                    <div
                                        className="h-full w-full rounded-full"
                                        style={{ backgroundColor: color.value }}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Grid Layout */}
                    <div className="space-y-3">
                        <Label className="text-sm font-semibold text-zinc-400">Note Layout</Label>
                        <RadioGroup value={gridLayout} onValueChange={(value) => setGridLayout(value as 'grid' | 'masonry')}>
                            <div className="flex items-center space-x-2 rounded-lg border border-white/5 bg-white/5 p-4">
                                <RadioGroupItem value="grid" id="grid" />
                                <Label htmlFor="grid" className="flex-1 cursor-pointer">
                                    <p className="font-medium text-zinc-100">Grid Layout</p>
                                    <p className="text-sm text-zinc-400">
                                        Custom note sizes with colSpan/rowSpan
                                    </p>
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2 rounded-lg border border-white/5 bg-white/5 p-4">
                                <RadioGroupItem value="masonry" id="masonry" />
                                <Label htmlFor="masonry" className="flex-1 cursor-pointer">
                                    <p className="font-medium text-zinc-100">Masonry Layout</p>
                                    <p className="text-sm text-zinc-400">
                                        Auto-flowing columns (classic view)
                                    </p>
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
