'use client';

import { useEffect } from 'react';

// Use relative URL for Next.js API routes (same server)
const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || '';

/** Apply font via global --font-primary only; load Google Font if needed. Full platform uses this variable. */
function applyFontFamily(fontFamilyName) {
  if (!fontFamilyName || typeof document === 'undefined') return;
  const value = `'${fontFamilyName}', sans-serif`;
  document.documentElement.style.setProperty('--font-primary', value);

  const fontName = String(fontFamilyName).replace(/\s+/g, '+');
  const existingLink = document.querySelector(
    `link[href*="fonts.googleapis.com"][href*="${fontName}"]`
  );
  if (!existingLink && fontName) {
    const oldLinks = document.querySelectorAll('link[href*="fonts.googleapis.com"]');
    oldLinks.forEach((link) => {
      if (!link.href.includes('font-awesome')) link.remove();
    });
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${fontName}:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600;1,700;1,800&display=swap`;
    document.head.appendChild(link);
  }
}

export default function FontSettingsLoader() {
  useEffect(() => {
    const applyFontSettings = async () => {
      try {
        const url = API_URL ? `${API_URL.replace(/\/$/, '')}/api/settings` : '/api/settings';
        const response = await fetch(url);
        const data = await response.json();

        if (data.success && data.data) {
          const settings = data.data;
          const root = document.documentElement;

          // Apply font family (full platform: website, admin, login)
          if (settings.fontFamily) {
            applyFontFamily(settings.fontFamily);
          }

          // Apply font size
          if (settings.fontSize) {
            const fontSizeMap = {
              small: '14px',
              medium: '16px',
              large: '18px',
              'extra-large': '20px',
            };
            const fontSize = fontSizeMap[settings.fontSize] || '16px';
            root.style.setProperty('--base-font-size', fontSize);
            document.body.style.fontSize = fontSize;
          }

          // Apply primary color
          if (settings.primaryColor) {
            root.style.setProperty('--primary-green', settings.primaryColor);
            // You can add more color variables if needed
          }

          // Apply theme (if needed for website)
          if (settings.theme) {
            if (settings.theme === 'dark') {
              document.documentElement.classList.add('dark-theme');
              document.documentElement.classList.remove('light-theme');
            } else if (settings.theme === 'light') {
              document.documentElement.classList.add('light-theme');
              document.documentElement.classList.remove('dark-theme');
            } else if (settings.theme === 'auto') {
              const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
              if (prefersDark) {
                document.documentElement.classList.add('dark-theme');
                document.documentElement.classList.remove('light-theme');
              } else {
                document.documentElement.classList.add('light-theme');
                document.documentElement.classList.remove('dark-theme');
              }
            }
          }
        }
      } catch (error) {
        console.error('Error loading font settings:', error);
        // Fallback to default font
        const root = document.documentElement;
        document.documentElement.style.setProperty('--font-primary', "'Baloo 2', sans-serif");
      }
    };

    applyFontSettings();

    // When admin saves font in another tab, storage fires here so this tab (e.g. customer site) updates
    const onStorage = (e) => {
      if (e.key === 'homiebites_font_family' && e.newValue) applyFontFamily(e.newValue);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return null; // This component doesn't render anything
}
