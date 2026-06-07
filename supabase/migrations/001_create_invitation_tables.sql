create extension if not exists pgcrypto;

create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  client_request_id uuid not null unique,
  side text not null check (side in ('groom', 'bride')),
  attendance text not null check (attendance in ('attending', 'declined')),
  meal text check (meal in ('yes', 'no', 'undecided')),
  name text not null,
  phone text,
  companion_count integer not null default 0 check (companion_count >= 0),
  companion_names text,
  memo text,
  privacy_agreed_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists rsvps_created_at_idx on public.rsvps (created_at desc);
create index if not exists rsvps_side_attendance_idx on public.rsvps (side, attendance);

alter table public.rsvps enable row level security;

create table if not exists public.guestbook_entries (
  id uuid primary key default gen_random_uuid(),
  client_request_id uuid not null unique,
  name text not null,
  message text not null,
  is_visible boolean not null default true,
  deleted_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists guestbook_public_created_idx
  on public.guestbook_entries (created_at desc)
  where is_visible = true and deleted_at is null;

alter table public.guestbook_entries enable row level security;
