/* Crystal Drops — service worker
   Caches the app shell so the order page works on flaky WiFi. */
const CACHE = 'cd-shell-v1';
const ASSETS = [
  'index.html', 'admin.html', 'order.html',
  'themes.html', 'backgrounds.html',
  'bottombar.js', 'db.js', 'firebase-config.js',
  'manifest.webmanifest'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS).catch(()=>{})));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // Network-first for HTML and Firestore
  if (e.request.mode === 'navigate' || url.pathname.endsWith('.html') || url.host.includes('firestore')) {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request).then(r => r || caches.match('order.html'))));
    return;
  }
  // Cache-first for static assets
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(resp => {
    if (resp.ok && url.origin === location.origin) {
      const copy = resp.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
    }
    return resp;
  }).catch(()=>caches.match('order.html'))));
});
