-- currentDNS – Supabase schema
-- Run this in the Supabase SQL editor to create all tables.

-- 1. Users
create table if not exists public.users (
  id              uuid primary key default gen_random_uuid(),
  email           text not null,
  domain          text not null,
  email_verified  boolean not null default false,
  verification_token text,
  monitoring_frequency text not null default '1d',
  github_org      text,
  alert_enabled   boolean not null default true,
  created_at      timestamptz not null default now(),

  constraint users_email_unique unique (email)
);

create index if not exists idx_users_domain on public.users (domain);

-- 2. OTP codes
create table if not exists public.otp_codes (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.users (id) on delete cascade,
  code        text not null,
  expires_at  timestamptz not null,
  used        boolean not null default false,
  created_at  timestamptz not null default now()
);

create index if not exists idx_otp_user on public.otp_codes (user_id, used, expires_at);

-- 3. Sessions
create table if not exists public.sessions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.users (id) on delete cascade,
  token       text not null unique,
  expires_at  timestamptz not null,
  created_at  timestamptz not null default now()
);

create index if not exists idx_sessions_token on public.sessions (token);
create index if not exists idx_sessions_user  on public.sessions (user_id);

-- 4. Integrations (one row per user+type)
create table if not exists public.integrations (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.users (id) on delete cascade,
  type            text not null,  -- 'bluesky', 'keybase', 'github'
  status          text not null default 'not_found',  -- 'active', 'broken', 'not_found'
  first_seen_at   timestamptz,
  first_seen_txt  text,
  last_valid_at   timestamptz,
  last_valid_txt  text,
  broken_at       timestamptz,
  broken_txt      text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  constraint integrations_user_type_unique unique (user_id, type)
);

create index if not exists idx_integrations_user on public.integrations (user_id);

-- 5. Scan history (append-only log of every check)
create table if not exists public.scan_history (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.users (id) on delete cascade,
  integration_id  uuid not null references public.integrations (id) on delete cascade,
  scanned_at      timestamptz not null default now(),
  status          text not null,  -- 'found', 'not_found'
  txt_record      text,
  created_at      timestamptz not null default now()
);

create index if not exists idx_scan_history_integration on public.scan_history (integration_id, scanned_at desc);
create index if not exists idx_scan_history_user        on public.scan_history (user_id, scanned_at desc);

-- RLS: all access is via service_role key from the backend, so we enable RLS
-- but add no policies (service_role bypasses RLS automatically).
alter table public.users          enable row level security;
alter table public.otp_codes      enable row level security;
alter table public.sessions       enable row level security;
alter table public.integrations   enable row level security;
alter table public.scan_history   enable row level security;
