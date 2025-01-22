import { useState, useEffect, useCallback } from 'react';
import { MediaSection } from '../components/Media/MediaSection';
import { GenreSection } from '../components/Media/GenreSection';
import { MediaCard } from '../components/Media/MediaCard';
import ApiService from '../services/apiServiceTMDB';

const Shows = () => {
  const [popularShows, setPopularShows] = useState([]);
  const [trendingShows, setTrendingShows] = useState([]);
  const [genreShows, setGenreShows] = useState([]);
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
  const fetchPopularShows = useCallback(async (page) => {
    setPopularLoading(true);
    try {
      const data = await ApiService.getPopularShows(page);
      setPopularShows(data.results);
    } catch (error) {
      console.error("Error fetching popular shows:", error);
    }
    setPopularLoading(false);
  }, []);

  const fetchTrendingShows = useCallback(async (page) => {
    setTrendingLoading(true);
    try {
      const data = await ApiService.getTrendingShows(page);
      setTrendingShows(data.results);
    } catch (error) {
      console.error("Error fetching trending shows:", error);
    }
    setTrendingLoading(false);
  }, []);

  const fetchGenreShows = useCallback(async (genreId, page) => {
    if (!genreId) return;
    setGenreLoading(true);
    try {
      const data = await ApiService.getShowsByGenre(genreId, page);
      setGenreShows(data.results);
    } catch (error) {
      console.error("Error fetching genre shows:", error);
    }
    setGenreLoading(false);
  }, []);

  // Separate useEffects for each section
  useEffect(() => {
    fetchPopularShows(popularPage);
  }, [popularPage, fetchPopularShows]);

  useEffect(() => {
    fetchTrendingShows(trendingPage);
  }, [trendingPage, fetchTrendingShows]);

  useEffect(() => {
    if (selectedGenre) {
      fetchGenreShows(selectedGenre, genrePage);
    }
  }, [selectedGenre, genrePage, fetchGenreShows]);

  // Fetch genres only once at mount
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await ApiService.getTVGenres();
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
        title="Popular Now" 
        items={popularShows.map(show => ({ ...show, isShow: true }))} 
        isShow={true}
        currentPage={popularPage}
        onPageChange={handlePopularPageChange}
        loading={popularLoading}
      />
      
      <MediaSection 
        title="Trending This Week" 
        items={trendingShows.map(show => ({ ...show, isShow: true }))} 
        isShow={true}
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
              name="shows-genre"
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
        {genreShows.map((show) => (
          <MediaCard key={show.id} item={show} isShow={true} />
        ))}
      </GenreSection>
    </div>
  );
};

export default Shows;