const BASE_URL = "https://api.themoviedb.org/3";
const AUTH_HEADERS = {
  Authorization:
    "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzNjM3YTg1ZDM2MTkxNzRkZmNhMTQxMGZlNzI4ZGE1OCIsIm5iZiI6MTczNzIzMDIxNC4wOTIsInN1YiI6IjY3OGMwNzg2MmU0MTYzNGU1MjY0ZjdjOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.wmdtkpjVDiB7OSBTHl42c9157xvEhJ3ieWmhvNJawp4",
  "Content-Type": "application/json",
};

class ApiService {
  static async getPopularMovies(page = 1) {
    try {
      const response = await fetch(`${BASE_URL}/movie/popular?page=${page}&page_size=6`, {
        headers: AUTH_HEADERS,
      });
      const data = await response.json();
      return {
        ...data,
        results: data.results.slice(0, 6)
      };
    } catch (error) {
      console.error("Error fetching popular movies:", error);
      throw error;
    }
  }

  static async searchMovies(query, page = 1) {
    try {
      const response = await fetch(
        `${BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${page}&page_size=6`,
        { headers: AUTH_HEADERS }
      );
      const data = await response.json();
      return {
        ...data,
        results: data.results.slice(0, 6)
      };
    } catch (error) {
      console.error("Error searching movies:", error);
      throw error;
    }
  }

  static async searchShows(query, page = 1) {
    try {
      const response = await fetch(
        `${BASE_URL}/search/tv?query=${encodeURIComponent(query)}&page=${page}&page_size=6`,
        { headers: AUTH_HEADERS }
      );
      const data = await response.json();
      return {
        ...data,
        results: data.results.slice(0, 6)
      };
    } catch (error) {
      console.error("Error searching shows:", error);
      throw error;
    }
  }

