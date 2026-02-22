'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Movie } from '../types';
import { Play, Plus, Info, Star, Clock, Volume2 } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';
import { useToast } from '../context/ToastContext';
import { useRouter } from 'next/navigation';

interface HeroBannerProps {
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ movies, onMovieClick }) => {
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);
  const { toggleWatchlist, isInWatchlist } = useWatchlist();
  const { showToast } = useToast();
  const router = useRouter();
  const featured = movies.slice(0, 5);

  const goTo = useCallback((index: number) => {
    setFade(false);
    setTimeout(() => { setCurrent(index); setFade(true); }, 300);
  }, []);

  useEffect(() => {
    if (featured.length <= 1) return;
    const timer = setInterval(() => {
      goTo((current + 1) % featured.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [current, featured.length, goTo]);

  if (featured.length === 0) return null;
  const movie = featured[current];
  const bgImage = movie.original_backdrop_url || movie.poster;
  const rating = movie.rating ? parseFloat(String(movie.rating)).toFixed(1) : '8.4';
  const inList = isInWatchlist(movie.movie_id);

  const handleWatchlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWatchlist(movie);
    showToast(inList ? 'Removed from My List' : '✓ Added to My List', inList ? 'info' : 'success');
  };

  return (
    <div className="relative w-full" style={{ height: '72vw', minHeight: 260, maxHeight: 480 }}>
      {/* Background Image */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}>
        <img src={bgImage} alt={movie.title} className="w-full h-full object-cover" />
        {/* Multi-layer gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#030812] via-[#030812]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#030812]/80 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className={`absolute bottom-0 left-0 right-0 p-5 pb-6 transition-all duration-500 ${fade ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {/* Genre Tags */}
        <div className="flex gap-1.5 mb-2 flex-wrap">
          {(movie.genre || '').split(',').slice(0, 3).map(g => (
            <span key={g} className="text-[9px] font-black text-white/50 uppercase tracking-[0.2em]">{g.trim()}</span>
          )).reduce((acc: React.ReactNode[], el, i, arr) => [
            ...acc,
            el,
            i < arr.length - 1 ? <span key={`dot-${i}`} className="text-white/20 text-[9px]">•</span> : null
          ], [])}
        </div>

        {/* Title */}
        <h1 className="text-[clamp(1.6rem,7vw,2.5rem)] font-[900] text-white leading-none tracking-tighter uppercase italic mb-2 drop-shadow-2xl line-clamp-2">
          {movie.title}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-1">
            <Star size={11} fill="#F5A623" className="text-[#F5A623]" />
            <span className="text-[#F5A623] text-xs font-black">{rating}</span>
          </div>
          <span className="text-white/30 text-xs">•</span>
          <span className="text-white/60 text-xs font-bold">{movie.year}</span>
          {movie.runtime && <><span className="text-white/30 text-xs">•</span><span className="text-white/60 text-xs font-bold flex items-center gap-1"><Clock size={10} />{movie.runtime}</span></>}
          <span className="bg-red-600/80 text-white text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
            {(movie.quality_name || 'HD').includes('4K') ? '4K' : (movie.quality_name || 'HD').includes('1080') ? 'FHD' : 'HD'}
          </span>
        </div>

        {/* Buttons */}
        <div className="flex gap-2.5">
          <button
            onClick={() => onMovieClick(movie)}
            className="flex-1 h-11 bg-white text-black rounded-xl flex items-center justify-center gap-2 font-black text-sm uppercase tracking-wider active:scale-95 transition-transform shadow-lg"
          >
            <Play size={16} fill="black" /> Play
          </button>
          <button
            onClick={handleWatchlist}
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all active:scale-90 border ${inList ? 'bg-red-600 border-red-600 text-white' : 'bg-white/10 border-white/20 text-white backdrop-blur-xl'}`}
          >
            <Plus size={20} strokeWidth={inList ? 3 : 2} style={{ transform: inList ? 'rotate(45deg)' : 'none', transition: 'transform 0.3s' }} />
          </button>
          <button
            onClick={() => router.push(`/player/${movie.movie_id}`)}
            className="w-11 h-11 rounded-xl bg-white/10 border border-white/20 backdrop-blur-xl flex items-center justify-center text-white active:scale-90 transition-transform"
          >
            <Info size={18} />
          </button>
        </div>
      </div>

      {/* Slide Dots */}
      {featured.length > 1 && (
        <div className="absolute bottom-0 right-5 flex gap-1.5 pb-6">
          {featured.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} className={`rounded-full transition-all duration-300 ${i === current ? 'w-5 h-1.5 bg-red-500' : 'w-1.5 h-1.5 bg-white/25'}`} />
          ))}
        </div>
      )}
    </div>
  );
};
