import { useEffect, useRef } from 'react';

/**
 * Custom hook for keyboard avoidance on mobile devices
 * Automatically scrolls input fields into view when keyboard appears
 * 
 * @param {Object} options - Configuration options
 * @param {boolean} options.enabled - Enable/disable keyboard avoidance (default: true)
 * @param {number} options.mobileBreakpoint - Screen width breakpoint for mobile (default: 768)
 * @param {string} options.scrollBehavior - Scroll behavior: 'smooth' or 'auto' (default: 'smooth')
 * @param {string} options.block - Vertical alignment: 'start', 'center', 'end', 'nearest' (default: 'center')
 * @param {number} options.delay - Delay in ms before scrolling (default: 100 for visualViewport, 300 for fallback)
 * @returns {Object} - Object with refs and utilities
 */
export const useKeyboardAvoidance = (options = {}) => {
  const {
    enabled = true,
    mobileBreakpoint = 768,
    scrollBehavior = 'smooth',
    block = 'center',
    delay = null,
  } = options;

  const inputRefs = useRef([]);

  useEffect(() => {
    if (!enabled) return;

    const isMobile = () => window.innerWidth <= mobileBreakpoint;

    const handleInputFocus = (input) => {
      if (!isMobile() || !input) return;

      const scrollInputIntoView = () => {
        // Use visualViewport if available for better keyboard detection
        if (window.visualViewport) {
          const viewport = window.visualViewport;
          const inputRect = input.getBoundingClientRect();
          const viewportHeight = viewport.height;
          
          // Check if input is covered by keyboard
          if (inputRect.bottom > viewportHeight) {
            const scrollDelay = delay !== null ? delay : 100;
            setTimeout(() => {
              input.scrollIntoView({
                behavior: scrollBehavior,
                block: block,
                inline: 'nearest'
              });
            }, scrollDelay);
          }
        } else {
          // Fallback for browsers without visualViewport
          const scrollDelay = delay !== null ? delay : 300;
          setTimeout(() => {
            input.scrollIntoView({
              behavior: scrollBehavior,
              block: block,
              inline: 'nearest'
            });
          }, scrollDelay);
        }
      };

      scrollInputIntoView();
    };

    // Add focus listeners to all registered inputs
    const inputs = inputRefs.current.filter(Boolean);
    const focusHandlers = inputs.map((input) => {
      const handler = () => handleInputFocus(input);
      input.addEventListener('focus', handler);
      return { input, handler };
    });

    return () => {
      // Cleanup: remove all event listeners
      focusHandlers.forEach(({ input, handler }) => {
        input.removeEventListener('focus', handler);
      });
    };
  }, [enabled, mobileBreakpoint, scrollBehavior, block, delay]);

  /**
   * Register an input element for keyboard avoidance
   * @param {HTMLElement} input - Input element to register
   */
  const registerInput = (input) => {
    if (input && !inputRefs.current.includes(input)) {
      inputRefs.current.push(input);
    }
  };

  /**
   * Unregister an input element
   * @param {HTMLElement} input - Input element to unregister
   */
  const unregisterInput = (input) => {
    inputRefs.current = inputRefs.current.filter((ref) => ref !== input);
  };

  /**
   * Create a ref callback that automatically registers the input
   * @returns {Function} - Ref callback function
   */
  const createInputRef = () => {
    return (input) => {
      if (input) {
        registerInput(input);
      }
    };
  };

  return {
    registerInput,
    unregisterInput,
    createInputRef,
    inputRefs: inputRefs.current,
  };
};

/**
 * Simplified hook that automatically finds and registers all inputs in a container
 * @param {Object} options - Same options as useKeyboardAvoidance
 * @param {string} options.containerSelector - CSS selector for container (default: 'form')
 * @param {string} options.inputSelector - CSS selector for inputs (default: 'input, textarea, select')
 */
export const useAutoKeyboardAvoidance = (options = {}) => {
  const {
    containerSelector = 'form',
    inputSelector = 'input, textarea, select',
    ...restOptions
  } = options;

  useEffect(() => {
    if (!restOptions.enabled && restOptions.enabled !== undefined) return;

    const isMobile = () => window.innerWidth <= (restOptions.mobileBreakpoint || 768);

    const handleInputFocus = (input) => {
      if (!isMobile() || !input) return;

      const scrollInputIntoView = () => {
        if (window.visualViewport) {
          const viewport = window.visualViewport;
          const inputRect = input.getBoundingClientRect();
          const viewportHeight = viewport.height;
          
          if (inputRect.bottom > viewportHeight) {
            const delay = restOptions.delay !== null ? restOptions.delay : 100;
            setTimeout(() => {
              input.scrollIntoView({
                behavior: restOptions.scrollBehavior || 'smooth',
                block: restOptions.block || 'center',
                inline: 'nearest'
              });
            }, delay);
          }
        } else {
          const delay = restOptions.delay !== null ? restOptions.delay : 300;
          setTimeout(() => {
            input.scrollIntoView({
              behavior: restOptions.scrollBehavior || 'smooth',
              block: restOptions.block || 'center',
              inline: 'nearest'
            });
          }, delay);
        }
      };

      scrollInputIntoView();
    };

    // Find all containers and their inputs
    const containers = document.querySelectorAll(containerSelector);
    const allHandlers = [];

    containers.forEach((container) => {
      const inputs = container.querySelectorAll(inputSelector);
      inputs.forEach((input) => {
        const handler = () => handleInputFocus(input);
        input.addEventListener('focus', handler);
        allHandlers.push({ input, handler });
      });
    });

    return () => {
      allHandlers.forEach(({ input, handler }) => {
        input.removeEventListener('focus', handler);
      });
    };
  }, [containerSelector, inputSelector, restOptions.enabled, restOptions.mobileBreakpoint, restOptions.scrollBehavior, restOptions.block, restOptions.delay]);
};
