import type { MovieMetadata, ApiSettings } from '../types';

// Helper to strip HTML tags from TVMaze summaries
const stripHtml = (html: string): string => {
  if (!html) return '';
  return html.replace(/<\/?[^>]+(>|$)/g, '');
};

// 15 Curated fallbacks for offline testing and empty state pre-loads
export const CURATED_LOCAL_MOVIES: MovieMetadata[] = [
  {
    id: 'local-1',
    title: 'Interstellar',
    year: '2014',
    released: '07 Nov 2014',
    runtime: '169 min',
    genre: ['Sci-Fi', 'Adventure', 'Drama'],
    director: 'Christopher Nolan',
    actors: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Michael Caine'],
    plot: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival in the face of a dying Earth.',
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop',
    imdbRating: '8.7',
    source: 'local'
  },
  {
    id: 'local-2',
    title: 'Inception',
    year: '2010',
    released: '16 Jul 2010',
    runtime: '148 min',
    genre: ['Action', 'Sci-Fi', 'Adventure'],
    director: 'Christopher Nolan',
    actors: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page', 'Tom Hardy'],
    plot: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop',
    imdbRating: '8.8',
    source: 'local'
  },
  {
    id: 'local-3',
    title: 'Spirited Away',
    year: '2001',
    released: '20 Jul 2001',
    runtime: '125 min',
    genre: ['Animation', 'Adventure', 'Fantasy'],
    director: 'Hayao Miyazaki',
    actors: ['Rumi Hiiragi', 'Miyu Irino', 'Mari Natsuki', 'Takashi Naito'],
    plot: 'During her family\'s move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts.',
    poster: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=600&auto=format&fit=crop',
    imdbRating: '8.6',
    source: 'local'
  },
  {
    id: 'local-4',
    title: 'The Dark Knight',
    year: '2008',
    released: '18 Jul 2008',
    runtime: '152 min',
    genre: ['Action', 'Crime', 'Drama'],
    director: 'Christopher Nolan',
    actors: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart', 'Maggie Gyllenhaal'],
    plot: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    poster: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=600&auto=format&fit=crop',
    imdbRating: '9.0',
    source: 'local'
  },
  {
    id: 'local-5',
    title: 'Blade Runner 2049',
    year: '2017',
    released: '06 Oct 2017',
    runtime: '164 min',
    genre: ['Sci-Fi', 'Action', 'Mystery'],
    director: 'Denis Villeneuve',
    actors: ['Ryan Gosling', 'Harrison Ford', 'Ana de Armas', 'Sylvia Hoeks'],
    plot: 'A new blade runner, LAPD Officer K, unearths a long-buried secret that has the potential to plunge what\'s left of society into chaos.',
    poster: 'https://images.unsplash.com/photo-1542204172-e7052809a937?q=80&w=600&auto=format&fit=crop',
    imdbRating: '8.0',
    source: 'local'
  },
  {
    id: 'local-6',
    title: 'Parasite',
    year: '2019',
    released: '30 May 2019',
    runtime: '132 min',
    genre: ['Drama', 'Thriller', 'Comedy'],
    director: 'Bong Joon Ho',
    actors: ['Song Kang-ho', 'Lee Sun-kyun', 'Cho Yeo-jeong', 'Choi Woo-shik'],
    plot: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
    poster: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=600&auto=format&fit=crop',
    imdbRating: '8.5',
    source: 'local'
  },
  {
    id: 'local-7',
    title: 'Whiplash',
    year: '2014',
    released: '10 Oct 2014',
    runtime: '106 min',
    genre: ['Drama', 'Music'],
    director: 'Damien Chazelle',
    actors: ['Miles Teller', 'J.K. Simmons', 'Paul Reiser', 'Melissa Benoist'],
    plot: 'A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor who will stop at nothing to realize a student\'s potential.',
    poster: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=600&auto=format&fit=crop',
    imdbRating: '8.5',
    source: 'local'
  },
  {
    id: 'local-8',
    title: 'Everything Everywhere All at Once',
    year: '2022',
    released: '25 Mar 2022',
    runtime: '139 min',
    genre: ['Action', 'Adventure', 'Comedy', 'Sci-Fi'],
    director: 'Daniel Kwan, Daniel Scheinert',
    actors: ['Michelle Yeoh', 'Stephanie Hsu', 'Ke Huy Quan', 'Jamie Lee Curtis'],
    plot: 'A middle-aged Chinese immigrant is swept up into an insane adventure in which she alone can save existence by exploring other universes and connecting with the lives she could have led.',
    poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop',
    imdbRating: '8.0',
    source: 'local'
  },
  {
    id: 'local-9',
    title: 'Dune: Part Two',
    year: '2024',
    released: '01 Mar 2024',
    runtime: '166 min',
    genre: ['Sci-Fi', 'Adventure', 'Action'],
    director: 'Denis Villeneuve',
    actors: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Javier Bardem'],
    plot: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
    poster: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop',
    imdbRating: '8.6',
    source: 'local'
  },
  {
    id: 'local-10',
    title: 'Pulp Fiction',
    year: '1994',
    released: '14 Oct 1994',
    runtime: '154 min',
    genre: ['Crime', 'Drama'],
    director: 'Quentin Tarantino',
    actors: ['John Travolta', 'Uma Thurman', 'Samuel L. Jackson', 'Bruce Willis'],
    plot: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
    poster: 'https://images.unsplash.com/photo-1593085512500-5d55148d6f0d?q=80&w=600&auto=format&fit=crop',
    imdbRating: '8.9',
    source: 'local'
  }
];

