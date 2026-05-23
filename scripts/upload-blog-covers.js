#!/usr/bin/env node
// Uploads local blog cover PNGs to Supabase storage bucket "blog-images"
// and patches each post's cover_url. File basename must match the post slug.
// Run from repo root: `node scripts/upload-blog-covers.js`

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { resolve, dirname, basename, extname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

function loadDashboardEnv() {
  const env = {}
  const raw = readFileSync(resolve(root, 'dashboard/.env'), 'utf8')
  for (const line of raw.split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (m) env[m[1]] = m[2]
  }
  return env
}

const env = loadDashboardEnv()
const SUPABASE_URL = env.VITE_SUPABASE_URL
const SERVICE_KEY = env.VITE_SUPABASE_SERVICE_KEY
const BUCKET = env.VITE_SUPABASE_BUCKET || 'blog-images'
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_SERVICE_KEY in dashboard/.env')
  process.exit(1)
}

const SRC_DIR = process.argv[2] || '/Users/taroshmathuria/Downloads/Blog images'

const MIME = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
}

async function uploadFile(filePath) {
  const ext = extname(filePath).toLowerCase()
  const slug = basename(filePath, ext)
  const buf = readFileSync(filePath)
  const objectPath = `${slug}-${Date.now()}${ext}`
  const upRes = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${objectPath}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SERVICE_KEY}`,
      apikey: SERVICE_KEY,
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'x-upsert': 'true',
      'Cache-Control': '31536000',
    },
    body: buf,
  })
  if (!upRes.ok) throw new Error(`upload ${slug}: ${upRes.status} ${await upRes.text()}`)
  const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${objectPath}`

  const patchRes = await fetch(
    `${SUPABASE_URL}/rest/v1/posts?slug=eq.${encodeURIComponent(slug)}`,
    {
      method: 'PATCH',
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify({ cover_url: publicUrl }),
    },
  )
  if (!patchRes.ok) throw new Error(`patch ${slug}: ${patchRes.status} ${await patchRes.text()}`)
  const rows = await patchRes.json()
  if (!rows.length) {
    console.warn(`[covers] no post matched slug "${slug}" — uploaded but not linked`)
    return
  }
  console.log(`[covers] ${slug} → ${publicUrl}`)
}

async function main() {
  const entries = readdirSync(SRC_DIR)
    .filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
    .map((f) => resolve(SRC_DIR, f))
    .filter((p) => statSync(p).isFile())
  if (!entries.length) {
    console.error(`no images in ${SRC_DIR}`)
    process.exit(1)
  }
  for (const f of entries) await uploadFile(f)
  console.log(`[covers] done — ${entries.length} files`)
}

main().catch((e) => {
  console.error('[covers] failed:', e.message)
  process.exit(1)
})
