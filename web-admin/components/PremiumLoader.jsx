'use client';

import React from 'react';

/**
 * Enterprise Loader Component
 * Features:
 * - Animated logo with blur/glow effect
 * - Clean, professional design
 * - Responsive design
 */
const PremiumLoader = ({ 
  message = 'Loading...', 
  size = 'large',
  showText = true 
}) => {
  const sizeClasses = {
    small: { container: '64px', logo: '48px', text: '0.85rem' },
    medium: { container: '80px', logo: '60px', text: '0.9rem' },
    large: { container: '100px', logo: '75px', text: '1rem' },
  };

  const dimensions = sizeClasses[size] || sizeClasses.large;

  return (
    <div className="premium-loader-container">
      <div className="premium-loader-wrapper">
        {/* Animated logo/text in center with blur/glow effect */}
        <div className="premium-loader-logo-container">
          <img
            src="/logo.png"
            alt="HomieBites"
            className="premium-loader-logo"
            style={{ 
              width: dimensions.logo, 
              height: dimensions.logo,
              maxWidth: dimensions.logo,
              maxHeight: dimensions.logo,
            }}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div 
            className="premium-loader-logo-fallback" 
            style={{ 
              display: 'none',
              width: 'auto',
              minWidth: dimensions.logo,
              height: dimensions.logo,
              fontSize: `calc(${dimensions.logo} * 0.35)`,
              fontWeight: '700',
              letterSpacing: '0.02em',
            }}
          >
            HomieBites
          </div>
        </div>
      </div>

      {/* Loading text */}
      {showText && (
        <div 
          className="premium-loader-text"
          style={{ fontSize: dimensions.text }}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default PremiumLoader;

