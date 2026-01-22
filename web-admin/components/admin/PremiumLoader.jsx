import React from 'react';

const PremiumLoader = ({
  message = 'Loading...',
  size = 'large',
  showText = false,
}) => {
  const sizeMap = { small: 48, medium: 67, large: 180 };
  const px = sizeMap[size] ?? 180;

  return (
    <div className="premium-loader-container">
      <div className="premium-loader-wrapper">
        <div
          className="premium-loader-logo-container"
          style={{ width: px, height: px, minWidth: px, minHeight: px }}
        >
          <img
            src="/logo.png"
            alt="Logo"
            className="premium-loader-logo"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        </div>
      </div>

      {showText && <div className="premium-loader-text">{message}</div>}
    </div>
  );
};

export default PremiumLoader;
