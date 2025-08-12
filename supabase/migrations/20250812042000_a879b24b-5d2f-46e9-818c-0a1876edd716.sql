
-- Seed events and related data for realistic Phase 2 test population
-- All functions follow existing seed_* patterns with dev_seed_records logging

-- 1) Seed Events
CREATE OR REPLACE FUNCTION public.seed_events(
  p_promoter_id uuid,
  p_establishment_ids uuid[] DEFAULT NULL,
  p_count integer DEFAULT 6,
  p_seed_run_id uuid DEFAULT NULL
)
RETURNS uuid[]
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  created_ids uuid[] := ARRAY[]::uuid[];
  i int;
  v_event_id uuid;
  v_name text;
  v_date date;
  v_time text;
  v_status public.event_status := 'published';
  v_venue uuid;
  v_capacity int;
BEGIN
  IF NOT public._table_exists('events') THEN
    RETURN created_ids;
  END IF;

  IF p_promoter_id IS NULL THEN
    RAISE EXCEPTION 'seed_events requires p_promoter_id';
  END IF;

  FOR i IN 1..GREATEST(1, p_count) LOOP
    v_name := 'Seed Event ' || lpad(i::text, 2, '0');
    -- Stagger dates in the near future to cover a realistic calendar
    v_date := (CURRENT_DATE + (i * 5) * INTERVAL '1 day')::date;
    v_time := '19:00';
    v_capacity := 100 + (random() * 200)::int;

    -- round-robin venue selection if provided
    IF p_establishment_ids IS NOT NULL AND array_length(p_establishment_ids, 1) IS NOT NULL THEN
      v_venue := p_establishment_ids[((i - 1) % array_length(p_establishment_ids,1)) + 1];
    ELSE
      v_venue := NULL;
    END IF;

    -- Idempotency by (name, created_by)
    SELECT id INTO v_event_id
    FROM public.events 
    WHERE name = v_name AND created_by = p_promoter_id;

    IF v_event_id IS NULL THEN
      INSERT INTO public.events (
        name, description, date, time, created_by, venue_id, status, is_public,
        capacity, image_url, custom_settings, contact_info, event_type, event_url
      ) VALUES (
        v_name,
        'Dev seeded event for realistic testing.',
        v_date::text,
        v_time,
        p_promoter_id,
        v_venue,
        'published',
        true,
        v_capacity,
        NULL,
        jsonb_build_object('dev_seed', true),
        jsonb_build_object('email', 'events@example.dev'),
        'showcase',
        NULL
      ) RETURNING id INTO v_event_id;

      PERFORM public._log_seed_record(p_seed_run_id, 'events', v_event_id);
    END IF;

    created_ids := created_ids || v_event_id;
  END LOOP;

  RETURN created_ids;
END;
$function$;

-- 2) Seed Event Ticket Types
CREATE OR REPLACE FUNCTION public.seed_event_ticket_types(
  p_event_ids uuid[],
  p_min_per integer DEFAULT 2,
  p_max_per integer DEFAULT 3,
  p_seed_run_id uuid DEFAULT NULL
)
RETURNS uuid[]
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  created_ids uuid[] := ARRAY[]::uuid[];
  e_id uuid;
  j int;
  v_n int;
  v_id uuid;
  v_name text;
  v_price numeric;
  v_qty int;
  base_names text[] := ARRAY['General Admission','VIP','Early Bird','Group Pack'];
BEGIN
  IF NOT public._table_exists('event_ticket_types') THEN
    RETURN created_ids;
  END IF;

  IF p_event_ids IS NULL OR array_length(p_event_ids, 1) IS NULL THEN
    RETURN created_ids;
  END IF;

  FOREACH e_id IN ARRAY p_event_ids LOOP
    v_n := GREATEST(p_min_per, LEAST(p_max_per, 2 + floor(random() * (p_max_per - p_min_per + 1))::int));
    FOR j IN 1..v_n LOOP
      v_name := base_names[1 + (floor(random()*LEAST(4, array_length(base_names,1)))::int)];
      -- ensure deterministic uniqueness per event by appending j where needed
      v_name := v_name || ' ' || lpad(j::text, 2, '0');
      v_price := round((20 + random() * 80)::numeric, 2);
      v_qty := 50 + (random() * 200)::int;

      -- Idempotency by (event_id, name)
      SELECT id INTO v_id
      FROM public.event_ticket_types
      WHERE event_id = e_id AND name = v_name;

      IF v_id IS NULL THEN
        INSERT INTO public.event_ticket_types (event_id, name, description, price, quantity)
        VALUES (e_id, v_name, 'Dev seeded ticket', v_price, v_qty)
        RETURNING id INTO v_id;

        PERFORM public._log_seed_record(p_seed_run_id, 'event_ticket_types', v_id);
      END IF;

      created_ids := created_ids || v_id;
    END LOOP;
  END LOOP;

  RETURN created_ids;
END;
$function$;

