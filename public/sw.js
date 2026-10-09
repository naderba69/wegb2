// Minimal service worker for WegB2 — app-shell cache so the app boots offline after first load.
// No runtime caching of data: everything is localStorage-driven; we only cache static
// JS/CSS/fonts and document shell so the PWA can be opened without network.
const CACHE = "wegb2-v1";
const SHELL = [
  "/",
  "/manifest.webmanifest",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(SHELL)).catch(() => undefined)
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Network-first for HTML/documents so updates come through immediately.
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => undefined);
          return res;
        })
        .catch(() => caches.match(req).then((r) => r || caches.match("/")))
    );
    return;
  }

  // Cache-first for static assets (JS/CSS/fonts/images/audio/mp3).
  if (
    url.pathname.startsWith("/_next/static") ||
    url.pathname.startsWith("/audio/") ||
    url.pathname.startsWith("/cards/") ||
    /\.(?:png|jpg|jpeg|svg|gif|webp|ico|mp3|ogg|wav|woff2?)$/i.test(url.pathname)
  ) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => undefined);
          }
          return res;
        }).catch(() => cached);
      })
    );
  }
});
