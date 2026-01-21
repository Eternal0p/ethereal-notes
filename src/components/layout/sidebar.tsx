'use client';

import { auth } from '@/lib/firebase';
import Image from 'next/image';
import {
  Home,
  Star,
  Archive,
  Settings,
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

type SidebarProps = {
  user: User;
};

const TAG_COLORS = [
  { bg: 'bg-red-400/80', shadow: 'shadow-[0_0_8px_rgba(248,113,113,0.4)]' },
  { bg: 'bg-blue-400/80', shadow: 'shadow-[0_0_8px_rgba(96,165,250,0.4)]' },
  { bg: 'bg-emerald-400/80', shadow: 'shadow-[0_0_8px_rgba(52,211,153,0.4)]' },
];

export default function Sidebar({ user }: SidebarProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  return (
    <>
      <aside className="hidden md:flex flex-col w-[80px] h-full glass-panel z-50 py-6 items-center gap-8 shrink-0">
        {/* Avatar */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="relative group cursor-pointer">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 shadow-lg">
                  {user.photoURL ? (
                    <Image
                      src={user.photoURL}
                      alt="User Avatar"
                      width={40}
                      height={40}
                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary flex items-center justify-center text-white font-bold">
                      {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#18181b]"></div>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{user.displayName || user.email}</p>
            </TooltipContent>
          </Tooltip>

          {/* Nav Icons */}
          <nav className="flex flex-col gap-6 w-full items-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setActiveTab('home')}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all hover:scale-105 group relative ${activeTab === 'home'
                      ? 'bg-primary text-white shadow-glow'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                  <Home className="w-6 h-6" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Home</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setActiveTab('favorites')}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all group relative ${activeTab === 'favorites'
                      ? 'bg-primary text-white shadow-glow'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                  <Star className="w-6 h-6" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Favorites</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setActiveTab('archive')}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all group relative ${activeTab === 'archive'
                      ? 'bg-primary text-white shadow-glow'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                  <Archive className="w-6 h-6" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Archive</p>
              </TooltipContent>
            </Tooltip>
          </nav>

          {/* Divider */}
          <div className="w-8 h-[1px] bg-white/10"></div>

          {/* Tags (Color Dots) */}
          <div className="flex flex-col gap-4">
            {TAG_COLORS.map((color, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <div
                    className={`w-3 h-3 rounded-full ${color.bg} ${color.shadow} cursor-pointer hover:scale-125 transition-transform`}
                  />
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Tag {index + 1}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>

          {/* Settings (Bottom) */}
          <div className="mt-auto">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setSettingsOpen(true)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl text-zinc-500 hover:text-white hover:bg-white/5 transition-all"
                >
                  <Settings className="w-6 h-6" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Settings</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </aside>

      <SettingsDialog user={user} open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}
