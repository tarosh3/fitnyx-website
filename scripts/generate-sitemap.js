#!/usr/bin/env node
// Generates dist/sitemap.xml + dist/robots.txt after `vite build`.
// Edit SITE_URL below when domain changes.

import { writeFileSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const SITE_URL = 'https://fitnyx.in'
const distDir = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'dist')

async function loadPosts() {
  const url = process.env.VITE_SUPABASE_URL
  const key = process.env.VITE_SUPABASE_ANON_KEY
  if (url && key) {
    try {
      const res = await fetch(`${url}/rest/v1/posts?select=slug,date&published=eq.true&order=date.desc`, {
        headers: { apikey: key, Authorization: `Bearer ${key}` },
      })
      if (res.ok) {
        const rows = await res.json()
        if (rows.length) return rows
      }
    } catch (e) {
      console.warn('[sitemap] supabase fetch failed, using static fallback:', e.message)
    }
  }
  const mod = await import(pathToFileURL(resolve(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', 'blogPosts.js')).href)
  return mod.blogPosts
}

const staticRoutes = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/blog', priority: '0.9', changefreq: 'weekly' },
  { path: '/privacy-policy', priority: '0.3', changefreq: 'yearly' },
  { path: '/terms-of-service', priority: '0.3', changefreq: 'yearly' },
  { path: '/delete-account', priority: '0.3', changefreq: 'yearly' },
]

function urlEntry({ loc, lastmod, changefreq, priority }) {
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
}

async function main() {
  const today = new Date().toISOString().slice(0, 10)
  const posts = await loadPosts()

  const urls = [
    ...staticRoutes.map((r) => urlEntry({ loc: `${SITE_URL}${r.path}`, lastmod: today, changefreq: r.changefreq, priority: r.priority })),
    ...posts.map((p) => urlEntry({ loc: `${SITE_URL}/blog/${p.slug}`, lastmod: p.date, changefreq: 'yearly', priority: '0.8' })),
  ].join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`

  const robots = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`

  mkdirSync(distDir, { recursive: true })
  writeFileSync(resolve(distDir, 'sitemap.xml'), xml)
  writeFileSync(resolve(distDir, 'robots.txt'), robots)
  console.log(`[sitemap] wrote ${posts.length + staticRoutes.length} urls`)
}

main().catch((e) => {
  console.error('[sitemap] failed:', e)
  process.exit(1)
})
