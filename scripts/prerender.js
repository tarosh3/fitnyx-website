#!/usr/bin/env node
// Prerenders SPA routes to static HTML so crawlers (Bing, social, AI bots) see real markup.
// Runs after `vite build` and `generate-sitemap.js`.
// - Spins up a local sirv server on dist/
// - Visits each route with puppeteer, waits for content, captures full HTML
// - Writes dist/<route>/index.html (resolves on Vercel/static hosts)
//
// Configure routes via STATIC_ROUTES + by reading slugs from src/data/blogPosts.js + Supabase if configured.
// Set PRERENDER=false to skip (e.g. in fast dev builds).

import { writeFileSync, mkdirSync, readFileSync, existsSync, rmSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { createServer } from 'node:http'
import sirv from 'sirv'

// Pick the right puppeteer + chromium combo for the host:
// - Vercel / Lambda: puppeteer-core + @sparticuz/chromium (Linux x64 binary with bundled libs)
// - Local dev: full puppeteer (ships its own chromium with native libs)
const IS_SERVERLESS = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.AWS_REGION)
async function launchBrowser() {
  if (IS_SERVERLESS) {
    const [{ default: chromium }, { default: pc }] = await Promise.all([
      import('@sparticuz/chromium'),
      import('puppeteer-core'),
    ])
    return pc.launch({
      args: [...chromium.args, '--disable-dev-shm-usage'],
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    })
  }
  const { default: pup } = await import('puppeteer')
  return pup.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  })
}

if (process.env.PRERENDER === 'false') {
  console.log('[prerender] PRERENDER=false, skipping')
  process.exit(0)
}

const __dirname = dirname(fileURLToPath(import.meta.url))
const distDir = resolve(__dirname, '..', 'dist')
const PORT = 4173 + Math.floor(Math.random() * 100)
const BASE = `http://127.0.0.1:${PORT}`

const STATIC_ROUTES = [
  '/',
  '/blog',
  '/privacy-policy',
  '/terms-of-service',
  '/delete-account',
]

async function loadBlogSlugs() {
  const slugs = new Set()
  const url = process.env.VITE_SUPABASE_URL
  const key = process.env.VITE_SUPABASE_ANON_KEY
  if (url && key) {
    try {
      const res = await fetch(`${url}/rest/v1/posts?select=slug&published=eq.true`, {
        headers: { apikey: key, Authorization: `Bearer ${key}` },
      })
      if (res.ok) {
        const rows = await res.json()
        rows.forEach((r) => slugs.add(r.slug))
      }
    } catch (e) {
      console.warn('[prerender] supabase slug fetch failed:', e.message)
    }
  }
  try {
    const mod = await import(pathToFileURL(resolve(__dirname, '..', 'src', 'data', 'blogPosts.js')).href)
    mod.blogPosts.forEach((p) => slugs.add(p.slug))
  } catch (e) {
    console.warn('[prerender] fallback slugs failed:', e.message)
  }
  return Array.from(slugs)
}

function startServer(templateHtml) {
  // Serve dist/ assets normally, but for ANY route path (HTML request) always
  // serve the pristine bootstrap template — never a prerendered HTML file. This
  // prevents React from re-hydrating already-rendered DOM on subsequent navigations.
  const serve = sirv(distDir, { single: false, dev: false, etag: true })
  const server = createServer((req, res) => {
    const url = req.url || '/'
    const path = url.split('?')[0]
    const accept = req.headers.accept || ''
    const looksLikeHtml = accept.includes('text/html') || path === '/' || !/\.[a-z0-9]{1,8}$/i.test(path)
    if (looksLikeHtml) {
      res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' })
      res.end(templateHtml)
      return
    }
    serve(req, res, () => {
      res.statusCode = 404
      res.end('not found')
    })
  })
  return new Promise((resolveServer) => {
    server.listen(PORT, '127.0.0.1', () => resolveServer(server))
  })
}

