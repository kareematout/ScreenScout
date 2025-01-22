import PropTypes from 'prop-types';
import { PaginationControls } from './PaginationControls';

export const GenreSection = ({ 
  title, 
  children, 
  currentPage, 
  onPageChange,
  loading
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
        children
      )}
    </div>
  </section>
);

GenreSection.propTypes = {
  title: PropTypes.node.isRequired,
  children: PropTypes.node,
  currentPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  loading: PropTypes.bool
};