const scope = self.registration.scope;
const cachePrefix = `${scope}stricto-app-`;
const cacheName = `${cachePrefix}4`;
const appFiles = new Set([
  'index.html', 'styles.css', 'catalog.js', 'vision.js', 'app.js', 'stricto.webmanifest',
  'assets/bowl-stricto.jpg', 'assets/stricto-marca.png', 'assets/stricto-logo.png', 'assets/stricto-logo-inverso.png',
  'assets/stricto-app-192.png', 'assets/stricto-app-512.png',
  'assets/stricto-escaner-editorial.jpg',
  'diet-plan.js', 'diet-ui.js', 'assets/dieta-arepa.jpg', 'assets/dieta-avena.jpg',
  'assets/dieta-tofu.jpg', 'assets/dieta-manzana.jpg',
].map(file => new URL(file, scope).href));
const startPage = new URL('index.html', scope).href;

self.addEventListener('install', event => {
  event.waitUntil(caches.open(cacheName).then(cache => cache.addAll(appFiles)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter(name => name.startsWith(cachePrefix) && name !== cacheName).map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});

async function respond(request, cacheKey) {
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request);
    if (!response.ok) return (await cache.match(cacheKey)) ?? response;
    await cache.put(cacheKey, response.clone()).catch(() => {});
    return response;
  } catch {
    return (await cache.match(cacheKey)) ?? Response.error();
  }
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  url.search = '';
  url.hash = '';
  const href = url.href;
  if (request.mode === 'navigate' && (href === scope || href === startPage)) {
    event.respondWith(respond(request, startPage));
  } else if (appFiles.has(href)) {
    event.respondWith(respond(request, href));
  }
});
