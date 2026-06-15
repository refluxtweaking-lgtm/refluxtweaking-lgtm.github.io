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
  app_version text,
  replaced_at timestamptz,
  created_at  timestamptz not null default now()
);

alter table public.licenses add column if not exists app_version text;
alter table public.licenses add column if not exists replaced_at timestamptz;

create table if not exists public.license_update_dispatches (
  id         uuid primary key default gen_random_uuid(),
  email      text not null,
  version    text not null,
  license_id uuid references public.licenses (id) on delete set null,
  sent_at    timestamptz not null default now(),
  unique (email, version)
);

create index if not exists license_update_dispatches_version_idx
  on public.license_update_dispatches (version);

create index if not exists licenses_email_idx on public.licenses (email);

alter table public.licenses enable row level security;

-- Authenticated users can read only the rows that match their own email.
drop policy if exists "Users can read their own licenses" on public.licenses;
create policy "Users can read their own licenses"
  on public.licenses
  for select
  to authenticated
  using (email = (auth.jwt() ->> 'email'));
