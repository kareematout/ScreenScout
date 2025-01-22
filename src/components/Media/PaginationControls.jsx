import PropTypes from 'prop-types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const PaginationControls = ({ 
  currentPage, 
  onPageChange, 
  loading = false 
}) => (
  <div className="pagination-controls">
    <button 
      className="pagination-btn"
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1 || loading}
    >
      <ChevronLeft size={20} />
    </button>
    <span className="pagination-page">Page {currentPage}</span>
    <button 
      className="pagination-btn"
      onClick={() => onPageChange(currentPage + 1)}
      disabled={loading}
    >
      <ChevronRight size={20} />
    </button>
  </div>
);

PaginationControls.propTypes = {
  currentPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  loading: PropTypes.bool
};