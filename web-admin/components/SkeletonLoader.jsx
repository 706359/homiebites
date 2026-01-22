'use client';

const SkeletonLoader = ({ type = 'default', count = 1 }) => {
  if (type === 'gallery') {
    return (
      <div className="skeleton-gallery">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="skeleton-gallery-item">
            <div className="skeleton-image"></div>
            <div className="skeleton-text"></div>
            <div className="skeleton-text short"></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'faq') {
    return (
      <div className="skeleton-faq">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="skeleton-faq-item">
            <div className="skeleton-text"></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'card') {
    return (
      <div className="skeleton-cards">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="skeleton-card">
            <div className="skeleton-image"></div>
            <div className="skeleton-text"></div>
            <div className="skeleton-text short"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="skeleton-default">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-line"></div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
