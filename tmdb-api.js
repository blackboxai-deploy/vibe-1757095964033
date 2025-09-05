// TMDB API Integration Utilities
const TMDB_API_KEY = '2e211dfda888f7cc55ce433d743f9bc3';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const TMDB_BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/w1920';

const TMDBAPI = {
  // Fetch movie details by ID
  async fetchMovieDetails(movieId) {
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=credits,images`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        id: data.id,
        title: data.title,
        poster: data.poster_path ? `${TMDB_IMAGE_BASE_URL}${data.poster_path}` : null,
        backdrop: data.backdrop_path ? `${TMDB_BACKDROP_BASE_URL}${data.backdrop_path}` : null,
        year: new Date(data.release_date).getFullYear(),
        rating: data.vote_average,
        storyline: data.overview,
        language: data.original_language,
        runtime: data.runtime,
        genres: data.genres.map(genre => genre.name),
        cast: data.credits.cast.slice(0, 10).map(actor => ({
          name: actor.name,
          character: actor.character,
          photo: actor.profile_path ? `${TMDB_IMAGE_BASE_URL}${actor.profile_path}` : null
        }))
      };
    } catch (error) {
      console.error('Error fetching movie details:', error);
      throw error;
    }
  },

  // Fetch TV series details by ID
  async fetchTVSeriesDetails(seriesId) {
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/tv/${seriesId}?api_key=${TMDB_API_KEY}&append_to_response=credits,images`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        id: data.id,
        title: data.name,
        poster: data.poster_path ? `${TMDB_IMAGE_BASE_URL}${data.poster_path}` : null,
        backdrop: data.backdrop_path ? `${TMDB_BACKDROP_BASE_URL}${data.backdrop_path}` : null,
        year: new Date(data.first_air_date).getFullYear(),
        rating: data.vote_average,
        storyline: data.overview,
        language: data.original_language,
        seasons: data.number_of_seasons,
        episodes: data.number_of_episodes,
        genres: data.genres.map(genre => genre.name),
        cast: data.credits.cast.slice(0, 10).map(actor => ({
          name: actor.name,
          character: actor.character,
          photo: actor.profile_path ? `${TMDB_IMAGE_BASE_URL}${actor.profile_path}` : null
        })),
        seasons_data: data.seasons.map(season => ({
          season_number: season.season_number,
          episode_count: season.episode_count,
          name: season.name,
          poster: season.poster_path ? `${TMDB_IMAGE_BASE_URL}${season.poster_path}` : null
        }))
      };
    } catch (error) {
      console.error('Error fetching TV series details:', error);
      throw error;
    }
  },

  // Fetch season details with episodes
  async fetchSeasonDetails(seriesId, seasonNumber) {
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/tv/${seriesId}/season/${seasonNumber}?api_key=${TMDB_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        season_number: data.season_number,
        episodes: data.episodes.map(episode => ({
          episode_number: episode.episode_number,
          name: episode.name,
          overview: episode.overview,
          still_path: episode.still_path ? `${TMDB_IMAGE_BASE_URL}${episode.still_path}` : null,
          air_date: episode.air_date,
          runtime: episode.runtime
        }))
      };
    } catch (error) {
      console.error('Error fetching season details:', error);
      throw error;
    }
  },

  // Search movies
  async searchMovies(query, page = 1) {
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        results: data.results.map(movie => ({
          id: movie.id,
          title: movie.title,
          poster: movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : null,
          backdrop: movie.backdrop_path ? `${TMDB_BACKDROP_BASE_URL}${movie.backdrop_path}` : null,
          year: movie.release_date ? new Date(movie.release_date).getFullYear() : null,
          rating: movie.vote_average,
          overview: movie.overview
        })),
        total_pages: data.total_pages,
        total_results: data.total_results
      };
    } catch (error) {
      console.error('Error searching movies:', error);
      throw error;
    }
  },

  // Search TV series
  async searchTVSeries(query, page = 1) {
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        results: data.results.map(series => ({
          id: series.id,
          title: series.name,
          poster: series.poster_path ? `${TMDB_IMAGE_BASE_URL}${series.poster_path}` : null,
          backdrop: series.backdrop_path ? `${TMDB_BACKDROP_BASE_URL}${series.backdrop_path}` : null,
          year: series.first_air_date ? new Date(series.first_air_date).getFullYear() : null,
          rating: series.vote_average,
          overview: series.overview
        })),
        total_pages: data.total_pages,
        total_results: data.total_results
      };
    } catch (error) {
      console.error('Error searching TV series:', error);
      throw error;
    }
  },

  // Get trending movies
  async getTrendingMovies(timeWindow = 'week') {
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/trending/movie/${timeWindow}?api_key=${TMDB_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      return data.results.map(movie => ({
        id: movie.id,
        title: movie.title,
        poster: movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : null,
        backdrop: movie.backdrop_path ? `${TMDB_BACKDROP_BASE_URL}${movie.backdrop_path}` : null,
        year: movie.release_date ? new Date(movie.release_date).getFullYear() : null,
        rating: movie.vote_average,
        overview: movie.overview
      }));
    } catch (error) {
      console.error('Error fetching trending movies:', error);
      throw error;
    }
  },

  // Get trending TV series
  async getTrendingTVSeries(timeWindow = 'week') {
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/trending/tv/${timeWindow}?api_key=${TMDB_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      return data.results.map(series => ({
        id: series.id,
        title: series.name,
        poster: series.poster_path ? `${TMDB_IMAGE_BASE_URL}${series.poster_path}` : null,
        backdrop: series.backdrop_path ? `${TMDB_BACKDROP_BASE_URL}${series.backdrop_path}` : null,
        year: series.first_air_date ? new Date(series.first_air_date).getFullYear() : null,
        rating: series.vote_average,
        overview: series.overview
      }));
    } catch (error) {
      console.error('Error fetching trending TV series:', error);
      throw error;
    }
  },

  // Utility function to determine content category based on origin country
  determineCategory(originCountry, originalLanguage) {
    if (Array.isArray(originCountry)) {
      if (originCountry.includes('US') || originCountry.includes('GB') || originCountry.includes('CA')) {
        return 'Hollywood';
      } else if (originCountry.includes('IN')) {
        if (originalLanguage === 'hi') {
          return 'Bollywood';
        } else {
          return 'South Indian';
        }
      }
    }
    
    // Fallback based on language
    if (originalLanguage === 'en') return 'Hollywood';
    if (originalLanguage === 'hi') return 'Bollywood';
    if (['ta', 'te', 'kn', 'ml'].includes(originalLanguage)) return 'South Indian';
    
    return 'Hollywood'; // Default
  },

  // Helper function to format data for Firebase
  formatForFirebase(tmdbData, category, accessLevel, customData = {}) {
    return {
      id: tmdbData.id,
      title: tmdbData.title,
      poster: tmdbData.poster,
      backdrop: tmdbData.backdrop,
      year: tmdbData.year,
      rating: tmdbData.rating,
      storyline: tmdbData.storyline,
      language: customData.language || tmdbData.language,
      category: category,
      access: accessLevel,
      cast: tmdbData.cast || [],
      genres: tmdbData.genres || [],
      ...customData
    };
  }
};

// Export for global use
window.TMDBAPI = TMDBAPI;