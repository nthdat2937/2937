-- ============================================================
-- MONKEYTYPE CLONE - Supabase Database Schema
-- ============================================================

-- 1. PROFILES (mt_profiles) - Thông tin người dùng
-- ============================================================
create table if not exists public.mt_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  email text,
  display_name text,
  avatar_url text,
  
  -- Typing stats
  started_tests integer not null default 0,
  completed_tests integer not null default 0,
  time_typing numeric not null default 0, -- seconds

  -- XP & Streak
  xp integer not null default 0,
  streak_length integer not null default 0,
  streak_max_length integer not null default 0,
  streak_hour_offset numeric default 0,

  -- Profile details
  bio text default '',
  keyboard text default '',
  social_twitter text default '',
  social_github text default '',
  social_website text default '',

  -- Theme & Config (store full config as JSONB)
  config jsonb default '{}',
  custom_themes jsonb default '[]',

  -- Flags
  is_premium boolean not null default false,
  is_banned boolean not null default false,
  is_verified boolean not null default false,
  lb_opt_out boolean not null default false,

  -- Timestamps
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. TEST RESULTS (mt_results) - Kết quả bài test
-- ============================================================
create table if not exists public.mt_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.mt_profiles(id) on delete cascade,

  -- Core metrics
  wpm numeric not null,            -- Words per minute
  raw_wpm numeric not null,        -- Raw WPM (before corrections)
  accuracy numeric not null,       -- 0-100
  consistency numeric not null,    -- 0-100
  
  -- Test configuration
  mode text not null check (mode in ('time', 'words', 'quote', 'zen', 'custom')),
  mode2 text not null,             -- e.g. "15", "30", "60", "25", "50", "custom", "zen"
  language text not null default 'english',
  difficulty text not null default 'normal' check (difficulty in ('normal', 'expert', 'master')),
  punctuation boolean not null default false,
  numbers boolean not null default false,
  lazy_mode boolean not null default false,
  blind_mode boolean not null default false,
  funbox text[] default '{}',
  
  -- Character stats [correct, incorrect, extra, missed]
  char_correct integer not null default 0,
  char_incorrect integer not null default 0,
  char_extra integer not null default 0,
  char_missed integer not null default 0,

  -- Duration & timing
  test_duration numeric not null,           -- seconds
  afk_duration numeric not null default 0,
  incomplete_test_seconds numeric not null default 0,
  restart_count integer not null default 0,

  -- Chart data (stored as JSONB for flexibility)
  chart_data jsonb default null, -- {wpm: [], burst: [], err: []}

  -- Quote info (if mode = 'quote')
  quote_length integer,

  -- Tags
  tags text[] default '{}',

  -- Flags
  is_pb boolean not null default false,
  bailed_out boolean not null default false,

  -- Timestamps
  timestamp bigint not null default (extract(epoch from now()) * 1000)::bigint,
  created_at timestamptz not null default now()
);

-- 3. PERSONAL BESTS (mt_personal_bests) - Kỷ lục cá nhân
-- ============================================================
create table if not exists public.mt_personal_bests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.mt_profiles(id) on delete cascade,

  mode text not null check (mode in ('time', 'words', 'quote', 'zen', 'custom')),
  mode2 text not null,
  language text not null default 'english',
  difficulty text not null default 'normal',
  punctuation boolean not null default false,
  numbers boolean not null default false,
  lazy_mode boolean not null default false,

  wpm numeric not null,
  raw_wpm numeric not null,
  accuracy numeric not null,
  consistency numeric not null,
  timestamp bigint not null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Unique constraint: one PB per config combination
  unique (user_id, mode, mode2, language, difficulty, punctuation, numbers, lazy_mode)
);

-- 4. LEADERBOARDS (mt_leaderboards) - Bảng xếp hạng
-- ============================================================
create table if not exists public.mt_leaderboards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.mt_profiles(id) on delete cascade,
  result_id uuid references public.mt_results(id) on delete set null,

  mode text not null default 'time',
  mode2 text not null,            -- "15" or "60"
  language text not null default 'english',

  wpm numeric not null,
  raw_wpm numeric not null,
  accuracy numeric not null,
  consistency numeric not null,
  timestamp bigint not null,

  -- Denormalized user info for fast queries
  username text not null,
  avatar_url text,
  badge_id integer,

  rank integer, -- computed rank (updated periodically or via trigger)

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- One entry per user per mode config
  unique (user_id, mode, mode2, language)
);