export const movieApi = {
  // Main Search Router
  async searchMovies(
    query: string,
    settings: ApiSettings,
    overrideEngines?: ('tvmaze' | 'tmdb' | 'omdb')[]
  ): Promise<MovieMetadata[]> {
    const trimmed = query.trim();
    if (!trimmed) return [];

    // 1. Check local fallbacks first for instant match (useful offline/testing)
    const localMatches = CURATED_LOCAL_MOVIES.filter(m => 
      m.title.toLowerCase().includes(trimmed.toLowerCase()) || 
      m.genre.some(g => g.toLowerCase().includes(trimmed.toLowerCase()))
    );

    const activeEngines = overrideEngines || settings.activeEngines || [settings.activeEngine || 'tvmaze'];

    try {
      const searchPromises: Promise<MovieMetadata[]>[] = [];

      if (activeEngines.includes('tmdb') && settings.tmdbApiKey) {
        searchPromises.push(this.searchTMDB(trimmed, settings.tmdbApiKey).catch(err => {
          console.error('TMDB search failed:', err);
          return [];
        }));
      }

      if (activeEngines.includes('omdb') && settings.omdbApiKey) {
        searchPromises.push(this.searchOMDb(trimmed, settings.omdbApiKey).catch(err => {
          console.error('OMDb search failed:', err);
          return [];
        }));
      }

      if (activeEngines.includes('tvmaze')) {
        searchPromises.push(this.searchTVMaze(trimmed).catch(err => {
          console.error('TVMaze search failed:', err);
          return [];
        }));
      }

      const resultsList = await Promise.all(searchPromises);
      const apiResults = resultsList.flat();

      const titles = new Set(apiResults.map(m => m.title.toLowerCase()));
      const uniqueLocal = localMatches.filter(m => !titles.has(m.title.toLowerCase()));

      return [...apiResults, ...uniqueLocal];
    } catch (error) {
      console.warn('Live search failed or offline. Falling back to local offline search database.', error);
      return localMatches;
    }
  },

  // Fetch full details (direct detail view for API items)
  async getMovieDetails(id: string, source: 'tvmaze' | 'tmdb' | 'omdb' | 'local', settings: ApiSettings): Promise<MovieMetadata | null> {
    if (source === 'local') {
      return CURATED_LOCAL_MOVIES.find(m => m.id === id) || null;
    }

    try {
      if (source === 'tmdb' && settings.tmdbApiKey) {
        return await this.getTMDBDetails(id, settings.tmdbApiKey);
      } else if (source === 'omdb' && settings.omdbApiKey) {
        return await this.getOMDbDetails(id, settings.omdbApiKey);
      } else {
        // TVMaze
        return await this.getTVMazeDetails(id);
      }
    } catch (e) {
      console.error('Failed to fetch live show details', e);
      // Fail back to local search matches
      const localFallback = CURATED_LOCAL_MOVIES.find(m => id.includes(m.title.toLowerCase()));
      return localFallback || null;
    }
  },

  // TVMaze API Implementation
  async searchTVMaze(query: string): Promise<MovieMetadata[]> {
    const url = `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('TVMaze search request failed');
    const data = await res.json();

    return data.map((item: any) => {
      const show = item.show;
      return {
        id: `tvmaze-${show.id}`,
        title: show.name,
        year: show.premiered ? show.premiered.split('-')[0] : 'N/A',
        released: show.premiered || 'N/A',
        runtime: show.runtime ? `${show.runtime} min` : 'N/A',
        genre: show.genres && show.genres.length > 0 ? show.genres : ['Drama'],
        director: 'Various Directors',
        actors: [], // Will fetch on demand or embed if detailed
        plot: stripHtml(show.summary) || 'No synopsis available.',
        poster: show.image?.medium || show.image?.original || 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=600&auto=format&fit=crop',
        imdbRating: show.rating?.average ? String(show.rating.average) : 'N/A',
        source: 'tvmaze' as const,
        isSeries: true,
        seasons: 1,
        episodes: 10,
      };
    });
  },

  async getTVMazeDetails(id: string): Promise<MovieMetadata> {
    const rawId = id.replace('tvmaze-', '');
    const url = `https://api.tvmaze.com/shows/${rawId}?embed=cast`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('TVMaze details request failed');
    const show = await res.json();

    const actors = show._embedded?.cast?.slice(0, 5).map((c: any) => c.person.name) || [];

    // Fetch and count actual seasons and episodes
    let seasonsCount = 1;
    let episodesCount = 10;
    try {
      const epRes = await fetch(`https://api.tvmaze.com/shows/${rawId}/episodes`);
      if (epRes.ok) {
        const episodes = await epRes.json();
        if (Array.isArray(episodes) && episodes.length > 0) {
          episodesCount = episodes.length;
          seasonsCount = Math.max(...episodes.map((ep: any) => ep.season || 1));
        }
      }
    } catch (e) {
      console.warn('Failed to dynamically fetch episodes counts in getTVMazeDetails', e);
    }

    return {
      id: `tvmaze-${show.id}`,
      title: show.name,
      year: show.premiered ? show.premiered.split('-')[0] : 'N/A',
      released: show.premiered || 'N/A',
      runtime: show.runtime ? `${show.runtime} min` : 'N/A',
      genre: show.genres && show.genres.length > 0 ? show.genres : ['Drama'],
      director: 'Various Directors',
      actors,
      plot: stripHtml(show.summary) || 'No synopsis available.',
      poster: show.image?.original || show.image?.medium || 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=600&auto=format&fit=crop',
      imdbRating: show.rating?.average ? String(show.rating.average) : 'N/A',
      source: 'tvmaze' as const,
      isSeries: true,
      seasons: seasonsCount,
      episodes: episodesCount,
    };
  },

  // TMDB API Implementation
  async searchTMDB(query: string, apiKey: string): Promise<MovieMetadata[]> {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=en-US&page=1`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('TMDB search request failed');
    const data = await res.json();

    return data.results.map((movie: any) => ({
      id: `tmdb-${movie.id}`,
      title: movie.title,
      year: movie.release_date ? movie.release_date.split('-')[0] : 'N/A',
      released: movie.release_date || 'N/A',
      runtime: 'N/A', // Detail fetch required for runtime
      genre: [], // Genre IDs mapping is complex, populated fully in details
      director: '',
      actors: [],
      plot: movie.overview || 'No synopsis available.',
      poster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=600&auto=format&fit=crop',
      imdbRating: movie.vote_average ? String(movie.vote_average.toFixed(1)) : 'N/A',
      source: 'tmdb' as const
    }));
  },

  async getTMDBDetails(id: string, apiKey: string): Promise<MovieMetadata> {
    const rawId = id.replace('tmdb-', '');
    // Fetch movie details AND credits for cast & crew
    const detailUrl = `https://api.themoviedb.org/3/movie/${rawId}?api_key=${apiKey}&append_to_response=credits&language=en-US`;
    const res = await fetch(detailUrl);
    if (!res.ok) throw new Error('TMDB details request failed');
    const movie = await res.json();

    const directorObj = movie.credits?.crew?.find((c: any) => c.job === 'Director');
    const director = directorObj ? directorObj.name : 'Unknown';
    const actors = movie.credits?.cast?.slice(0, 5).map((c: any) => c.name) || [];
    const genre = movie.genres?.map((g: any) => g.name) || [];

    return {
      id: `tmdb-${movie.id}`,
      title: movie.title,
      year: movie.release_date ? movie.release_date.split('-')[0] : 'N/A',
      released: movie.release_date || 'N/A',
      runtime: movie.runtime ? `${movie.runtime} min` : 'N/A',
      genre,
      director,
      actors,
      plot: movie.overview || 'No synopsis available.',
      poster: movie.poster_path ? `https://image.tmdb.org/t/p/original${movie.poster_path}` : 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=600&auto=format&fit=crop',
      imdbRating: movie.vote_average ? String(movie.vote_average.toFixed(1)) : 'N/A',
      source: 'tmdb' as const
    };
  },

  // OMDb API Implementation
  async searchOMDb(query: string, apiKey: string): Promise<MovieMetadata[]> {
    const url = `https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(query)}&type=movie`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('OMDb search request failed');
    const data = await res.json();

    if (data.Response === 'False') return [];

    return data.Search.map((movie: any) => ({
      id: `omdb-${movie.imdbID}`,
      title: movie.Title,
      year: movie.Year,
      released: 'N/A',
      runtime: 'N/A',
      genre: [],
      director: '',
      actors: [],
      plot: `OMDb ID: ${movie.imdbID}. Click to view details.`,
      poster: movie.Poster !== 'N/A' ? movie.Poster : 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=600&auto=format&fit=crop',
      imdbRating: 'N/A',
      source: 'omdb' as const
    }));
  },

  async getOMDbDetails(id: string, apiKey: string): Promise<MovieMetadata> {
    const rawId = id.replace('omdb-', '');
    const url = `https://www.omdbapi.com/?apikey=${apiKey}&i=${rawId}&plot=full`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('OMDb details request failed');
    const movie = await res.json();

    if (movie.Response === 'False') throw new Error(movie.Error || 'OMDb error');

    const genre = movie.Genre ? movie.Genre.split(',').map((g: string) => g.trim()) : [];
    const actors = movie.Actors ? movie.Actors.split(',').map((a: string) => a.trim()) : [];

    return {
      id: `omdb-${movie.imdbID}`,
      title: movie.Title,
      year: movie.Year,
      released: movie.Released,
      runtime: movie.Runtime,
      genre,
      director: movie.Director,
      actors,
      plot: movie.Plot,
      poster: movie.Poster !== 'N/A' ? movie.Poster : 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=600&auto=format&fit=crop',
      imdbRating: movie.imdbRating || 'N/A',
      source: 'omdb' as const
    };
  }
};
