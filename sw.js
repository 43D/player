console.log("Hello, this message is sent by a service worker");

const cacheName = "1.0";

function cache() {
    const resources = [
        "/",
        "index.html",
        "",
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