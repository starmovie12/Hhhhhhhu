'use client';
import React from 'react';
import { Home, Search, Grid3X3, Heart, User } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';
import { useRouter, usePathname } from 'next/navigation';

interface BottomNavProps {
  onSearchOpen: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onSearchOpen }) => {
  const { watchlist } = useWatchlist();
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { id: 'home', label: 'Home', icon: Home, action: () => router.push('/') },
    { id: 'search', label: 'Search', icon: Search, action: onSearchOpen },
    { id: 'categories', label: 'Browse', icon: Grid3X3, action: () => router.push('/category/all') },
    { id: 'watchlist', label: 'My List', icon: Heart, action: () => router.push('/profile'), badge: watchlist.length },
    { id: 'profile', label: 'Profile', icon: User, action: () => router.push('/profile') },
  ];

  const activeTab = pathname === '/' ? 'home' : pathname.startsWith('/category') ? 'categories' : pathname.startsWith('/profile') ? 'profile' : '';

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md">
      <div className="bg-[#0d1117]/95 backdrop-blur-2xl border border-white/10 rounded-[2rem] px-2 py-2 flex items-center justify-around shadow-2xl shadow-black/80">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={tab.action}
              className={`relative flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl transition-all duration-300 active:scale-90 ${isActive ? 'bg-red-600/15' : ''}`}
            >
              <div className="relative">
                <tab.icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  className={`transition-all duration-300 ${isActive ? 'text-red-500 scale-110 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'text-white/40'}`}
                />
                {tab.badge && tab.badge > 0 ? (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full text-[8px] font-black text-white flex items-center justify-center">
                    {tab.badge > 9 ? '9+' : tab.badge}
                  </span>
                ) : null}
              </div>
              {isActive && (
                <span className="text-[9px] font-black text-red-400 uppercase tracking-wider">{tab.label}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