  static async getMovieDetails(movieId) {
    try {
      const response = await fetch(
        `${BASE_URL}/movie/${movieId}?append_to_response=credits,videos,similar`,
        { headers: AUTH_HEADERS }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching movie details:", error);
      throw error;
    }
  }

  static async getMovieReviews(movieId, page = 1) {
    try {
      const response = await fetch(
        `${BASE_URL}/movie/${movieId}/reviews?page=${page}&page_size=6`,
        { headers: AUTH_HEADERS }
      );
      const data = await response.json();
      return {
        ...data,
        results: data.results.slice(0, 6)
      };
    } catch (error) {
      console.error("Error fetching movie reviews:", error);
      throw error;
    }
  }

  static async getTrendingMovies(page = 1, timeWindow = "week") {
    try {
      const response = await fetch(
        `${BASE_URL}/trending/movie/${timeWindow}?page=${page}&page_size=6`,
        { headers: AUTH_HEADERS }
      );
      const data = await response.json();
      return {
        ...data,
        results: data.results.slice(0, 6)
      };
    } catch (error) {
      console.error("Error fetching trending movies:", error);
      throw error;
    }
  }

  static async getMovieRecommendations(movieId, page = 1) {
    try {
      const response = await fetch(
        `${BASE_URL}/movie/${movieId}/recommendations?page=${page}&page_size=6`,
        { headers: AUTH_HEADERS }
      );
      const data = await response.json();
      return {
        ...data,
        results: data.results.slice(0, 6)
      };
    } catch (error) {
      console.error("Error fetching movie recommendations:", error);
      throw error;
    }
  }

  static async getNowPlayingMovies(page = 1) {
    try {
      const response = await fetch(
        `${BASE_URL}/movie/now_playing?page=${page}&page_size=6`,
        { headers: AUTH_HEADERS }
      );
      const data = await response.json();
      return {
        ...data,
        results: data.results.slice(0, 6)
      };
    } catch (error) {
      console.error("Error fetching now playing movies:", error);
      throw error;
    }
  }

  static async getTopRatedMovies(page = 1) {
    try {
      const response = await fetch(
        `${BASE_URL}/movie/top_rated?page=${page}&page_size=6`,
        { headers: AUTH_HEADERS }
      );
      const data = await response.json();
      return {
        ...data,
        results: data.results.slice(0, 6)
      };
    } catch (error) {
      console.error("Error fetching top rated movies:", error);
      throw error;
    }
  }

  static async getMovieGenres() {
    try {
      const response = await fetch(`${BASE_URL}/genre/movie/list`, {
        headers: AUTH_HEADERS,
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching movie genres:", error);
      throw error;
    }
  }

  static async getPopularShows(page = 1) {
    try {
      const response = await fetch(
        `${BASE_URL}/tv/popular?page=${page}&page_size=6`,
        { headers: AUTH_HEADERS }
      );
      const data = await response.json();
      return {
        ...data,
        results: data.results.slice(0, 6)
      };
    } catch (error) {
      console.error("Error fetching popular shows:", error);
      throw error;
    }
  }

  static async getTrendingShows(page = 1, timeWindow = "week") {
    try {
      const response = await fetch(
        `${BASE_URL}/trending/tv/${timeWindow}?page=${page}&page_size=6`,
        { headers: AUTH_HEADERS }
      );
      const data = await response.json();
      return {
        ...data,
        results: data.results.slice(0, 6)
      };
    } catch (error) {
      console.error("Error fetching trending shows:", error);
      throw error;
    }
  }

  static async getTopRatedShows(page = 1) {
    try {
      const response = await fetch(
        `${BASE_URL}/tv/top_rated?page=${page}&page_size=6`,
        { headers: AUTH_HEADERS }
      );
      const data = await response.json();
      return {
        ...data,
        results: data.results.slice(0, 6)
      };
    } catch (error) {
      console.error("Error fetching top rated shows:", error);
      throw error;
    }
  }

  static async getShowDetails(showId) {
    try {
      const response = await fetch(
        `${BASE_URL}/tv/${showId}?append_to_response=credits,videos,similar`,
        { headers: AUTH_HEADERS }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching show details:", error);
      throw error;
    }
  }

  static async getMoviesByGenre(genreId, page = 1) {
    try {
      const response = await fetch(
        `${BASE_URL}/discover/movie?with_genres=${genreId}&sort_by=popularity.desc&page=${page}&page_size=6`,
        { headers: AUTH_HEADERS }
      );
      const data = await response.json();
      return {
        ...data,
        results: data.results.slice(0, 6)
      };
    } catch (error) {
      console.error("Error fetching movies by genre:", error);
      throw error;
    }
  }

  static async getShowsByGenre(genreId, page = 1) {
    try {
      const response = await fetch(
        `${BASE_URL}/discover/tv?with_genres=${genreId}&sort_by=popularity.desc&page=${page}&page_size=6`,
        { headers: AUTH_HEADERS }
      );
      const data = await response.json();
      return {
        ...data,
        results: data.results.slice(0, 6)
      };
    } catch (error) {
      console.error("Error fetching shows by genre:", error);
      throw error;
    }
  }

  static async getTopRatedMoviesByGenre(genreId, page = 1) {
    try {
      const response = await fetch(
        `${BASE_URL}/discover/movie?with_genres=${genreId}&sort_by=vote_average.desc&vote_count.gte=100&page=${page}&page_size=6`,
        { headers: AUTH_HEADERS }
      );
      const data = await response.json();
      return {
        ...data,
        results: data.results.slice(0, 6)
      };
    } catch (error) {
      console.error("Error fetching top rated movies by genre:", error);
      throw error;
    }
  }
  
  static async getTopRatedShowsByGenre(genreId, page = 1) {
    try {
      const response = await fetch(
        `${BASE_URL}/discover/tv?with_genres=${genreId}&sort_by=vote_average.desc&vote_count.gte=100&page=${page}&page_size=6`,
        { headers: AUTH_HEADERS }
      );
      const data = await response.json();
      return {
        ...data,
        results: data.results.slice(0, 6)
      };
    } catch (error) {
      console.error("Error fetching top rated shows by genre:", error);
      throw error;
    }
  }

  static async getTVGenres() {
    try {
      const response = await fetch(`${BASE_URL}/genre/tv/list`, {
        headers: AUTH_HEADERS,
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching TV genres:", error);
      throw error;
    }
  }

  static getImageUrl(path, size = "original") {
    if (!path) return null;
    return `https://image.tmdb.org/t/p/${size}${path}`;
  }
}

export default ApiService;