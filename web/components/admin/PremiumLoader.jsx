import React from 'react';

/**
 * Enterprise Loader Component
 * Features:
 * - Static logo in center
 * - Single rotating circle
 * - Clean, professional design
 * - Responsive design
 */
const PremiumLoader = ({ 
  message = 'Loading...', 
  size = 'large',
  showText = true 
}) => {
  const sizeClasses = {
    small: { container: '64px', logo: '48px', spinner: '64px', text: '0.85rem' },
    medium: { container: '80px', logo: '60px', spinner: '80px', text: '0.9rem' },
    large: { container: '100px', logo: '75px', spinner: '100px', text: '1rem' },
  };

  const dimensions = sizeClasses[size] || sizeClasses.large;

  return (
    <div className="premium-loader-container">
      <div className="premium-loader-wrapper">
        {/* Rotating spinner circle */}
        <div 
          className="premium-loader-spinner"
          style={{ 
            width: dimensions.spinner, 
            height: dimensions.spinner 
          }}
        ></div>
        
        {/* Static logo in center */}
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
              width: dimensions.logo,
              height: dimensions.logo,
              fontSize: `calc(${dimensions.logo} * 0.5)`,
            }}
          >
            <i className="fa-solid fa-shield-halved"></i>
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

