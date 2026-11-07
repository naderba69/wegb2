// WegB2 Service Worker — vollständige Offline-Hülle für die Online-Ausgabe.
// Nutzerfortschritt bleibt in localStorage; hier liegen ausschließlich öffentliche App-Assets.
const CACHE = "wegb2-v5";
const FULL_AUDIO_PREFIX = "wegb2-audio-voll";
const AUDIO_MAX = 200;
const ROUTES = [
  "/",
  "/lernen",
  "/ueben",
  "/fortschritt",
  "/pruefen",
  "/einstellungen",
  "/masar",
  "/drucken",
  "/datenschutz",
  "/qualitaet",
];
const BANKEN = ["/banks.json", "/banks-vertiefung.json", "/banks-lang.json"];
const SHELL = [
  ...ROUTES,
  ...BANKEN,
  "/manifest.webmanifest",
  "/audio-manifest.json",
  "/icons/icon-180.png",
  "/icons/icon-512.png",
  "/icons/icon-512-maskable.png",
];

async function trimmeCache(cache) {
  try {
    const keys = await cache.keys();
    const audio = keys.filter((request) => new URL(request.url).pathname.startsWith("/audio/"));
    for (let i = 0; i < audio.length - AUDIO_MAX; i++) await cache.delete(audio[i]);
  } catch {
    // Best effort: ein Speicherfehler darf die Wiedergabe nicht blockieren.
  }
}

/**
 * Cache.add("/lernen") speichert nur HTML, nicht dessen routenspezifische Next-Chunks.
 * Darum lesen wir beim Installieren alle Routen und legen ihre lokalen JS/CSS/Fonts mit ab.
 */
async function speichereRouteMitAssets(cache, route) {
  const response = await fetch(route, { cache: "no-store" });
  if (!response.ok) throw new Error(`${route}: HTTP ${response.status}`);
  await cache.put(route, response.clone());
  const html = await response.text();
  const assets = new Set();
  for (const match of html.matchAll(/(?:src|href)=["']([^"']+)["']/g)) {
    try {
      const url = new URL(match[1], self.location.origin);
      if (url.origin !== self.location.origin) continue;
      if (url.pathname.startsWith("/_next/static/") || /\.(?:css|js|woff2?|png|svg|ico)$/i.test(url.pathname)) {
        assets.add(url.pathname + url.search);
      }
    } catch {
      // Ungültige optionale URL ignorieren.
    }
  }
  const assetErgebnisse = await Promise.allSettled([...assets].map(async (asset) => {
    if (await cache.match(asset)) return;
    const res = await fetch(asset);
    if (!res.ok) throw new Error(`${asset}: HTTP ${res.status}`);
    await cache.put(asset, res);
  }));
  if (assetErgebnisse.some((ergebnis) => ergebnis.status === "rejected")) {
    throw new Error(`${route}: mindestens ein Route-Asset fehlt`);
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // Sequenziell: alle Routen teilen große Next-Chunks. Parallele cache.put-Aufrufe
    // derselben URL können CacheStorage minutenlang blockieren; nach Route 1 sind
    // gemeinsame Assets bereits da und die folgenden Routen schreiben nur Neues.
    for (const route of ROUTES) await speichereRouteMitAssets(cache, route);
    for (const url of SHELL) {
      if (ROUTES.includes(url) || await cache.match(url)) continue;
      await cache.add(url);
    }
    // Jeder Fehler verwirft die Installation automatisch. So wird nie ein
    // teilweise gefüllter Offline-Shell als installierter Worker gemeldet.
  })());
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter((key) => key.startsWith("wegb2-") && key !== CACHE && !key.startsWith(FULL_AUDIO_PREFIX))
      .map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Dokumente: online aktuell, offline exakt die vorinstallierte/zuletzt besuchte Route.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy)).catch(() => undefined);
          }
          return response;
        })
        .catch(async () => (await caches.match(request)) || (await caches.match(url.pathname)) || caches.match("/")),
    );
    return;
  }

  // Alle drei Inhaltsbanken: stale-while-revalidate, nicht nur der Core-Bank.
  if (BANKEN.includes(url.pathname)) {
    event.respondWith((async () => {
      const cached = await caches.match(request);
      const network = fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy)).catch(() => undefined);
          }
          return response;
        })
        .catch(() => cached);
      return cached || network;
    })());
    return;
  }

  // Lokale statische Assets und Audio: cache-first. caches.match durchsucht auch den
  // ausdrücklich vom Nutzer gefüllten, bei Updates erhaltenen Voll-Audio-Cache.
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/audio/") ||
    url.pathname.startsWith("/cards/") ||
    /\.(?:css|js|png|jpg|jpeg|svg|gif|webp|ico|mp3|ogg|wav|woff2?)$/i.test(url.pathname)
  ) {
    event.respondWith((async () => {
      const cached = await caches.match(request);
      if (cached) return cached;
      try {
        const response = await fetch(request);
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then(async (cache) => {
            await cache.put(request, copy);
            if (url.pathname.startsWith("/audio/")) await trimmeCache(cache);
          }).catch(() => undefined);
        }
        return response;
      } catch {
        return cached || Response.error();
      }
    })());
  }
});
