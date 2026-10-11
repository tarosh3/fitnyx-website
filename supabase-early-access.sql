-- Early-access (pre-register) list used by api/subscribe.js.
-- Run once in the WEBSITE Supabase project (the one holding `posts`):
-- Dashboard → SQL Editor → paste → Run.
create table if not exists public.early_access (
  id         bigint generated always as identity primary key,
  email      text not null unique,
  created_at timestamptz not null default now()
);

-- Only the server (service-role key in api/subscribe.js) may touch this
-- table; RLS with no policies blocks the public anon key entirely.
alter table public.early_access enable row level security;
