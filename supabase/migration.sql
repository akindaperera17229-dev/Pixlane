-- ================================================================
-- PIXLANE — Quick Schema Migration Script
-- Run this in: Supabase Dashboard → SQL Editor → New query → Run
-- This adds the new columns for Video, Plans & Themes without losing any existing data!
-- ================================================================

-- 1. Add video limit & plan columns to events
alter table public.events add column if not exists video_limit integer default 3;
alter table public.events add column if not exists plan text default 'free';
alter table public.events add column if not exists theme_template text default 'default';

-- 2. Add media_type column to photos ('photo' or 'video')
alter table public.photos add column if not exists media_type text default 'photo';

-- 3. Force Supabase PostgREST to immediately refresh its schema cache
notify pgrst, 'reload schema';
