'use client';

import React from 'react';

const PremiumLoader = ({ message = 'Loading...', size = 'large', showText = true }) => {
  const sizeClasses = {
    small: { container: '77px', logo: '58px', text: '0.85rem' },
    medium: { container: '96px', logo: '72px', text: '0.9rem' },
    large: { container: '120px', logo: '90px', text: '1rem' },
  };

  const dimensions = sizeClasses[size] || sizeClasses.large;

  return (
    <div className='premium-loader-container'>
      <div className='premium-loader-wrapper'>
        <div
          className='premium-loader-logo-container'
          style={{ width: dimensions.logo, height: dimensions.logo, minWidth: dimensions.logo, minHeight: dimensions.logo }}
        >
          <img
            src='/logo.png'
            alt='Logo'
            className='premium-loader-logo'
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className='premium-loader-logo-fallback'></div>
        </div>
      </div>

      {showText && <div className='premium-loader-text'>{message}</div>}
    </div>
  );
};

export default PremiumLoader;
