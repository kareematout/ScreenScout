const BASE_URL = "https://api.rawg.io/api";
const API_KEY = "ff88d4e7a9aa41a9b2b919236320d082"; 

class RawgApiService {
  static async getPopularGames(page = 1) {
    try {
      const response = await fetch(
        `${BASE_URL}/games?key=${API_KEY}&ordering=-relevance&page=${page}&page_size=6`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      return {
        ...data,
        results: data.results.slice(0, 6)
      };
    } catch (error) {
      console.error("Error fetching popular games:", error);
      throw error;
    }
  }

  static async searchGames(query, page = 1) {
    try {
      const response = await fetch(
        `${BASE_URL}/games?key=${API_KEY}&search=${encodeURIComponent(query)}&page=${page}&page_size=6`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      return {
        ...data,
        results: data.results.slice(0, 6)
      };
    } catch (error) {
      console.error("Error searching games:", error);
      throw error;
    }
  }

  static async getGameDetails(gameId) {
    try {
      const response = await fetch(
        `${BASE_URL}/games/${gameId}?key=${API_KEY}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching game details:", error);
      throw error;
    }
  }

  static async getTrendingGames(page = 1) {
    try {
      const response = await fetch(
        `${BASE_URL}/games?key=${API_KEY}&ordering=-added&dates=${this.getLastMonthDate()},${this.getCurrentDate()}&page=${page}&page_size=6`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      return {
        ...data,
        results: data.results.slice(0, 6)
      };
    } catch (error) {
      console.error("Error fetching trending games:", error);
      throw error;
    }
  }

  static async getGamesByGenre(genreId, page = 1) {
    try {
      const response = await fetch(
        `${BASE_URL}/games?key=${API_KEY}&genres=${genreId}&ordering=-relevance&page=${page}&page_size=6`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      return {
        ...data,
        results: data.results.slice(0, 6)
      };
    } catch (error) {
      console.error("Error fetching games by genre:", error);
      throw error;
    }
  }

  static async getTopRatedGamesByGenre(genreId, page = 1) {
    try {
      const response = await fetch(
        `${BASE_URL}/games?key=${API_KEY}&genres=${genreId}&ordering=-rating&ratings_count=100&page=${page}&page_size=6`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      return {
        ...data,
        results: data.results.slice(0, 6)
      };
    } catch (error) {
      console.error("Error fetching top rated games by genre:", error);
      throw error;
    }
  }

  static async getTopRatedGames(page = 1) {
    try {
      const response = await fetch(
        `${BASE_URL}/games?key=${API_KEY}&ordering=-rating&ratings_count=100&page=${page}&page_size=6`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      return {
        ...data,
        results: data.results.slice(0, 6)
      };
    } catch (error) {
      console.error("Error fetching top rated games:", error);
      throw error;
    }
  }

  static async getGenres() {
    try {
      const response = await fetch(`${BASE_URL}/genres?key=${API_KEY}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching genres:", error);
      throw error;
    }
  }

  static getCurrentDate() {
    return new Date().toISOString().split('T')[0];
  }

  static getLastMonthDate() {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().split('T')[0];
  }

  static getImageUrl(url) {
    return url || null;
  }
}

export default RawgApiService;