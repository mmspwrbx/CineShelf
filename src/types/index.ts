export interface MovieReview {
  rating: number;      // Personal rating (0 to 10)
  reviewText: string;  // User's written review
  watchDate: string;   // ISO date string
  watchCount: number;  // Number of times watched
  favorite: boolean;   // Quick star toggle
  notes: string;       // Private notes
  seasonsWatched?: number;
  episodesWatched?: number;
  episodeRatings?: Record<string, number>; // e.g. { "S1E1": 9, "S1E2": 8 }
}

export interface MovieMetadata {
  id: string;          // Unique library ID (API source prefix + API ID)
  title: string;
  year: string;
  released: string;
  runtime: string;
  genre: string[];
  director: string;
  actors: string[];
  plot: string;
  poster: string;      // URL to cover image
  imdbRating: string;  // Open source rating (e.g. IMDb or TVMaze average)
  source: 'tvmaze' | 'tmdb' | 'omdb' | 'local';
  isSeries?: boolean;
  seasons?: number;
  episodes?: number;
}

export interface LibraryMovie {
  id: string;
  metadata: MovieMetadata;
  review: MovieReview;
  status: 'watched' | 'watching' | 'plan-to-watch';
  tags: string[];
}

export interface ApiSettings {
  tmdbApiKey: string;
  omdbApiKey: string;
  activeEngine: 'tvmaze' | 'tmdb' | 'omdb';
  activeEngines?: ('tvmaze' | 'tmdb' | 'omdb')[];
  language: 'en' | 'ru';
}
