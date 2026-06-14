-- REFLUX TWEAKS — licenses schema
--
-- HOW TO USE:
--   1. Open your Supabase project dashboard.
--   2. Go to SQL Editor -> New query.
--   3. Paste this entire file and click "Run".
--
-- This creates the `licenses` table, an index on email, enables Row Level
-- Security, and adds a policy so authenticated users can only read their own
-- licenses. Inserts are performed by the webhook using the service-role key,
-- which bypasses RLS.

create table if not exists public.licenses (
  id          uuid primary key default gen_random_uuid(),
  email       text not null,
  plan        text not null,
  license_key text not null,
  status      text not null default 'active',
  created_at  timestamptz not null default now()
);

create index if not exists licenses_email_idx on public.licenses (email);

alter table public.licenses enable row level security;

-- Authenticated users can read only the rows that match their own email.
drop policy if exists "Users can read their own licenses" on public.licenses;
create policy "Users can read their own licenses"
  on public.licenses
  for select
  to authenticated
  using (email = (auth.jwt() ->> 'email'));
