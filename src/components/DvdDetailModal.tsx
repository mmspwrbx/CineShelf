import React, { useState, useEffect } from 'react';
import { Star, Plus, Trash2, Heart, Loader2 } from 'lucide-react';
import type { LibraryMovie } from '../types';
import { t } from '../services/translations';
import type { Language } from '../services/translations';

interface DvdDetailModalProps {
  movie: LibraryMovie;
  language: Language;
  onClose: () => void;
  onSave: (updatedMovie: LibraryMovie) => void;
  onDelete: (id: string) => void;
}

export const DvdDetailModal: React.FC<DvdDetailModalProps> = ({
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

  // 3D Animation state
  const [isAnimOpen, setIsAnimOpen] = useState(false);

  // Tab state inside the DVD case right leaf
  const [activeTab, setActiveTab] = useState<'review' | 'critique' | 'episodes'>('review');

  // Trigger 3D Open Animation on Mount
  useEffect(() => {
    const timer = setTimeout(() => setIsAnimOpen(true), 150);
    return () => clearTimeout(timer);
  }, []);

  // Sync episodes on mount for TVMaze series
  useEffect(() => {
    if (isSeries && metadata.source === 'tvmaze') {
      const rawId = metadata.id.replace('tvmaze-', '');
      let active = true;
      
      Promise.resolve().then(() => {
        if (active) setLoadingEpisodes(true);
      });

      fetch(`https://api.tvmaze.com/shows/${rawId}/episodes`)
        .then((res) => {
          if (!res.ok) throw new Error();
          return res.json();
        })
        .then((data) => {
          if (active && Array.isArray(data)) {
            setEpisodesList(
              data.map((ep: { season: number; number: number; name?: string }) => ({
                season: ep.season,
                number: ep.number,
                name: ep.name || `Episode ${ep.number}`,
              }))
            );
          }
        })
        .catch((err) => console.error('Failed to fetch dynamic episodes list from TVMaze', err))
        .finally(() => {
          if (active) setLoadingEpisodes(false);
        });

      return () => {
        active = false;
      };
    }
  }, [isSeries, metadata.id, metadata.source]);

  // Compute total seasons
  const computedSeasonsCount = episodesList.length > 0 
    ? Math.max(...episodesList.map((ep) => ep.season)) 
    : totalSeasons;

  // Filter episodes for active season
  const activeSeasonEpisodes = episodesList.length > 0
    ? episodesList.filter((ep) => ep.season === selectedSeason)
    : [...Array(totalEpisodes)].map((_, idx) => ({
        season: selectedSeason,
        number: idx + 1,
        name: `Episode ${idx + 1}`
      }));

  const selectedEpObj = activeSeasonEpisodes.find((ep) => ep.number === selectedEpisode);
  const selectedEpName = selectedEpObj ? selectedEpObj.name : '';

  // Handle Close with 3D animation
  const handleClose = () => {
    setIsAnimOpen(false);
    setTimeout(onClose, 800); // Wait for the rotate flip transition
  };

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
    handleClose();
  };

  const handleDelete = () => {
    if (confirm(t('deleteConfirm', language))) {
      onDelete(movie.id);
      handleClose();
    }
  };

  return (
    <div className="dvd-case-modal-overlay">
      <div className="dvd-case-modal-scale-container">
        
        {/* Closed/Open 3D Book Layout */}
        <div className={`dvd-case-opened-book ${isAnimOpen ? 'open' : ''}`}>
          
          {/* Middle Spine Hinge */}
          <div className="dvd-case-hinge" />

          {/* Left Leaf: Cover Page (Rotates -180deg to reveal inside booklet) */}
          <div className={`dvd-case-cover-leaf ${isAnimOpen ? 'open' : ''}`}>
            
            {/* Front Cover (visible when closed) */}
            <div className="dvd-case-face dvd-case-front-face">
              <img
                src={metadata.poster}
                alt={metadata.title}
                className="w-full h-full object-cover filter grayscale contrast-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=600&auto=format&fit=crop';
                }}
              />
              <div className="absolute inset-0 bg-black/40 pointer-events-none" />
              {/* Spine edge thickness overlay */}
              <div className="absolute right-0 top-0 w-2.5 h-full bg-gradient-to-l from-white/10 to-transparent pointer-events-none" />
            </div>

            {/* Back Cover: Inside Booklet (revealed when opened, on the left side) */}
            <div className="dvd-case-face dvd-case-back-face">
              <div className="p-10 h-full flex flex-col justify-between overflow-y-auto font-mono text-[13.5px] text-neutral-400 leading-relaxed uppercase select-none">
                <div className="space-y-6">
                  <div className="border-b border-dashed border-white/20 pb-3 text-[11px] text-gray-500 font-bold tracking-widest text-center">
                    {t('dvdCoverBackBooklet', language)}
                  </div>
                  
                  <div className="space-y-1.5">
                    <h3 className="text-xl font-bold text-white tracking-wider font-display font-sans normal-case">{metadata.title}</h3>
                    <div className="text-[12px] text-gray-500 flex gap-4">
                      <span>YEAR: {metadata.year}</span>
                      <span>RUN: {metadata.runtime}</span>
                    </div>
                  </div>

                  <p className="border-t border-b border-white/10 py-5 lowercase text-neutral-400 font-sans text-[14.5px] normal-case leading-relaxed">
                    {metadata.plot}
                  </p>

                  <div className="space-y-2 text-[12.5px]">
                    <div>
                      <span className="text-gray-600 font-bold">{t('directorLabel', language)}</span>
                      <span className="text-neutral-300 ml-1">{metadata.director}</span>
                    </div>
                    {metadata.actors.length > 0 && (
                      <div>
                        <span className="text-gray-600 font-bold">{t('starring', language)}</span>
                        <span className="text-neutral-300 ml-1 normal-case">{metadata.actors.join(', ')}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-600 font-bold">GENRES:</span>
                      <span className="text-neutral-300 ml-1">{metadata.genre.join(', ')}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-dashed border-white/20 pt-3 text-[11px] text-gray-600 flex justify-between">
                  <span>SRC: [{metadata.source}]</span>
                  <span>ID: [{metadata.id.replace('tvmaze-', '').replace('tmdb-', '').replace('omdb-', '')}]</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Leaf: Tray Disc Holder & Interactive Review Form */}
          <div className="dvd-case-tray-leaf">
            {/* Visual DVD Disc overlay in the tray background */}
            <div className="dvd-disc-holder" />

            {/* Content Form Overlay */}
            <div className="relative z-10 p-9 h-full flex flex-col justify-between bg-black/85">
              
              {/* Header Favorite Toggle & Close Button */}
              <div className="flex justify-between items-center pb-3 border-b border-white/10">
                <button
                  type="button"
                  onClick={() => setFavorite(!favorite)}
                  className="p-2.5 border border-white/15 bg-black hover:bg-white text-gray-400 hover:text-black transition-colors rounded-none cursor-pointer"
                  title="Toggle Favorite"
                >
                  <Heart className={`h-5 w-5 ${favorite ? 'fill-white text-white hover:text-black' : 'text-gray-400'}`} />
                </button>

                {/* Tab select bar */}
                <div className="flex border border-white/15 p-0.5 rounded-none bg-black max-w-[280px]">
                  <button
                    type="button"
                    onClick={() => setActiveTab('review')}
                    className={`px-4 py-1.5 text-xs font-mono uppercase transition-all duration-150 rounded-none cursor-pointer ${
                      activeTab === 'review' ? 'bg-white text-black font-bold' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    RATING
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('critique')}
                    className={`px-4 py-1.5 text-xs font-mono uppercase transition-all duration-150 rounded-none cursor-pointer ${
                      activeTab === 'critique' ? 'bg-white text-black font-bold' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    LOG
                  </button>
                  {isSeries && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('episodes')}
                      className={`px-4 py-1.5 text-xs font-mono uppercase transition-all duration-150 rounded-none cursor-pointer ${
                        activeTab === 'episodes' ? 'bg-white text-black font-bold' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      EPISODES
                    </button>
                  )}
                </div>
              </div>

              {/* Main Tab Area */}
              <div className="flex-1 my-3 overflow-y-auto pr-1 scrollbar-thin max-h-[550px]">
                
                {/* 1. Review/Rating General Tab */}
                {activeTab === 'review' && (
                  <div className="space-y-6 animate-fade-in">
                    
                    {/* Stars Select */}
                    <div className="space-y-2.5">
                      <label className="text-xs uppercase tracking-widest text-gray-500 font-mono font-bold block">
                        {t('userRating', language)} <span className="text-white text-base font-bold font-sans ml-1">{rating ? `${rating}/10` : t('unrated', language)}</span>
                      </label>
                      <div className="flex items-center gap-1">
                        {[...Array(10)].map((_, idx) => {
                          const starVal = idx + 1;
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setRating(starVal)}
                              onMouseEnter={() => setHoverRating(starVal)}
                              onMouseLeave={() => setHoverRating(0)}
                              className="transition-transform focus:outline-none cursor-pointer"
                            >
                              <Star
                                className={`h-6 w-6 ${
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

                    {/* Status Select */}
                    <div className="space-y-2">
                      <label className="text-[11px] uppercase tracking-widest text-gray-500 font-mono font-bold block">{t('statusLabel', language)}</label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as LibraryMovie['status'])}
                        className="stark-input px-3.5 py-2.5 text-sm rounded-none w-full cursor-pointer font-mono uppercase"
                      >
                        <option value="watched">{t('tabWatched', language).replace('[', '').replace(']', '')}</option>
                        <option value="watching">{t('tabWatching', language).replace('[', '').replace(']', '')}</option>
                        <option value="plan-to-watch">{t('tabPlan', language).replace('[', '').replace(']', '')}</option>
                      </select>
                    </div>

                    {/* Details row: watch count / date */}
                    <div className="grid grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-[11px] uppercase tracking-widest text-gray-500 font-mono font-bold block">{t('countLabel', language)}</label>
                        <input
                          type="number"
                          min="1"
                          value={watchCount}
                          onChange={(e) => setWatchCount(Math.max(1, parseInt(e.target.value) || 1))}
                          className="stark-input px-3.5 py-2 rounded-none text-sm w-full font-mono text-center"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] uppercase tracking-widest text-gray-500 font-mono font-bold block">{t('dateLabel', language)}</label>
                        <input
                          type="date"
                          value={watchDate}
                          onChange={(e) => setWatchDate(e.target.value)}
                          className="stark-input px-3 py-2 rounded-none text-xs w-full font-mono"
                        />
                      </div>
                    </div>

                    {/* Series toggle button */}
                    <div className="space-y-2">
                      <label className="text-[11px] uppercase tracking-widest text-gray-500 font-mono font-bold block">FORMAT</label>
                      <button
                        type="button"
                        onClick={() => {
                          setIsSeries(!isSeries);
                          setSelectedEpisode(null);
                        }}
                        className="stark-btn px-4 py-2.5 text-sm w-full font-mono uppercase tracking-wider text-center font-bold"
                      >
                        {isSeries ? '📺 SERIES' : '🎬 MOVIE'}
                      </button>
                    </div>

                    {/* Tags */}
                    <div className="space-y-2.5 border-t border-white/10 pt-5">
                      <label className="text-[11px] uppercase tracking-widest text-gray-500 font-mono font-bold block">{t('tagsLabel', language)}</label>
                      <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                        {tags.map((tag) => (
                          <span
                            key={tag}
                            className="flex items-center gap-1 border border-white/20 text-gray-300 px-2.5 py-0.5 rounded-none text-xs font-mono uppercase"
                          >
                            #{tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="text-gray-500 hover:text-white transition-colors ml-0.5 font-bold font-mono cursor-pointer"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>

                      <form onSubmit={handleAddTag} className="flex gap-2.5 mt-2.5">
                        <input
                          type="text"
                          placeholder={t('addTagPlaceholder', language)}
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          className="stark-input px-3.5 py-2 rounded-none text-sm w-full font-mono uppercase"
                        />
                        <button
                          type="submit"
                          className="p-2.5 stark-btn text-white rounded-none transition-all shadow-none cursor-pointer"
                        >
                          <Plus className="h-4.5 w-4.5" />
                        </button>
                      </form>
                    </div>

                  </div>
                )}

                {/* 2. Critique Log Tab */}
                {activeTab === 'critique' && (
                  <div className="space-y-6 animate-fade-in">
                    
                    {/* Review text */}
                    <div className="space-y-2">
                      <label className="text-[11px] uppercase tracking-widest text-gray-500 font-mono font-bold block">{t('userReviewLabel', language)}</label>
                      <textarea
                        placeholder={t('reviewPlaceholder', language)}
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        rows={10}
                        className="stark-input px-4 py-3 rounded-none text-sm w-full resize-none font-sans"
                      />
                    </div>

                    {/* Private Notes */}
                    <div className="space-y-2">
                      <label className="text-[11px] uppercase tracking-widest text-gray-500 font-mono font-bold block">{t('privateNotesLabel', language)}</label>
                      <input
                        type="text"
                        placeholder={t('notesPlaceholder', language)}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="stark-input px-4 py-3 rounded-none text-sm w-full font-sans"
                      />
                    </div>

                  </div>
                )}

                {/* 3. Series Episodes Tracker Tab */}
                {activeTab === 'episodes' && isSeries && (
                  <div className="space-y-5 animate-fade-in flex flex-col h-full min-h-0">
                    
                    {/* Seasons setup */}
                    <div className="flex gap-2 items-center justify-between">
                      {episodesList.length === 0 ? (
                        <div className="flex gap-2">
                          <div className="space-y-2">
                            <label className="text-[11px] text-gray-500 font-mono uppercase block">{t('seasonsCount', language).split(' ')[0]}</label>
                            <input
                              type="number"
                              min="1"
                              max="30"
                              value={totalSeasons}
                              onChange={(e) => setTotalSeasons(Math.max(1, Math.min(30, parseInt(e.target.value) || 1)))}
                              className="stark-input w-16 px-3 py-1.5 rounded-none text-sm font-mono text-center"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[11px] text-gray-500 font-mono uppercase block">{t('episodesCount', language).split(' ')[0]}</label>
                            <input
                              type="number"
                              min="1"
                              max="50"
                              value={totalEpisodes}
                              onChange={(e) => setTotalEpisodes(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
                              className="stark-input w-16 px-3 py-1.5 rounded-none text-sm font-mono text-center"
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-neutral-400 font-mono uppercase">
                          {computedSeasonsCount}S / {episodesList.length}EP
                        </span>
                      )}

                      <div className="space-y-2">
                        <select
                          value={selectedSeason}
                          onChange={(e) => {
                            setSelectedSeason(parseInt(e.target.value) || 1);
                            setSelectedEpisode(null);
                          }}
                          className="stark-input px-3 py-1.5 rounded-none text-sm cursor-pointer font-mono uppercase"
                        >
                          {[...Array(computedSeasonsCount)].map((_, idx) => (
                            <option key={idx + 1} value={idx + 1}>
                              SEASON {idx + 1}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {loadingEpisodes ? (
                      <div className="flex flex-col items-center justify-center py-20 gap-2.5 text-white animate-pulse font-mono text-xs uppercase">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span>[SYNCING...]</span>
                      </div>
                    ) : (
                      <>
                        {/* Episode Card Grid */}
                        <div className="grid grid-cols-5 gap-2 border border-white/10 p-4 bg-neutral-950/80 rounded-none max-h-72 overflow-y-auto scrollbar-thin">
                          {activeSeasonEpisodes.map((ep) => {
                            const epNum = ep.number;
                            const epKey = `S${selectedSeason}E${epNum}`;
                            const epRate = episodeRatings[epKey] || 0;
                            const isSelected = selectedEpisode === epNum;

                            return (
                              <div
                                key={epNum}
                                onClick={() => setSelectedEpisode(epNum)}
                                className={`p-2 border rounded-none cursor-pointer flex flex-col items-center justify-center transition-all text-center select-none ${
                                  isSelected
                                    ? 'border-white bg-white text-black font-bold'
                                    : 'border-white/10 bg-black hover:bg-white/5 text-gray-500'
                                }`}
                              >
                                <span className="text-[10px] font-mono block">E{epNum}</span>
                                <span className={`text-[11px] font-mono block mt-1 ${isSelected ? 'text-black' : 'text-white'}`}>
                                  {epRate > 0 ? epRate : '—'}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Interactive Episode star rating */}
                        {selectedEpisode !== null && (
                          <div className="p-4 border border-white/15 bg-neutral-950/95 rounded-none space-y-3 animate-fade-in mt-3">
                            <div className="flex justify-between items-center text-[11px] font-mono uppercase font-bold text-gray-500">
                              <span className="truncate max-w-[80%]">
                                S{selectedSeason}E{selectedEpisode} {selectedEpName && `- ${selectedEpName}`}
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
                                    className="transition-transform focus:outline-none cursor-pointer"
                                  >
                                    <Star
                                      className={`h-5.5 w-5.5 ${
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

              {/* Bottom Form Actions */}
              <div className="flex items-center justify-between border-t border-white/15 pt-5 mt-3">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex items-center gap-1.5 px-4.5 py-2.5 stark-btn-danger rounded-none transition-colors text-xs font-mono uppercase tracking-wider cursor-pointer"
                >
                  <Trash2 className="h-4.5 w-4.5" />
                  DELETE
                </button>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2.5 border border-white/20 hover:border-white text-gray-400 hover:text-white rounded-none transition-colors text-xs font-mono uppercase tracking-wider cursor-pointer"
                  >
                    {t('closeBtn', language)}
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleSave}
                    className="px-5 py-2.5 bg-white hover:bg-black border border-white text-black hover:text-white font-bold rounded-none transition-all text-xs font-mono uppercase tracking-wider cursor-pointer"
                  >
                    SAVE
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
