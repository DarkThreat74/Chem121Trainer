/**
 * Chem 121 Trainer — Service Worker
 *
 * Caching strategy:
 * - Navigation (page) requests: network-first, fall back to cache (offline support)
 * - Static assets (JS/CSS/images/fonts): cache-first, fall back to network
 * - All successful GET responses are cached for offline use
 *
 * Offline review saves:
 * - POST to /api/review is NOT intercepted (handled client-side via IndexedDB queue)
 * - Background Sync is registered so the SW can trigger a flush when back online
 */

const CACHE_NAME = "chem121-v2";

// All 8 topic IDs — used to pre-cache practice and learn pages
const TOPIC_IDS = [
  "fundamentals",
  "metric-system",
  "atomic-structure",
  "significant-figures",
  "dimensional-analysis",
  "the-mole",
  "stoichiometry",
  "molarity-dilutions",
];

// Pre-cache these on install so the app works offline immediately after first visit
const PRE_CACHE = [
  "/",
  "/dashboard",
  "/review",
  "/icon.svg",
  "/manifest.json",
  ...TOPIC_IDS.map((t) => `/practice/${t}`),
  ...TOPIC_IDS.map((t) => `/learn/${t}`),
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRE_CACHE).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Background Sync: when connectivity is restored, notify all clients to flush
self.addEventListener("sync", (event) => {
  if (event.tag === "review-queue") {
    event.waitUntil(
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => client.postMessage({ type: "FLUSH_QUEUE" }));
      })
    );
  }
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only handle GET requests — POST (API) is handled client-side
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== location.origin) return;

  // Navigation requests (page loads): network-first, fall back to cache
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() =>
          caches.match(request).then((r) => r || caches.match("/dashboard").then((d) => d || caches.match("/")))
        )
    );
    return;
  }

  // Static assets (JS, CSS, images, fonts): cache-first, fall back to network
  if (
    request.destination === "script" ||
    request.destination === "style" ||
    request.destination === "image" ||
    request.destination === "font"
  ) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            return response;
          })
      )
    );
    return;
  }

  // Other same-origin GET requests: stale-while-revalidate
  event.respondWith(
    caches.match(request).then((cached) => {
      const fetchPromise = fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
