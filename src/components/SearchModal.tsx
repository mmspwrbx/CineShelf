import React, { useState, useEffect, useRef } from 'react';
import { X, Search, Loader2, Check, Eye, Bookmark, EyeOff } from 'lucide-react';
import type { MovieMetadata, LibraryMovie, ApiSettings } from '../types';
import { movieApi } from '../services/movieApi';
import { t } from '../services/translations';

interface SearchModalProps {
  onClose: () => void;
  onAddMovie: (metadata: MovieMetadata, status: 'watched' | 'watching' | 'plan-to-watch') => void;
  existingMovies: LibraryMovie[];
  settings: ApiSettings;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  onClose,
  onAddMovie,
  existingMovies,
  settings,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MovieMetadata[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeEngines, setActiveEngines] = useState<('tvmaze' | 'tmdb' | 'omdb')[]>(
    settings.activeEngines || [settings.activeEngine || 'tvmaze']
  );
  const [addingId, setAddingId] = useState<string | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleToggleEngine = (engine: 'tvmaze' | 'tmdb' | 'omdb') => {
    setActiveEngines((prev) => {
      if (prev.includes(engine)) {
        if (prev.length === 1) return prev; // Enforce at least one active engine
        return prev.filter((e) => e !== engine);
      } else {
        return [...prev, engine];
      }
    });
  };

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      const trimmed = query.trim();
      if (!trimmed) {
        setResults([]);
        return;
      }

