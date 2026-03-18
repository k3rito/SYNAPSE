-- 1. Enable RLS on core tables
alter table profiles enable row level security;
alter table user_activity_log enable row level security;
alter table generated_lessons enable row level security;

-- 2. Profiles Policies
create policy "Users can view their own profile"
on profiles for select
using (auth.uid() = id);

create policy "Users can update their own profile"
on profiles for update
using (auth.uid() = id);

-- 3. Activity Log Policies
create policy "Users can view their own activity logs"
on user_activity_log for select
using (auth.uid() = user_id);

create policy "Users can insert their own activity logs"
on user_activity_log for insert
with check (auth.uid() = user_id);

-- 4. Generated Lessons Policies
create policy "Users can view their own lessons"
on generated_lessons for select
using (auth.uid() = user_id);

create policy "Users can update their own lessons"
on generated_lessons for update
using (auth.uid() = user_id);

-- 5. XP Award Function (IDEMPOTENT & SECURE)
create or replace function award_xp(p_action text, p_ref_id text)
returns json as $$
declare
  v_user_id uuid := auth.uid();
  v_xp_gain integer := 0;
  v_new_xp integer;
  v_new_level integer;
begin
  -- Validate user
  if v_user_id is null then
    return json_build_object('error', 'Unauthorized');
  end if;

  -- Prevent duplicate actions (Idempotency)
  if exists (
    select 1 from user_activity_log
    where user_id = v_user_id
    and action_type = p_action
    and reference_id = p_ref_id
  ) then
    return json_build_object('status', 'already_awarded');
  end if;

  -- Define XP rewards
  v_xp_gain := case
    when p_action = 'lesson' then 50
    when p_action = 'quiz' then 100
    else 0
  end;

  -- Insert activity log
  insert into user_activity_log (user_id, action_type, reference_id)
  values (v_user_id, p_action, p_ref_id);

  -- Update profile atomically and return new values
  update profiles
  set
    xp = xp + v_xp_gain,
    total_lessons_completed = total_lessons_completed + (case when p_action = 'lesson' then 1 else 0 end),
    last_activity_at = now()
  where id = v_user_id
  returning xp into v_new_xp;

  return json_build_object(
    'status', 'success',
    'xp_gained', v_xp_gain,
    'total_xp', v_new_xp
  );
end;
$$ language plpgsql security definer;
