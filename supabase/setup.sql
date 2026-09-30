-- ================================================================
-- PIXLANE — Supabase Database Setup
-- Run this entire file in: Supabase Dashboard → SQL Editor → Run
-- ================================================================

-- ── 1. Profiles ──────────────────────────────────────────────
create table if not exists public.profiles (
  id          uuid primary key references auth.users on delete cascade,
  full_name   text,
  email       text not null,
  created_at  timestamptz default now() not null
);

-- Auto-create profile when a user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── 2. Events ────────────────────────────────────────────────
create table if not exists public.events (
  id              uuid primary key default gen_random_uuid(),
  host_id         uuid not null references public.profiles(id) on delete cascade,
  name            text not null,
  description     text,
  event_date      date,
  code            text not null unique,
  is_active       boolean default true not null,
  photo_limit     integer default 30 not null,
  video_limit     integer default 3 not null,
  plan            text default 'free' not null,
  theme_template  text default 'default' not null,
  created_at      timestamptz default now() not null
);

create index if not exists events_host_id_idx on public.events(host_id);
create index if not exists events_code_idx on public.events(code);

-- ── 3. Photos / Media ────────────────────────────────────────
create table if not exists public.photos (
  id             uuid primary key default gen_random_uuid(),
  event_id       uuid not null references public.events(id) on delete cascade,
  uploader_name  text not null,
  file_url       text not null,
  file_path      text not null,
  file_size      bigint not null,
  media_type     text default 'photo' not null, -- 'photo' or 'video'
  uploaded_at    timestamptz default now() not null
);

create index if not exists photos_event_id_idx on public.photos(event_id);

-- ── 4. Row Level Security ─────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.events   enable row level security;
alter table public.photos   enable row level security;

-- Profiles: users can only see/edit their own
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Events: hosts manage their own; everyone can read active ones by code
create policy "Hosts can manage own events"
  on public.events for all
  using (auth.uid() = host_id);

create policy "Anyone can read active events"
  on public.events for select
  using (is_active = true);

-- Photos: hosts can manage photos in their events; anyone can insert/read
create policy "Anyone can upload to active events"
  on public.photos for insert
  with check (
    exists (
      select 1 from public.events
      where id = event_id and is_active = true
    )
  );

create policy "Anyone can view photos of active events"
  on public.photos for select
  using (
    exists (
      select 1 from public.events
      where id = event_id and is_active = true
    )
  );

create policy "Hosts can delete photos from own events"
  on public.photos for delete
  using (
    exists (
      select 1 from public.events
      where id = event_id and host_id = auth.uid()
    )
  );

-- ── 5. Storage Bucket ─────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do nothing;

-- Storage policies
create policy "Anyone can upload photos"
  on storage.objects for insert
  with check (bucket_id = 'photos');

create policy "Anyone can view photos"
  on storage.objects for select
  using (bucket_id = 'photos');

create policy "Hosts can delete photos"
  on storage.objects for delete
  using (bucket_id = 'photos' and auth.uid() is not null);

-- ── 6. Migration for Existing Databases (Safe to run multiple times) ──
alter table public.events add column if not exists video_limit integer default 3;
alter table public.events add column if not exists plan text default 'free';
alter table public.events add column if not exists theme_template text default 'default';
alter table public.photos add column if not exists media_type text default 'photo';

-- Force Supabase PostgREST to immediately refresh its schema cache
notify pgrst, 'reload schema';

-- ================================================================
-- Realtime:
-- Enable realtime on photos table in Supabase Dashboard:
-- Database → Replication → Toggle "photos" table ON
-- ================================================================
