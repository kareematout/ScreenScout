import PropTypes from 'prop-types';
import ApiService from '../../services/apiServiceTMDB';
import RawgApiService from '../../services/apiServiceRAWG';

export const MediaCard = ({ 
  item, 
  isMovie = false,
  isShow = false,
  isGame = false 
}) => {
  const getImageUrl = () => {
    if (isGame) {
      return RawgApiService.getImageUrl(item.background_image) || 'image-not-available.jpg';
    }
    return item.poster_path 
      ? ApiService.getImageUrl(item.poster_path, 'w500')
      : 'image-not-available.jpg';
  };

  const getYear = () => {
    if (isGame) {
      return item.released ? new Date(item.released).getFullYear() : 'TBA';
    }
    const dateString = isMovie ? item.release_date : item.first_air_date;
    if (!dateString) return 'TBA';
    return new Date(dateString).getFullYear();
  };

  const getRating = () => {
    if (isGame) {
      if (!item.rating) return 'N/A';
      // RAWG uses 5-star scale, multiply by 2 to match TMDB's 10-star scale
      return (item.rating * 2).toFixed(1);
    }
    return item.vote_average?.toFixed(1) || 'N/A';
  };

  const getTitle = () => {
    if (isGame) return item.name;
    return isMovie ? item.title : item.name;
  };

  const getMediaType = () => {
    if (isGame) return 'Game';
    if (isShow) return 'TV Show';
    return 'Movie';
  };

  return (
    <div className={`movie-card ${isGame ? 'game-card' : ''}`}>
      <div className="movie-poster">
        <img
          src={getImageUrl()}
          alt={getTitle()}
          loading="lazy"
        />
        <div className="movie-overlay">
          <span className="movie-rating">★ {getRating()}</span>
          <span className="media-type">{getMediaType()}</span>
          <button className="watch-btn">Learn More</button>
        </div>
      </div>
      <div className="movie-info">
        <h3>{getTitle()}</h3>
        <p>{getYear()}</p>
      </div>
    </div>
  );
};

MediaCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string,
    name: PropTypes.string,
    poster_path: PropTypes.string,
    background_image: PropTypes.string,
    vote_average: PropTypes.number,
    rating: PropTypes.number,
    release_date: PropTypes.string,
    released: PropTypes.string,
    first_air_date: PropTypes.string
  }).isRequired,
  isMovie: PropTypes.bool,
  isShow: PropTypes.bool,
  isGame: PropTypes.bool
};