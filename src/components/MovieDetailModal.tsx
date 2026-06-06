import React, { useState, useEffect } from 'react';
import { X, Star, Calendar, Clock, Film, Plus, Trash2, Heart, Loader2 } from 'lucide-react';
import type { LibraryMovie } from '../types';
import { t } from '../services/translations';
import type { Language } from '../services/translations';

interface MovieDetailModalProps {
  movie: LibraryMovie;
  language: Language;
  onClose: () => void;
  onSave: (updatedMovie: LibraryMovie) => void;
  onDelete: (id: string) => void;
}

export const MovieDetailModal: React.FC<MovieDetailModalProps> = ({
  movie,
  language,
  onClose,
  onSave,
  onDelete,
}) => {
  const { metadata } = movie;

  // Local state for editing reviews and tags
  const [rating, setRating] = useState(movie.review.rating);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState(movie.review.reviewText);
  const [watchDate, setWatchDate] = useState(movie.review.watchDate);
  const [watchCount, setWatchCount] = useState(movie.review.watchCount);
  const [favorite, setFavorite] = useState(movie.review.favorite);
  const [notes, setNotes] = useState(movie.review.notes);
  const [status, setStatus] = useState(movie.status);
  
  const [tags, setTags] = useState<string[]>(movie.tags);
  const [newTag, setNewTag] = useState('');

  // Series Specific States
  const [isSeries, setIsSeries] = useState(!!metadata.isSeries || metadata.source === 'tvmaze');
  const [totalSeasons, setTotalSeasons] = useState(movie.metadata.seasons || 1);
  const [totalEpisodes, setTotalEpisodes] = useState(movie.metadata.episodes || 10);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState<number | null>(null);
  const [episodeRatings, setEpisodeRatings] = useState<Record<string, number>>(movie.review.episodeRatings || {});
  const [episodeHoverRating, setEpisodeHoverRating] = useState(0);

  // TVMaze Live Episode List Sync States
  const [episodesList, setEpisodesList] = useState<{ season: number; number: number; name: string }[]>([]);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);

  // Dynamic episodes fetch on mount for TVMaze series
  useEffect(() => {
    if (isSeries && metadata.source === 'tvmaze') {
      const rawId = metadata.id.replace('tvmaze-', '');
      setLoadingEpisodes(true);
      fetch(`https://api.tvmaze.com/shows/${rawId}/episodes`)
        .then((res) => {
          if (!res.ok) throw new Error();
          return res.json();
        })
        .then((data) => {
          if (Array.isArray(data)) {
            setEpisodesList(
              data.map((ep) => ({
                season: ep.season,
                number: ep.number,
                name: ep.name || `Episode ${ep.number}`,
              }))
            );
          }
        })
        .catch((err) => console.error('Failed to fetch dynamic episodes list from TVMaze', err))
        .finally(() => setLoadingEpisodes(false));
    }
  }, [isSeries, metadata.id, metadata.source]);

  // Compute total seasons from active episode list or fallback
  const computedSeasonsCount = episodesList.length > 0 
    ? Math.max(...episodesList.map((ep) => ep.season)) 
    : totalSeasons;

  // Filter episodes for the currently viewed season
  const activeSeasonEpisodes = episodesList.length > 0
    ? episodesList.filter((ep) => ep.season === selectedSeason)
    : [...Array(totalEpisodes)].map((_, idx) => ({
        season: selectedSeason,
        number: idx + 1,
        name: `Episode ${idx + 1}`
      }));

  // Resolve current active episode name on rating highlight
  const selectedEpObj = activeSeasonEpisodes.find((ep) => ep.number === selectedEpisode);
  const selectedEpName = selectedEpObj ? selectedEpObj.name : '';

  // Handle Tag creation
  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newTag.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSave = () => {
    const finalSeasons = episodesList.length > 0 ? computedSeasonsCount : totalSeasons;
    const finalEpisodes = episodesList.length > 0 ? episodesList.length : totalEpisodes;

    onSave({
      ...movie,
      status,
      tags,
      metadata: {
        ...metadata,
        isSeries,
        seasons: finalSeasons,
        episodes: finalEpisodes,
      },
      review: {
        ...movie.review,
        rating,
        reviewText,
        watchDate,
        watchCount,
        favorite,
        notes,
        episodeRatings,
      },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-none overflow-y-auto animate-fade-in">
      <div className="stark-panel w-full max-w-6xl rounded-none overflow-hidden relative animate-scale-in flex flex-col md:flex-row my-8 md:h-[85vh] max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 md:right-8 z-20 p-2.5 rounded-none bg-black border border-white/15 text-gray-400 hover:text-white hover:border-white transition-all shadow-none"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Left Column: Fixed to natural block layout flow (No cut-off or blank gaps!) */}
        <div className="w-full md:w-[42%] bg-black border-r border-white/15 overflow-y-auto md:h-full flex flex-col">
          
          {/* Poster Cover */}
          <div className="relative aspect-[2/3] w-full max-h-[350px] md:max-h-[440px] overflow-hidden border-b border-white/15 bg-neutral-950">
            <img
              src={metadata.poster}
              alt={metadata.title}
              className="w-full h-full object-cover object-top filter grayscale contrast-[1.05]"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=600&auto=format&fit=crop';
              }}
            />
            {/* Ambient shadow gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            
            {/* Favorite toggle on card */}
            <button
              onClick={() => setFavorite(!favorite)}
              className="absolute top-4 left-4 p-2 rounded-none bg-black border border-white/15 text-gray-400 hover:text-white hover:border-white transition-all shadow-none"
            >
              <Heart className={`h-4 w-4 ${favorite ? 'fill-white text-white' : 'text-gray-300'}`} />
            </button>
          </div>

          {/* Quick Technical Badges sit immediately below the cover (stacked naturally!) */}
          <div className="p-5 bg-black space-y-3 border-b border-white/10">
            <h2 className="text-lg font-bold font-display uppercase tracking-widest text-white leading-tight">{metadata.title}</h2>
            
            <div className="grid grid-cols-2 gap-3 text-[10px] text-gray-400 font-mono uppercase">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-white" />
                <span>{metadata.released}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-white" />
                <span>{metadata.runtime}</span>
              </div>
              <div className="flex items-center gap-1.5 col-span-2">
                <Film className="h-3.5 w-3.5 text-white" />
                <span className="truncate">{t('directorLabel', language)}{metadata.director}</span>
              </div>
            </div>

            {metadata.imdbRating && metadata.imdbRating !== 'N/A' && (
              <div className="flex items-center justify-between border-t border-white/10 pt-2.5">
                <span className="text-[9px] uppercase tracking-widest text-gray-500 font-mono font-bold">{t('apiRating', language)}</span>
                <span className="text-[10px] font-bold text-white border border-white/20 px-2 py-0.5 font-mono">
                  [★ {metadata.imdbRating} / 10]
                </span>
              </div>
            )}
          </div>

          {/* Series Seasons & Episodes Tracker widget (sits below title block) */}
          {isSeries && (
            <div className="p-5 space-y-4 bg-black border-b border-white/10 animate-fade-in flex-grow flex flex-col min-h-0">
              <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                <span className="text-[9px] uppercase tracking-widest text-gray-500 font-mono font-bold">
                  {t('seriesTrackerTitle', language)}
                </span>
              </div>

              {loadingEpisodes ? (
                <div className="flex flex-col items-center justify-center py-10 gap-2 text-white animate-pulse font-mono text-[9px] uppercase tracking-wider">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>[LOADING_TVMAZE_EPISODES...]</span>
                </div>
              ) : (
                <>
                  {/* Series Dimension Configs */}
                  <div className="grid grid-cols-3 gap-2">
                    {/* Hide manual inputs if episodes list is loaded from TVMaze */}
                    {episodesList.length === 0 ? (
                      <>
                        <div className="space-y-1">
                          <label className="text-[8px] uppercase tracking-widest text-gray-500 font-mono font-bold block">
                            {t('seasonsCount', language)}
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="30"
                            value={totalSeasons}
                            onChange={(e) => setTotalSeasons(Math.max(1, Math.min(30, parseInt(e.target.value) || 1)))}
                            className="stark-input px-2.5 py-1.5 rounded-none text-[11px] w-full font-mono text-center"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] uppercase tracking-widest text-gray-500 font-mono font-bold block">
                            {t('episodesCount', language)}
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="50"
                            value={totalEpisodes}
                            onChange={(e) => setTotalEpisodes(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
                            className="stark-input px-2.5 py-1.5 rounded-none text-[11px] w-full font-mono text-center"
                          />
                        </div>
                      </>
                    ) : (
                      <div className="col-span-2 border border-white/10 p-2 text-left font-mono text-[9px] uppercase flex items-center justify-between text-neutral-400 bg-neutral-950/20">
                        <span>{computedSeasonsCount} {t('seasonsCount', language)}</span>
                        <span>{episodesList.length} {t('episodesCount', language)}</span>
                      </div>
                    )}
                    
                    <div className="space-y-1">
                      <label className="text-[8px] uppercase tracking-widest text-gray-500 font-mono font-bold block">
                        {t('activeSeasonLabel', language).split(' ')[0]}
                      </label>
                      <select
                        value={selectedSeason}
                        onChange={(e) => {
                          setSelectedSeason(parseInt(e.target.value) || 1);
                          setSelectedEpisode(null);
                        }}
                        className="stark-input px-1.5 py-1.5 rounded-none text-[11px] w-full cursor-pointer font-mono uppercase text-center"
                      >
                        {[...Array(computedSeasonsCount)].map((_, idx) => (
                          <option key={idx + 1} value={idx + 1}>
                            S{idx + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Episode Cards Grid */}
                  <div className="grid grid-cols-4 gap-1.5 border border-white/10 p-2.5 bg-neutral-950/80 rounded-none flex-grow overflow-y-auto min-h-0">
                    {activeSeasonEpisodes.map((ep) => {
                      const epNum = ep.number;
                      const epKey = `S${selectedSeason}E${epNum}`;
                      const epRate = episodeRatings[epKey] || 0;
                      const isSelected = selectedEpisode === epNum;

                      return (
                        <div
                          key={epNum}
                          onClick={() => setSelectedEpisode(epNum)}
                          className={`p-1.5 border rounded-none cursor-pointer flex flex-col items-center justify-between transition-all select-none text-center ${
                            isSelected
                              ? 'border-white bg-white text-black font-bold'
                              : 'border-white/10 bg-black hover:bg-white/5 text-gray-400'
                          }`}
                        >
                          <span className="text-[7.5px] font-mono block">E{epNum < 10 ? `0${epNum}` : epNum}</span>
                          <span className={`text-[8.5px] font-mono block mt-0.5 ${isSelected ? 'text-black' : 'text-white'}`}>
                            {epRate > 0 ? `★${epRate}` : '—'}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Interactive Episode Rating Star Widget */}
                  {selectedEpisode !== null && (
                    <div className="p-2.5 border border-white/15 bg-neutral-950/90 rounded-none space-y-2 animate-fade-in">
                      <div className="flex justify-between items-center text-[8px] font-mono uppercase font-bold text-gray-400">
                        <span className="truncate max-w-[85%]">
                          {t('ratingEpisodeText', language)} S{selectedSeason}E{selectedEpisode}
                          {selectedEpName && ` - ${selectedEpName}`}
                        </span>
                        {episodeRatings[`S${selectedSeason}E${selectedEpisode}`] > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              const newRatings = { ...episodeRatings };
                              delete newRatings[`S${selectedSeason}E${selectedEpisode}`];
                              setEpisodeRatings(newRatings);
                            }}
                            className="text-rose-400 hover:underline cursor-pointer"
                          >
                            {t('clearRatingBtn', language)}
                          </button>
                        )}
                      </div>
                      <div className="flex items-center justify-center gap-1">
                        {[...Array(10)].map((_, idx) => {
                          const starVal = idx + 1;
                          const epKey = `S${selectedSeason}E${selectedEpisode}`;
                          const currentRate = episodeRatings[epKey] || 0;

                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setEpisodeRatings({
                                  ...episodeRatings,
                                  [epKey]: starVal,
                                });
                              }}
                              onMouseEnter={() => setEpisodeHoverRating(starVal)}
                              onMouseLeave={() => setEpisodeHoverRating(0)}
                              className="transition-transform focus:outline-none scale-90"
                            >
                              <Star
                                className={`h-4.5 w-4.5 ${
                                  starVal <= (episodeHoverRating || currentRate)
                                    ? 'fill-white text-white'
                                    : 'text-gray-700 hover:text-gray-400'
                                  }`}
                              />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

        </div>

        {/* Right Column: User Review & Metadata Fields (Pinned actions at bottom!) */}
        <div className="w-full md:w-3/5 p-5 md:pt-6 md:pb-6 md:pl-6 md:pr-0 flex flex-col justify-between md:h-full bg-black overflow-hidden">
          <div className="flex-1 overflow-y-auto pr-5 md:pr-20 space-y-4 min-h-0 max-h-[52vh] md:max-h-none">
            {/* Header info */}
            <div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {metadata.genre.map((g) => (
                  <span
                    key={g}
                    className="border border-white/20 text-white px-2.5 py-0.5 text-[9px] font-mono uppercase font-bold"
                  >
                    {g}
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">{metadata.plot}</p>
              {metadata.actors.length > 0 && (
                <div className="mt-3 text-[10px] font-mono uppercase">
                  <span className="text-gray-500">{t('starring', language)}</span>
                  <span className="text-gray-300">{metadata.actors.join(', ')}</span>
                </div>
              )}
            </div>

            {/* Custom Interactive Stars (1-10) */}
            <div className="space-y-2.5 border-t border-white/10 pt-4">
              <label className="text-[9px] uppercase tracking-widest text-gray-500 font-mono font-bold block">
                {t('userRating', language)} <span className="text-white text-xs font-bold">{rating ? `${rating}/10` : t('unrated', language)}</span>
              </label>
              <div className="flex items-center gap-1.5">
                {[...Array(10)].map((_, idx) => {
                  const starVal = idx + 1;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setRating(starVal)}
                      onMouseEnter={() => setHoverRating(starVal)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="transition-transform focus:outline-none"
                    >
                      <Star
                        className={`h-5 w-5 ${
                          starVal <= (hoverRating || rating)
                            ? 'fill-white text-white'
                            : 'text-gray-700 hover:text-gray-400'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Watch Progress & Status Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 border-t border-white/10 pt-4">
              {/* Watch Status */}
              <div className="space-y-1.5 sm:col-span-1">
                <label className="text-[9px] uppercase tracking-widest text-gray-500 font-mono font-bold block">{t('statusLabel', language)}</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="stark-input px-2.5 py-2 rounded-none text-xs w-full cursor-pointer font-mono uppercase"
                >
                  <option value="watched">{t('tabWatched', language).replace(/[\[\]]/g, '')}</option>
                  <option value="watching">{t('tabWatching', language).replace(/[\[\]]/g, '')}</option>
                  <option value="plan-to-watch">{t('tabPlan', language).replace(/[\[\]]/g, '')}</option>
                </select>
              </div>

              {/* Format Switch Toggle */}
              <div className="space-y-1.5 sm:col-span-1">
                <label className="text-[9px] uppercase tracking-widest text-gray-500 font-mono font-bold block">FORMAT</label>
                <button
                  type="button"
                  onClick={() => {
                    setIsSeries(!isSeries);
                    setSelectedEpisode(null);
                  }}
                  className="stark-btn px-2 py-2 text-xs w-full font-mono uppercase tracking-wider text-center font-bold"
                >
                  {isSeries ? '📺 SERIES' : '🎬 MOVIE'}
                </button>
              </div>

              {/* Watch count */}
              <div className="space-y-1.5 sm:col-span-1">
                <label className="text-[9px] uppercase tracking-widest text-gray-500 font-mono font-bold block">{t('countLabel', language)}</label>
                <input
                  type="number"
                  min="1"
                  value={watchCount}
                  onChange={(e) => setWatchCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="stark-input px-2.5 py-2 rounded-none text-xs w-full font-mono text-center"
                />
              </div>

              {/* Watch date */}
              <div className="space-y-1.5 sm:col-span-1">
                <label className="text-[9px] uppercase tracking-widest text-gray-500 font-mono font-bold block">{t('dateLabel', language)}</label>
                <input
                  type="date"
                  value={watchDate}
                  onChange={(e) => setWatchDate(e.target.value)}
                  className="stark-input px-2.5 py-2 rounded-none text-[11px] w-full font-mono"
                />
              </div>
            </div>

            {/* Tags section */}
            <div className="space-y-2 border-t border-white/10 pt-4">
              <label className="text-[9px] uppercase tracking-widest text-gray-500 font-mono font-bold block">{t('tagsLabel', language)}</label>
              
              <div className="flex flex-wrap gap-1.5 mb-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 border border-white/20 text-gray-300 px-2 py-0.5 rounded-none text-[9px] font-mono uppercase"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-gray-500 hover:text-white transition-colors ml-1 font-bold font-mono"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <form onSubmit={handleAddTag} className="flex gap-2">
                <input
                  type="text"
                  placeholder={t('addTagPlaceholder', language)}
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="stark-input px-3 py-2 rounded-none text-xs w-full font-mono uppercase"
                />
                <button
                  type="submit"
                  className="p-2 stark-btn text-white rounded-none transition-all shadow-none"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </form>
            </div>

            {/* Review Box */}
            <div className="space-y-1.5 border-t border-white/10 pt-4">
              <label className="text-[9px] uppercase tracking-widest text-gray-500 font-mono font-bold block">{t('userReviewLabel', language)}</label>
              <textarea
                placeholder={t('reviewPlaceholder', language)}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={3}
                className="stark-input px-4 py-3 rounded-none text-xs w-full resize-none font-sans"
              />
            </div>

            {/* Private Notes */}
            <div className="space-y-1.5">
              <label className="text-[9px] uppercase tracking-widest text-gray-500 font-mono font-bold block">{t('privateNotesLabel', language)}</label>
              <input
                type="text"
                placeholder={t('notesPlaceholder', language)}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="stark-input px-4 py-2.5 rounded-none text-xs w-full font-sans"
              />
            </div>
          </div>

          {/* Action Row (Pinned and static!) */}
          <div className="flex items-center justify-between border-t border-white/15 pt-4 mt-4 md:pr-6">
            <button
              onClick={() => {
                if (confirm(t('deleteConfirm', language))) {
                  onDelete(movie.id);
                  onClose();
                }
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 stark-btn-danger rounded-none transition-all text-xs font-semibold font-mono uppercase tracking-wider cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
              {t('deleteRecordBtn', language)}
            </button>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2.5 stark-btn rounded-none transition-all text-xs font-semibold font-mono uppercase tracking-wider"
              >
                {t('closeBtn', language)}
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2.5 stark-btn-filled font-bold rounded-none transition-all text-xs font-mono uppercase tracking-wider cursor-pointer"
              >
                {t('saveRecordBtn', language)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
