import React from 'react';
import type { LibraryMovie } from '../types';
import { Film, Clock, Star, Edit3, Award } from 'lucide-react';
import { t } from '../services/translations';
import type { Language } from '../services/translations';

interface DashboardStatsProps {
  movies: LibraryMovie[];
  language: Language;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ movies, language }) => {
  const totalCount = movies.length;
  const watchedMovies = movies.filter((m) => m.status === 'watched');
  const watchedCount = watchedMovies.length;
  const planCount = movies.filter((m) => m.status === 'plan-to-watch').length;
  const watchingCount = movies.filter((m) => m.status === 'watching').length;

  const ratedMovies = watchedMovies.filter((m) => m.review.rating > 0);
  const averageRating =
    ratedMovies.length > 0
      ? (ratedMovies.reduce((acc, m) => acc + m.review.rating, 0) / ratedMovies.length).toFixed(1)
      : '0.0';

  const totalMinutes = watchedMovies.reduce((acc, m) => {
    const runtimeStr = m.metadata.runtime || '0';
    const parsedMinutes = parseInt(runtimeStr.replace(/[^0-9]/g, '')) || 90;
    return acc + parsedMinutes * (m.review.watchCount || 1);
  }, 0);
  const totalHours = Math.round(totalMinutes / 60);

  const reviewsCount = movies.filter((m) => m.review.reviewText.trim().length > 0).length;
  const favoritesCount = movies.filter((m) => m.review.favorite).length;

  const genreCounts: { [key: string]: number } = {};
  movies.forEach((m) => {
    m.metadata.genre.forEach((g) => {
      if (g && g !== 'N/A') {
        genreCounts[g] = (genreCounts[g] || 0) + 1;
      }
    });
  });

  const sortedGenres = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const maxGenreCount = sortedGenres.length > 0 ? sortedGenres[0][1] : 1;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Cataloged */}
        <div className="stark-panel p-6 rounded-none flex items-center gap-4 relative overflow-hidden group hover:border-white transition-all duration-200">
          <div className="p-3.5 border border-white bg-black text-white group-hover:bg-white group-hover:text-black transition-all">
            <Film className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-gray-500 font-mono font-bold uppercase tracking-wider block">{t('statsCataloged', language)}</span>
            <span className="text-2xl font-bold font-mono text-white tracking-tight">{totalCount}</span>
            <span className="text-[10px] text-gray-500 block font-mono">
              {watchingCount} {t('statsActive', language)} • {planCount} {t('statsPlan', language)}
            </span>
          </div>
        </div>

        {/* Watch Time */}
        <div className="stark-panel p-6 rounded-none flex items-center gap-4 relative overflow-hidden group hover:border-white transition-all duration-200">
          <div className="p-3.5 border border-white bg-black text-white group-hover:bg-white group-hover:text-black transition-all">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-gray-500 font-mono font-bold uppercase tracking-wider block">{t('statsScreenTime', language)}</span>
            <span className="text-2xl font-bold font-mono text-white tracking-tight">{totalHours} {t('statsHours', language)}</span>
            <span className="text-[10px] text-gray-500 block font-mono">
              {t('statsAcross', language)} {watchedCount} {t('statsFilms', language)}
            </span>
          </div>
        </div>

        {/* Avg Rating */}
        <div className="stark-panel p-6 rounded-none flex items-center gap-4 relative overflow-hidden group hover:border-white transition-all duration-200">
          <div className="p-3.5 border border-white bg-black text-white group-hover:bg-white group-hover:text-black transition-all">
            <Star className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-gray-500 font-mono font-bold uppercase tracking-wider block">{t('statsAvgRating', language)}</span>
            <span className="text-2xl font-bold font-mono text-white tracking-tight">{averageRating}</span>
            <span className="text-[10px] text-gray-500 block font-mono">
              {t('statsFromRated', language)} {ratedMovies.length} {t('statsRatedOnly', language)}
            </span>
          </div>
        </div>

        {/* Reviews & Favorites */}
        <div className="stark-panel p-6 rounded-none flex items-center gap-4 relative overflow-hidden group hover:border-white transition-all duration-200">
          <div className="p-3.5 border border-white bg-black text-white group-hover:bg-white group-hover:text-black transition-all">
            <Edit3 className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-gray-500 font-mono font-bold uppercase tracking-wider block">{t('statsUserReviews', language)}</span>
            <span className="text-2xl font-bold font-mono text-white tracking-tight">{reviewsCount}</span>
            <span className="text-[10px] text-gray-500 block font-mono">
              {t('statsAndFavorites', language)} {favoritesCount} {t('statsFavorites', language)}
            </span>
          </div>
        </div>
      </div>

      {/* Analytics Splits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left 2 Cols: Favorite Genres Breakdown */}
        <div className="stark-panel p-6 rounded-none md:col-span-2 space-y-5">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <Award className="h-4 w-4 text-white" />
            <h3 className="text-sm font-bold font-mono uppercase tracking-widest text-white">{t('statsDistribution', language)}</h3>
          </div>

          {sortedGenres.length === 0 ? (
            <div className="text-center py-8 text-[10px] text-gray-500 font-mono uppercase">
              {t('statsNoMetrics', language)}
            </div>
          ) : (
            <div className="space-y-4">
              {sortedGenres.map(([genre, count]) => {
                const percentage = Math.round((count / maxGenreCount) * 100);
                return (
                  <div key={genre} className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] font-mono uppercase font-semibold">
                      <span className="text-gray-300">{genre}</span>
                      <span className="text-white">
                        {count} {language === 'en' ? (count === 1 ? 'FILM' : 'FILMS') : t('statsFilms', language)}
                      </span>
                    </div>
                    {/* Stark solid progress bar with thin border */}
                    <div className="w-full h-2 bg-black border border-white/20 rounded-none overflow-hidden">
                      <div
                        style={{ width: `${percentage}%` }}
                        className="h-full bg-white rounded-none transition-all duration-300"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Col: Library Composition Info Card */}
        <div className="stark-panel p-6 rounded-none flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-4">
              <Film className="h-4 w-4 text-white" />
              <h3 className="text-sm font-bold font-mono uppercase tracking-widest text-white">{t('statsBreakdown', language)}</h3>
            </div>
            
            <div className="space-y-4 text-xs font-mono uppercase text-gray-300">
              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span>{t('tabWatched', language).replace(/[\[\]]/g, '')}</span>
                <span className="font-bold text-white border border-white/20 px-2 py-0.5 rounded-none bg-black">
                  {watchedCount}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span>{t('tabWatching', language).replace(/[\[\]]/g, '')}</span>
                <span className="font-bold text-white border border-white/20 px-2 py-0.5 rounded-none bg-black">
                  {watchingCount}
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span>{t('tabPlan', language).replace(/[\[\]]/g, '')}</span>
                <span className="font-bold text-white border border-white/20 px-2 py-0.5 rounded-none bg-black">
                  {planCount}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 border border-white/15 p-4 text-center bg-black rounded-none">
            <span className="text-[9px] font-bold text-gray-500 block uppercase font-mono tracking-widest">{t('statsLevelLabel', language)}</span>
            <span className="text-xs font-bold font-mono text-white mt-1 block tracking-wider uppercase">
              {watchedCount >= 50
                ? t('statsLevelHistorian', language)
                : watchedCount >= 20
                ? t('statsLevelCritic', language)
                : watchedCount >= 5
                ? t('statsLevelSpectator', language)
                : t('statsLevelInitiate', language)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