async function prerenderRoute(browser, route) {
  const page = await browser.newPage()
  await page.setUserAgent('Mozilla/5.0 (compatible; FitNyxPrerender/1.0)')
  await page.setViewport({ width: 1280, height: 900 })
  await page.evaluateOnNewDocument(() => { window.__PRERENDER__ = true })

  page.on('pageerror', (err) => console.warn(`[prerender][${route}] pageerror:`, err.message))

  // Block heavy assets we don't need for HTML capture (videos, GLB, fonts, images).
  await page.setRequestInterception(true)
  page.on('request', (req) => {
    const type = req.resourceType()
    const url = req.url()
    if (
      type === 'media' ||
      type === 'font' ||
      type === 'image' ||
      url.endsWith('.glb') ||
      url.endsWith('.mp4') ||
      url.endsWith('.webm') ||
      url.includes('fonts.gstatic.com')
    ) {
      req.abort()
    } else {
      req.continue()
    }
  })

  // Route-specific readiness signal: pick a selector that only renders after
  // the route's async data (and therefore its <Helmet>) has flushed.
  let readySelector = 'footer'
  if (route === '/') readySelector = '.hero-h1'
  else if (route === '/blog') readySelector = '.blog-list, .blog-page-title'
  else if (route.startsWith('/blog/')) readySelector = '.blog-post-title'
  else if (route === '/privacy-policy' || route === '/terms-of-service' || route === '/delete-account') readySelector = '.policy-title'

  const target = `${BASE}${route}`
  try {
    await page.goto(target, { waitUntil: 'domcontentloaded', timeout: 25000 })
    await page.waitForFunction(
      () => {
        const root = document.querySelector('#root')
        return root && root.children.length > 0 && root.innerText.trim().length > 50
      },
      { timeout: 20000 }
    )
    await page.waitForSelector(readySelector, { timeout: 15000 })
    await page.waitForSelector('footer', { timeout: 8000 })
    // Wait until <title> matches the route (Helmet has flushed) or timeout.
    await page.waitForFunction(
      (r) => {
        const t = document.title || ''
        if (r === '/') return /fitnyx/i.test(t) && /(coach|planner|fitness)/i.test(t)
        if (r === '/blog') return /insight|blog/i.test(t)
        if (r.startsWith('/blog/')) return /insights/i.test(t) && t.length > 30 && !/coach,\s*workout/i.test(t)
        if (r === '/privacy-policy') return /privacy/i.test(t)
        if (r === '/terms-of-service') return /terms/i.test(t)
        if (r === '/delete-account') return /delete/i.test(t)
        return true
      },
      { timeout: 8000 },
      route,
    ).catch(() => {})
    // Final settle for any async meta tag injections.
    await new Promise((r) => setTimeout(r, 800))
  } catch (e) {
    console.warn(`[prerender] ${route} → soft fail: ${e.message}`)
  }

  // Pull the route-specific title from the live DOM — survives Helmet/document.title quirks.
  const liveTitle = await page.evaluate(() => document.title)

  let html = await page.content()
  await page.close()

  // Strip dev-only inline scripts / leftover hash mismatches. Keep <head>+<body>.
  html = html.replace(/<script[^>]+vite[^>]*><\/script>/g, '')

  // De-duplicate inside <head> — keep the LAST occurrence (Helmet-injected, route-specific).
  html = html.replace(/<head>([\s\S]*?)<\/head>/i, (m, head) => {
    // <title>: strip all existing, write a single correct one taken from document.title.
    const safeTitle = liveTitle.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    head = head.replace(/<title[^>]*>[\s\S]*?<\/title>/gi, '')
    head = `<title>${safeTitle}</title>` + head
    // <meta name=…> / <meta property=…> — keep LAST per key.
    const metaRe = /<meta\b[^>]*\/?>/gi
    const metaSeen = new Map()
    ;(head.match(metaRe) || []).forEach((tag, i) => {
      const k = tag.match(/\s(?:name|property)=["']([^"']+)["']/i)
      if (k) metaSeen.set(k[1].toLowerCase(), i)
    })
    let mi = 0
    head = head.replace(metaRe, (tag) => {
      const cur = mi++
      const k = tag.match(/\s(?:name|property)=["']([^"']+)["']/i)
      if (!k) return tag
      return metaSeen.get(k[1].toLowerCase()) === cur ? tag : ''
    })
    // <link rel=canonical|alternate|…> — keep LAST per rel-value combo.
    const linkRe = /<link\b[^>]*\/?>/gi
    const linkSeen = new Map()
    ;(head.match(linkRe) || []).forEach((tag, i) => {
      const rel = tag.match(/\srel=["']([^"']+)["']/i)
      if (!rel) return
      const dedupeRels = ['canonical', 'alternate', 'manifest', 'author', 'me']
      if (!dedupeRels.includes(rel[1].toLowerCase())) return
      // For alternate, also key by hreflang so different langs survive.
      const hreflang = tag.match(/\shreflang=["']([^"']+)["']/i)
      const key = rel[1].toLowerCase() + (hreflang ? `:${hreflang[1].toLowerCase()}` : '')
      linkSeen.set(key, i)
    })
    let li = 0
    head = head.replace(linkRe, (tag) => {
      const cur = li++
      const rel = tag.match(/\srel=["']([^"']+)["']/i)
      if (!rel) return tag
      const dedupeRels = ['canonical', 'alternate', 'manifest', 'author', 'me']
      if (!dedupeRels.includes(rel[1].toLowerCase())) return tag
      const hreflang = tag.match(/\shreflang=["']([^"']+)["']/i)
      const key = rel[1].toLowerCase() + (hreflang ? `:${hreflang[1].toLowerCase()}` : '')
      return linkSeen.get(key) === cur ? tag : ''
    })
    return `<head>${head}</head>`
  })

  return html
}

