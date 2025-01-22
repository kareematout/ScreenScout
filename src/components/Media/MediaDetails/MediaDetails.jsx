import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Calendar, Star, Loader2 } from 'lucide-react';
import ApiService from '../../../services/apiServiceTMDB';
import RawgApiService from '../../../services/apiServiceRAWG';
import './MediaDetails.css';

const MediaDetails = () => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { type, id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        let data;
        
        switch (type) {
          case 'movie':
            data = await ApiService.getMovieDetails(id);
            break;
          case 'show':
            data = await ApiService.getShowDetails(id);
            break;
          case 'game':
            data = await RawgApiService.getGameDetails(id);
            break;
          default:
            throw new Error('Invalid media type');
        }
        
        setDetails(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [type, id]);

  const getImageUrl = () => {
    if (type === 'game') {
      return RawgApiService.getImageUrl(details?.background_image) || '/image-not-available.jpg';
    }
    return details?.poster_path 
      ? ApiService.getImageUrl(details.poster_path, 'original')
      : '/image-not-available.jpg';
  };

  const getTitle = () => {
    if (type === 'game') return details?.name;
    return type === 'movie' ? details?.title : details?.name;
  };

  const getReleaseDate = () => {
    if (type === 'game') {
      return details?.released ? new Date(details.released).toLocaleDateString() : 'TBA';
    }
    const date = type === 'movie' ? details?.release_date : details?.first_air_date;
    return date ? new Date(date).toLocaleDateString() : 'TBA';
  };

  const getRating = () => {
    if (type === 'game') {
      return details?.rating && details.rating > 0 
        ? (details.rating * 2).toFixed(1) 
        : 'N/A';
    }
    return details?.vote_average 
      ? details.vote_average.toFixed(1) 
      : 'N/A';
  };

  const formatGameDescription = (description) => {
    if (!description) return 'No description available.';
    const temp = document.createElement('div');
    temp.innerHTML = description;
    return temp.innerText.replace(/\n+/g, '\n').trim();
  };

  const getDescription = () => {
    if (type === 'game') {
      return formatGameDescription(details.description);
    }
    return details.overview || 'No description available.';
  };

  if (loading) {
    return (
      <div className="details-loading">
        <Loader2 className="details-loading-icon" />
        <span>Loading details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="details-error">
        <h2>Error Loading Details</h2>
        <p>{error}</p>
        <button 
          onClick={() => navigate(-1)}
          className="details-error-btn"
        >
          Return to Previous Page
        </button>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="details-not-found">
        <h2>Details Not Found</h2>
        <button 
          onClick={() => navigate(-1)}
          className="details-error-btn"
        >
          Return to Previous Page
        </button>
      </div>
    );
  }

  const isGame = type === 'game';
  const containerClass = `details-container ${isGame ? 'details-container-game' : ''}`;
  const contentClass = `details-content ${isGame ? 'details-content-game' : ''}`;

  return (
    <div className={containerClass}>
      <div className="details-backdrop" style={{ backgroundImage: `url(${getImageUrl()})` }} />
      
      <button 
        onClick={() => navigate(-1)}
        className="details-back-btn"
      >
        <ChevronLeft className="details-back-icon" />
        Back
      </button>
      
      <div className={contentClass}>
        <div className={`details-image-container ${isGame ? 'details-image-container-game' : ''}`}>
          <img
            src={getImageUrl()}
            alt={getTitle()}
            className="details-image"
          />
        </div>
        
        <div className="details-info">
          <h1 className="details-title">{getTitle()}</h1>
          
          <div className="details-meta">
            <div className="details-meta-item">
              <Calendar className="details-meta-icon" />
              <span className="details-meta-label">Release Date:</span>
              <span>{getReleaseDate()}</span>
            </div>
            
            <div className="details-meta-item">
              <Star className="details-meta-icon" />
              <span className="details-meta-label">Rating:</span>
              <span>{getRating()}</span>
            </div>
          </div>
          
          <div className="details-section">
            <h2 className="details-section-title">Overview</h2>
            <p className="details-overview">{getDescription()}</p>
          </div>
          
          {details.genres && details.genres.length > 0 && (
            <div className="details-section">
              <h2 className="details-section-title">Genres</h2>
              <div className="details-genres">
                {details.genres.map(genre => (
                  <span 
                    key={genre.id}
                    className="details-genre"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaDetails;