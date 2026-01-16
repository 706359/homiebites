'use client';

import React from 'react';

const PremiumLoader = ({ message = 'Loading...', size = 'large', showText = true }) => {
  const sizeClasses = {
    small: { container: '64px', logo: '48px', text: '0.85rem' },
    medium: { container: '80px', logo: '60px', text: '0.9rem' },
    large: { container: '100px', logo: '75px', text: '1rem' },
  };

  const dimensions = sizeClasses[size] || sizeClasses.large;

  return (
    <div className='premium-loader-container'>
      <div className='premium-loader-wrapper'>
        <div className='premium-loader-logo-container'>
          <img
            src='/logo.png'
            alt='HomieBites'
            className='premium-loader-logo'
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className='premium-loader-logo-fallback'>HomieBites</div>
        </div>
      </div>

      {showText && <div className='premium-loader-text'>{message}</div>}
    </div>
  );
};

export default PremiumLoader;
