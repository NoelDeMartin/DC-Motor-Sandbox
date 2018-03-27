var paths = [
    'index.html',
    'manifest.json',
    'icons/icon_32.png',
    'icons/icon_64.png',
    'icons/icon_256.png',
    'build/app.js',
    'build/app.css',
];

var version = '0.0.1';

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches
            .open('offline-' + version)
            .then(function(cache) {
                return cache.addAll(paths);
            })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        fetch(event.request).catch(function(e) {
            return caches.open('offline-' + version).then(function(cache) {
                return cache.match((new URL(event.request.url)).pathname.endsWith('/') ? 'index.html' : event.request);
            });
        })
    );
});
