'use client';
import React from 'react';
import { Movie } from '../types';
import { Star, Plus, Check } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';
import { useToast } from '../context/ToastContext';

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
  variant?: 'portrait' | 'landscape';
  progress?: number;
  timeLeft?: string;
}

const FALLBACK = 'https://picsum.photos/seed/fallback/300/450';

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick, variant = 'portrait', progress, timeLeft }) => {
  const { toggleWatchlist, isInWatchlist } = useWatchlist();
  const { showToast } = useToast();
  const inList = isInWatchlist(movie.movie_id);

  const posterUrl = movie.poster || movie.original_poster_url || FALLBACK;
  const rating = movie.rating ? parseFloat(String(movie.rating)).toFixed(1) : '7.5';
  const quality = movie.quality_name || movie.quality || 'HD';
  const year = movie.year || '2025';
  const lang = ((movie.languages || movie.audio_type || movie.original_language || 'HI').toString().split(' ')[0].substring(0, 4)).toUpperCase();

  const handleWatchlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWatchlist(movie);
    showToast(inList ? 'Removed from My List' : '✓ Added to My List', inList ? 'info' : 'success');
  };

  if (variant === 'landscape') {
    return (
      <article className="flex-shrink-0 w-full cursor-pointer" onClick={() => onClick(movie)}>
        <div className="relative aspect-video rounded-xl overflow-hidden bg-white/5 border border-white/8">
          <img src={posterUrl} alt={movie.title} className="w-full h-full object-cover brightness-75" loading="lazy" onError={e => { (e.target as HTMLImageElement).src = FALLBACK; }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
              <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            </div>
          </div>
          {progress !== undefined && (
            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10">
              <div className="h-full bg-red-600" style={{ width: `${progress}%` }} />
            </div>
          )}
        </div>
        <p className="text-[12px] font-bold text-white/80 mt-1.5 truncate">{movie.title}</p>
        {timeLeft && <p className="text-[10px] text-white/30 font-bold">{timeLeft}</p>}
      </article>
    );
  }

  return (
    <article className="relative w-full cursor-pointer group" onClick={() => onClick(movie)}>
      <div className="relative w-full pb-[150%] rounded-[8px] overflow-hidden bg-[#111827] border border-white/8 group-active:scale-[0.96] transition-transform duration-200 shadow-xl">
        <img
          src={posterUrl}
          alt={movie.title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={e => { (e.target as HTMLImageElement).src = FALLBACK; }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Language badge */}
        <div className="absolute top-0 left-0 bg-[#E50914] text-white text-[7px] font-black px-1.5 py-0.5 rounded-br-[6px] uppercase tracking-tight">{lang}</div>

        {/* Quality badge */}
        <div className="absolute top-0 right-0 bg-black/70 text-white text-[7px] font-black px-1.5 py-0.5 rounded-bl-[6px] uppercase">
          {quality.includes('4K') ? '4K' : quality.includes('1080') ? 'FHD' : 'HD'}
        </div>

        {/* Watchlist btn */}
        <button
          onClick={handleWatchlist}
          className={`absolute bottom-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 active:scale-90 ${inList ? 'bg-red-600' : 'bg-black/60 border border-white/30 backdrop-blur-sm'}`}
        >
          {inList ? <Check size={12} strokeWidth={3} className="text-white" /> : <Plus size={12} strokeWidth={2.5} className="text-white" />}
        </button>
      </div>

      <div className="mt-1.5 space-y-0.5">
        <h3 className="text-[11px] font-bold text-white/85 leading-tight truncate">{movie.title}</h3>
        <div className="flex items-center justify-between">
          <span className="text-[9px] text-white/30 font-medium">{year}</span>
          <div className="flex items-center gap-0.5">
            <Star size={8} fill="#F5A623" className="text-[#F5A623]" />
            <span className="text-[9px] font-black text-white/60">{rating}</span>
          </div>
        </div>
      </div>
    </article>
  );
};
