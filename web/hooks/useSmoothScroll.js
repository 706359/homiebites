import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useSmoothScroll = () => {
  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    // Handle hash in URL when page loads or route changes
    const handleHashScroll = () => {
      if (pathname === '/') {
        const hash = window.location.hash;
        if (hash && hash !== '#') {
          // Small delay to ensure DOM is ready
          setTimeout(() => {
            const targetElement = document.querySelector(hash);
            if (targetElement) {
              const headerOffset = 70;
              const elementPosition = targetElement.getBoundingClientRect().top;
              const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

              window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth',
              });
            }
          }, 200);
        }
      }
    };

    // Handle initial load and route changes
    handleHashScroll();

    // Also listen for hashchange events
    const handleHashChange = () => {
      handleHashScroll();
    };
    window.addEventListener('hashchange', handleHashChange);

    // Handle click on anchor links
    const handleClick = (e) => {
      // Don't interfere with buttons, inputs, or interactive elements
      if (
        e.target.tagName === 'BUTTON' ||
        e.target.tagName === 'INPUT' ||
        e.target.closest('button') ||
        e.target.closest('.faq-question') ||
        e.target.closest('.order-modal') ||
        e.target.closest('.gallery-modal')
      ) {
        return;
      }

      // Handle React Router Link components with hash
      const link = e.target.closest('a[href*="#"]');
      if (link) {
        const href = link.getAttribute('href');
        if (href && href.startsWith('/#')) {
          // Let React Router handle navigation, then scroll after navigation
          const hash = href.split('#')[1];
          if (hash) {
            // Wait for navigation to complete
            setTimeout(() => {
              const targetElement = document.querySelector(`#${hash}`);
              if (targetElement) {
                const headerOffset = 70;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                  top: offsetPosition,
                  behavior: 'smooth',
                });
              }
            }, 300);
          }
          return;
        }
      }

      // Handle regular anchor tags with hash (for same-page scrolling)
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;

      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      // Only prevent default if we're on the same page
      if (pathname === '/') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          e.stopPropagation();
          const headerOffset = 70;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        }
      }
    };

    document.addEventListener('click', handleClick, true);
    return () => {
      document.removeEventListener('click', handleClick, true);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [pathname]);
};
