// WegB2 Service Worker (U3/R189) — التطبيق كامل بلا شبكة بعد أول تحميل.
// الاستراتيجية (نفس الأصل حصرًا — أي طلب خارجي يمرّ بلا اعتراض):
//  • التنقّلات: الشبكة أولًا، وعند غيابها النسخة المخزّنة (حتى تعمل الصفحات المُزارة دون اتصال).
//  • /banks.json (بنوك المحتوى): stale-while-revalidate — تُعرَض المخزّنة فورًا وتُحدَّث في الخلفية،
//    فلا يتعطّل المحتوى بلا شبكة ولا يتيبّس بعد تحديث خادم.
//  • الأصول الثابتة والصوتيات والصور: cache-first، فكلّ صوت يُسمَع مرة يُحفَظ ليعمل بعدها بلا شبكة (الصوتيات المستعملة).
// لا تُخزَّن بيانات مستخدم هنا: التقدّم في localStorage كما كان دائمًا، وهذا مخزن أصول فقط قابل للمسح من الإعدادات.
const CACHE = "wegb2-v2";
const SHELL = [
  "/",
  "/ueben",
  "/fortschritt",
  "/pruefen",
  "/einstellungen",
  "/manifest.webmanifest",
  "/banks.json",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then(async (c) => {
      // best-effort: فشل صفحة واحدة لا يقتل التثبيت كله
      await Promise.allSettled(SHELL.map((u) => c.add(u)));
    })
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

  // banks.json: stale-while-revalidate
  if (url.pathname === "/banks.json") {
    event.respondWith(
      caches.match(req).then((cached) => {
        const netz = fetch(req)
          .then((res) => {
            if (res.ok) {
              const copy = res.clone();
              caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => undefined);
            }
            return res;
          })
          .catch(() => cached);
        return cached || netz;
      })
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
