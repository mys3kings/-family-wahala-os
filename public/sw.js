/* Minimal service worker: keeps navigation online-first without caching personal data. */
const CACHE_NAME = "family-wahala-shell-v1";
self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});
self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key.startsWith("family-wahala-") && key !== CACHE_NAME).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin || event.request.mode !== "navigate") return;
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request).then((cached) => cached || Response.error())));
});
