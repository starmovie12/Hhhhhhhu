'use client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Movie } from '../types';
import { fetchAllMovies } from '../services/firebaseService';
import { HeroBanner } from '../components/HeroBanner';
import { MovieRow } from '../components/MovieRow';
import { BottomNav } from '../components/BottomNav';
import { SearchOverlay } from '../components/SearchOverlay';
import { SplashScreen } from '../components/SplashScreen';
import { ScrollToTop } from '../components/ScrollToTop';
import { HomePageSkeleton } from '../components/SkeletonLoader';
import { useWatchlist } from '../context/WatchlistContext';
import { useWatchHistory } from '../hooks/useWatchHistory';
import { Bell } from 'lucide-react';

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const router = useRouter();
  const { watchlist } = useWatchlist();
  const { history, removeFromHistory } = useWatchHistory();

  useEffect(() => {
    const seen = sessionStorage.getItem('mflix_splash');
    if (!seen) { setShowSplash(true); sessionStorage.setItem('mflix_splash', '1'); }
    fetchAllMovies().then(data => { setMovies(data); setLoading(false); });
  }, []);

  const handleMovieClick = useCallback((movie: Movie) => {
    router.push(`/player/${movie.movie_id}`);
  }, [router]);

  const continueWatching = useMemo(() => history.map(h => h.movie), [history]);
  const featured = useMemo(() => movies.filter(m => m.is_featured === 'Yes').slice(0, 8).length > 0 ? movies.filter(m => m.is_featured === 'Yes').slice(0, 8) : movies.slice(0, 8), [movies]);
  const trending = useMemo(() => movies.filter(m => m.is_trending_now === 'Yes').slice(0, 12), [movies]);
  const latest = useMemo(() => [...movies].sort((a, b) => Number(b.year || 0) - Number(a.year || 0)).slice(0, 12), [movies]);
  const bollywood = useMemo(() => movies.filter(m => m.industry?.toLowerCase().includes('bollywood')).slice(0, 12), [movies]);
  const action = useMemo(() => movies.filter(m => m.genre?.toLowerCase().includes('action')).slice(0, 12), [movies]);
  const comedy = useMemo(() => movies.filter(m => m.genre?.toLowerCase().includes('comedy')).slice(0, 12), [movies]);
  const horror = useMemo(() => movies.filter(m => m.genre?.toLowerCase().includes('horror') || m.genre?.toLowerCase().includes('thriller')).slice(0, 12), [movies]);
  const romance = useMemo(() => movies.filter(m => m.genre?.toLowerCase().includes('romance')).slice(0, 12), [movies]);
  const uhd = useMemo(() => movies.filter(m => m.quality_name?.includes('4K') || m.quality?.includes('4K')).slice(0, 12), [movies]);

  return (
    <>
      {showSplash && <SplashScreen onDone={() => setShowSplash(false)} />}
      {searchOpen && <SearchOverlay movies={movies} onClose={() => setSearchOpen(false)} />}

      <div className="relative min-h-screen bg-[#030812] text-white overflow-x-hidden pb-28">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-[60] px-4 py-3 flex items-center justify-between glass-header pointer-events-none">
          <div className="pointer-events-auto flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-800 rounded-lg flex items-center justify-center shadow-lg shadow-red-900/50">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3L2 12h3v8h14v-8h3L12 3zm0 13c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" />
              </svg>
            </div>
            <span className="text-[22px] font-[900] tracking-[-0.05em] text-white uppercase italic">MFLIX</span>
          </div>
          <div className="pointer-events-auto flex items-center gap-3">
            <button className="relative text-white/70 p-1.5 active:scale-90 transition-transform" onClick={() => setSearchOpen(true)}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </button>
            <button className="relative text-white/70 p-1.5 active:scale-90 transition-transform">
              <Bell size={20} strokeWidth={1.8} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full border border-[#030812] animate-pulse" />
            </button>
            <button onClick={() => router.push('/profile')} className="w-8 h-8 rounded-full overflow-hidden border-2 border-red-600/60 active:scale-90 transition-transform">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=mflix" className="w-full h-full object-cover" alt="Profile" />
            </button>
          </div>
        </header>

        {loading ? <HomePageSkeleton /> : (
          <main>
            <HeroBanner movies={featured} onMovieClick={handleMovieClick} />
            <div className="pt-2 space-y-1">
              {continueWatching.length > 0 && (
                <MovieRow title="▶ Continue Watching" movies={continueWatching} onMovieClick={handleMovieClick} variant="landscape" showProgress accentColor="#06B6D4" onRemove={removeFromHistory} />
              )}
              {watchlist.length > 0 && (
                <MovieRow title="❤ My List" movies={watchlist} onMovieClick={handleMovieClick} accentColor="#7C3AED" />
              )}
              {trending.length > 0 && <MovieRow title="🔥 Trending Now" movies={trending} onMovieClick={handleMovieClick} genre="trending" />}
              <MovieRow title="⚡ Latest Releases" movies={latest} onMovieClick={handleMovieClick} genre="latest" />
              {bollywood.length > 0 && <MovieRow title="🎬 Bollywood" movies={bollywood} onMovieClick={handleMovieClick} genre="bollywood" accentColor="#F5A623" />}
              {action.length > 0 && <MovieRow title="💥 Action" movies={action} onMovieClick={handleMovieClick} genre="action" />}
              {comedy.length > 0 && <MovieRow title="😂 Comedy" movies={comedy} onMovieClick={handleMovieClick} genre="comedy" accentColor="#F5A623" />}
              {horror.length > 0 && <MovieRow title="👻 Horror & Thriller" movies={horror} onMovieClick={handleMovieClick} genre="horror" accentColor="#7C3AED" />}
              {romance.length > 0 && <MovieRow title="❤️ Romance" movies={romance} onMovieClick={handleMovieClick} genre="romance" accentColor="#EC4899" />}
              {uhd.length > 0 && <MovieRow title="🎥 4K Ultra HD" movies={uhd} onMovieClick={handleMovieClick} genre="4k" accentColor="#06B6D4" />}
            </div>
          </main>
        )}

        <ScrollToTop />
        <BottomNav onSearchOpen={() => setSearchOpen(true)} />
      </div>
    </>
  );
}
