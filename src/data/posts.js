// Posts data layer.
// - Primary source: Supabase posts table (live edits via dashboard).
// - Fallback: static seed in blogPosts.js (used if Supabase env not configured or fetch fails).
//
// Returns posts in the shape the page components expect:
//   { slug, title, excerpt, date, readMinutes, tags[], cover, author:{name,role}, content (HTML string) }

import { supabase, supabaseEnabled } from '../lib/supabaseClient'
import { blogPosts as fallback } from './blogPosts'

function normalize(row) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt || '',
    date: row.date,
    readMinutes: row.read_minutes || 5,
    tags: row.tags || [],
    cover: row.cover_url || null,
    author: { name: row.author_name || 'FitNyx', role: row.author_role || '' },
    content: row.content_html || '',
  }
}

let cache = null
let cacheAt = 0
const TTL_MS = 60 * 1000

async function fetchAll() {
  if (!supabaseEnabled) return null
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('date', { ascending: false })
  if (error || !data) return null
  return data.map(normalize)
}

export async function getAllPosts() {
  if (cache && Date.now() - cacheAt < TTL_MS) return cache
  const live = await fetchAll()
  cache = live && live.length > 0 ? live : fallback
  cacheAt = Date.now()
  return cache
}

export async function getPost(slug) {
  if (supabaseEnabled) {
    const { data } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle()
    if (data) return normalize(data)
  }
  return fallback.find((p) => p.slug === slug) || null
}
