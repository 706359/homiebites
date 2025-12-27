'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import NotificationWrapper from '../components/NotificationWrapper';
import { LanguageProvider, useLanguage } from '../contexts/LanguageContext';
import { NotificationProvider } from '../contexts/NotificationContext';

function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Scroll to top on route change, unless there's a hash
    const hash = window.location.hash;
    if (!hash || hash === '#') {
      window.scrollTo({
        top: 0,
        behavior: 'instant',
      });
    }
  }, [pathname]);

  return null;
}

function HashScrollHandler() {
  const pathname = usePathname();

  useEffect(() => {
    // Handle hash navigation when route changes to home page
    if (pathname === '/') {
      const hash = window.location.hash;
      if (hash && hash !== '#') {
        // Wait for DOM to be ready
        const scrollToHash = () => {
          const targetElement = document.querySelector(hash);
          if (targetElement) {
            const headerOffset = 70;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth',
            });
            return true;
          }
          return false;
        };

        // Try immediately, then retry with delays if needed
        if (!scrollToHash()) {
          setTimeout(() => {
            if (!scrollToHash()) {
              setTimeout(scrollToHash, 300);
            }
          }, 100);
        }
      }
    }
  }, [pathname]);

  return null;
}

function LanguageHandler() {
  const { language } = useLanguage();

  useEffect(() => {
    // Update HTML lang attribute based on selected language
    document.documentElement.lang = language === 'hi' ? 'hi' : 'en';
  }, [language]);

  return null;
}

function ClientLayoutContent({ children }) {
  return (
    <NotificationProvider>
      <LanguageHandler />
      <ScrollToTop />
      <HashScrollHandler />
      {children}
      <NotificationWrapper />
    </NotificationProvider>
  );
}

export default function ClientLayout({ children }) {
  return (
    <LanguageProvider>
      <ClientLayoutContent>{children}</ClientLayoutContent>
    </LanguageProvider>
  );
}
