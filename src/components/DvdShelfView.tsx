import React, { useState, useEffect, useRef } from 'react';
import type { LibraryMovie } from '../types';

interface DvdShelfViewProps {
  movies: LibraryMovie[];
  onMovieClick: (movie: LibraryMovie) => void;
  isCustomOrder: boolean;
  onReorderMovies: (draggedId: string, targetId: string, position: 'before' | 'after') => void;
}

export const DvdShelfView: React.FC<DvdShelfViewProps> = ({
  movies,
  onMovieClick,
  isCustomOrder,
  onReorderMovies,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [itemsPerRow, setItemsPerRow] = useState(10); // default initial fallback
  const [isArrangeMode, setIsArrangeMode] = useState(false);

  // Drag states for DVD reordering
  const isDraggingRef = useRef(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [dropPosition, setDropPosition] = useState<'before' | 'after'>('before');

  const handleDragStart = (e: React.DragEvent, id: string) => {
    isDraggingRef.current = true;
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    if (draggedId === id) return;
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const position = mouseX > rect.width / 2 ? 'after' : 'before';
    if (dropPosition !== position) {
      setDropPosition(position);
    }
    if (dragOverId !== id) {
      setDragOverId(id);
    }
  };

  const handleDragEnter = (_e: React.DragEvent, id: string) => {
    if (draggedId === id) return;
    setDragOverId(id);
  };

  const handleDragLeave = (_e: React.DragEvent, id: string) => {
    if (dragOverId === id) {
      setDragOverId(null);
    }
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverId(null);
    setDropPosition('before');
    setTimeout(() => {
      isDraggingRef.current = false;
    }, 50);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (draggedId && draggedId !== targetId) {
      onReorderMovies(draggedId, targetId, dropPosition);
    }
    setDraggedId(null);
    setDragOverId(null);
    setDropPosition('before');
  };

  // Measure container and dynamically calculate row capacity
  useEffect(() => {
    if (!containerRef.current) return;

    const updateItemsPerRow = () => {
      if (containerRef.current) {
        const width = containerRef.current.getBoundingClientRect().width;
        // In Arrange Mode, each slot is 260px + 8px gap = 268px
        // In Normal Mode, each slot is 96px + 8px gap = 104px
        const slotWidth = 104;
        const calculated = Math.max(1, Math.floor((width - 32) / slotWidth));
        setItemsPerRow(calculated);
      }
    };

    updateItemsPerRow();

    // Listen to container resizing
    const observer = new ResizeObserver(() => {
      updateItemsPerRow();
    });
    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [isArrangeMode]);

  // Visual status indicator for the DVD case
  const getStatusColor = (status: LibraryMovie['status']) => {
    switch (status) {
      case 'watched':
        return 'bg-zinc-500 border-zinc-400';
      case 'watching':
        return 'bg-white border-white';
      case 'plan-to-watch':
        return 'bg-zinc-800 border-zinc-700';
      default:
        return 'bg-zinc-600 border-zinc-500';
    }
  };

  // Helper to chunk movies into rows of dynamic itemsPerRow capacity
  const chunkMovies = (arr: LibraryMovie[], size: number) => {
    const chunked: LibraryMovie[][] = [];
    for (let i = 0; i < arr.length; i += size) {
      chunked.push(arr.slice(i, i + size));
    }
    return chunked;
  };

  const movieRows = chunkMovies(movies, itemsPerRow);

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Arrange Mode Toolbar Button */}
      {isCustomOrder && (
        <div className="flex justify-end pr-4">
          <button
            onClick={() => setIsArrangeMode(!isArrangeMode)}
            className={`px-5 py-2.5 rounded-none text-xs font-mono tracking-wider uppercase border transition-all duration-150 cursor-pointer ${
              isArrangeMode
                ? 'bg-white text-black border-white font-bold'
                : 'bg-black text-gray-400 border-white/15 hover:text-white hover:border-white/20'
            }`}
          >
            {isArrangeMode ? '[DONE_REARRANGING]' : '[ARRANGE_SHELF]'}
          </button>
        </div>
      )}

      <div ref={containerRef} className={`dvd-shelf-container w-full ${draggedId ? 'dragging-active' : ''} ${isArrangeMode ? 'arrange-mode-active' : ''}`}>
        {movieRows.map((rowMovies, rowIndex) => (
          <div key={rowIndex} className="dvd-shelf-row">
            {rowMovies.map((movie) => {
              const { metadata, review, status } = movie;

              return (
                <div
                  key={movie.id}
                  onDragOver={(e) => { if (!isArrangeMode) return; handleDragOver(e, movie.id); }}
                  onDragEnter={(e) => { if (!isArrangeMode) return; handleDragEnter(e, movie.id); }}
                  onDragLeave={(e) => { if (!isArrangeMode) return; handleDragLeave(e, movie.id); }}
                  onDrop={(e) => { if (!isArrangeMode) return; handleDrop(e, movie.id); }}
                  className={`dvd-shelf-item group transition-all duration-200 ${
                    draggedId === movie.id ? 'dragging opacity-40' : ''
                  } ${dragOverId === movie.id && dropPosition === 'before' ? 'drag-over-before' : ''} ${
                    dragOverId === movie.id && dropPosition === 'after' ? 'drag-over-after' : ''
                  }`}
                >
                  {/* 3D DVD Case Wrapper */}
                  <div
                    onClick={() => onMovieClick(movie)}
                    className="dvd-case-card"
                  >
                    {/* Spine (shows 3D depth when turned) */}
                    <div className="dvd-case-card-spine flex flex-col justify-between py-7 px-1.5 overflow-hidden">
                      {/* Visual Status Indicator on Spine top */}
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(status)} mx-auto mb-3 shrink-0 border border-black/30`} />
                      
                      <span
                        className="text-[11px] sm:text-[12px] text-gray-400 font-mono uppercase tracking-[0.3em] truncate max-h-[80%] select-none font-bold text-center"
                        style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)' }}
                      >
                        {metadata.title}
                      </span>

                      <span className="text-[9.5px] text-gray-600 font-mono mt-4 select-none font-bold text-center">
                        {metadata.year}
                      </span>
                    </div>

                    {/* Cover Image Face */}
                    <div className="dvd-case-card-cover overflow-hidden border border-white/10 flex flex-col justify-between">
                      <img
                        src={metadata.poster}
                        alt={metadata.title}
                        loading="lazy"
                        draggable={false}
                        className="w-full h-full object-cover filter grayscale contrast-[1.1] brightness-[0.8] group-hover:grayscale-0 group-hover:brightness-[0.95] transition-all duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=600&auto=format&fit=crop';
                        }}
                      />

                      {/* Ambient Plastic reflections */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 pointer-events-none" />

                      {/* Floating Rating Badge */}
                      {review.rating > 0 && (
                        <div className="absolute bottom-3 right-3 bg-black/85 border border-white/15 px-2 py-0.5 rounded-none text-[10px] font-mono text-white font-bold select-none">
                          ★ {review.rating}
                        </div>
                      )}

                      {/* Small overlay on bottom spine showing source */}
                      <div className="absolute bottom-3 left-3 bg-black/85 border border-white/10 px-1.5 py-0.5 rounded-none text-[8.5px] font-mono text-gray-400 select-none">
                        {metadata.source.toUpperCase()}
                      </div>
                    </div>

                    {/* 3D Right Face (plastic edge) */}
                    <div className="dvd-case-card-right" />

                    {/* 3D Top Face */}
                    <div className="dvd-case-card-top" />

                    {/* 3D Bottom Face */}
                    <div className="dvd-case-card-bottom" />
                  </div>

                  {/* Flat 2D Drag and Click Overlay for Arrange Mode */}
                  {isArrangeMode && (
                    <div
                      draggable={true}
                      onDragStart={(e) => handleDragStart(e, movie.id)}
                      onDragEnd={handleDragEnd}
                      onDragOver={(e) => handleDragOver(e, movie.id)}
                      onDragEnter={(e) => handleDragEnter(e, movie.id)}
                      onDragLeave={(e) => handleDragLeave(e, movie.id)}
                      onDrop={(e) => handleDrop(e, movie.id)}
                      onClick={() => {
                        if (isDraggingRef.current) return;
                        onMovieClick(movie);
                      }}
                      className="absolute inset-0 z-40 cursor-grab active:cursor-grabbing bg-transparent dvd-drag-overlay"
                      style={{ transform: 'none' }}
                    />
                  )}
                </div>
              );
            })}

            {/* Solid shelf line for this row container */}
            <div className="dvd-shelf-line" />
          </div>
        ))}
      </div>
    </div>
  );
};
