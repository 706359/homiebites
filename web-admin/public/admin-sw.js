// Service Worker for Admin Dashboard Only
//
// Best approach for admin: no caching. All requests go to the network.
// - No stale HTML/JS/CSS → no "design lost on refresh" or hard-refresh fixes
// - Matches every deploy; simplest to maintain

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name.startsWith('homiebites-admin-'))
          .map((name) => caches.delete(name))
      )
    )
  );
  self.clients.claim();
});
