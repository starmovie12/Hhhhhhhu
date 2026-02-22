'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchAllMovies } from '../../../services/firebaseService';
import { Movie } from '../../../types';
import { ArrowLeft, Filter } from 'lucide-react';
import { MovieCard } from '../../../components/MovieCard';
import { BottomNav } from '../../../components/BottomNav';
import { SearchOverlay } from '../../../components/SearchOverlay';

const GENRES = [
  { id: 'all', label: 'All', emoji: '🎬', color: 'from-red-600 to-red-900' },
  { id: 'trending', label: 'Trending', emoji: '🔥', color: 'from-orange-500 to-red-700' },
  { id: 'bollywood', label: 'Bollywood', emoji: '🌟', color: 'from-yellow-500 to-orange-600' },
  { id: 'action', label: 'Action', emoji: '💥', color: 'from-red-500 to-rose-800' },
  { id: 'comedy', label: 'Comedy', emoji: '😂', color: 'from-yellow-400 to-amber-600' },
  { id: 'romance', label: 'Romance', emoji: '❤️', color: 'from-pink-500 to-rose-700' },
  { id: 'horror', label: 'Horror', emoji: '👻', color: 'from-purple-700 to-slate-900' },
  { id: 'thriller', label: 'Thriller', emoji: '🔪', color: 'from-slate-600 to-slate-900' },
  { id: 'drama', label: 'Drama', emoji: '🎭', color: 'from-teal-600 to-cyan-900' },
  { id: '4k', label: '4K Ultra HD', emoji: '🎥', color: 'from-cyan-500 to-blue-700' },
  { id: 'latest', label: 'Latest', emoji: '⚡', color: 'from-blue-500 to-indigo-700' },
  { id: 'hollywood', label: 'Hollywood', emoji: '🌍', color: 'from-indigo-500 to-purple-700' },
];

export default function CategoryPage() {
  const { genre } = useParams();
  const router = useRouter();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeGenre, setActiveGenre] = useState((genre as string) || 'all');

  useEffect(() => {
    fetchAllMovies().then(data => { setMovies(data); setLoading(false); });
  }, []);

  useEffect(() => { setActiveGenre((genre as string) || 'all'); }, [genre]);

  const filtered = useMemo(() => {
    switch (activeGenre) {
      case 'all': return movies;
      case 'trending': return movies.filter(m => m.is_trending_now === 'Yes');
      case 'bollywood': return movies.filter(m => m.industry?.toLowerCase().includes('bollywood'));
      case 'hollywood': return movies.filter(m => m.industry?.toLowerCase().includes('hollywood'));
      case '4k': return movies.filter(m => m.quality_name?.includes('4K') || m.quality?.includes('4K'));
      case 'latest': return [...movies].sort((a, b) => Number(b.year || 0) - Number(a.year || 0));
      default: return movies.filter(m => m.genre?.toLowerCase().includes(activeGenre));
    }
  }, [movies, activeGenre]);

  const currentGenre = GENRES.find(g => g.id === activeGenre) || GENRES[0];

  return (
    <>
      {searchOpen && <SearchOverlay movies={movies} onClose={() => setSearchOpen(false)} />}
      <div className="min-h-screen bg-[#030812] text-white pb-28">
        {/* Header */}
        <div className="fixed top-0 left-0 right-0 z-50 glass-header px-4 py-3 flex items-center gap-3">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center active:scale-90 transition-transform">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-[900] uppercase tracking-tight">{currentGenre.emoji} {currentGenre.label}</h1>
            <p className="text-xs text-white/40 font-medium">{filtered.length} titles</p>
          </div>
        </div>

        {/* Genre Tabs */}
        <div className="pt-20 pb-2 px-4">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {GENRES.map(g => (
              <button
                key={g.id}
                onClick={() => { setActiveGenre(g.id); router.replace(`/category/${g.id}`); }}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all active:scale-95 border ${activeGenre === g.id ? `bg-gradient-to-r ${g.color} text-white border-transparent shadow-lg` : 'bg-white/5 border-white/10 text-white/60'}`}
              >
                {g.emoji} {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-3 gap-3 px-4 pt-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="relative overflow-hidden bg-white/5 rounded-xl pb-[150%] animate-pulse">
                <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center py-24 gap-4">
            <div className="text-6xl">{currentGenre.emoji}</div>
            <p className="text-white/40 font-bold text-lg">No {currentGenre.label} movies yet</p>
            <p className="text-white/20 text-sm">Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3 px-4 pt-2 pb-4">
            {filtered.map(movie => (
              <MovieCard key={movie.movie_id} movie={movie} onClick={m => router.push(`/player/${m.movie_id}`)} />
            ))}
          </div>
        )}

        <BottomNav onSearchOpen={() => setSearchOpen(true)} />
      </div>
    </>
  );
}
