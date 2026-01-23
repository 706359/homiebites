import { useEffect, useRef } from 'react';

/**
 * Hook to preserve scroll position during data updates
 * Prevents flickering and maintains user's scroll position
 */
export const usePreserveScroll = (dependency, containerSelector = null) => {
  const scrollPositionRef = useRef({ top: 0, left: 0 });
  const containerRef = useRef(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Find the scrollable container
    if (containerSelector) {
      containerRef.current = document.querySelector(containerSelector);
    } else {
      // Default to window scroll
      containerRef.current = window;
    }
  }, [containerSelector]);

  useEffect(() => {
    // Skip on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    // Save scroll position before update
    const saveScroll = () => {
      if (container === window) {
        scrollPositionRef.current = {
          top: window.pageYOffset || window.scrollY,
          left: window.pageXOffset || window.scrollX,
        };
      } else {
        scrollPositionRef.current = {
          top: container.scrollTop,
          left: container.scrollLeft,
        };
      }
    };

    // Restore scroll position after update
    const restoreScroll = () => {
      // Use double RAF to ensure DOM has updated
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (container === window) {
            window.scrollTo({
              top: scrollPositionRef.current.top,
              left: scrollPositionRef.current.left,
              behavior: 'auto', // Instant, no animation
            });
          } else if (container) {
            container.scrollTop = scrollPositionRef.current.top;
            container.scrollLeft = scrollPositionRef.current.left;
          }
        });
      });
    };

    // Save before dependency changes
    saveScroll();

    // Restore after React has updated the DOM
    const timeoutId = setTimeout(restoreScroll, 0);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [dependency]);
};

export default usePreserveScroll;
