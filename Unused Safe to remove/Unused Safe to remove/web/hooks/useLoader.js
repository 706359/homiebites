"use client";

import { useState, useEffect } from "react";

/**
 * Hook to manage loader state
 * @param {boolean} initialLoading - Initial loading state
 * @param {number} delay - Delay before showing loader (ms)
 * @returns {[boolean, function, function]} - [isLoading, setLoading, showLoader, hideLoader]
 */
export function useLoader(initialLoading = false, delay = 0) {
  const [isLoading, setIsLoading] = useState(initialLoading);
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    let timeoutId;

    if (isLoading) {
      if (delay > 0) {
        timeoutId = setTimeout(() => {
          setShowLoader(true);
        }, delay);
      } else {
        setShowLoader(true);
      }
    } else {
      setShowLoader(false);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isLoading, delay]);

  const setLoading = (loading) => {
    setIsLoading(loading);
  };

  const hideLoader = () => {
    setIsLoading(false);
  };

  const showLoaderFunc = () => {
    setIsLoading(true);
  };

  return [showLoader, setLoading, showLoaderFunc, hideLoader];
}
