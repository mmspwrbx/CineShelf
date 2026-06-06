import type { LibraryMovie, ApiSettings } from '../types';

const MOVIES_KEY = 'cineshelf_library_movies';
const SETTINGS_KEY = 'cineshelf_library_settings';

const DEFAULT_SETTINGS: ApiSettings = {
  tmdbApiKey: '',
  omdbApiKey: '',
  activeEngine: 'tvmaze',
  activeEngines: ['tvmaze'],
  language: 'en',
};

export const storage = {
  // Load movies from LocalStorage
  getMovies(): LibraryMovie[] {
    try {
      const data = localStorage.getItem(MOVIES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to parse cineshelf movies from storage', e);
      return [];
    }
  },

  // Save movies list
  saveMovies(movies: LibraryMovie[]): void {
    try {
      localStorage.setItem(MOVIES_KEY, JSON.stringify(movies));
    } catch (e) {
      console.error('Failed to save cineshelf movies to storage', e);
    }
  },

  // Load api config
  getSettings(): ApiSettings {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        const settings = { ...DEFAULT_SETTINGS, ...parsed };
        if (!settings.activeEngines) {
          settings.activeEngines = [settings.activeEngine || 'tvmaze'];
        }
        return settings;
      }
      return DEFAULT_SETTINGS;
    } catch (e) {
      return DEFAULT_SETTINGS;
    }
  },

  // Save api config
  saveSettings(settings: ApiSettings): void {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save cineshelf settings to storage', e);
    }
  },

  // Export database as JSON file string
  exportLibrary(movies: LibraryMovie[]): string {
    return JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        version: '1.0.0',
        movies,
      },
      null,
      2
    );
  },

  // Import and validate JSON database
  importLibrary(jsonString: string): LibraryMovie[] {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || !Array.isArray(parsed.movies)) {
        throw new Error('Invalid backup file: movies list is missing or invalid.');
      }
      
      // Perform simple integrity validations
      const validated: LibraryMovie[] = parsed.movies.map((m: any, idx: number) => {
        if (!m.id || !m.metadata || !m.metadata.title) {
          throw new Error(`Movie object at index ${idx} is missing essential data.`);
        }
        
        return {
          id: m.id,
          metadata: {
            id: m.metadata.id || m.id,
            title: m.metadata.title,
            year: m.metadata.year || 'N/A',
            released: m.metadata.released || 'N/A',
            runtime: m.metadata.runtime || 'N/A',
            genre: Array.isArray(m.metadata.genre) ? m.metadata.genre : ['N/A'],
            director: m.metadata.director || 'Unknown',
            actors: Array.isArray(m.metadata.actors) ? m.metadata.actors : [],
            plot: m.metadata.plot || '',
            poster: m.metadata.poster || '',
            imdbRating: m.metadata.imdbRating || 'N/A',
            source: m.metadata.source || 'local',
            isSeries: !!m.metadata.isSeries,
            seasons: typeof m.metadata.seasons === 'number' ? m.metadata.seasons : undefined,
            episodes: typeof m.metadata.episodes === 'number' ? m.metadata.episodes : undefined,
          },
          review: {
            rating: typeof m.review?.rating === 'number' ? m.review.rating : 0,
            reviewText: m.review?.reviewText || '',
            watchDate: m.review?.watchDate || new Date().toISOString().split('T')[0],
            watchCount: typeof m.review?.watchCount === 'number' ? m.review.watchCount : 1,
            favorite: !!m.review?.favorite,
            notes: m.review?.notes || '',
            seasonsWatched: typeof m.review?.seasonsWatched === 'number' ? m.review.seasonsWatched : undefined,
            episodesWatched: typeof m.review?.episodesWatched === 'number' ? m.review.episodesWatched : undefined,
            episodeRatings: typeof m.review?.episodeRatings === 'object' && m.review.episodeRatings !== null ? m.review.episodeRatings : {},
          },
          status: ['watched', 'watching', 'plan-to-watch'].includes(m.status) ? m.status : 'watched',
          tags: Array.isArray(m.tags) ? m.tags : [],
        };
      });

      return validated;
    } catch (e) {
      throw new Error(e instanceof Error ? e.message : 'Failed to parse file.');
    }
  }
};
