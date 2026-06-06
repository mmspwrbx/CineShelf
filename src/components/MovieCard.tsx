import React from 'react';
import { Star, Heart } from 'lucide-react';
import type { LibraryMovie } from '../types';
import { t } from '../services/translations';
import type { Language } from '../services/translations';

interface MovieCardProps {
  movie: LibraryMovie;
  language: Language;
  onClick: () => void;
  onToggleFavorite: () => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDragEnter?: (e: React.DragEvent) => void;
  onDragLeave?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  isDragging?: boolean;
  isDragOverBefore?: boolean;
  isDragOverAfter?: boolean;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  language,
  onClick,
  onToggleFavorite,
  draggable,
  onDragStart,
  onDragOver,
  onDragEnter,
  onDragLeave,
  onDragEnd,
  onDrop,
  isDragging,
  isDragOverBefore,
  isDragOverAfter,
}) => {
  const { metadata, review, status, tags } = movie;
  const isSeries = !!metadata.isSeries || metadata.source === 'tvmaze';

  const getStatusBadge = () => {
    switch (status) {
      case 'watched':
        return (
          <span className="bg-black text-white border border-white/20 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider badge-dark">
            {t('tabWatched', language)}
          </span>
        );
      case 'watching':
        return (
          <span className="bg-white text-black border border-white px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider font-bold">
            {t('tabWatching', language)}
          </span>
        );
      case 'plan-to-watch':
        return (
          <span className="bg-black text-white border border-white/20 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider badge-dark">
            {t('tabPlan', language)}
          </span>
        );
    }
  };

  return (
    <div
      onClick={onClick}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragEnd={onDragEnd}
      onDrop={onDrop}
      className={`movie-card-wrapper relative aspect-[2/3] w-full animate-slide-up ${
        isDragging ? 'opacity-40 cursor-grabbing' : 'cursor-pointer'
      } ${draggable && !isDragging ? 'cursor-grab' : ''} ${isDragOverBefore ? 'drag-over-before' : ''} ${isDragOverAfter ? 'drag-over-after' : ''}`}
    >
      <div className="stark-card-inner stark-card flex flex-col rounded-none overflow-hidden w-full h-full relative group transition-all duration-200">
        {/* Stark Favorite Heart toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className="absolute top-3 right-3 z-10 p-2 rounded-none bg-black border border-white/15 text-white hover:bg-white hover:text-black transition-all hover:scale-105 active:scale-95 shadow-none favorite-btn"
        >
          <Heart
            className={`h-3.5 w-3.5 transition-colors ${review.favorite ? 'fill-white text-white' : 'text-gray-400'
              } group-hover:text-white`}
          />
        </button>

        {/* Movie Cover Poster */}
        <div className="relative w-full h-full overflow-hidden bg-black">
          <img
            src={metadata.poster}
            alt={metadata.title}
            loading="lazy"
            draggable={false}
            className="w-full h-full object-cover transition-all duration-300 filter grayscale contrast-[1.1] brightness-[0.8] group-hover:grayscale-0 group-hover:brightness-[0.95]"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=600&auto=format&fit=crop';
            }}
          />

          {/* Dynamic shadow overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-85 group-hover:opacity-90 transition-opacity" />

          {/* Floating status & API badge */}
          <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
            {getStatusBadge()}
            <span className="bg-black/90 text-gray-400 border border-white/10 text-[9px] px-1.5 py-0.5 uppercase font-mono tracking-widest badge-dark text-center">
              {metadata.source}
            </span>
          </div>

          {/* Movie Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4.5 flex flex-col gap-2.5 z-10">
            {/* Year & Rating */}
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-gray-400 font-bold tracking-wider">{metadata.year}</span>
              {review.rating > 0 && (
                <div className="flex items-center gap-1 text-white border border-white/20 px-1.5 py-0.2 rounded-none text-[10px] badge-dark font-bold">
                  <Star className="h-2.5 w-2.5 fill-white text-white" />
                  <span>[{review.rating}/10]</span>
                </div>
              )}
            </div>

            {/* Title */}
            <h3 className="text-sm font-bold font-display text-white tracking-wider uppercase truncate">
              {metadata.title}
            </h3>

            {/* Tags / Series Ticker */}
            {isSeries ? (
              <div className="mt-1 space-y-1.5 border-t border-white/10 pt-2 font-mono">
                <div className="flex justify-between items-center text-[9px] text-gray-400 font-bold uppercase">
                  <span>{metadata.seasons || 1} {t('seasonsCount', language)}</span>
                  <span>{metadata.episodes || 10} {t('episodesCount', language)}</span>
                </div>
                {review.episodeRatings && Object.keys(review.episodeRatings).filter(key => (review.episodeRatings?.[key] || 0) > 0).length > 0 && (
                  <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none snap-x text-[8px] font-semibold text-white select-none whitespace-nowrap">
                    {Object.entries(review.episodeRatings)
                      .filter(([_, rate]) => rate > 0)
                      .sort((a, b) => a[0].localeCompare(b[0], undefined, { numeric: true, sensitivity: 'base' }))
                      .map(([epKey, rate]) => (
                        <span
                          key={epKey}
                          className="border border-white/15 px-1 py-0.2 rounded-none bg-black/50 tracking-wider snap-start"
                        >
                          [{epKey}: {rate}]
                        </span>
                      ))
                    }
                  </div>
                )}
              </div>
            ) : (
              tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-0.5">
                  {tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="border border-white/10 text-gray-400 px-1.5 py-0.5 text-[9px] font-mono uppercase tracking-wider badge-dark"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
