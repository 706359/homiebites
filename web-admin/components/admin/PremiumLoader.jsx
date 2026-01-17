import React from 'react';

const PremiumLoader = ({ message = 'Loading...', size = 'large', showText = false }) => {
  const sizeClasses = {
    small: { container: '64px', logo: '120px', text: '0.85rem' },
    medium: { container: '80px', logo: '150px', text: '0.9rem' },
    large: { container: '100px', logo: '180px', text: '1rem' },
  };

  const dimensions = sizeClasses[size] || sizeClasses.large;

  return (
    <div className='premium-loader-container'>
      <div className='premium-loader-wrapper'>
        {}
        <div className='premium-loader-logo-container'>
          <img
            src='/logo.png'
            alt='Logo'
            className='premium-loader-logo'
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className='premium-loader-logo-fallback'>Logo</div>
        </div>
      </div>

      {}
      {showText && <div className='premium-loader-text'>{message}</div>}
    </div>
  );
};

export default PremiumLoader;
