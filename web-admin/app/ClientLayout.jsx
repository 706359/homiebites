'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import FontSettingsLoader from '../components/FontSettingsLoader';
import { LanguageProvider, useLanguage } from '../contexts/LanguageContext';
import { NotificationProvider } from '../contexts/NotificationContext';
import ErrorBoundary from '../components/ErrorBoundary';

function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
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
    if (pathname === '/') {
      const hash = window.location.hash;
      if (hash && hash !== '#') {
        const scrollToHash = () => {
          const targetElement = document.querySelector(hash);
          if (targetElement) {
            const headerOffset = 70;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition =
              elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth',
            });
            return true;
          }
          return false;
        };

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
    document.documentElement.lang = language === 'hi' ? 'hi' : 'en';
  }, [language]);

  return null;
}

function ClientLayoutContent({ children }) {
  return (
    <ErrorBoundary>
      <NotificationProvider>
        <FontSettingsLoader />
        <LanguageHandler />
        <ScrollToTop />
        <HashScrollHandler />
        {children}
      </NotificationProvider>
    </ErrorBoundary>
  );
}

export default function ClientLayout({ children }) {
  return (
    <LanguageProvider>
      <ClientLayoutContent>{children}</ClientLayoutContent>
    </LanguageProvider>
  );
}
