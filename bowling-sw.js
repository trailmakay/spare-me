/* Human Lanes — service worker: cache the whole app so it runs fully offline */
const CACHE = 'spare-me-v11';
const ASSETS = [
  './bowling.html',
  './scenes.css',
  './manifest.webmanifest',
  './bowling-icon-192.png',
  './bowling-icon-512.png',
  './bowling-icon-180.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Page/HTML = network-first (always get the latest when online; fall back to cache offline).
// Everything else = cache-first (fast, offline), refreshed in the background.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const req = e.request;
  const isPage = req.mode === 'navigate' ||
                 (req.headers.get('accept') || '').includes('text/html');

  if (isPage) {
    e.respondWith(
      fetch(req).then(res => {
        // Only trust a real, OK response — a tunnel/Cloudflare error page (5xx) must NOT
        // replace the good cached app. On any bad status, fall back to cache.
        if (!res || !res.ok) throw new Error('bad status ' + (res && res.status));
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put('./bowling.html', copy)).catch(()=>{});
        return res;
      }).catch(() => caches.match('./bowling.html').then(hit => hit || caches.match(req)))
    );
    return;
  }

  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(req, copy)).catch(()=>{});
      return res;
    }))
  );
});
