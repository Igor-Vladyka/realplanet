var CACHE_NAME = 'real.planet.v0.1.6';
var toCache = [
  'images/unesco.png',
  'images/flags32.png',
  'images/markers/marker-icon-green.png',
  'images/markers/marker-icon-red.png',
  'images/markers/marker-icon-orange.png',
  'css/libs.min.css',
  'js/app.min.js',
  'js/libs.min.js',
  'fonts/icomoon.ttf'
];

self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then(function(cache) {
            return cache.addAll(toCache);
        })
        .then(function() { // Force the SW to transition from installing -> active state
            return self.skipWaiting();
        })
    );
});

self.addEventListener('activate', function(event) {

    // Delete all cache on new activation;
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            var oldCacheNames = cacheNames.filter(function(f) { return f !== CACHE_NAME; });
            return Promise.all(
                oldCacheNames.map(function(cacheName) {
                    return caches.delete(cacheName);
                })
            );
        }).then(function() {
            return self.clients.claim();
        })
    );
});

self.addEventListener('fetch', function(event) {
    if(event.request.url.indexOf("tile.openstreetmap.org") === -1 && event.request.url.indexOf("arcgisonline") === -1 && event.request.url.indexOf("localhost") === -1){
          event.respondWith(
            caches.match(event.request)
              .then(function(response) {
                // Cache hit - return response
                if (response) {
                  return response;
                }

                // IMPORTANT: Clone the request. A request is a stream and
                // can only be consumed once. Since we are consuming this
                // once by cache and once by the browser for fetch, we need
                // to clone the response.
                var fetchRequest = event.request.clone();

                return fetch(fetchRequest).then(
                  function(response) {
                    // Check if we received a valid response
                    if(!response || response.status !== 200 || response.type !== 'basic') {
                      return response;
                    }

                    // IMPORTANT: Clone the response. A response is a stream
                    // and because we want the browser to consume the response
                    // as well as the cache consuming the response, we need
                    // to clone it so we have two streams.
                    var responseToCache = response.clone();

                    caches.open(CACHE_NAME)
                      .then(function(cache) {
                        cache.put(event.request, responseToCache);
                      });

                    return response;
                  }
                );
            })
        );
    } else {
        event.respondWith(fetch(event.request));
    }
});
