-- Helper function to increment user stats atomically
create or replace function public.mt_increment_stats(
  p_user_id uuid,
  p_time numeric,
  p_started integer,
  p_completed integer
) returns void as $$
begin
  update public.mt_profiles
  set
    time_typing = time_typing + p_time,
    started_tests = started_tests + p_started,
    completed_tests = completed_tests + p_completed,
    updated_at = now()
  where id = p_user_id;
end;
$$ language plpgsql security definer;
