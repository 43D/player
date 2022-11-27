const cacheName = "1.1";

function cache() {
    const resources = [
        "/player/",
        "/player/index.html",
        "/player/public/css/css.css",
        "https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css",
        "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.9.1/font/bootstrap-icons.css",
        "https://code.jquery.com/jquery-3.6.1.js",
        "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js",
        "/player/public/script/jquery-ui.min.js",
        "/player/public/script/jquery.ui.touch-punch.js",
        "/player/public/script/app.js",
        "/player/public/img/box-arrow-down.png",
        "/player/public/img/cover.jpg",
        "/player/public/img/icons-192.png",
        "/player/public/img/icons-512.png",
        "/player/public/script/defaultConfigs.js",
        "/player/public/script/fileReader.js",
        "/player/public/script/jsonManipulator.js",
        "/player/public/script/localStorageObject.js",
        "/player/public/script/theme.js",
        "/player/public/script/webService.js",
        "/player/public/script/display.js",
        "/player/public/script/events.js",
        "/player/public/script/mediaManager.js",
        "/player/public/script/musicManager.js",
        "/player/public/script/player.js",
        "/player/public/script/playlistManager.js",
        "/player/public/script/search.js",
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