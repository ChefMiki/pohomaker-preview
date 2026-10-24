/*
 * PoHoMaker's service worker (plan 2026-10-20, phase 4.3: works offline, installable). Hand-written, no dependencies.
 * - Pages: from the network first, so they are always current online; without a connection, the copy kept from the last
 *   visit (any query string, so /edit?open=1 and /editor/_/?id=… find their page), else the app's home.
 * - The site's own code, fonts and pictures: kept as they are first loaded; Next's hashed files never change, so they
 *   come from the cache, everything else is refreshed in the background.
 * - When it installs it fetches the app's home, the editor, My projects and the designer's page and keeps the code they
 *   name, so those open offline even before a first visit. Nothing from another origin (accounts, analytics) is kept:
 *   signing in and saving to the account still need a connection.
 * - Video and audio, and any request for part of a file (Range), go straight to the network: a cache can't answer them,
 *   and storing a 206 answer fails (v1 did, and every video on the GitHub preview stopped playing, 2026-10-21).
 */
const VERSION = "v2";
const PAGES = `pohomaker-pages-${VERSION}`;
const ASSETS = `pohomaker-assets-${VERSION}`;
const MAX_ASSETS = 800;
const BASE = new URL(self.registration.scope).pathname.replace(/\/$/, "");
const CORE = ["/app", "/edit", "/projects", "/editor/_/"].map((p) => BASE + p);

const pageKey = (url) => {
  const u = new URL(url);
  return u.origin + u.pathname.replace(/\/$/, "");
};

async function trim() {
  const cache = await caches.open(ASSETS);
  const keys = await cache.keys();
  for (const k of keys.slice(0, Math.max(0, keys.length - MAX_ASSETS))) await cache.delete(k);
}

async function warm() {
  const pages = await caches.open(PAGES);
  const assets = await caches.open(ASSETS);
  const found = new Set();
  for (const path of CORE) {
    try {
      const res = await fetch(path, { credentials: "same-origin" });
      if (!res.ok) continue;
      const html = await res.clone().text();
      await pages.put(pageKey(new URL(path, self.location.origin).href), res);
      for (const m of html.matchAll(/["'(]((?:[^"'()\s]*?)\/_next\/static\/[^"'()\s]+)/g)) found.add(new URL(m[1], self.location.origin).href);
    } catch {
      // Offline while installing, or a page this host doesn't have (the designer's shell exists only in the static build).
    }
  }
  await Promise.all([...found].map((u) => assets.add(u).catch(() => {})));
}

self.addEventListener("install", (event) => {
  event.waitUntil(warm().then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith("pohomaker-") && k !== PAGES && k !== ASSETS).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

async function page(request) {
  const cache = await caches.open(PAGES);
  try {
    const res = await fetch(request);
    if (res.ok) await cache.put(pageKey(request.url), res.clone());
    return res;
  } catch {
    const path = new URL(request.url).pathname;
    const kept =
      (await cache.match(pageKey(request.url))) ||
      (path.startsWith(`${BASE}/editor/`) ? await cache.match(pageKey(new URL(`${BASE}/editor/_/`, self.location.origin).href)) : undefined) ||
      (await cache.match(pageKey(new URL(`${BASE}/app`, self.location.origin).href)));
    return (
      kept ||
      new Response("<!doctype html><meta charset=utf-8><title>Offline</title><p style=\"font:16px system-ui;padding:2rem\">You're offline, and this page wasn't kept on this device yet. Connect once and open it, and it will work offline after that.</p>", {
        status: 503,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      })
    );
  }
}

async function asset(request, immutable) {
  const cache = await caches.open(ASSETS);
  const kept = await cache.match(request);
  // A hashed file never changes: no request at all.
  if (kept && immutable) return kept;
  const fresh = fetch(request)
    .then(async (res) => {
      // Only complete answers: a 206 (part of a file) can't be stored, and an error page must not stand in for the file.
      if (res.status === 200 && res.type === "basic") {
        await cache.put(request, res.clone());
        void trim();
      }
      return res;
    })
    .catch(() => undefined);
  // Anything else answers from the cache and is refreshed in the background.
  if (kept) return kept;
  return (await fresh) || Response.error();
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || url.pathname === `${BASE}/sw.js`) return;
  if (request.headers.has("range") || request.destination === "video" || request.destination === "audio") return;
  if (request.mode === "navigate") {
    event.respondWith(page(request));
    return;
  }
  event.respondWith(asset(request, url.pathname.startsWith(`${BASE}/_next/static/`)));
});
