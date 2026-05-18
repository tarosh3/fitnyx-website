// Self-destructing service worker. Replaces any legacy sw.js the old Next.js
// site registered: when a returning browser fetches /sw.js (because it was
// previously registered), it now receives THIS script — which unregisters
// itself and wipes all caches. After this runs once, the browser is clean.

self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys()
    await Promise.all(keys.map((k) => caches.delete(k)))
    const regs = await self.registration ? [self.registration] : []
    await Promise.all(regs.map((r) => r.unregister()))
    const clients = await self.clients.matchAll({ type: 'window' })
    clients.forEach((c) => { try { c.navigate(c.url) } catch (e) {} })
  })())
})

self.addEventListener('fetch', (event) => {
  // Pass through — don't serve from any cache.
  event.respondWith(fetch(event.request))
})
