import React from 'react';

/**
 * Skeleton loader component for tables and cards
 * @param {string} type - 'table' | 'card' | 'stat'
 * @param {number} rows - Number of rows for table skeleton (default: 10)
 * @param {number} cols - Number of columns for table skeleton (default: 9)
 * @param {number} items - Number of items for card skeleton (default: 6)
 */
const SkeletonLoader = ({ type = 'table', rows = 10, cols = 9, items = 6 }) => {
  if (type === 'table') {
    return (
      <div className='skeleton-table-container'>
        <div className='skeleton-table'>
          {/* Table header skeleton */}
          <div className='skeleton-table-header'>
            {[...Array(cols)].map((_, i) => (
              <div key={`header-${i}`} className='skeleton-table-header-cell'></div>
            ))}
          </div>
          {/* Table rows skeleton */}
          {[...Array(rows)].map((_, rowIdx) => (
            <div key={`row-${rowIdx}`} className='skeleton-table-row'>
              {[...Array(cols)].map((_, colIdx) => (
                <div key={`cell-${rowIdx}-${colIdx}`} className='skeleton-table-cell'></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'card') {
    return (
      <div className='skeleton-card-container'>
        {[...Array(items)].map((_, idx) => (
          <div key={`card-${idx}`} className='skeleton-card'>
            <div className='skeleton-card-header'></div>
            <div className='skeleton-card-body'>
              <div className='skeleton-card-line skeleton-card-line-full'></div>
              <div className='skeleton-card-line skeleton-card-line-80'></div>
              <div className='skeleton-card-line skeleton-card-line-60'></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'stat') {
    return (
      <div className='skeleton-stat-container'>
        {[...Array(items)].map((_, idx) => (
          <div key={`stat-${idx}`} className='skeleton-stat-card'>
            <div className='skeleton-stat-icon'></div>
            <div className='skeleton-stat-content'>
              <div className='skeleton-stat-label'></div>
              <div className='skeleton-stat-value'></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default SkeletonLoader;
