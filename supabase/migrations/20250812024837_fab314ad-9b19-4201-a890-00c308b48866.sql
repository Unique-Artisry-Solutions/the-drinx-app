
-- Idempotent signup trigger: generate unique username and upsert profile;
-- assign role only for valid enum values.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_raw_meta jsonb := coalesce(NEW.raw_user_meta_data, '{}'::jsonb);
  v_user_type text := coalesce(v_raw_meta->>'user_type', 'individual');
  v_name text := coalesce(v_raw_meta->>'name', split_part(NEW.email, '@', 1));
  v_username_base text := coalesce(v_raw_meta->>'username', split_part(NEW.email, '@', 1));
  v_username text;
  v_phone text := v_raw_meta->>'phone';
  v_role public.user_role;
  i int := 0;
begin
  -- Normalize base username (lowercase, alnum + underscore)
  v_username_base := lower(regexp_replace(v_username_base, '[^a-z0-9_]+', '_', 'g'));
  if length(v_username_base) = 0 then
    v_username_base := 'user_' || substr(NEW.id::text, 1, 8);
  end if;

  -- Find an available username
  v_username := v_username_base;
  while exists(select 1 from public.profiles where username = v_username) loop
    i := i + 1;
    if i <= 10 then
      v_username := v_username_base || '_' || lpad((floor(random()*9999)::int)::text, 4, '0');
    else
      v_username := v_username_base || '_' || substr(gen_random_uuid()::text, 1, 8);
      exit;
    end if;
  end loop;

  -- Upsert profile by id to ensure idempotency
  insert into public.profiles (id, username, display_name, user_type, phone)
  values (NEW.id, v_username, v_name, v_user_type, v_phone)
  on conflict (id) do update set
    username = excluded.username,
    display_name = excluded.display_name,
    user_type = excluded.user_type,
    phone = excluded.phone;

  -- Assign base role only if it's within the enum (skip admin)
  if v_user_type in ('individual','establishment','promoter') then
    v_role := v_user_type::public.user_role;
    insert into public.user_roles (user_id, role, is_active)
    values (NEW.id, v_role, true)
    on conflict (user_id, role) do update set is_active = true;
  end if;

  return NEW;
end;
$$;

-- Ensure trigger is attached to use the updated function
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute procedure public.handle_new_user();
