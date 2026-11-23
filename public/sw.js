const CACHE = 'portfolio-images-v1';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)));
      await self.clients.claim();
    })()
  );
});

function isStorageImage(url) {
  if (url.hostname !== 'firebasestorage.googleapis.com') return false;
  return /\.(avif|gif|jpe?g|png|webp)$/i.test(decodeURIComponent(url.pathname));
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(request);
  const refresh = fetch(request)
    .then((response) => {
      if (response && (response.ok || response.type === 'opaque')) {
        cache.put(request, response.clone()).catch(() => undefined);
      }
      return response;
    })
    .catch(() => cached);

  if (cached) return cached;
  const response = await refresh;
  return response || new Response('', { status: 504, statusText: 'Image unavailable' });
}

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  let url;
  try {
    url = new URL(event.request.url);
  } catch (error) {
    return;
  }
  if (!isStorageImage(url)) return;
  event.respondWith(staleWhileRevalidate(event.request));
});
