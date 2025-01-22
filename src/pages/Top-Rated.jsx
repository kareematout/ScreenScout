import { useState, useEffect, useCallback } from 'react';
import { MediaSection } from '../components/Media/MediaSection';
import { GenreSection } from '../components/Media/GenreSection';
import { MediaCard } from '../components/Media/MediaCard';
import ApiService from '../services/apiServiceTMDB';
import RawgApiService from '../services/apiServiceRAWG';

const TopRated = () => {
  // Media states
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [topRatedShows, setTopRatedShows] = useState([]);
  const [topRatedGames, setTopRatedGames] = useState([]);
  const [genreTopMovies, setGenreTopMovies] = useState([]);
  const [genreTopShows, setGenreTopShows] = useState([]);
  const [genreTopGames, setGenreTopGames] = useState([]);
  
  // Genre states
  const [movieGenres, setMovieGenres] = useState([]);
  const [tvGenres, setTvGenres] = useState([]);
  const [gameGenres, setGameGenres] = useState([]);
  const [selectedMovieGenre, setSelectedMovieGenre] = useState("");
  const [selectedTvGenre, setSelectedTvGenre] = useState("");
  const [selectedGameGenre, setSelectedGameGenre] = useState("");
  
  // Separate loading states for each section
  const [movieLoading, setMovieLoading] = useState(true);
  const [showLoading, setShowLoading] = useState(true);
  const [gameLoading, setGameLoading] = useState(true);
  const [movieGenreLoading, setMovieGenreLoading] = useState(true);
  const [showGenreLoading, setShowGenreLoading] = useState(true);
  const [gameGenreLoading, setGameGenreLoading] = useState(true);
  
  // Pagination states
  const [moviePage, setMoviePage] = useState(1);
  const [showPage, setShowPage] = useState(1);
  const [gamePage, setGamePage] = useState(1);
  const [movieGenrePage, setMovieGenrePage] = useState(1);
  const [showGenrePage, setShowGenrePage] = useState(1);
  const [gameGenrePage, setGameGenrePage] = useState(1);

  // Fetch functions for each section
  const fetchTopRatedMovies = useCallback(async (page) => {
    setMovieLoading(true);
    try {
      const data = await ApiService.getTopRatedMovies(page);
      setTopRatedMovies(data.results);
    } catch (error) {
      console.error("Error fetching top rated movies:", error);
    }
    setMovieLoading(false);
  }, []);

  const fetchTopRatedShows = useCallback(async (page) => {
    setShowLoading(true);
    try {
      const data = await ApiService.getTopRatedShows(page);
      setTopRatedShows(data.results);
    } catch (error) {
      console.error("Error fetching top rated shows:", error);
    }
    setShowLoading(false);
  }, []);

  const fetchTopRatedGames = useCallback(async (page) => {
    setGameLoading(true);
    try {
      const data = await RawgApiService.getTopRatedGames(page);
      setTopRatedGames(data.results);
    } catch (error) {
      console.error("Error fetching top rated games:", error);
    }
    setGameLoading(false);
  }, []);

  const fetchGenreTopMovies = useCallback(async (genreId, page) => {
    if (!genreId) return;
    setMovieGenreLoading(true);
    try {
      const data = await ApiService.getTopRatedMoviesByGenre(genreId, page);
      setGenreTopMovies(data.results);
    } catch (error) {
      console.error("Error fetching genre top movies:", error);
    }
    setMovieGenreLoading(false);
  }, []);

  const fetchGenreTopShows = useCallback(async (genreId, page) => {
    if (!genreId) return;
    setShowGenreLoading(true);
    try {
      const data = await ApiService.getTopRatedShowsByGenre(genreId, page);
      setGenreTopShows(data.results);
    } catch (error) {
      console.error("Error fetching genre top shows:", error);
    }
    setShowGenreLoading(false);
  }, []);

  const fetchGenreTopGames = useCallback(async (genreId, page) => {
    if (!genreId) return;
    setGameGenreLoading(true);
    try {
      const data = await RawgApiService.getTopRatedGamesByGenre(genreId, page);
      setGenreTopGames(data.results);
    } catch (error) {
      console.error("Error fetching genre top games:", error);
    }
    setGameGenreLoading(false);
  }, []);

  // Fetch genres once at mount
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const [movieGenresData, tvGenresData, gameGenresData] = await Promise.all([
          ApiService.getMovieGenres(),
          ApiService.getTVGenres(),
          RawgApiService.getGenres()
        ]);

        setMovieGenres(movieGenresData.genres);
        setTvGenres(tvGenresData.genres);
        setGameGenres(gameGenresData.results);

        // Set initial genre selections
        if (movieGenresData.genres.length > 0) {
          setSelectedMovieGenre(movieGenresData.genres[0].id);
        }
        if (tvGenresData.genres.length > 0) {
          setSelectedTvGenre(tvGenresData.genres[0].id);
        }
        if (gameGenresData.results.length > 0) {
          setSelectedGameGenre(gameGenresData.results[0].id);
        }
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };
    fetchGenres();
  }, []);

  // Separate useEffects for each section
  useEffect(() => {
    fetchTopRatedMovies(moviePage);
  }, [moviePage, fetchTopRatedMovies]);

  useEffect(() => {
    fetchTopRatedShows(showPage);
  }, [showPage, fetchTopRatedShows]);

  useEffect(() => {
    fetchTopRatedGames(gamePage);
  }, [gamePage, fetchTopRatedGames]);

  useEffect(() => {
    if (selectedMovieGenre) {
      fetchGenreTopMovies(selectedMovieGenre, movieGenrePage);
    }
  }, [selectedMovieGenre, movieGenrePage, fetchGenreTopMovies]);

  useEffect(() => {
    if (selectedTvGenre) {
      fetchGenreTopShows(selectedTvGenre, showGenrePage);
    }
  }, [selectedTvGenre, showGenrePage, fetchGenreTopShows]);

  useEffect(() => {
    if (selectedGameGenre) {
      fetchGenreTopGames(selectedGameGenre, gameGenrePage);
    }
  }, [selectedGameGenre, gameGenrePage, fetchGenreTopGames]);

  // Page change handlers
  const handlePageChange = (section, newPage) => {
    switch(section) {
      case 'movies':
        setMoviePage(newPage);
        break;
      case 'shows':
        setShowPage(newPage);
        break;
      case 'games':
        setGamePage(newPage);
        break;
      case 'movieGenre':
        setMovieGenrePage(newPage);
        break;
      case 'showGenre':
        setShowGenrePage(newPage);
        break;
      case 'gameGenre':
        setGameGenrePage(newPage);
        break;
      default:
        break;
    }
  };

  // Genre change handlers
  const handleGenreChange = (event, type) => {
    const value = event.target.value;
    switch(type) {
      case 'movie':
        setSelectedMovieGenre(value);
        setMovieGenrePage(1);
        break;
      case 'tv':
        setSelectedTvGenre(value);
        setShowGenrePage(1);
        break;
      case 'game':
        setSelectedGameGenre(value);
        setGameGenrePage(1);
        break;
      default:
        break;
    }
  };

  return (
    <div className="movies-container">
      <MediaSection 
        title="Top Rated Movies of All Time" 
        items={topRatedMovies} 
        isMovie={true}
        currentPage={moviePage}
        onPageChange={(page) => handlePageChange('movies', page)}
        loading={movieLoading}
      />
      
      <MediaSection 
        title="Top Rated TV Shows of All Time" 
        items={topRatedShows} 
        isShow={true}
        currentPage={showPage}
        onPageChange={(page) => handlePageChange('shows', page)}
        loading={showLoading}
      />

      <MediaSection 
        title="Top Rated Games of All Time" 
        items={topRatedGames.map(game => ({
          ...game,
          poster_path: game.background_image,
          title: game.name
        }))} 
        isGame={true}
        currentPage={gamePage}
        onPageChange={(page) => handlePageChange('games', page)}
        loading={gameLoading}
      />
      
      <GenreSection 
        title={
          <>
            Top Rated Movies in{" "}
            <select
              value={selectedMovieGenre}
              onChange={(e) => handleGenreChange(e, 'movie')}
              className="genre-select"
              name="toprated-movies-genre"
            >
              {movieGenres.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
          </>
        }
        currentPage={movieGenrePage}
        onPageChange={(page) => handlePageChange('movieGenre', page)}
        loading={movieGenreLoading}
      >
        {genreTopMovies.map((movie) => (
          <MediaCard key={movie.id} item={movie} isMovie={true} />
        ))}
      </GenreSection>

      <GenreSection 
        title={
          <>
            Top Rated Shows in{" "}
            <select
              value={selectedTvGenre}
              onChange={(e) => handleGenreChange(e, 'tv')}
              className="genre-select"
              name="toprated-shows-genre"
            >
              {tvGenres.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
          </>
        }
        currentPage={showGenrePage}
        onPageChange={(page) => handlePageChange('showGenre', page)}
        loading={showGenreLoading}
      >
        {genreTopShows.map((show) => (
          <MediaCard key={show.id} item={show} isShow={true} />
        ))}
      </GenreSection>

      <GenreSection 
        title={
          <>
            Top Rated Games in{" "}
            <select
              value={selectedGameGenre}
              onChange={(e) => handleGenreChange(e, 'game')}
              className="genre-select"
              name="toprated-games-genre"
            >
              {gameGenres.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
          </>
        }
        currentPage={gameGenrePage}
        onPageChange={(page) => handlePageChange('gameGenre', page)}
        loading={gameGenreLoading}
      >
        {genreTopGames.map((game) => (
          <MediaCard 
            key={game.id} 
            item={{
              ...game,
              poster_path: game.background_image,
              title: game.name
            }} 
            isGame={true} 
          />
        ))}
      </GenreSection>
    </div>
  );
};

export default TopRated;