      setLoading(true);
      setError('');
      try {
        const apiResults = await movieApi.searchMovies(trimmed, settings, activeEngines);
        setResults(apiResults);
      } catch (err) {
        setError('Failed to fetch search results. Check connection or api keys.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query, settings, activeEngines]);

  const isAlreadyInLibrary = (apiId: string) => {
    return existingMovies.some((m) => m.metadata.id === apiId);
  };

  const getLibraryMovieStatus = (apiId: string) => {
    const found = existingMovies.find((m) => m.metadata.id === apiId);
    return found ? found.status : null;
  };

  const getLocalizedStatusLabel = (status: string) => {
    switch (status) {
      case 'watched':
        return t('tabWatched', settings.language).replace('[', '').replace(']', '');
      case 'watching':
        return t('tabWatching', settings.language).replace('[', '').replace(']', '');
      case 'plan-to-watch':
        return t('tabPlan', settings.language).replace('[', '').replace(']', '');
      default:
        return status;
    }
  };

  const handleAdd = async (meta: MovieMetadata, status: 'watched' | 'watching' | 'plan-to-watch') => {
    setAddingId(meta.id);
    try {
      const detailedMeta = await movieApi.getMovieDetails(meta.id, meta.source, settings);
      onAddMovie(detailedMeta || meta, status);
    } catch (e) {
      console.warn('Could not fetch detailed show metadata, adding simple version instead.', e);
      onAddMovie(meta, status);
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-none overflow-y-auto animate-fade-in">
      <div className="stark-panel w-full max-w-4xl rounded-none overflow-hidden shadow-none relative animate-scale-in flex flex-col h-[85vh] bg-black">
        {/* Header Search Bar */}
        <div className="p-6 border-b border-white/15 relative flex flex-col gap-4 bg-black">
          <div className="relative flex items-center gap-4 w-full bg-black">
            <div className="relative w-full bg-black">
              <Search className="absolute left-4 top-4.5 h-4 w-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder={t('searchModalPlaceholder', settings.language)}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="stark-input pl-11 pr-4 py-3.5 rounded-none w-full text-sm font-mono uppercase"
              />
            </div>

            <button
              onClick={onClose}
              className="p-3.5 stark-btn rounded-none shadow-none active:scale-95 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Engine Selector Pills */}
          <div className="flex flex-wrap gap-3 items-center">
            <span className="text-[9px] uppercase tracking-widest text-gray-500 font-mono font-bold">
              {t('searchEnginesLabel', settings.language)}
            </span>
            
            <button
              onClick={() => handleToggleEngine('tvmaze')}
              className={`px-3 py-1.5 border text-[10px] font-mono font-bold uppercase transition-all duration-150 rounded-none cursor-pointer ${
                activeEngines.includes('tvmaze')
                  ? 'bg-white text-black border-white'
                  : 'bg-black text-gray-400 border-white/15 hover:border-white/30 hover:text-white'
              }`}
            >
              TVMaze
            </button>

            <button
              disabled={!settings.tmdbApiKey}
              onClick={() => handleToggleEngine('tmdb')}
              className={`px-3 py-1.5 border text-[10px] font-mono font-bold uppercase transition-all duration-150 rounded-none ${
                !settings.tmdbApiKey
                  ? 'opacity-40 cursor-not-allowed border-dashed border-white/10 text-gray-600'
                  : activeEngines.includes('tmdb')
                  ? 'bg-white text-black border-white cursor-pointer'
                  : 'bg-black text-gray-400 border-white/15 hover:border-white/30 hover:text-white cursor-pointer'
              }`}
              title={!settings.tmdbApiKey ? t('apiKeyRequired', settings.language) : ''}
            >
              TMDB
            </button>

            <button
              disabled={!settings.omdbApiKey}
              onClick={() => handleToggleEngine('omdb')}
              className={`px-3 py-1.5 border text-[10px] font-mono font-bold uppercase transition-all duration-150 rounded-none ${
                !settings.omdbApiKey
                  ? 'opacity-40 cursor-not-allowed border-dashed border-white/10 text-gray-600'
                  : activeEngines.includes('omdb')
                  ? 'bg-white text-black border-white cursor-pointer'
                  : 'bg-black text-gray-400 border-white/15 hover:border-white/30 hover:text-white cursor-pointer'
              }`}
              title={!settings.omdbApiKey ? t('apiKeyRequired', settings.language) : ''}
            >
              OMDB
            </button>
          </div>
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          {loading && (
            <div className="flex flex-col items-center justify-center h-full py-12 gap-3 text-white animate-pulse">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="text-xs font-mono tracking-widest uppercase">{t('searchingProgress', settings.language)}</span>
            </div>
          )}

          {error && (
            <div className="text-center py-12 text-rose-400 bg-rose-500/5 rounded-none border border-rose-500/20 p-6">
              <p className="text-xs font-mono uppercase font-bold mb-1">{t('searchError', settings.language)}</p>
              <p className="text-[10px] text-gray-400 leading-relaxed font-mono">{error}</p>
            </div>
          )}

          {!loading && !error && results.length === 0 && (
            <div className="text-center py-16 text-gray-500 flex flex-col items-center gap-4">
              <div className="p-4 border border-white/10 rounded-none bg-black">
                <Search className="h-6 w-6 text-white" />
              </div>
              <div className="space-y-1.5">
                <p className="text-xs font-bold text-gray-300 font-mono uppercase tracking-widest">{t('searchIdle', settings.language)}</p>
                <p className="text-[10px] text-gray-500 max-w-sm mx-auto leading-relaxed font-mono">
                  {t('searchIdleSub', settings.language)}
                </p>
              </div>
            </div>
          )}

          {!loading && !error && results.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.map((item) => {
                const alreadyInLib = isAlreadyInLibrary(item.id);
                const libStatus = getLibraryMovieStatus(item.id);

                return (
                  <div
                    key={item.id}
                    className="stark-card flex gap-4 p-4 rounded-none items-center border-white/15 relative group overflow-hidden"
                  >
                    {/* Movie Cover Mini */}
                    <div className="w-20 h-28 shrink-0 rounded-none overflow-hidden bg-black border border-white/10 relative">
                      <img
                        src={item.poster}
                        alt={item.title}
                        className="w-full h-full object-cover filter grayscale contrast-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=600&auto=format&fit=crop';
                        }}
                      />
                    </div>

                     {/* Movie Details Info */}
                    <div className="flex-1 flex flex-col justify-between min-w-0 h-full py-1">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-xs bg-black border border-white/10 text-gray-400 px-1.5 py-0.5 rounded-none font-mono">
                            {item.year}
                          </span>
                          {item.imdbRating && item.imdbRating !== 'N/A' && (
                            <span className="text-xs text-white font-bold border border-white/10 px-1.5 py-0.2 rounded-none font-mono">
                              ★ {item.imdbRating}
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-bold font-display text-white truncate tracking-wider uppercase">
                          {item.title}
                        </h4>
                        <p className="text-xs text-gray-400 leading-snug line-clamp-2 mt-1.5 font-sans">
                          {item.plot}
                        </p>
                      </div>

                      {/* Add Action Buttons */}
                      <div className="mt-3.5 flex items-center justify-between">
                        {alreadyInLib ? (
                          <div className="flex items-center gap-1 border border-white text-white px-2.5 py-1 rounded-none text-[9px] font-mono uppercase tracking-wider font-bold">
                            <Check className="h-3 w-3" />
                            <span>{t('inLibraryBadge', settings.language)} ({getLocalizedStatusLabel(libStatus || '')})</span>
                          </div>
                        ) : addingId === item.id ? (
                          <div className="flex items-center gap-1.5 text-xs text-white animate-pulse font-mono uppercase font-bold">
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            {t('importingProgress', settings.language)}
                          </div>
                        ) : (
                          <div className="flex gap-2 opacity-90 group-hover:opacity-100 transition-opacity">
                            {/* Watched Action */}
                            <button
                              onClick={() => handleAdd(item, 'watched')}
                              title={t('addWatchedTitle', settings.language)}
                              className="flex items-center justify-center p-2.5 rounded-none bg-black hover:bg-white text-white hover:text-black border border-white/20 hover:border-white transition-all cursor-pointer"
                            >
                              <Eye className="h-4 w-4" />
                            </button>

                            {/* Watching Action */}
                            <button
                              onClick={() => handleAdd(item, 'watching')}
                              title={t('addWatchingTitle', settings.language)}
                              className="flex items-center justify-center p-2.5 rounded-none bg-black hover:bg-white text-white hover:text-black border border-white/20 hover:border-white transition-all cursor-pointer"
                            >
                              <Bookmark className="h-4 w-4" />
                            </button>

                            {/* Plan To Watch Action */}
                            <button
                              onClick={() => handleAdd(item, 'plan-to-watch')}
                              title={t('addWatchlistTitle', settings.language)}
                              className="flex items-center justify-center p-2.5 rounded-none bg-black hover:bg-white text-white hover:text-black border border-white/20 hover:border-white transition-all cursor-pointer"
                            >
                              <EyeOff className="h-4 w-4" />
                            </button>
                          </div>
                        )}

                        <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">
                          [{item.source}]
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
