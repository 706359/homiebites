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
    const oldLinks = document.querySelectorAll(
      'link[href*="fonts.googleapis.com"]'
    );
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
        const url = API_URL
          ? `${API_URL.replace(/\/$/, '')}/api/settings`
          : '/api/settings';
        const response = await fetch(url);
        const data = await response.json();

        if (data.success && data.data) {
          const settings = data.data;
          const root = document.documentElement;

          // Apply font family (full platform: website, admin, login)
          // Font family is applied globally via --font-primary CSS variable
          if (settings.fontFamily) {
            applyFontFamily(settings.fontFamily);
          } else {
            // If no font family in settings, use default but still apply it
            applyFontFamily('Baloo 2');
          }

          // Font size is NOT applied here - it only applies to admin dashboard
          // Admin font size is handled by AdminDashboard and applyAdminFontSize()
          // which uses --admin-base-font-size and .admin-active class

          // Apply primary color
          if (settings.primaryColor) {
            root.style.setProperty('--primary-green', settings.primaryColor);
            // You can add more color variables if needed
          }

          // Apply theme: dark, light, or auto (prefers-color-scheme). Default to auto when unset.
          const theme = settings.theme || 'auto';
          const applyDark = () => {
            document.documentElement.classList.add('dark-theme');
            document.documentElement.classList.remove('light-theme');
            const meta = document.querySelector('meta[name="theme-color"]');
            if (meta) meta.setAttribute('content', '#0f1412');
          };
          const applyLight = () => {
            document.documentElement.classList.add('light-theme');
            document.documentElement.classList.remove('dark-theme');
            const meta = document.querySelector('meta[name="theme-color"]');
            if (meta) meta.setAttribute('content', '#f9fafb');
          };
          if (theme === 'dark') {
            applyDark();
          } else if (theme === 'light') {
            applyLight();
          } else {
            const prefersDark = window.matchMedia(
              '(prefers-color-scheme: dark)'
            ).matches;
            if (prefersDark) applyDark();
            else applyLight();
          }
        } else {
          // No settings: apply default font and theme
          applyFontFamily('Baloo 2');
          
          // Default to auto (prefers-color-scheme)
          const prefersDark = window.matchMedia(
            '(prefers-color-scheme: dark)'
          ).matches;
          if (prefersDark) {
            document.documentElement.classList.add('dark-theme');
            document.documentElement.classList.remove('light-theme');
            const meta = document.querySelector('meta[name="theme-color"]');
            if (meta) meta.setAttribute('content', '#0f1412');
          } else {
            document.documentElement.classList.add('light-theme');
            document.documentElement.classList.remove('dark-theme');
            const meta = document.querySelector('meta[name="theme-color"]');
            if (meta) meta.setAttribute('content', '#f9fafb');
          }
        }
      } catch (error) {
        console.error('Error loading font settings:', error);
        // Fallback to default font - apply it via the function to load Google Font
        applyFontFamily('Baloo 2');
      }
    };

    applyFontSettings();

    // When admin saves font in another tab, storage fires here so this tab (e.g. customer site) updates
    const onStorage = (e) => {
      if (e.key === 'homiebites_font_family' && e.newValue)
        applyFontFamily(e.newValue);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return null; // This component doesn't render anything
}
