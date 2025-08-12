
-- Fix handle_new_user to avoid enum cast errors for 'admin' and be idempotent

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $$
declare
  v_user_type text;
  v_role user_role;
begin
  -- Determine user_type with a safe fallback
  v_user_type := coalesce(NEW.raw_user_meta_data->>'user_type', 'individual');

  -- Idempotent profile creation/upsert
  insert into public.profiles (id, username, display_name, user_type)
  values (
    NEW.id,
    coalesce(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    coalesce(NEW.raw_user_meta_data->>'name', NEW.email),
    v_user_type
  )
  on conflict (id) do update
    set
      username = coalesce(excluded.username, public.profiles.username),
      display_name = coalesce(excluded.display_name, public.profiles.display_name),
      user_type = excluded.user_type;

  -- Only insert a user_roles row for switchable roles present in the enum
  if v_user_type in ('individual', 'establishment', 'promoter') then
    v_role := v_user_type::user_role;
    insert into public.user_roles (user_id, role, is_active)
    values (NEW.id, v_role, true)
    on conflict (user_id, role) do update
      set is_active = true;
  else
    -- For 'admin' or any unexpected type, skip creating a user_roles row to avoid enum errors
    null;
  end if;

  return NEW;
end;
$$;
