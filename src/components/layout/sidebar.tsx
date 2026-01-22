'use client';

import { motion } from 'framer-motion';
import {
  Home,
  Search,
  Settings,
  LogOut,
  Hash,
  Star,
  User as UserIcon,
  Tag
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { auth } from '@/lib/firebase';
import type { User } from 'firebase/auth';
import { useNotesStore } from '@/store/notes';

type SidebarProps = {
  user: User;
};

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const { notes, selectedTags, toggleTag } = useNotesStore();

  const handleSignOut = () => {
    auth.signOut();
  };

  const navItems = [
    { icon: Home, label: 'All Notes', href: '/', exact: true },
    { icon: Star, label: 'Favorites', href: '/favorites' },
    { icon: Search, label: 'Search', href: '/search' },
    { icon: Hash, label: 'Tags', href: '/tags' },
    { icon: UserIcon, label: 'Profile', href: '/profile' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ];

  // Calculate stats
  const totalNotes = notes.length;
  const favoriteCount = notes.filter((n: any) => n.isFavorite).length;
  const uniqueTags = new Set<string>();
  notes.forEach(note => note.tags?.forEach(tag => uniqueTags.add(tag)));

  // Get recent/top tags (limit to 5)
  const recentTags = Array.from(uniqueTags).slice(0, 5);

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="hidden md:flex w-[280px] flex-col h-full p-4 gap-6 z-50 glass-panel md:rounded-2xl m-4 mr-0 border-r-0"
    >
      {/* Profile Section */}
      <div className="flex items-center gap-3 px-2 pt-2">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-medium text-lg shadow-lg">
          {user.photoURL ? (
            <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full rounded-full object-cover" />
          ) : (
            (user.displayName || 'U').charAt(0).toUpperCase()
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-zinc-100 truncate">
            {user.displayName || 'User'}
          </h3>
          <p className="text-xs text-zinc-500 truncate">{user.email}</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2 px-1">
        <div className="bg-zinc-800/30 rounded-lg p-2 text-center border border-white/5">
          <div className="text-lg font-bold text-zinc-100">{totalNotes}</div>
          <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Notes</div>
        </div>
        <div className="bg-zinc-800/30 rounded-lg p-2 text-center border border-white/5">
          <div className="text-lg font-bold text-yellow-400">{favoriteCount}</div>
          <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Favs</div>
        </div>
        <div className="bg-zinc-800/30 rounded-lg p-2 text-center border border-white/5">
          <div className="text-lg font-bold text-primary">{uniqueTags.size}</div>
          <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Tags</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-1 flex-1">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${isActive
                  ? 'bg-primary/10 text-primary font-medium shadow-[inset_0_0_0_1px_rgba(98,98,243,0.2)]'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5'
                }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}

        {/* Recent Tags Section */}
        {recentTags.length > 0 && (
          <div className="mt-8 px-3">
            <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">Recent Tags</h4>
            <div className="space-y-1">
              {recentTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`flex items-center gap-2 w-full px-2 py-1.5 rounded-lg text-sm transition-colors ${selectedTags.includes(tag)
                      ? 'bg-zinc-800 text-zinc-100'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                    }`}
                >
                  <Tag className="w-3 h-3 opacity-50" />
                  <span className="truncate">#{tag}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Sign Out */}
      <button
        onClick={handleSignOut}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors w-full mt-auto"
      >
        <LogOut className="w-5 h-5" />
        <span>Sign Out</span>
      </button>
    </motion.aside>
  );
}
