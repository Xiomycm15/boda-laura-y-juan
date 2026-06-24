create extension if not exists pgcrypto;

create table if not exists public.wedding_rsvps (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  identity_document text not null,
  phone text not null,
  description text,
  room text,
  number_of_people integer not null check (number_of_people > 0),
  number_of_nights integer not null check (number_of_nights > 0),
  check_in_date date not null,
  check_out_date date not null,
  arrival_time time,
  departure_time time,
  boarding_point text,
  allergies text,
  notes text,
  created_at timestamptz not null default now()
);

alter table public.wedding_rsvps enable row level security;

create policy "Allow anonymous inserts for wedding RSVPs"
on public.wedding_rsvps
for insert
to anon
with check (true);

create policy "Allow authenticated users to read RSVPs"
on public.wedding_rsvps
for select
to authenticated
using (true);
