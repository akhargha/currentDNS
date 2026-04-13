-- currentDNS schema
-- Run this in Supabase SQL Editor.

create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'integration_type') then
    create type integration_type as enum ('bluesky', 'keybase', 'github_org');
  end if;
end $$;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists domains (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  domain_name text not null,
  monitor_email text not null,
  status text not null default 'pending_dns_verification',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, domain_name)
);
create index if not exists idx_domains_user_id on domains(user_id);

create table if not exists domain_verification_challenges (
  id uuid primary key default gen_random_uuid(),
  domain_id uuid not null references domains(id) on delete cascade,
  verify_host text not null,
  expected_token text not null,
  expires_at timestamptz,
  verified_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists idx_domain_verification_domain_id on domain_verification_challenges(domain_id);

create table if not exists monitoring_preferences (
  id uuid primary key default gen_random_uuid(),
  domain_id uuid not null unique references domains(id) on delete cascade,
  interval_minutes int not null check (interval_minutes between 360 and 43200),
  next_run_at timestamptz not null default now(),
  alerts_enabled boolean not null default true,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create index if not exists idx_monitoring_preferences_next_run on monitoring_preferences(next_run_at);

create table if not exists github_orgs (
  id uuid primary key default gen_random_uuid(),
  domain_id uuid not null references domains(id) on delete cascade,
  org_name text not null,
  created_at timestamptz not null default now(),
  unique(domain_id, org_name)
);
create index if not exists idx_github_orgs_domain_id on github_orgs(domain_id);

create table if not exists integration_snapshots (
  id uuid primary key default gen_random_uuid(),
  domain_id uuid not null references domains(id) on delete cascade,
  integration_type integration_type not null,
  identity_key text not null,
  lookup_host text not null,
  status text not null default 'missing',
  last_txt_value text,
  first_seen_at timestamptz,
  last_valid_seen_at timestamptz,
  broken_at timestamptz,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique(domain_id, integration_type, identity_key)
);
create index if not exists idx_integration_snapshots_domain_id on integration_snapshots(domain_id);

create table if not exists integration_events (
  id uuid primary key default gen_random_uuid(),
  domain_id uuid not null references domains(id) on delete cascade,
  integration_type integration_type not null,
  identity_key text not null,
  event_type text not null,
  txt_value text,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create index if not exists idx_integration_events_domain_occurred on integration_events(domain_id, occurred_at desc);

create table if not exists otp_codes (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  code_hash text not null,
  expires_at timestamptz not null,
  consumed_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists idx_otp_codes_email_created on otp_codes(email, created_at desc);

create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists idx_sessions_user_id on sessions(user_id);

create table if not exists notification_events (
  id uuid primary key default gen_random_uuid(),
  domain_id uuid not null references domains(id) on delete cascade,
  event_type text not null,
  recipient_email text not null,
  payload jsonb,
  status text not null default 'queued',
  created_at timestamptz not null default now()
);
create index if not exists idx_notification_events_domain_id on notification_events(domain_id);

-- RLS: backend service role is expected for writes.
alter table users enable row level security;
alter table domains enable row level security;
alter table domain_verification_challenges enable row level security;
alter table monitoring_preferences enable row level security;
alter table github_orgs enable row level security;
alter table integration_snapshots enable row level security;
alter table integration_events enable row level security;
alter table otp_codes enable row level security;
alter table sessions enable row level security;
alter table notification_events enable row level security;

drop policy if exists "service_role_all_users" on users;
create policy "service_role_all_users" on users for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
drop policy if exists "service_role_all_domains" on domains;
create policy "service_role_all_domains" on domains for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
drop policy if exists "service_role_all_domain_verification_challenges" on domain_verification_challenges;
create policy "service_role_all_domain_verification_challenges" on domain_verification_challenges for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
drop policy if exists "service_role_all_monitoring_preferences" on monitoring_preferences;
create policy "service_role_all_monitoring_preferences" on monitoring_preferences for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
drop policy if exists "service_role_all_github_orgs" on github_orgs;
create policy "service_role_all_github_orgs" on github_orgs for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
drop policy if exists "service_role_all_integration_snapshots" on integration_snapshots;
create policy "service_role_all_integration_snapshots" on integration_snapshots for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
drop policy if exists "service_role_all_integration_events" on integration_events;
create policy "service_role_all_integration_events" on integration_events for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
drop policy if exists "service_role_all_otp_codes" on otp_codes;
create policy "service_role_all_otp_codes" on otp_codes for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
drop policy if exists "service_role_all_sessions" on sessions;
create policy "service_role_all_sessions" on sessions for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
drop policy if exists "service_role_all_notification_events" on notification_events;
create policy "service_role_all_notification_events" on notification_events for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
