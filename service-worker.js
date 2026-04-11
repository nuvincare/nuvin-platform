const CACHE = 'nuvin-v9';
const ASSETS = [
  '/', '/index.html', '/nuvin-gateway.html',
  '/admin-login.html', '/admin.html',
  '/nuvin2-home.html', '/nuvin2-search.html',
  '/nuvin2-hospital.html', '/nuvin2-admin.html',
  '/nuvin2-crm.html', '/nuvin2-monitor.html',
  '/nuvin2-landing.html', '/hospital-manual.html',
  '/guidebook.html', '/privacy.html',
  '/migration-guide.html', '/nuvin-service.html',
  '/caregiver-service.html', '/hospital-service.html',
  '/launch.html', '/manifest.json',
  '/images/hero-doctor-patient.jpg',
  '/images/care-doctor-patient.jpg'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  // Network-first: 항상 네트워크 우선, 실패시 캐시 fallback
  e.respondWith(
    fetch(e.request).then(res => {
      if (res.ok && e.request.url.startsWith(self.location.origin)) {
        const resClone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, resClone));
      }
      return res;
    }).catch(() =>
      caches.match(e.request).then(cached => cached || caches.match('/index.html'))
    )
  );
});
