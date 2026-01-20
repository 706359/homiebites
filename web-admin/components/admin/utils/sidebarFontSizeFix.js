import { parseFontSize, applyAdminFontSize } from './fontSize.js';

export const syncSidebarFontSize = () => {
  const key = localStorage.getItem('homiebites_font_size') || '16';
  const v = parseFontSize(key);
  applyAdminFontSize(v ?? 16);
};

if (typeof window !== 'undefined') {
  window.addEventListener('adminFontSizeChanged', (e) => {
    const v = parseFontSize(e.detail?.fontSize);
    if (v != null) applyAdminFontSize(v);
  });

  const run = () => {
    requestAnimationFrame(() => {
      syncSidebarFontSize();
      setTimeout(syncSidebarFontSize, 100);
    });
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    setTimeout(run, 0);
  }
}
