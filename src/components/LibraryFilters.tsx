import { Search, LayoutGrid, Disc } from 'lucide-react';
import { t } from '../services/translations';
import type { Language } from '../services/translations';

interface LibraryFiltersProps {
  language: Language;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedStatus: 'all' | 'watched' | 'watching' | 'plan-to-watch';
  setSelectedStatus: (s: 'all' | 'watched' | 'watching' | 'plan-to-watch') => void;
  selectedGenre: string;
  setSelectedGenre: (g: string) => void;
  sortBy: 'dateAdded' | 'rating' | 'title' | 'year' | 'custom';
  setSortBy: (s: 'dateAdded' | 'rating' | 'title' | 'year' | 'custom') => void;
  allGenres: string[];
  viewMode: 'grid' | 'dvd';
  setViewMode: (v: 'grid' | 'dvd') => void;
}

export const LibraryFilters: React.FC<LibraryFiltersProps> = ({
  language,
  searchQuery,
  setSearchQuery,
  selectedStatus,
  setSelectedStatus,
  selectedGenre,
  setSelectedGenre,
  sortBy,
  setSortBy,
  allGenres,
  viewMode,
  setViewMode,
}) => {
  return (
    <div className="stark-panel p-6 rounded-none flex flex-col gap-6 animate-fade-in z-10 relative">
      {/* Search Input and Sorts */}
      <div className="flex flex-col lg:flex-row gap-5 items-center justify-between">
        {/* Search */}
        <div className="relative w-full lg:w-[450px]">
          <Search className="absolute left-4 top-4.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder={t('searchPlaceholder', language)}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="stark-input pl-11 pr-4 py-3.5 rounded-none w-full text-sm font-mono uppercase placeholder:text-gray-600"
          />
        </div>

        {/* Filters Controls */}
        <div className="flex flex-wrap gap-4 items-center w-full lg:w-auto justify-end">
          {/* Genre select */}
          <div className="flex items-center gap-2.5">
            <span className="text-xs text-gray-400 font-mono uppercase">{t('genreLabel', language)}</span>
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="stark-input px-3 py-1.5 rounded-none text-xs font-mono cursor-pointer uppercase"
            >
              <option value="">{t('allGenres', language)}</option>
              {allGenres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>

          {/* Sort selection */}
          <div className="flex items-center gap-2.5">
            <span className="text-xs text-gray-400 font-mono uppercase">{t('sortLabel', language)}</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="stark-input px-3 py-1.5 rounded-none text-xs font-mono cursor-pointer uppercase"
            >
              <option value="dateAdded">{t('sortRecentlyAdded', language)}</option>
              <option value="rating">{t('sortPersonalRating', language)}</option>
              <option value="title">{t('sortTitle', language)}</option>
              <option value="year">{t('sortReleaseYear', language)}</option>
              <option value="custom">{t('sortCustom', language)}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabs for Watch Status & View Mode Switcher */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center border-t border-white/10 pt-5">
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => setSelectedStatus('all')}
            className={`px-5 py-2.5 rounded-none text-xs font-mono tracking-wider uppercase transition-all duration-150 border ${
              selectedStatus === 'all'
                ? 'bg-white text-black border-white font-bold'
                : 'bg-black text-gray-400 border-white/10 hover:text-white hover:border-white/20'
            }`}
          >
            <span>{t('tabAll', language)}</span>
          </button>

          <button
            onClick={() => setSelectedStatus('watched')}
            className={`px-5 py-2.5 rounded-none text-xs font-mono tracking-wider uppercase transition-all duration-150 border ${
              selectedStatus === 'watched'
                ? 'bg-white text-black border-white font-bold'
                : 'bg-black text-gray-400 border-white/10 hover:text-white hover:border-white/20'
            }`}
          >
            <span>{t('tabWatched', language)}</span>
          </button>

          <button
            onClick={() => setSelectedStatus('watching')}
            className={`px-5 py-2.5 rounded-none text-xs font-mono tracking-wider uppercase transition-all duration-150 border ${
              selectedStatus === 'watching'
                ? 'bg-white text-black border-white font-bold'
                : 'bg-black text-gray-400 border-white/10 hover:text-white hover:border-white/20'
            }`}
          >
            <span>{t('tabWatching', language)}</span>
          </button>

          <button
            onClick={() => setSelectedStatus('plan-to-watch')}
            className={`px-5 py-2.5 rounded-none text-xs font-mono tracking-wider uppercase transition-all duration-150 border ${
              selectedStatus === 'plan-to-watch'
                ? 'bg-white text-black border-white font-bold'
                : 'bg-black text-gray-400 border-white/10 hover:text-white hover:border-white/20'
            }`}
          >
            <span>{t('tabPlanToWatch', language)}</span>
          </button>
        </div>

        {/* View Switcher Pill Toggle */}
        <div className="flex items-center border border-white/15 p-0.5 rounded-none bg-black self-end md:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-none text-xs font-mono tracking-wider uppercase transition-all duration-150 cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-white text-black font-bold'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
            title={t('viewGrid', language)}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            <span>{t('viewGrid', language).split(' ')[0]}</span>
          </button>
          <button
            onClick={() => setViewMode('dvd')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-none text-xs font-mono tracking-wider uppercase transition-all duration-150 cursor-pointer ${
              viewMode === 'dvd'
                ? 'bg-white text-black font-bold'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
            title={t('viewDvd', language)}
          >
            <Disc className="h-3.5 w-3.5" />
            <span>{t('viewDvd', language).split(' ')[0]}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
