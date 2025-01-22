import { useState, useEffect, useCallback } from 'react';
import { MediaSection } from '../components/Media/MediaSection';
import { GenreSection } from '../components/Media/GenreSection';
import { MediaCard } from '../components/Media/MediaCard';
import ApiService from '../services/apiServiceTMDB';

const Movies = () => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [genreMovies, setGenreMovies] = useState([]);
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
  const fetchPopularMovies = useCallback(async (page) => {
    setPopularLoading(true);
    try {
      const data = await ApiService.getPopularMovies(page);
      setPopularMovies(data.results);
    } catch (error) {
      console.error("Error fetching popular movies:", error);
    }
    setPopularLoading(false);
  }, []);

  const fetchTrendingMovies = useCallback(async (page) => {
    setTrendingLoading(true);
    try {
      const data = await ApiService.getTrendingMovies(page);
      setTrendingMovies(data.results);
    } catch (error) {
      console.error("Error fetching trending movies:", error);
    }
    setTrendingLoading(false);
  }, []);

  const fetchGenreMovies = useCallback(async (genreId, page) => {
    if (!genreId) return;
    setGenreLoading(true);
    try {
      const data = await ApiService.getMoviesByGenre(genreId, page);
      setGenreMovies(data.results);
    } catch (error) {
      console.error("Error fetching genre movies:", error);
    }
    setGenreLoading(false);
  }, []);

  // Separate useEffects for each section
  useEffect(() => {
    fetchPopularMovies(popularPage);
  }, [popularPage, fetchPopularMovies]);

  useEffect(() => {
    fetchTrendingMovies(trendingPage);
  }, [trendingPage, fetchTrendingMovies]);

  useEffect(() => {
    if (selectedGenre) {
      fetchGenreMovies(selectedGenre, genrePage);
    }
  }, [selectedGenre, genrePage, fetchGenreMovies]);

  // Fetch genres only once at mount
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await ApiService.getMovieGenres();
        setGenres(data.genres);
        if (data.genres.length > 0) {
          setSelectedGenre(data.genres[0].id);
        }
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };
    fetchGenres();
  }, []);

  // Simplified page change handlers - only update state
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

  // Show sections as they load
  return (
    <div className="movies-container">
      <MediaSection 
        title="Popular Now" 
        items={popularMovies} 
        isMovie={true}
        currentPage={popularPage}
        onPageChange={handlePopularPageChange}
        loading={popularLoading}
      />
      
      <MediaSection 
        title="Trending This Week" 
        items={trendingMovies} 
        isMovie={true}
        currentPage={trendingPage}
        onPageChange={handleTrendingPageChange}
        loading={trendingLoading}
      />
      
      <GenreSection 
        title={
          <>
            Latest & Greatest in{" "}
            <select
              value={selectedGenre}
              onChange={handleGenreChange}
              className="genre-select"
              name="movies-genre"
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
        {genreMovies.map((movie) => (
          <MediaCard key={movie.id} item={movie} isMovie={true} />
        ))}
      </GenreSection>
    </div>
  );
};

export default Movies;