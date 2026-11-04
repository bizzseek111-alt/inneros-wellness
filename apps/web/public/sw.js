/**
 * InnerOS Progressive Web App Service Worker
 * Version: 1.0.0
 * 
 * Safety & Privacy Principles:
 * 1. STRICT NETWORK-ONLY for all /api/* routes (zero caching of child disclosures, safeguarding, auth, billing).
 * 2. Network-First with Cache fallback for navigational HTML pages.
 * 3. Stale-While-Revalidate for static assets, fonts, icons, and illustrations.
 * 4. Offline fallback page (/offline) providing safe, local mindfulness and visual routine tools.
 * 5. Safe lifecycle management with SKIP_WAITING message listener.
 */

const CACHE_VERSION = "weebly-pwa-v1.0.0";
const PRECACHE_ASSETS = [
  "/",
  "/offline",
  "/manifest.webmanifest",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/icons/icon-maskable-192x192.png",
  "/icons/apple-touch-icon.png",
  "/icons/icon.svg",
  "/favicon.ico",
];

// Install: Pre-cache core app shell & offline fallback
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      .then((cache) => {
        return cache.addAll(PRECACHE_ASSETS);
      })
      .catch((err) => {
        console.warn("[SW] Precache skipped for dynamic routes:", err);
      })
  );
});

// Activate: Prune stale caches from prior versions
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_VERSION) {
            console.log("[SW] Removing outdated cache:", key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event router
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. NON-GET REQUESTS: Network-Only (mutations, checkouts, turns)
  if (request.method !== "GET") {
    return;
  }

  // 2. SENSITIVE API & WEBSOCKET ROUTES: Strict Network-Only
  // Child voice/text conversations, authentication tokens, safeguarding alerts, and billing
  // MUST NEVER be cached in CacheStorage.
  if (
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/ws/") ||
    url.hostname !== self.location.hostname
  ) {
    return;
  }

  // 3. NAVIGATION REQUESTS (HTML Pages): Network-First with Offline Fallback
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // If valid response, clone into cache for offline viewing of visited pages
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_VERSION).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(async () => {
          // Network failed: attempt to match cached page
          const cachedResponse = await caches.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }
          // Fallback to designated safe offline page
          const offlinePage = await caches.match("/offline");
          if (offlinePage) {
            return offlinePage;
          }
          return new Response(
            `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Weebly Offline</title><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="font-family:sans-serif;padding:2rem;text-align:center;background:#F8FAFC;color:#0F172A"><h1>You are currently offline</h1><p>Reconnect to access live voice companions and sync your progress.</p><a href="/" style="display:inline-block;margin-top:1rem;padding:0.75rem 1.5rem;background:#0D9488;color:white;border-radius:1rem;text-decoration:none">Retry Connection</a></body></html>`,
            { headers: { "Content-Type": "text/html" } }
          );
        })
    );
    return;
  }

  // 4. STATIC ASSETS (_next/static, images, icons, fonts): Stale-While-Revalidate
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname.startsWith("/images/") ||
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".svg") ||
    url.pathname.endsWith(".woff2")
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const clone = networkResponse.clone();
              caches.open(CACHE_VERSION).then((cache) => cache.put(request, clone));
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // Default: Network with Cache Fallback
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});

// Update Management Message Listener
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
