import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  showFirstLast?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
  showFirstLast = false,
  size = 'md',
}) => {
  // Don't render if there's only one page
  if (totalPages <= 1) return null;

  // Generate page buttons logic
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // If total pages is less than or equal to maxVisiblePages, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first and last pages, and some pages around the current page
      const leftBound = Math.max(1, currentPage - 1);
      const rightBound = Math.min(totalPages, currentPage + 1);
      
      // First page
      pages.push(1);
      
      // Ellipsis after first page
      if (leftBound > 2) {
        pages.push('ellipsis-left');
      } else if (leftBound === 2) {
        pages.push(2);
      }
      
      // Pages around current page
      for (let i = Math.max(2, leftBound); i <= Math.min(totalPages - 1, rightBound); i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i);
        }
      }
      
      // Ellipsis before last page
      if (rightBound < totalPages - 1) {
        pages.push('ellipsis-right');
      } else if (rightBound === totalPages - 1) {
        pages.push(totalPages - 1);
      }
      
      // Last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  // Size classes
  const sizeClasses = {
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10',
    lg: 'h-12 w-12 text-lg',
  };

  const buttonBaseClass = `
    inline-flex items-center justify-center 
    border border-gray-300 bg-white 
    font-medium text-gray-700 hover:bg-gray-50 
    focus:outline-none focus:ring-2 focus:ring-primary/50
    ${sizeClasses[size]}
  `;

  const pages = getPageNumbers();

  return (
    <nav
      className={`flex justify-center ${className}`}
      aria-label="Pagination"
    >
      <ul className="inline-flex space-x-2 items-center">
        {/* First page button */}
        {showFirstLast && (
          <li>
            <button
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
              className={`${buttonBaseClass} rounded-md ${
                currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              }`}
              aria-label="Go to first page"
            >
              <span className="sr-only">First</span>
              <FaChevronLeft className="mr-1 h-3 w-3" />
              <FaChevronLeft className="h-3 w-3" />
            </button>
          </li>
        )}

        {/* Previous page button */}
        <li>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`${buttonBaseClass} rounded-md ${
              currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            }`}
            aria-label="Previous"
          >
            <span className="sr-only">Previous</span>
            <FaChevronLeft />
          </button>
        </li>

        {/* Page numbers */}
        {pages.map((page, index) => {
          if (page === 'ellipsis-left' || page === 'ellipsis-right') {
            return (
              <li key={`${page}-${index}`}>
                <span className="inline-flex items-center justify-center h-10 w-10">...</span>
              </li>
            );
          }

          return (
            <li key={`page-${page}`}>
              <button
                onClick={() => onPageChange(page as number)}
                className={`${buttonBaseClass} rounded-md ${
                  currentPage === page
                    ? 'bg-primary text-white hover:bg-primary-dark border-primary'
                    : 'cursor-pointer'
                }`}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </button>
            </li>
          );
        })}

        {/* Next page button */}
        <li>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`${buttonBaseClass} rounded-md ${
              currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            }`}
            aria-label="Next"
          >
            <span className="sr-only">Next</span>
            <FaChevronRight />
          </button>
        </li>

        {/* Last page button */}
        {showFirstLast && (
          <li>
            <button
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
              className={`${buttonBaseClass} rounded-md ${
                currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              }`}
              aria-label="Go to last page"
            >
              <span className="sr-only">Last</span>
              <FaChevronRight className="mr-1 h-3 w-3" />
              <FaChevronRight className="h-3 w-3" />
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Pagination;