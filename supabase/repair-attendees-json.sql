alter table public.wedding_rsvps
add column if not exists attendees_json jsonb;

create unique index if not exists wedding_rsvps_invitation_code_key
on public.wedding_rsvps (invitation_code)
where invitation_code is not null;

create or replace function public.upsert_wedding_rsvp(rsvp_payload jsonb)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  saved_id uuid;
begin
  insert into public.wedding_rsvps (
    full_name,
    identity_document,
    phone,
    invitation_code,
    invitation_label,
    description,
    travel_group_mode,
    group_id,
    group_label,
    group_leader_name,
    group_capacity,
    room,
    number_of_people,
    number_of_nights,
    check_in_date,
    check_out_date,
    arrival_time,
    departure_time,
    boarding_point,
    attendees_json,
    allergies,
    notes
  )
  values (
    nullif(trim(rsvp_payload->>'full_name'), ''),
    nullif(trim(rsvp_payload->>'identity_document'), ''),
    nullif(trim(rsvp_payload->>'phone'), ''),
    nullif(trim(rsvp_payload->>'invitation_code'), ''),
    nullif(trim(rsvp_payload->>'invitation_label'), ''),
    nullif(trim(rsvp_payload->>'description'), ''),
    nullif(trim(rsvp_payload->>'travel_group_mode'), ''),
    nullif(trim(rsvp_payload->>'group_id'), ''),
    nullif(trim(rsvp_payload->>'group_label'), ''),
    nullif(trim(rsvp_payload->>'group_leader_name'), ''),
    case
      when nullif(trim(rsvp_payload->>'group_capacity'), '') is null then null
      else (rsvp_payload->>'group_capacity')::integer
    end,
    nullif(trim(rsvp_payload->>'room'), ''),
    (rsvp_payload->>'number_of_people')::integer,
    (rsvp_payload->>'number_of_nights')::integer,
    (rsvp_payload->>'check_in_date')::date,
    (rsvp_payload->>'check_out_date')::date,
    case
      when nullif(trim(rsvp_payload->>'arrival_time'), '') is null then null
      else (rsvp_payload->>'arrival_time')::time
    end,
    case
      when nullif(trim(rsvp_payload->>'departure_time'), '') is null then null
      else (rsvp_payload->>'departure_time')::time
    end,
    nullif(trim(rsvp_payload->>'boarding_point'), ''),
    case
      when jsonb_typeof(rsvp_payload->'attendees_json') = 'array' then rsvp_payload->'attendees_json'
      else '[]'::jsonb
    end,
    nullif(trim(rsvp_payload->>'allergies'), ''),
    nullif(trim(rsvp_payload->>'notes'), '')
  )
  on conflict (invitation_code) do update
  set
    full_name = excluded.full_name,
    identity_document = excluded.identity_document,
    phone = excluded.phone,
    invitation_label = excluded.invitation_label,
    description = excluded.description,
    travel_group_mode = excluded.travel_group_mode,
    group_id = excluded.group_id,
    group_label = excluded.group_label,
    group_leader_name = excluded.group_leader_name,
    group_capacity = excluded.group_capacity,
    room = excluded.room,
    number_of_people = excluded.number_of_people,
    number_of_nights = excluded.number_of_nights,
    check_in_date = excluded.check_in_date,
    check_out_date = excluded.check_out_date,
    arrival_time = excluded.arrival_time,
    departure_time = excluded.departure_time,
    boarding_point = excluded.boarding_point,
    attendees_json = excluded.attendees_json,
    allergies = excluded.allergies,
    notes = excluded.notes
  returning id into saved_id;

  return saved_id;
end;
$$;

revoke all on function public.upsert_wedding_rsvp(jsonb) from public;
grant execute on function public.upsert_wedding_rsvp(jsonb) to anon, authenticated;

create or replace function public.get_wedding_rsvp_by_invitation(invitation_code_param text)
returns table (
  full_name text,
  identity_document text,
  phone text,
  invitation_code text,
  invitation_label text,
  description text,
  travel_group_mode text,
  group_id text,
  group_label text,
  group_leader_name text,
  group_capacity integer,
  room text,
  number_of_people integer,
  number_of_nights integer,
  check_in_date date,
  check_out_date date,
  arrival_time time,
  departure_time time,
  boarding_point text,
  attendees_json jsonb,
  allergies text,
  notes text
)
language sql
security definer
set search_path = public
as $$
  select
    wedding_rsvps.full_name,
    wedding_rsvps.identity_document,
    wedding_rsvps.phone,
    wedding_rsvps.invitation_code,
    wedding_rsvps.invitation_label,
    wedding_rsvps.description,
    wedding_rsvps.travel_group_mode,
    wedding_rsvps.group_id,
    wedding_rsvps.group_label,
    wedding_rsvps.group_leader_name,
    wedding_rsvps.group_capacity,
    wedding_rsvps.room,
    wedding_rsvps.number_of_people,
    wedding_rsvps.number_of_nights,
    wedding_rsvps.check_in_date,
    wedding_rsvps.check_out_date,
    wedding_rsvps.arrival_time,
    wedding_rsvps.departure_time,
    wedding_rsvps.boarding_point,
    wedding_rsvps.attendees_json,
    wedding_rsvps.allergies,
    wedding_rsvps.notes
  from public.wedding_rsvps
  where wedding_rsvps.invitation_code = invitation_code_param
  limit 1;
$$;

revoke all on function public.get_wedding_rsvp_by_invitation(text) from public;
grant execute on function public.get_wedding_rsvp_by_invitation(text) to anon, authenticated;

create or replace function public.get_wedding_admin_reservations()
returns table (
  id uuid,
  full_name text,
  identity_document text,
  phone text,
  invitation_code text,
  invitation_label text,
  travel_group_mode text,
  group_id text,
  group_label text,
  group_leader_name text,
  group_capacity integer,
  room text,
  number_of_people integer,
  number_of_nights integer,
  check_in_date date,
  check_out_date date,
  attendees_json jsonb,
  allergies text,
  notes text,
  created_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select
    wedding_rsvps.id,
    wedding_rsvps.full_name,
    wedding_rsvps.identity_document,
    wedding_rsvps.phone,
    wedding_rsvps.invitation_code,
    wedding_rsvps.invitation_label,
    wedding_rsvps.travel_group_mode,
    wedding_rsvps.group_id,
    wedding_rsvps.group_label,
    wedding_rsvps.group_leader_name,
    wedding_rsvps.group_capacity,
    wedding_rsvps.room,
    wedding_rsvps.number_of_people,
    wedding_rsvps.number_of_nights,
    wedding_rsvps.check_in_date,
    wedding_rsvps.check_out_date,
    wedding_rsvps.attendees_json,
    wedding_rsvps.allergies,
    wedding_rsvps.notes,
    wedding_rsvps.created_at
  from public.wedding_rsvps
  order by wedding_rsvps.created_at desc;
$$;

revoke all on function public.get_wedding_admin_reservations() from public;
grant execute on function public.get_wedding_admin_reservations() to anon, authenticated;

notify pgrst, 'reload schema';

select
  invitation_code,
  invitation_label,
  attendees_json
from public.wedding_rsvps
order by created_at desc;