async function writeRouteHtml(route, html) {
  let outDir
  if (route === '/' || route === '') {
    outDir = distDir
  } else {
    outDir = join(distDir, route.replace(/^\//, ''))
    mkdirSync(outDir, { recursive: true })
  }
  const outFile = join(outDir, 'index.html')
  writeFileSync(outFile, html)
  console.log(`[prerender]  ✓ ${route} → ${outFile.replace(distDir, 'dist')}`)
}

async function main() {
  if (!existsSync(join(distDir, 'index.html'))) {
    console.error('[prerender] dist/index.html missing — run `vite build` first.')
    process.exit(1)
  }

  const slugs = await loadBlogSlugs()
  const routes = [
    ...STATIC_ROUTES,
    ...slugs.map((s) => `/blog/${s}`),
  ]
  console.log(`[prerender] ${routes.length} routes`)

  // Clean any stale per-route subdirs from a prior run so sirv falls back to
  // the SPA index.html during navigation instead of serving empty HTML.
  for (const route of routes) {
    if (route === '/') continue
    const dir = join(distDir, route.replace(/^\//, ''))
    if (existsSync(dir)) rmSync(dir, { recursive: true, force: true })
  }

  // Read pristine template ONCE before any prerender writes.
  const templateHtml = readFileSync(join(distDir, 'index.html'), 'utf8')

  const server = await startServer(templateHtml)
  const browser = await launchBrowser()

  const captured = []
  try {
    for (const route of routes) {
      const html = await prerenderRoute(browser, route)
      captured.push({ route, html })
    }
  } finally {
    await browser.close()
    server.close()
  }

  // Write all prerendered HTML AFTER capturing everything, so prior writes
  // never leak into subsequent navigations.
  for (const { route, html } of captured) {
    await writeRouteHtml(route, html)
  }

  console.log('[prerender] done')
}

main().catch((e) => {
  console.error('[prerender] failed:', e)
  process.exit(1)
})
