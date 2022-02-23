const FILES_TO_CACHE = [
    '/index.html',
    '/styles.css',
    '/db.js',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png'
]

//CACHE
const PRECACHE = 'precache-v1';
const RUNTIME = 'runtime';


self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(PRECACHE).then((cache) => 
        cache.addAll(FILES_TO_CACHE)
        )
        .then(self.skipWaiting())
    );
  });
  