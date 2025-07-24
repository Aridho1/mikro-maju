const CACHE_NAME = "MM-CACHE";

const ASSET_TO_CACHE = ["/", "index.html"];

// cache asset
self.addEventListener("install", (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSET_TO_CACHE);
        })
    );
});

// hadle request connection | jaringan
self.addEventListener("fetch", (e) => {
    e.reponWith(
        caches.match(e.request).then((res) => {
            if (res) return res;
            return fetch(e.request);
        })
    );
});

// delete prev cache
self.addEventListener("active", (e) => {
    e.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(cacheNames.filter((cacheName) => cacheName !== CACHE_NAME).map((cacheName) => caches.delete(cacheName)));
        })
    );
});