-- 5. USER TAGS (mt_tags) - Nhãn tùy chỉnh
-- ============================================================
create table if not exists public.mt_tags (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.mt_profiles(id) on delete cascade,
  name text not null,
  personal_bests jsonb default '{}',
  created_at timestamptz not null default now()
);

-- 6. PRESETS (mt_presets) - Cài đặt preset
-- ============================================================
create table if not exists public.mt_presets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.mt_profiles(id) on delete cascade,
  name text not null,
  config jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 7. TEST ACTIVITY (mt_test_activity) - Hoạt động luyện tập theo ngày
-- ============================================================
create table if not exists public.mt_test_activity (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.mt_profiles(id) on delete cascade,
  activity_date date not null,
  test_count integer not null default 0,
  
  unique (user_id, activity_date)
);

-- 8. FAVORITE QUOTES (mt_favorite_quotes) - Quote yêu thích
-- ============================================================
create table if not exists public.mt_favorite_quotes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.mt_profiles(id) on delete cascade,
  language text not null,
  quote_id text not null,
  created_at timestamptz not null default now(),

  unique (user_id, language, quote_id)
);

-- 9. QUOTE RATINGS (mt_quote_ratings) - Đánh giá quote
-- ============================================================
create table if not exists public.mt_quote_ratings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.mt_profiles(id) on delete cascade,
  language text not null,
  quote_id text not null,
  rating numeric not null check (rating >= 0),
  created_at timestamptz not null default now(),

  unique (user_id, language, quote_id)
);

-- 10. CUSTOM WORD LISTS (mt_custom_texts) - Danh sách từ tùy chỉnh
-- ============================================================
create table if not exists public.mt_custom_texts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.mt_profiles(id) on delete cascade,
  name text not null,
  words text[] not null default '{}',
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- INDEXES
-- ============================================================
create index idx_mt_results_user_id on public.mt_results(user_id);
create index idx_mt_results_mode on public.mt_results(mode, mode2, language);
create index idx_mt_results_timestamp on public.mt_results(timestamp desc);
create index idx_mt_results_user_mode on public.mt_results(user_id, mode, mode2);

create index idx_mt_pb_user_id on public.mt_personal_bests(user_id);
create index idx_mt_pb_lookup on public.mt_personal_bests(user_id, mode, mode2, language, difficulty, punctuation, numbers, lazy_mode);

create index idx_mt_lb_ranking on public.mt_leaderboards(mode, mode2, language, wpm desc);
create index idx_mt_lb_user on public.mt_leaderboards(user_id);

create index idx_mt_tags_user on public.mt_tags(user_id);
create index idx_mt_activity_user_date on public.mt_test_activity(user_id, activity_date desc);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Profiles
alter table public.mt_profiles enable row level security;

create policy "mt_profiles_select" on public.mt_profiles
  for select using (true);

create policy "mt_profiles_insert" on public.mt_profiles
  for insert with check (auth.uid() = id);

create policy "mt_profiles_update" on public.mt_profiles
  for update using (auth.uid() = id);

-- Results
alter table public.mt_results enable row level security;

create policy "mt_results_select_own" on public.mt_results
  for select using (auth.uid() = user_id);

create policy "mt_results_insert_own" on public.mt_results
  for insert with check (auth.uid() = user_id);

-- Personal Bests
alter table public.mt_personal_bests enable row level security;

create policy "mt_pb_select" on public.mt_personal_bests
  for select using (true);

create policy "mt_pb_insert" on public.mt_personal_bests
  for insert with check (auth.uid() = user_id);

create policy "mt_pb_update" on public.mt_personal_bests
  for update using (auth.uid() = user_id);

-- Leaderboards
alter table public.mt_leaderboards enable row level security;

create policy "mt_lb_select" on public.mt_leaderboards
  for select using (true);

