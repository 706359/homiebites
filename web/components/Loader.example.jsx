'use client';

/**
 * LOADER USAGE EXAMPLES
 * 
 * This file shows different ways to use the Loader component
 */

import { useState, useEffect } from 'react';
import Loader from './Loader';
import { useLoader } from '../hooks/useLoader';

// Example 1: Simple Fullscreen Loader
export function Example1_SimpleLoader() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <Loader fullScreen={true} size="medium" />}
      <button onClick={() => setLoading(!loading)}>
        Toggle Loader
      </button>
    </>
  );
}

// Example 2: Using the useLoader Hook
export function Example2_WithHook() {
  const [showLoader, setLoading, showLoaderFunc, hideLoader] = useLoader(false, 300);

  return (
    <>
      {showLoader && <Loader fullScreen={true} size="medium" />}
      <div>
        <button onClick={showLoaderFunc}>Show Loader</button>
        <button onClick={hideLoader}>Hide Loader</button>
        <button onClick={() => setLoading(!showLoader)}>Toggle</button>
      </div>
    </>
  );
}

// Example 3: Inline Loader (not fullscreen)
export function Example3_InlineLoader() {
  return (
    <div>
      <h2>Loading Content...</h2>
      <Loader fullScreen={false} size="small" />
    </div>
  );
}

// Example 4: Different Sizes
export function Example4_DifferentSizes() {
  return (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
      <Loader fullScreen={false} size="small" />
      <Loader fullScreen={false} size="medium" />
      <Loader fullScreen={false} size="large" />
    </div>
  );
}

// Example 5: Page Loader (in layout or page)
export function Example5_PageLoader() {
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    // Simulate page load
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isPageLoading) {
    return <Loader fullScreen={true} size="large" />;
  }

  return <div>Page Content</div>;
}

