import { useState, useEffect, useCallback } from 'react';
import { MediaSection } from '../components/Media/MediaSection';
import { GenreSection } from '../components/Media/GenreSection';
import { MediaCard } from '../components/Media/MediaCard';
import RawgApiService from '../services/apiServiceRAWG';

const Games = () => {
  const [popularGames, setPopularGames] = useState([]);
  const [trendingGames, setTrendingGames] = useState([]);
  const [genreGames, setGenreGames] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  
  // Separate loading states
  const [popularLoading, setPopularLoading] = useState(true);
  const [trendingLoading, setTrendingLoading] = useState(true);
  const [genreLoading, setGenreLoading] = useState(true);
  
  // Pagination states
  const [popularPage, setPopularPage] = useState(1);
  const [trendingPage, setTrendingPage] = useState(1);
  const [genrePage, setGenrePage] = useState(1);

  // Split fetch functions for each section
  const fetchPopularGames = useCallback(async (page) => {
    setPopularLoading(true);
    try {
      const data = await RawgApiService.getPopularGames(page);
      setPopularGames(data.results);
    } catch (error) {
      console.error("Error fetching popular games:", error);
    }
    setPopularLoading(false);
  }, []);

  const fetchTrendingGames = useCallback(async (page) => {
    setTrendingLoading(true);
    try {
      const data = await RawgApiService.getTrendingGames(page);
      setTrendingGames(data.results);
    } catch (error) {
      console.error("Error fetching trending games:", error);
    }
    setTrendingLoading(false);
  }, []);

  const fetchGenreGames = useCallback(async (genreId, page) => {
    if (!genreId) return;
    setGenreLoading(true);
    try {
      const data = await RawgApiService.getGamesByGenre(genreId, page);
      setGenreGames(data.results);
    } catch (error) {
      console.error("Error fetching genre games:", error);
    }
    setGenreLoading(false);
  }, []);

  // Separate useEffects for each section
  useEffect(() => {
    fetchPopularGames(popularPage);
  }, [popularPage, fetchPopularGames]);

  useEffect(() => {
    fetchTrendingGames(trendingPage);
  }, [trendingPage, fetchTrendingGames]);

  useEffect(() => {
    if (selectedGenre) {
      fetchGenreGames(selectedGenre, genrePage);
    }
  }, [selectedGenre, genrePage, fetchGenreGames]);

  // Fetch genres only once at mount
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await RawgApiService.getGenres();
        setGenres(data.results);
        if (data.results.length > 0) {
          setSelectedGenre(data.results[0].id);
        }
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };
    fetchGenres();
  }, []);

  const handlePopularPageChange = (newPage) => {
    setPopularPage(newPage);
  };

  const handleTrendingPageChange = (newPage) => {
    setTrendingPage(newPage);
  };

  const handleGenrePageChange = (newPage) => {
    setGenrePage(newPage);
  };

  const handleGenreChange = (event) => {
    setSelectedGenre(event.target.value);
    setGenrePage(1);
  };

  return (
    <div className="movies-container">
      <MediaSection 
        title="Popular Games" 
        items={popularGames.map(game => ({
          ...game,
          poster_path: game.background_image,
          title: game.name
        }))} 
        isGame={true}
        currentPage={popularPage}
        onPageChange={handlePopularPageChange}
        loading={popularLoading}
      />
      
      <MediaSection 
        title="Trending This Month" 
        items={trendingGames.map(game => ({
          ...game,
          poster_path: game.background_image,
          title: game.name
        }))} 
        isGame={true}
        currentPage={trendingPage}
        onPageChange={handleTrendingPageChange}
        loading={trendingLoading}
      />
      
      <GenreSection 
        title={
          <>
            Top Games in{" "}
            <select
              value={selectedGenre}
              onChange={handleGenreChange}
              className="genre-select"
              name="games-genre"
            >
              {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
          </>
        }
        currentPage={genrePage}
        onPageChange={handleGenrePageChange}
        loading={genreLoading}
      >
        {genreGames.map((game) => (
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

export default Games;