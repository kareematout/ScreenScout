import PropTypes from 'prop-types';
import { MediaCard } from './MediaCard';
import { PaginationControls } from './PaginationControls';

export const MediaSection = ({ 
  title, 
  items, 
  isMovie = false,
  isShow = false,
  isGame = false,
  currentPage, 
  onPageChange,
  loading = false
}) => (
  <section className="movie-section">
    <div className="section-header">
      <h2>{title}</h2>
      <div className="section-line"></div>
      <PaginationControls 
        currentPage={currentPage} 
        onPageChange={onPageChange}
        loading={loading}
      />
    </div>
    <div className="movies-grid">
      {loading ? (
        [...Array(6)].map((_, index) => (
          <div key={index} className="movie-card skeleton-card">
            <div className="skeleton-image"></div>
            <div className="skeleton-info">
              <div className="skeleton-title"></div>
              <div className="skeleton-year"></div>
            </div>
          </div>
        ))
      ) : (
        items.map(item => (
          <MediaCard 
            key={item.id} 
            item={item} 
            isMovie={isMovie}
            isShow={isShow}
            isGame={isGame}
          />
        ))
      )}
    </div>
  </section>
);

MediaSection.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired
  })).isRequired,
  isMovie: PropTypes.bool,
  isShow: PropTypes.bool,
  isGame: PropTypes.bool,
  currentPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  loading: PropTypes.bool
};