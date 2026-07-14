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
alter table public.licenses add column if not exists activated_at timestamptz;
alter table public.licenses add column if not exists activated_hwid text;
alter table public.licenses add column if not exists access_expires_at timestamptz;

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

create index if not exists licenses_email_idx on public.licenses (lower(email));

create table if not exists public.processed_checkouts (
  session_id  text primary key,
  email       text not null,
  plan        text not null,
  created_at  timestamptz not null default now()
);

create index if not exists processed_checkouts_email_idx on public.processed_checkouts (lower(email));

alter table public.licenses enable row level security;

-- Authenticated users can read only the rows that match their own email.
drop policy if exists "Users can read their own licenses" on public.licenses;
create policy "Users can read their own licenses"
  on public.licenses
  for select
  to authenticated
  using (lower(email) = lower(auth.jwt() ->> 'email'));

alter table public.license_update_dispatches enable row level security;

-- Webhook idempotency table: service-role only (no policies for anon/authenticated).
alter table public.processed_checkouts enable row level security;

-- Aim trainer leaderboard (best score per licensed account email + mode).
-- Inserts/updates go through the website API with the service-role key.
create table if not exists public.aim_trainer_scores (
  id               uuid primary key default gen_random_uuid(),
  email            text not null,
  discord_username text not null,
  score            integer not null check (score >= 0 and score <= 1000000),
  accuracy         numeric(6,3) not null default 0,
  duration_ms      integer not null default 60000,
  mode             text not null default 'track',
  created_at       timestamptz not null default now()
);

create index if not exists aim_trainer_scores_score_idx
  on public.aim_trainer_scores (score desc, created_at asc);

create index if not exists aim_trainer_scores_email_idx
  on public.aim_trainer_scores (lower(email));

create unique index if not exists aim_trainer_scores_email_mode_unique
  on public.aim_trainer_scores (lower(email), mode);

create index if not exists aim_trainer_scores_mode_score_idx
  on public.aim_trainer_scores (mode, score desc, created_at asc);

alter table public.aim_trainer_scores enable row level security;
