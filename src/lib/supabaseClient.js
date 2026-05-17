import { createClient } from '@supabase/supabase-js'

// Prod uses the ANON key (read-only via RLS — public can SELECT published posts).
// Dashboard uses SERVICE_ROLE key (full CRUD, never expose to prod).
const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabaseEnabled = Boolean(url && anonKey)

export const supabase = supabaseEnabled
  ? createClient(url, anonKey, { auth: { persistSession: false } })
  : null
