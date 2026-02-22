'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Search, Clock, TrendingUp } from 'lucide-react';
import { Movie } from '../types';
import { useRouter } from 'next/navigation';

interface SearchOverlayProps {
  movies: Movie[];
  onClose: () => void;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ movies, onClose }) => {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    inputRef.current?.focus();
    try {
      const saved = localStorage.getItem('mflix_searches');
      if (saved) setRecentSearches(JSON.parse(saved));
    } catch {}
  }, []);

  const results = query.trim().length > 1
    ? movies.filter(m =>
        m.title?.toLowerCase().includes(query.toLowerCase()) ||
        m.genre?.toLowerCase().includes(query.toLowerCase()) ||
        m.cast?.toLowerCase().includes(query.toLowerCase()) ||
        m.director?.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 20)
    : [];

  const handleSelect = (movie: Movie) => {
    const updated = [movie.title, ...recentSearches.filter(s => s !== movie.title)].slice(0, 6);
    setRecentSearches(updated);
    try { localStorage.setItem('mflix_searches', JSON.stringify(updated)); } catch {}
    onClose();
    router.push(`/player/${movie.movie_id}`);
  };

  const handleRecentClick = (term: string) => setQuery(term);

  const clearRecent = () => {
    setRecentSearches([]);
    try { localStorage.removeItem('mflix_searches'); } catch {}
  };

  const trendingTags = ['Action', 'Comedy', 'Bollywood', 'Horror', '4K', 'Drama', 'Romance'];

  return (
    <div className="fixed inset-0 z-[200] bg-[#030812]/98 backdrop-blur-xl flex flex-col animate-fadeIn">
      {/* Search Header */}
      <div className="flex items-center gap-3 px-4 pt-14 pb-4 border-b border-white/5">
        <Search size={20} className="text-white/40 flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Movies, genres, actors..."
          className="flex-1 bg-transparent text-white text-lg font-medium placeholder:text-white/20 outline-none"
        />
        {query ? (
          <button onClick={() => setQuery('')} className="text-white/40 hover:text-white">
            <X size={20} />
          </button>
        ) : (
          <button onClick={onClose} className="text-white/60 font-bold text-sm px-2 py-1">
            Cancel
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        {/* Search Results */}
        {query.trim().length > 1 && (
          <div>
            {results.length > 0 ? (
              <div className="grid grid-cols-3 gap-3">
                {results.map(movie => (
                  <div key={movie.movie_id} onClick={() => handleSelect(movie)} className="cursor-pointer active:scale-95 transition-transform">
                    <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-white/5 border border-white/10">
                      <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/fallback/300/450'; }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      <div className="absolute bottom-2 left-2 right-2">
                        <p className="text-white text-[10px] font-bold line-clamp-2 leading-tight">{movie.title}</p>
                        <p className="text-white/50 text-[9px] mt-0.5">{movie.year}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center py-16 gap-4">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                  <Search size={28} className="text-white/20" />
                </div>
                <p className="text-white/40 font-bold">No results for "{query}"</p>
                <p className="text-white/20 text-sm">Try different keywords</p>
              </div>
            )}
          </div>
        )}

        {/* No query state */}
        {query.trim().length <= 1 && (
          <>
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white/60 text-xs font-black uppercase tracking-widest">Recent</span>
                  <button onClick={clearRecent} className="text-red-500 text-xs font-bold">Clear</button>
                </div>
                <div className="flex flex-col gap-2">
                  {recentSearches.map(term => (
                    <button key={term} onClick={() => handleRecentClick(term)} className="flex items-center gap-3 py-2 text-left">
                      <Clock size={15} className="text-white/30" />
                      <span className="text-white/70 text-sm font-medium">{term}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Tags */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={14} className="text-red-500" />
                <span className="text-white/60 text-xs font-black uppercase tracking-widest">Trending</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {trendingTags.map(tag => (
                  <button key={tag} onClick={() => setQuery(tag)} className="bg-white/8 border border-white/10 text-white/70 text-sm font-bold px-4 py-2 rounded-full hover:bg-white/15 hover:text-white transition-all active:scale-95">
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