-- 3) Seed Event Discount Codes
CREATE OR REPLACE FUNCTION public.seed_event_discount_codes(
  p_event_ids uuid[],
  p_codes_per_event integer DEFAULT 2,
  p_seed_run_id uuid DEFAULT NULL
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  created_count int := 0;
  e_id uuid;
  i int;
  v_id uuid;
  v_code text;
  v_type text;
  v_amount numeric;
  v_expiry timestamptz;
  v_event_date date;
BEGIN
  IF NOT public._table_exists('event_discount_codes') THEN
    RETURN 0;
  END IF;

  IF p_event_ids IS NULL OR array_length(p_event_ids, 1) IS NULL THEN
    RETURN 0;
  END IF;

  FOREACH e_id IN ARRAY p_event_ids LOOP
    -- get event date if available to set expiry
    SELECT date::date INTO v_event_date FROM public.events WHERE id = e_id;

    FOR i IN 1..GREATEST(1, p_codes_per_event) LOOP
      v_type := CASE WHEN random() < 0.5 THEN 'percentage' ELSE 'fixed' END;
      v_amount := CASE WHEN v_type = 'percentage' THEN 10 + (random() * 20) ELSE 5 + (random() * 25) END;
      v_code := (CASE WHEN v_type = 'percentage' THEN 'SAVE' ELSE 'TAKE' END) || '-' || lpad((v_amount::int)::text, 2, '0') || '-' || substr(e_id::text,1,4);
      v_expiry := COALESCE((v_event_date::timestamptz - interval '1 day'), now() + interval '14 days');

      -- Idempotency by (event_id, code)
      SELECT id INTO v_id FROM public.event_discount_codes WHERE event_id = e_id AND code = v_code;
      IF v_id IS NULL THEN
        INSERT INTO public.event_discount_codes (
          event_id, code, discount_type, discount_amount, description, is_active, usage_limit, usage_count, created_at, expires_at, applicable_ticket_types
        ) VALUES (
          e_id, v_code, v_type, v_amount, 'Dev seeded discount', true, 100, 0, now(), v_expiry, NULL
        ) RETURNING id INTO v_id;

        PERFORM public._log_seed_record(p_seed_run_id, 'event_discount_codes', v_id);
        created_count := created_count + 1;
      END IF;
    END LOOP;
  END LOOP;

  RETURN created_count;
END;
$function$;

-- 4) Seed Event Notification Schedules
CREATE OR REPLACE FUNCTION public.seed_event_notification_schedules(
  p_event_ids uuid[],
  p_seed_run_id uuid DEFAULT NULL
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  created_count int := 0;
  e_id uuid;
  v_id uuid;
  v_title text;
  v_date date;
  v_sched timestamptz;
BEGIN
  IF NOT public._table_exists('event_notification_schedules') THEN
    RETURN 0;
  END IF;

  IF p_event_ids IS NULL OR array_length(p_event_ids, 1) IS NULL THEN
    RETURN 0;
  END IF;

  FOREACH e_id IN ARRAY p_event_ids LOOP
    SELECT date::date INTO v_date FROM public.events WHERE id = e_id;
    v_sched := COALESCE((v_date::timestamptz - interval '1 day') + interval '10 hours', now() + interval '2 days');
    v_title := 'Reminder: ' || COALESCE((SELECT name FROM public.events WHERE id = e_id), 'Event');

    -- Idempotency by (event_id, title)
    SELECT id INTO v_id FROM public.event_notification_schedules WHERE event_id = e_id AND title = v_title;
    IF v_id IS NULL THEN
      INSERT INTO public.event_notification_schedules (
        id, event_id, title, content, priority, scheduled_for, location_based, coordinates, target_radius, created_at, updated_at
      ) VALUES (
        gen_random_uuid(), e_id, v_title, 'See you soon! This is a friendly reminder for your upcoming event.',
        'medium', v_sched, false, NULL, NULL, now(), now()
      ) RETURNING id INTO v_id;

      PERFORM public._log_seed_record(p_seed_run_id, 'event_notification_schedules', v_id);
      created_count := created_count + 1;
    END IF;
  END LOOP;

  RETURN created_count;
END;
$function$;

-- 5) Seed Event Marketing Campaigns
CREATE OR REPLACE FUNCTION public.seed_event_marketing_campaigns(
  p_event_ids uuid[],
  p_seed_run_id uuid DEFAULT NULL
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  created_count int := 0;
  e_id uuid;
  v_id uuid;
  v_date date;
  names text[] := ARRAY['Social Boost','Email Blast'];
  types text[] := ARRAY['social','email'];
  statuses text[] := ARRAY['active','draft'];
  idx int;
  nm text;
  typ text;
  st text;
BEGIN
  IF NOT public._table_exists('event_marketing_campaigns') THEN
    RETURN 0;
  END IF;

  IF p_event_ids IS NULL OR array_length(p_event_ids, 1) IS NULL THEN
    RETURN 0;
  END IF;

  FOREACH e_id IN ARRAY p_event_ids LOOP
    SELECT date::date INTO v_date FROM public.events WHERE id = e_id;

    FOR idx IN 1..array_length(names,1) LOOP
      nm := names[idx];
      typ := types[idx];
      st := statuses[idx];

      -- Idempotency by (event_id, name)
      SELECT id INTO v_id FROM public.event_marketing_campaigns WHERE event_id = e_id AND name = nm;
      IF v_id IS NULL THEN
        INSERT INTO public.event_marketing_campaigns (
          event_id, name, campaign_type, status, start_date, end_date, budget, metrics, target_audience, created_at, updated_at, description
        ) VALUES (
          e_id, nm, typ, st,
          COALESCE((v_date - interval '21 days')::date, CURRENT_DATE),
          COALESCE((v_date - interval '1 day')::date, CURRENT_DATE + 14),
          200 + (random() * 500),
          jsonb_build_object('impressions', (1000 + (random()*5000)::int), 'clicks', (100 + (random()*900)::int), 'conversions', (10 + (random()*90)::int)),
          jsonb_build_object('segment', 'seeded_test_audience'),
          now(), now(),
          'Dev seeded marketing campaign'
        ) RETURNING id INTO v_id;

        PERFORM public._log_seed_record(p_seed_run_id, 'event_marketing_campaigns', v_id);
        created_count := created_count + 1;
      END IF;
    END LOOP;
  END LOOP;

  RETURN created_count;
END;
$function$;
