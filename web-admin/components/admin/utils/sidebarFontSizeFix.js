export const syncSidebarFontSize = () => {
  const adminDashboard = document.querySelector('.admin-dashboard');
  const adminSidebar = document.querySelector('.admin-sidebar');
  const root = document.documentElement;

  if (!adminDashboard) {
    return;
  }

  // Get the base font size from admin-dashboard
  const baseFontSize =
    getComputedStyle(adminDashboard).getPropertyValue('--admin-base-font-size').trim() ||
    getComputedStyle(root).getPropertyValue('--admin-base-font-size').trim() ||
    '16px';

  // Set CSS variables on :root and .admin-sidebar
  root.style.setProperty('--admin-base-font-size', baseFontSize);
  if (adminSidebar) {
    adminSidebar.style.setProperty('--admin-base-font-size', baseFontSize);
  }

  // Calculate and set all derived font sizes on :root and .admin-sidebar
  const baseSize = parseFloat(baseFontSize);
  if (!isNaN(baseSize)) {
    const derivedSizes = {
      '--admin-font-size-h1': `${baseSize * 1.75}px`,
      '--admin-font-size-h2': `${baseSize * 1.375}px`,
      '--admin-font-size-h3': `${baseSize * 1.125}px`,
      '--admin-font-size-h4': `${baseSize}px`,
      '--admin-font-size-body-lg': `${baseSize * 0.9375}px`,
      '--admin-font-size-body': `${baseSize * 0.875}px`,
      '--admin-font-size-body-sm': `${baseSize * 0.8125}px`,
      '--admin-font-size-body-xs': `${baseSize * 0.75}px`,
      '--admin-font-size-body-xxs': `${baseSize * 0.6875}px`,
      '--admin-font-size-caption': `${baseSize * 0.625}px`,
    };

    Object.entries(derivedSizes).forEach(([key, value]) => {
      root.style.setProperty(key, value);
      if (adminSidebar) {
        adminSidebar.style.setProperty(key, value);
      }
    });
  }
};

// Auto-sync on font size changes
if (typeof window !== 'undefined') {
  window.addEventListener('adminFontSizeChanged', syncSidebarFontSize);

  // Wait for React hydration to complete before syncing
  // Use requestAnimationFrame to ensure DOM is ready after hydration
  const syncAfterHydration = () => {
    requestAnimationFrame(() => {
      syncSidebarFontSize();
      // Also sync after a short delay to catch any late updates
      setTimeout(syncSidebarFontSize, 100);
    });
  };

  // Sync on load, but wait for hydration
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', syncAfterHydration);
  } else {
    // Use a small delay to ensure React has hydrated
    setTimeout(syncAfterHydration, 0);
  }

  // Sync periodically to catch any missed updates (but only after initial hydration)
  setTimeout(() => {
    setInterval(syncSidebarFontSize, 1000);
  }, 2000);
}
