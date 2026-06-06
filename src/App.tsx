import { useState, useEffect, useMemo } from 'react';
import { Plus, Film, BarChart3, Settings as SettingsIcon, AlertCircle, BookOpen } from 'lucide-react';
import { storage } from './services/storage';
import type { LibraryMovie, MovieMetadata, ApiSettings } from './types';
import { t } from './services/translations';

// Components
import { LibraryFilters } from './components/LibraryFilters';
import { MovieCard } from './components/MovieCard';
import { MovieDetailModal } from './components/MovieDetailModal';
import { DvdShelfView } from './components/DvdShelfView';
import { DvdDetailModal } from './components/DvdDetailModal';
import { SearchModal } from './components/SearchModal';
import { DashboardStats } from './components/DashboardStats';
import { SettingsPanel } from './components/SettingsPanel';

function App() {
  // Global React States
  const [movies, setMovies] = useState<LibraryMovie[]>(() => storage.getMovies());
  const [settings, setSettings] = useState<ApiSettings>(storage.getSettings());
  const [activeTab, setActiveTab] = useState<'library' | 'stats' | 'settings'>('library');

  // Modal Visibility States
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<LibraryMovie | null>(null);

  // Library Filter & Sort States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'watched' | 'watching' | 'plan-to-watch'>('all');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortBy, setSortBy] = useState<'dateAdded' | 'rating' | 'title' | 'year' | 'custom'>('dateAdded');
  const [viewMode, setViewMode] = useState<'grid' | 'dvd'>(() => {
    return (localStorage.getItem('cineshelf_view_mode') as 'grid' | 'dvd') || 'grid';
  });

  const handleSetViewMode = (mode: 'grid' | 'dvd') => {
    setViewMode(mode);
    localStorage.setItem('cineshelf_view_mode', mode);
  };

  const [hasSyncedTvmaze, setHasSyncedTvmaze] = useState(false);


  // Background Auto-sync real seasons/episodes counts from TVMaze
  useEffect(() => {
    if (movies.length === 0 || hasSyncedTvmaze) return;

    // Robust filter matching undefined, null, missing, 1, or 10
    const tvmazeMoviesToSync = movies.filter(
      (m) =>
        m.metadata.source === 'tvmaze' &&
        (!m.metadata.seasons || m.metadata.seasons === 1) &&
        (!m.metadata.episodes || m.metadata.episodes === 10)
    );

    if (tvmazeMoviesToSync.length === 0) return;

    let active = true;
    Promise.resolve().then(() => {
      if (active) setHasSyncedTvmaze(true);
    });

    console.log(`[CineShelf] Starting background TVMaze sync for ${tvmazeMoviesToSync.length} shows:`, tvmazeMoviesToSync.map(m => m.metadata.title));

    const syncNext = async (index: number) => {
      if (!active) return;
      if (index >= tvmazeMoviesToSync.length) return;
      const movie = tvmazeMoviesToSync[index];
      const rawId = movie.metadata.id.replace('tvmaze-', '');

      console.log(`[CineShelf] Syncing episodes count for: "${movie.metadata.title}" (ID: ${rawId})`);
      try {
        const res = await fetch(`https://api.tvmaze.com/shows/${rawId}/episodes`);
        if (res.ok) {
          const episodes = await res.json();
          if (active && Array.isArray(episodes) && episodes.length > 0) {
            const realEpisodes = episodes.length;
            const realSeasons = Math.max(...episodes.map((ep: { season?: number }) => ep.season || 1));

            console.log(`[CineShelf] Successfully resolved: "${movie.metadata.title}" -> ${realSeasons} Seasons, ${realEpisodes} Episodes`);
            setMovies((currentMovies) => {
              const updated = currentMovies.map((m) => {
                if (m.id === movie.id) {
                  return {
                    ...m,
                    metadata: {
                      ...m.metadata,
                      seasons: realSeasons,
                      episodes: realEpisodes,
                    },
                  };
                }
                return m;
              });
              storage.saveMovies(updated);
              return updated;
            });
          }
        }
      } catch (err) {
        console.warn('Failed to background sync episodes for', movie.metadata.title, err);
      }

      if (active) {
        setTimeout(() => syncNext(index + 1), 800);
      }
    };

    syncNext(0);

    return () => {
      active = false;
    };

    syncNext(0);
  }, [movies, hasSyncedTvmaze]);

  // Sync Library Changes to Storage
  const handleUpdateMoviesList = (updatedList: LibraryMovie[]) => {
    setMovies(updatedList);
    storage.saveMovies(updatedList);
  };

  // Add Movie
  const handleAddMovie = (metadata: MovieMetadata, status: 'watched' | 'watching' | 'plan-to-watch') => {
    // Avoid double-adding
    if (movies.some((m) => m.metadata.id === metadata.id)) {
      alert(`"${metadata.title}" ${t('doubleAddWarning', settings.language)}`);
      return;
    }

    const newMovie: LibraryMovie = {
      id: metadata.id,
      metadata,
      status,
      tags: metadata.genre.map((g) => g.toLowerCase()),
      review: {
        rating: 0,
        reviewText: '',
        watchDate: new Date().toISOString().split('T')[0],
        watchCount: status === 'watched' ? 1 : 0,
        favorite: false,
        notes: '',
      },
    };

    const newList = [newMovie, ...movies];
    handleUpdateMoviesList(newList);
  };

  // Save / Update movie details from Modal
  const handleSaveMovieDetails = (updatedMovie: LibraryMovie) => {
    const updatedList = movies.map((m) => (m.id === updatedMovie.id ? updatedMovie : m));
    handleUpdateMoviesList(updatedList);
  };

  // Delete movie
  const handleDeleteMovie = (id: string) => {
    const updatedList = movies.filter((m) => m.id !== id);
    handleUpdateMoviesList(updatedList);
  };

  // Fast Toggle Favorite
  const handleToggleFavorite = (id: string) => {
    const updatedList = movies.map((m) => {
      if (m.id === id) {
        return {
          ...m,
          review: { ...m.review, favorite: !m.review.favorite },
        };
      }
      return m;
    });
    handleUpdateMoviesList(updatedList);
  };

  // Reorder movies (for Custom Order sort mode)
  const handleReorderMovies = (draggedId: string, targetId: string, position: 'before' | 'after' = 'before') => {
    setMovies((currentMovies) => {
      const draggedIdx = currentMovies.findIndex((m) => m.id === draggedId);
      const targetIdx = currentMovies.findIndex((m) => m.id === targetId);
      if (draggedIdx === -1 || targetIdx === -1 || draggedIdx === targetIdx) return currentMovies;

      const updated = [...currentMovies];
      const [draggedMovie] = updated.splice(draggedIdx, 1);
      
      let newTargetIdx = updated.findIndex((m) => m.id === targetId);
      if (position === 'after') {
        newTargetIdx += 1;
      }
      updated.splice(newTargetIdx, 0, draggedMovie);

      storage.saveMovies(updated);
      return updated;
    });
  };

  // Drag states for Grid view reordering
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [dropPosition, setDropPosition] = useState<'before' | 'after'>('before');

  const handleDragStart = (e: React.DragEvent, id: string) => {
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
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (draggedId && draggedId !== targetId) {
      handleReorderMovies(draggedId, targetId, dropPosition);
    }
    setDraggedId(null);
    setDragOverId(null);
    setDropPosition('before');
  };

  // Update Settings
  const handleSaveSettings = (newSettings: ApiSettings) => {
    setSettings(newSettings);
    storage.saveSettings(newSettings);
  };

  // Import Database JSON
  const handleImportDatabase = (importedMovies: LibraryMovie[]) => {
    if (movies.length > 0) {
      if (confirm(t('mergeConfirm', settings.language))) {
        handleUpdateMoviesList(importedMovies);
      } else {
        const existingIds = new Set(movies.map((m) => m.metadata.id));
        const uniqueImported = importedMovies.filter((m) => !existingIds.has(m.metadata.id));
        handleUpdateMoviesList([...movies, ...uniqueImported]);
      }
    } else {
      handleUpdateMoviesList(importedMovies);
    }
  };

  // Reset Storage Database
  const handleResetDatabase = () => {
    localStorage.removeItem('cineshelf_library_movies');
    setMovies([]);
  };

  // Memoize full unique genres in library
  const allGenresInLibrary = useMemo(() => {
    const genres = new Set<string>();
    movies.forEach((m) => {
      m.metadata.genre.forEach((g) => {
        if (g && g !== 'N/A') genres.add(g);
      });
    });
    return Array.from(genres).sort();
  }, [movies]);

  // Memoize and filter movies
  const filteredAndSortedMovies = useMemo(() => {
    let result = [...movies];

    if (selectedStatus !== 'all') {
      result = result.filter((m) => m.status === selectedStatus);
    }

    if (selectedGenre) {
      result = result.filter((m) => m.metadata.genre.includes(selectedGenre));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (m) =>
          m.metadata.title.toLowerCase().includes(q) ||
          m.metadata.director.toLowerCase().includes(q) ||
          m.metadata.actors.some((a) => a.toLowerCase().includes(q)) ||
          m.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.metadata.title.localeCompare(b.metadata.title);
        case 'year':
          return b.metadata.year.localeCompare(a.metadata.year);
        case 'rating':
          return (b.review.rating || 0) - (a.review.rating || 0);
        case 'custom':
        case 'dateAdded':
        default:
          return 0;
      }
    });

    return result;
  }, [movies, selectedStatus, selectedGenre, searchQuery, sortBy]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-black text-white pb-16 font-sans select-none">
      
      {/* Decorative vertical separator grid stripes flanking the container */}
      <div className="viewport-line-v left-[3%] hidden lg:block" />
      <div className="viewport-line-v right-[3%] hidden lg:block" />

      {/* Stark Horizontal Header Banner */}
      <header className="border-b border-white/15 bg-black sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          
          {/* Logo Brand - Stark Brutalist */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('library')}>
            <svg
              className="h-10 w-10 shrink-0"
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Pitch black background box */}
              <rect width="100" height="100" fill="#000000"/>
              {/* Crisp stark white outer border frame */}
              <rect x="8" y="8" width="84" height="84" fill="none" stroke="#ffffff" stroke-width="3"/>
              {/* Left film strip sprocket grids */}
              <rect x="16" y="16" width="8" height="8" fill="#ffffff"/>
              <rect x="16" y="34" width="8" height="8" fill="#ffffff"/>
              <rect x="16" y="52" width="8" height="8" fill="#ffffff"/>
              <rect x="16" y="70" width="8" height="8" fill="#ffffff"/>
              {/* Right film strip sprocket grids */}
              <rect x="76" y="16" width="8" height="8" fill="#ffffff"/>
              <rect x="76" y="34" width="8" height="8" fill="#ffffff"/>
              <rect x="76" y="52" width="8" height="8" fill="#ffffff"/>
              <rect x="76" y="70" width="8" height="8" fill="#ffffff"/>
              {/* Center C/S stenciled layout */}
              <rect x="34" y="24" width="32" height="52" fill="none" stroke="#ffffff" stroke-width="3"/>
              <line x1="34" y1="50" x2="66" y2="50" stroke="#ffffff" stroke-width="3"/>
            </svg>
            <div>
              <h1 className="text-lg font-bold font-display tracking-widest text-white uppercase m-0 leading-none">
                {t('brandName', settings.language)}
              </h1>
              <span className="text-[9px] text-gray-500 font-mono block mt-1 tracking-widest uppercase">
                {t('tagline', settings.language)}
              </span>
            </div>
          </div>

          {/* Navigation Tab Bar */}
          <div className="flex items-center gap-4">
            <nav className="flex items-center border border-white/15 p-0.5 rounded-none bg-black">
              <button
                onClick={() => setActiveTab('library')}
                className={`flex items-center gap-2 px-4 py-2 rounded-none text-xs font-mono tracking-wider uppercase transition-all duration-150 ${
                  activeTab === 'library'
                    ? 'bg-white text-black font-bold'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t('navLibrary', settings.language)}</span>
                <span className={`px-1 rounded-none text-[9px] font-mono border ${
                  activeTab === 'library' ? 'bg-black text-white border-black' : 'bg-transparent text-gray-400 border-white/10'
                }`}>
                  {movies.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('stats')}
                className={`flex items-center gap-2 px-4 py-2 rounded-none text-xs font-mono tracking-wider uppercase transition-all duration-150 ${
                  activeTab === 'stats'
                    ? 'bg-white text-black font-bold'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <BarChart3 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t('navAnalytics', settings.language)}</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-2 px-4 py-2 rounded-none text-xs font-mono tracking-wider uppercase transition-all duration-150 ${
                  activeTab === 'settings'
                    ? 'bg-white text-black font-bold'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <SettingsIcon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t('navSettings', settings.language)}</span>
              </button>
            </nav>

            {/* Stark Header Action Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-white border border-white text-black hover:bg-black hover:text-white active:scale-95 text-xs font-mono uppercase tracking-wider rounded-none transition-all cursor-pointer font-bold"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden md:inline">{t('addFilm', settings.language)}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Decorative Viewport Horizontal Separation Bar */}
      <div className="viewport-line-h" />

      {/* Main Core Container */}
      <main className="max-w-6xl mx-auto px-6 py-8 relative z-10">
        
        {/* Tab 1: Movie Library Grid */}
        {activeTab === 'library' && (
          <div className="space-y-6">
            <LibraryFilters
              language={settings.language}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              selectedGenre={selectedGenre}
              setSelectedGenre={setSelectedGenre}
              sortBy={sortBy}
              setSortBy={setSortBy}
              allGenres={allGenresInLibrary}
              viewMode={viewMode}
              setViewMode={handleSetViewMode}
            />

            {/* Separator */}
            <div className="viewport-line-h my-2" />

            {/* Empty State Banner */}
            {movies.length === 0 ? (
              <div className="stark-panel p-10 md:p-16 rounded-none text-center space-y-8 max-w-xl mx-auto border-white/15 shadow-none animate-fade-in my-8">
                <div className="inline-flex p-4 border border-white text-white rounded-none bg-black">
                  <Film className="h-8 w-8" />
                </div>
                
                <div className="space-y-3">
                  <h2 className="text-xl font-bold font-display uppercase tracking-widest text-white">{t('emptyTitle', settings.language)}</h2>
                  <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed font-mono">
                    {t('emptySubtext', settings.language)}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                  <button
                    onClick={() => setIsSearchOpen(true)}
                    className="stark-btn-filled px-6 py-3 font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer rounded-none"
                  >
                    <Plus className="h-4 w-4" />
                    {t('searchDatabaseBtn', settings.language)}
                  </button>

                  <button
                    onClick={() => handleImportDatabase(storage.getMovies())}
                    className="stark-btn px-6 py-3 font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer rounded-none"
                  >
                    <AlertCircle className="h-4 w-4" />
                    {t('loadMockSeedBtn', settings.language)}
                  </button>
                </div>
              </div>
            ) : filteredAndSortedMovies.length === 0 ? (
              <div className="text-center py-20 text-gray-500 stark-panel rounded-none p-8 border-white/15">
                <AlertCircle className="h-10 w-10 text-gray-600 mx-auto mb-3" />
                <p className="text-sm font-bold font-mono uppercase text-gray-300">{t('noResults', settings.language)}</p>
                <p className="text-xs text-gray-400 mt-1">{t('noResultsSub', settings.language)}</p>
              </div>
            ) : viewMode === 'dvd' ? (
              <DvdShelfView
                movies={filteredAndSortedMovies}
                onMovieClick={(movie) => setSelectedMovie(movie)}
                isCustomOrder={sortBy === 'custom'}
                onReorderMovies={handleReorderMovies}
              />
            ) : (
              // Beautiful stark grid layout
              <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 ${draggedId ? 'dragging-active' : ''}`}>
                {filteredAndSortedMovies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    language={settings.language}
                    onClick={() => setSelectedMovie(movie)}
                    onToggleFavorite={() => handleToggleFavorite(movie.id)}
                    draggable={sortBy === 'custom'}
                    onDragStart={(e) => { if (sortBy !== 'custom') return; handleDragStart(e, movie.id); }}
                    onDragOver={(e) => { if (sortBy !== 'custom') return; handleDragOver(e, movie.id); }}
                    onDragEnter={(e) => { if (sortBy !== 'custom') return; handleDragEnter(e, movie.id); }}
                    onDragLeave={(e) => { if (sortBy !== 'custom') return; handleDragLeave(e, movie.id); }}
                    onDragEnd={() => { if (sortBy !== 'custom') return; handleDragEnd(); }}
                    onDrop={(e) => { if (sortBy !== 'custom') return; handleDrop(e, movie.id); }}
                    isDragging={sortBy === 'custom' && draggedId === movie.id}
                    isDragOverBefore={sortBy === 'custom' && draggedId !== null && dragOverId === movie.id && dropPosition === 'before'}
                    isDragOverAfter={sortBy === 'custom' && draggedId !== null && dragOverId === movie.id && dropPosition === 'after'}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Statistics */}
        {activeTab === 'stats' && <DashboardStats movies={movies} language={settings.language} />}

        {/* Tab 3: Settings */}
        {activeTab === 'settings' && (
          <SettingsPanel
            settings={settings}
            onSaveSettings={handleSaveSettings}
            movies={movies}
            onImportMovies={handleImportDatabase}
            onResetLibrary={handleResetDatabase}
          />
        )}
      </main>

      {/* Floating Search Modal */}
      {isSearchOpen && (
        <SearchModal
          onClose={() => setIsSearchOpen(false)}
          onAddMovie={handleAddMovie}
          existingMovies={movies}
          settings={settings}
        />
      )}

      {/* Movie Details Modal */}
      {selectedMovie && (
        viewMode === 'dvd' ? (
          <DvdDetailModal
            movie={selectedMovie}
            language={settings.language}
            onClose={() => setSelectedMovie(null)}
            onSave={handleSaveMovieDetails}
            onDelete={handleDeleteMovie}
          />
        ) : (
          <MovieDetailModal
            movie={selectedMovie}
            language={settings.language}
            onClose={() => setSelectedMovie(null)}
            onSave={handleSaveMovieDetails}
            onDelete={handleDeleteMovie}
          />
        )
      )}
    </div>
  );
}

export default App;
