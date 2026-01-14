import { useEffect, useRef } from 'react';


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
        
        if (window.visualViewport) {
          const viewport = window.visualViewport;
          const inputRect = input.getBoundingClientRect();
          const viewportHeight = viewport.height;
          
          
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

    
    const inputs = inputRefs.current.filter(Boolean);
    const focusHandlers = inputs.map((input) => {
      const handler = () => handleInputFocus(input);
      input.addEventListener('focus', handler);
      return { input, handler };
    });

    return () => {
      
      focusHandlers.forEach(({ input, handler }) => {
        input.removeEventListener('focus', handler);
      });
    };
  }, [enabled, mobileBreakpoint, scrollBehavior, block, delay]);

  
  const registerInput = (input) => {
    if (input && !inputRefs.current.includes(input)) {
      inputRefs.current.push(input);
    }
  };

  
  const unregisterInput = (input) => {
    inputRefs.current = inputRefs.current.filter((ref) => ref !== input);
  };

  
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
