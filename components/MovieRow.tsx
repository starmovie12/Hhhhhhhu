'use client';
import React from 'react';
import { Movie } from '../types';
import { MovieCard } from './MovieCard';
import { ChevronRight, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface MovieRowProps {
  title: string;
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
  variant?: 'portrait' | 'landscape';
  showProgress?: boolean;
  onRemove?: (id: string) => void;
  accentColor?: string;
  genre?: string;
}

export const MovieRow: React.FC<MovieRowProps> = ({
  title, movies, onMovieClick, variant = 'portrait',
  showProgress, onRemove, accentColor = '#E50914', genre
}) => {
  const router = useRouter();
  if (movies.length === 0) return null;

  return (
    <section className="mb-2">
      <div className="flex items-center justify-between px-4 mb-3">
        <h2 className="text-[14px] font-[900] tracking-tight text-white/95 uppercase border-l-[3px] pl-3 leading-none" style={{ borderColor: accentColor }}>
          {title}
        </h2>
        {genre && (
          <button
            onClick={() => router.push(`/category/${genre.toLowerCase()}`)}
            className="flex items-center gap-0.5 text-[10px] font-black text-white/30 uppercase tracking-widest hover:text-white transition-colors active:scale-95"
          >
            See All <ChevronRight size={12} />
          </button>
        )}
      </div>

      <div className="flex overflow-x-auto no-scrollbar gap-[6px] pb-2 pl-4 pr-2">
        {movies.map((movie, idx) => (
          <div key={movie.movie_id} className={`flex-shrink-0 ${variant === 'landscape' ? 'w-[180px]' : 'w-[104px]'} relative`}>
            {onRemove && (
              <button
                onClick={e => { e.stopPropagation(); onRemove(movie.movie_id); }}
                className="absolute -top-1 -right-1 z-10 w-5 h-5 bg-black/80 rounded-full flex items-center justify-center border border-white/20"
              >
                <X size={10} className="text-white" />
              </button>
            )}
            <MovieCard
              movie={movie}
              onClick={onMovieClick}
              variant={variant}
              progress={showProgress ? 40 : undefined}
              timeLeft={showProgress ? '45 min left' : undefined}
            />
          </div>
        ))}
        <div className="flex-shrink-0 w-2" />
      </div>
    </section>
  );
};
