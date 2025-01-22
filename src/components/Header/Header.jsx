import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Film, Menu, X, Search, Star, Home, Clapperboard, Tv, Gamepad2 } from 'lucide-react';
import { MediaCard } from '../Media/MediaCard';
import ApiService from '../../services/apiServiceTMDB';
import RawgApiService from '../../services/apiServiceRAWG';
import './Header.css';

const useDebounce = (callback, delay) => {
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const debouncedCallback = useCallback(
    (...args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );

  return debouncedCallback;
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const searchContainerRef = useRef(null);

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/movies', icon: Clapperboard, label: 'Movies' },
    { path: '/tv-shows', icon: Tv, label: 'TV Shows' },
    { path: '/top-rated', icon: Star, label: 'Top Rated' },
    { path: '/games', icon: Gamepad2, label: 'Games' }
  ];

  const searchContent = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
  
    try {
      const [movieResults, showResults, gameResults] = await Promise.all([
        ApiService.searchMovies(query),
        ApiService.searchShows(query),
        RawgApiService.searchGames(query)
      ]);
  
      const combinedResults = [
        ...movieResults.results.map(movie => ({
          ...movie,
          mediaType: 'movie',
          // Ensure consistent property names
          title: movie.title,
          poster_path: movie.poster_path,
          imageUrl: ApiService.getImageUrl(movie.poster_path)
        })),
        ...showResults.results.map(show => ({
          ...show,
          mediaType: 'tv',
          // Ensure consistent property names
          title: show.name,
          poster_path: show.poster_path,
          imageUrl: ApiService.getImageUrl(show.poster_path)
        })),
        ...gameResults.results.map(game => ({
          ...game,
          mediaType: 'game',
          // Map RAWG properties to match TMDB format
          title: game.name,
          poster_path: game.background_image,
          imageUrl: game.background_image,
          release_date: game.released,
          vote_average: game.rating * 2 // RAWG uses 5-star scale, TMDB uses 10
        }))
      ].sort((a, b) => {
        // Normalize popularity scores since they come from different APIs
        const aPopularity = a.mediaType === 'game' ? a.rating * 20 : a.popularity;
        const bPopularity = b.mediaType === 'game' ? b.rating * 20 : b.popularity;
        return bPopularity - aPopularity;
      })
      .slice(0, 8);
  
      setSearchResults(combinedResults);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const debouncedSearch = useDebounce(searchContent, 300);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setIsSearching(true);
    debouncedSearch(query);
  };

  const handleResultClick = (result) => {
    setSearchQuery('');
    setSearchResults([]);
    setIsMenuOpen(false);
    navigate(`/${result.mediaType}/${result.id}`);
  };

  const handleNavClick = () => {
    setIsMenuOpen(false);
    setSearchResults([]);
    setSearchQuery('');
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setSearchResults([]);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <header className="header">
      <div className="header-container">
        <div className="nav-content">
          <Link to="/" className="brand">
            <Film className="film-icon" />
            <span className="brand-name">ScreenScout</span>
          </Link>
          
          <button 
            className="menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="menu-icon" />
            ) : (
              <Menu className="menu-icon" />
            )}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="dropdown-menu">
          <div className="dropdown-content">
            <div className="search-container" ref={searchContainerRef}>
              <input
                type="text"
                name="search-input"
                placeholder="Search movies, shows, and games..."
                className="search-input"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <Search className="search-icon" />
              
              {searchResults.length > 0 && (
                <div className="search-results">
                  <div className="search-results-grid">
                    {searchResults.map((result) => (
                      <div 
                        key={`${result.mediaType}-${result.id}`}
                        onClick={() => handleResultClick(result)}
                        className="search-result-item"
                      >
                        <MediaCard 
                          item={result} 
                          isMovie={result.mediaType === 'movie'}
                          isShow={result.mediaType === 'tv'}
                          isGame={result.mediaType === 'game'}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {isSearching && searchQuery && (
                <div className="search-loading">
                  Searching...
                </div>
              )}
            </div>
            
            <nav className="nav-links">
              {navItems.map(({ path, icon: Icon, label }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={handleNavClick}
                  className={`nav-link with-icon ${
                    location.pathname === path ? 'active' : ''
                  }`}
                >
                  <Icon className="nav-icon" />
                  <span>{label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;