-- Run once in the Supabase SQL Editor for this project.
-- The app uses a server-only service-role key; never expose that key in browser code.
create table if not exists public.wahala_users (
  username text primary key check (username ~ '^[a-z0-9_]{3,24}$'),
  full_name text not null,
  password_hash text not null,
  created_at timestamptz not null default now()
);
create table if not exists public.wahala_data (
  username text primary key references public.wahala_users(username) on delete cascade,
  data jsonb not null default '{"income":0,"budget":0,"reqs":[],"expenses":[],"upcoming":[],"goals":[]}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.wahala_users enable row level security;
alter table public.wahala_data enable row level security;
-- No client policies: browser clients cannot read or modify either table.
-- Server routes authenticate users and scope every data operation to the signed session username.
