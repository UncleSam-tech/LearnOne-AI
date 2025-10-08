const CACHE_VERSION = 'v3';
const APP_SHELL = [
  '/',
  '/manifest.webmanifest',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE_VERSION ? caches.delete(k) : undefined)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.credentials !== 'omit') return; // hygiene: don't cache credentialed requests
  if (url.pathname.startsWith('/api/proxy')) return; // network-only for proxy calls
  // cache-first for static/data seeds; network for others
  event.respondWith(
    caches.match(request).then((cached) =>
      cached || fetch(request).then((res) => res)
    )
  );
});


