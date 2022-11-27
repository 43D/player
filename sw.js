console.log("Hello, this message is sent by a service worker");

const cacheName = "1.0";

function cache() {
    const resources = [
        "/player/",
        "/player/index.html",
        "/player/public/css/css.css",
        "https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css",
    ];

    self.addEventListener('install', (event) => {
        event.waitUntil(
            caches.open(cacheName)
                .then(cache => (cache.addAll(resources))),
        );
    });

    self.addEventListener('fetch', (event) => {
        event.respondWith(
            caches.match(event.request)
                .then(cacheResponse => (cacheResponse || fetch(event.request))),
        )
    });
}

cache();