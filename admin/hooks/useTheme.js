import { useEffect, useState } from 'react';

/**
 * Theme Hook - Manages theme state and palette selection
 * Supports dark/light mode and multiple color palettes
 * 
 * @returns {Object} Theme state and controls
 */
export function useTheme() {
  const [dark, setDark] = useState(false);
  const [palette, setPalette] = useState('theme-blue');
  const [mounted, setMounted] = useState(false);

  // Available palettes
  const palettes = [
    'theme-blue',
    'theme-slate',
    'theme-indigo',
    'theme-emerald',
    'theme-neon',
  ];

  // Initialize theme on mount
  useEffect(() => {
    setMounted(true);
    
    // Get saved preferences from localStorage
    const savedDark = localStorage.getItem('admin-dark-theme');
    const savedPalette = localStorage.getItem('admin-palette');

    // Check system preference for dark mode
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Set dark mode (saved preference or system preference)
    setDark(savedDark ? savedDark === 'true' : prefersDark);
    
    // Set palette (saved preference or default)
    if (savedPalette && palettes.includes(savedPalette)) {
      setPalette(savedPalette);
    }
  }, []);

  // Apply theme changes to DOM
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    const dashboard = document.querySelector('.admin-dashboard');

    // Toggle dark class
    if (dark) {
      root.classList.add('dark', 'dark-theme');
      if (dashboard) {
        dashboard.classList.add('dark', 'dark-theme');
      }
    } else {
      root.classList.remove('dark', 'dark-theme');
      if (dashboard) {
        dashboard.classList.remove('dark', 'dark-theme');
      }
    }

    // Remove all palette classes
    palettes.forEach((p) => {
      root.classList.remove(p);
      if (dashboard) {
        dashboard.classList.remove(p);
      }
    });

    // Add current palette class
    root.classList.add(palette);
    if (dashboard) {
      dashboard.classList.add(palette);
    }

    // Save to localStorage
    localStorage.setItem('admin-dark-theme', String(dark));
    localStorage.setItem('admin-palette', palette);
  }, [dark, palette, mounted]);

  // Toggle dark mode
  const toggleDark = () => {
    setDark((prev) => !prev);
  };

  // Set specific palette
  const setPaletteSafe = (newPalette) => {
    if (palettes.includes(newPalette)) {
      setPalette(newPalette);
    }
  };

  return {
    dark,
    setDark,
    toggleDark,
    palette,
    setPalette: setPaletteSafe,
    palettes,
    mounted,
  };
}