create policy "mt_lb_upsert" on public.mt_leaderboards
  for insert with check (auth.uid() = user_id);

create policy "mt_lb_update" on public.mt_leaderboards
  for update using (auth.uid() = user_id);

-- Tags
alter table public.mt_tags enable row level security;

create policy "mt_tags_select" on public.mt_tags
  for select using (auth.uid() = user_id);

create policy "mt_tags_insert" on public.mt_tags
  for insert with check (auth.uid() = user_id);

create policy "mt_tags_update" on public.mt_tags
  for update using (auth.uid() = user_id);

create policy "mt_tags_delete" on public.mt_tags
  for delete using (auth.uid() = user_id);

-- Presets
alter table public.mt_presets enable row level security;

create policy "mt_presets_select" on public.mt_presets
  for select using (auth.uid() = user_id);

create policy "mt_presets_insert" on public.mt_presets
  for insert with check (auth.uid() = user_id);

create policy "mt_presets_update" on public.mt_presets
  for update using (auth.uid() = user_id);

create policy "mt_presets_delete" on public.mt_presets
  for delete using (auth.uid() = user_id);

-- Test Activity
alter table public.mt_test_activity enable row level security;

create policy "mt_activity_select" on public.mt_test_activity
  for select using (auth.uid() = user_id);

create policy "mt_activity_upsert" on public.mt_test_activity
  for insert with check (auth.uid() = user_id);

create policy "mt_activity_update" on public.mt_test_activity
  for update using (auth.uid() = user_id);

-- Favorite Quotes
alter table public.mt_favorite_quotes enable row level security;

create policy "mt_fav_quotes_select" on public.mt_favorite_quotes
  for select using (auth.uid() = user_id);

create policy "mt_fav_quotes_insert" on public.mt_favorite_quotes
  for insert with check (auth.uid() = user_id);

create policy "mt_fav_quotes_delete" on public.mt_favorite_quotes
  for delete using (auth.uid() = user_id);

-- Quote Ratings
alter table public.mt_quote_ratings enable row level security;

create policy "mt_quote_ratings_select" on public.mt_quote_ratings
  for select using (true);

create policy "mt_quote_ratings_upsert" on public.mt_quote_ratings
  for insert with check (auth.uid() = user_id);

create policy "mt_quote_ratings_update" on public.mt_quote_ratings
  for update using (auth.uid() = user_id);

-- Custom Texts
alter table public.mt_custom_texts enable row level security;

create policy "mt_custom_texts_select" on public.mt_custom_texts
  for select using (auth.uid() = user_id or is_public = true);

create policy "mt_custom_texts_insert" on public.mt_custom_texts
  for insert with check (auth.uid() = user_id);

create policy "mt_custom_texts_update" on public.mt_custom_texts
  for update using (auth.uid() = user_id);

create policy "mt_custom_texts_delete" on public.mt_custom_texts
  for delete using (auth.uid() = user_id);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto update updated_at
create or replace function public.mt_handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger mt_profiles_updated_at
  before update on public.mt_profiles
  for each row execute function public.mt_handle_updated_at();

create trigger mt_pb_updated_at
  before update on public.mt_personal_bests
  for each row execute function public.mt_handle_updated_at();

create trigger mt_lb_updated_at
  before update on public.mt_leaderboards
  for each row execute function public.mt_handle_updated_at();

create trigger mt_presets_updated_at
  before update on public.mt_presets
  for each row execute function public.mt_handle_updated_at();

create trigger mt_custom_texts_updated_at
  before update on public.mt_custom_texts
  for each row execute function public.mt_handle_updated_at();

-- Auto create profile on user signup
create or replace function public.mt_handle_new_user()
returns trigger as $$
begin
  insert into public.mt_profiles (id, username, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', 'user_' || substr(new.id::text, 1, 8)),
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

-- Only create trigger if it doesn't exist
do $$
begin
  if not exists (
    select 1 from pg_trigger where tgname = 'on_auth_user_created_mt'
  ) then
    create trigger on_auth_user_created_mt
      after insert on auth.users
      for each row execute function public.mt_handle_new_user();
  end if;
end;
$$;
