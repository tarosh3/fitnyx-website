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
import puppeteer from 'puppeteer'

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

  const target = `${BASE}${route}`
  try {
    await page.goto(target, { waitUntil: 'domcontentloaded', timeout: 25000 })
    // Wait until React renders something into #root (Suspense resolved).
    await page.waitForFunction(
      () => {
        const root = document.querySelector('#root')
        return root && root.children.length > 0 && root.innerText.trim().length > 50
      },
      { timeout: 20000 }
    )
    await page.waitForSelector('footer', { timeout: 12000 })
    // Settle for Helmet head sync + async post fetches.
    await new Promise((r) => setTimeout(r, 1200))
  } catch (e) {
    console.warn(`[prerender] ${route} → soft fail: ${e.message}`)
  }

  let html = await page.content()
  await page.close()

  // Strip dev-only inline scripts / leftover hash mismatches. Keep <head>+<body>.
  html = html.replace(/<script[^>]+vite[^>]*><\/script>/g, '')

  // De-duplicate <title> tags inside <head> — keep the LAST one (Helmet-injected, route-specific).
  html = html.replace(/<head>([\s\S]*?)<\/head>/i, (m, head) => {
    const titles = head.match(/<title[^>]*>[\s\S]*?<\/title>/gi) || []
    if (titles.length > 1) {
      const last = titles[titles.length - 1]
      const stripped = head.replace(/<title[^>]*>[\s\S]*?<\/title>/gi, '')
      head = stripped + last
    }
    // Collapse duplicate name=/property= meta tags — keep the LAST occurrence.
    const seen = new Map()
    const metaRe = /<meta\b[^>]*\/?>/gi
    const metas = head.match(metaRe) || []
    metas.forEach((tag, i) => {
      const keyMatch = tag.match(/\s(?:name|property)=["']([^"']+)["']/i)
      if (!keyMatch) return
      const key = keyMatch[1].toLowerCase()
      seen.set(key, { tag, i })
    })
    let idx = 0
    head = head.replace(metaRe, (tag) => {
      const keyMatch = tag.match(/\s(?:name|property)=["']([^"']+)["']/i)
      const cur = idx++
      if (!keyMatch) return tag
      const winner = seen.get(keyMatch[1].toLowerCase())
      return winner && winner.i === cur ? tag : ''
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
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  })

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
