create table if not exists public.admin_recommendation (
  id integer primary key default 1 check (id = 1),
  type text not null check (type in ('song', 'youtube', 'spotify')),
  song_id bigint references public.songs("Id") on delete set null,
  url text,
  title text not null,
  subtitle text,
  thumbnail text,
  updated_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.admin_recommendation enable row level security;

create policy "admin_recommendation_select"
on public.admin_recommendation
for select
using (true);

create policy "admin_recommendation_insert_admin"
on public.admin_recommendation
for insert
with check (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'Admin'
  )
);

create policy "admin_recommendation_update_admin"
on public.admin_recommendation
for update
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'Admin'
  )
)
with check (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'Admin'
  )
);
