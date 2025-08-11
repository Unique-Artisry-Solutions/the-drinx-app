-- Dev seed tracking tables and seed RPC helpers
-- 1) Tables
CREATE TABLE IF NOT EXISTS public.dev_seed_registry (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  params jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'running',
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz NULL
);

CREATE TABLE IF NOT EXISTS public.dev_seed_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seed_run_id uuid NOT NULL REFERENCES public.dev_seed_registry(id) ON DELETE CASCADE,
  table_name text NOT NULL,
  record_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_dev_seed_records_seed ON public.dev_seed_records(seed_run_id);
CREATE INDEX IF NOT EXISTS idx_dev_seed_records_table ON public.dev_seed_records(table_name);

-- Enable RLS and restrict writes to functions/service role only
ALTER TABLE public.dev_seed_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dev_seed_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view dev seed registry" ON public.dev_seed_registry;
CREATE POLICY "Admins can view dev seed registry"
ON public.dev_seed_registry
FOR SELECT
USING ((SELECT profiles.user_type FROM public.profiles WHERE profiles.id = auth.uid()) = 'admin');

DROP POLICY IF EXISTS "Admins can view dev seed records" ON public.dev_seed_records;
CREATE POLICY "Admins can view dev seed records"
ON public.dev_seed_records
FOR SELECT
USING ((SELECT profiles.user_type FROM public.profiles WHERE profiles.id = auth.uid()) = 'admin');

-- 2) Helper functions
CREATE OR REPLACE FUNCTION public._table_exists(p_table text)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT EXISTS(
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = p_table
  );
$$;

CREATE OR REPLACE FUNCTION public._log_seed_record(p_seed_run_id uuid, p_table text, p_record_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public
AS $$
BEGIN
  IF p_seed_run_id IS NOT NULL THEN
    INSERT INTO public.dev_seed_records(seed_run_id, table_name, record_id)
    VALUES (p_seed_run_id, p_table, p_record_id);
  END IF;
END;
$$;

-- 3) Seed Establishments
CREATE OR REPLACE FUNCTION public.seed_establishments(
  p_owner_ids uuid[],
  p_count int DEFAULT 18,
  p_seed_run_id uuid DEFAULT NULL
) RETURNS uuid[]
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public
AS $$
DECLARE
  created_ids uuid[] := ARRAY[]::uuid[];
  i int;
  v_owner uuid;
  v_id uuid;
  v_name text;
BEGIN
  IF NOT public._table_exists('establishments') THEN
    RETURN created_ids;
  END IF;

  IF p_owner_ids IS NULL OR array_length(p_owner_ids,1) IS NULL THEN
    RAISE EXCEPTION 'seed_establishments requires at least one owner id';
  END IF;

  FOR i IN 1..GREATEST(1, p_count) LOOP
    v_owner := p_owner_ids[((i-1) % array_length(p_owner_ids,1)) + 1];
    v_name := 'Seed Bar ' || lpad(i::text, 2, '0');

    -- Idempotency by name
    SELECT id INTO v_id FROM public.establishments WHERE name = v_name;
    IF v_id IS NULL THEN
      INSERT INTO public.establishments (
        name, owner_id, address, latitude, longitude, cocktail_count, phone, website
      ) VALUES (
        v_name,
        v_owner,
        '123 Seed St, Test City',
        40.70 + (random() * 0.1),
        -74.00 - (random() * 0.1),
        0,
        '+1-555-010' || lpad((i)::text, 2, '0'),
        'https://seed-bar-' || lpad(i::text, 2, '0') || '.dev'
      ) RETURNING id INTO v_id;
    END IF;

    PERFORM public._log_seed_record(p_seed_run_id, 'establishments', v_id);
    created_ids := created_ids || v_id;
  END LOOP;

  RETURN created_ids;
END;
$$;

-- 4) Seed Cocktails for Establishments
CREATE OR REPLACE FUNCTION public.seed_cocktails_for_establishments(
  p_establishment_ids uuid[],
  p_min_per int DEFAULT 3,
  p_max_per int DEFAULT 6,
  p_seed_run_id uuid DEFAULT NULL
) RETURNS uuid[]
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public
AS $$
DECLARE
  created_ids uuid[] := ARRAY[]::uuid[];
  est_id uuid;
  j int;
  v_n int;
  v_name text;
  v_id uuid;
BEGIN
  IF NOT public._table_exists('cocktails') THEN
    RETURN created_ids;
  END IF;

  IF p_establishment_ids IS NULL OR array_length(p_establishment_ids,1) IS NULL THEN
    RETURN created_ids;
  END IF;

  FOREACH est_id IN ARRAY p_establishment_ids LOOP
    v_n := GREATEST(p_min_per, LEAST(p_max_per, 3 + floor(random()*((p_max_per - p_min_per + 1)))::int));
    FOR j IN 1..v_n LOOP
      v_name := 'Seed Cocktail ' || substr(est_id::text,1,4) || '-' || lpad(j::text, 2, '0');
      SELECT id INTO v_id FROM public.cocktails WHERE establishment_id = est_id AND name = v_name;
      IF v_id IS NULL THEN
        INSERT INTO public.cocktails (
          name, price, establishment_id, description, ingredients, image_url
        ) VALUES (
          v_name,
          '$' || (8 + (random()*12))::int,
          est_id,
          'A delightful dev-seed mocktail.',
          jsonb_build_array('ingredient_'||j, 'citrus', 'herbs'),
          NULL
        ) RETURNING id INTO v_id;
      END IF;
      PERFORM public._log_seed_record(p_seed_run_id, 'cocktails', v_id);
      created_ids := created_ids || v_id;
    END LOOP;
  END LOOP;

  RETURN created_ids;
END;
$$;

-- 5) Seed Reviews
CREATE OR REPLACE FUNCTION public.seed_reviews(
  p_user_ids uuid[],
  p_cocktail_ids uuid[],
  p_total int DEFAULT 120,
  p_seed_run_id uuid DEFAULT NULL
) RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public
AS $$
DECLARE
  i int;
  v_user uuid;
  v_cocktail uuid;
  v_rating int;
  v_text text;
  v_source text;
  created_count int := 0;
BEGIN
  IF NOT public._table_exists('cocktail_reviews') THEN
    RETURN 0;
  END IF;

  IF array_length(p_user_ids,1) IS NULL OR array_length(p_cocktail_ids,1) IS NULL THEN
    RETURN 0;
  END IF;

  FOR i IN 1..GREATEST(1, p_total) LOOP
    v_user := p_user_ids[((i-1) % array_length(p_user_ids,1)) + 1];
    v_cocktail := p_cocktail_ids[(1 + floor(random()*array_length(p_cocktail_ids,1)))::int];
    -- Skewed towards higher ratings
    v_rating := CASE WHEN random() < 0.6 THEN 5 WHEN random() < 0.8 THEN 4 WHEN random() < 0.9 THEN 3 ELSE 2 END;
    v_text := 'Seed review #' || i || ' - rating ' || v_rating;
    v_source := CASE WHEN random() < 0.85 THEN 'app' ELSE 'yelp' END;

    INSERT INTO public.cocktail_reviews (id, text, cocktail_id, user_id, rating, source, created_at)
    VALUES (gen_random_uuid(), v_text, v_cocktail::text, v_user, v_rating, v_source, now() - (floor(random()*30)||' days')::interval);
    created_count := created_count + 1;
    -- cocktail_reviews table doesn't store metadata; track via dev_seed_records only
    PERFORM public._log_seed_record(p_seed_run_id, 'cocktail_reviews', currval(pg_get_serial_sequence('public.cocktail_reviews','id')));
  END LOOP;

  RETURN created_count;
END;
$$;

-- 6) Seed Analytics Events
CREATE OR REPLACE FUNCTION public.seed_analytics(
  p_user_ids uuid[],
  p_event_ids uuid[] DEFAULT NULL,
  p_days int DEFAULT 30,
  p_seed_run_id uuid DEFAULT NULL
) RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public
AS $$
DECLARE
  d int;
  u uuid;
  created_count int := 0;
  v_event_type text;
BEGIN
  IF NOT public._table_exists('analytics_events') THEN
    RETURN json_build_object('created', 0, 'days', p_days);
  END IF;

  FOR d IN REVERSE p_days..1 LOOP
    FOREACH u IN ARRAY p_user_ids LOOP
      -- 3 events per user per day avg
      FOR i IN 1..(2 + (random()*3)::int) LOOP
        v_event_type := (ARRAY['page_view','click','conversion','discovery'])[(1 + floor(random()*4))::int];
        INSERT INTO public.analytics_events (id, event_type, user_id, page_url, user_agent, ip_address, event_data, timestamp)
        VALUES (
          gen_random_uuid(),
          v_event_type,
          u,
          '/seeded/page-'|| (1 + (random()*9)::int),
          'SeedAgent/1.0',
          '127.0.0.1',
          jsonb_build_object('dev_seed', true),
          (now() - (d||' days')::interval) + ((random()*86399)||' seconds')::interval
        );
        created_count := created_count + 1;
      END LOOP;
    END LOOP;
  END LOOP;

  RETURN json_build_object('created', created_count, 'days', p_days);
END;
$$;

-- 7) Seed Rewards Activity
CREATE OR REPLACE FUNCTION public.seed_rewards_activity(
  p_user_ids uuid[],
  p_establishment_ids uuid[] DEFAULT NULL,
  p_events_per_user int DEFAULT 6,
  p_seed_run_id uuid DEFAULT NULL
) RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public
AS $$
DECLARE
  u uuid;
  e uuid;
  i int;
  v_points int;
  v_tx_id uuid;
  total_tx int := 0;
BEGIN
  IF NOT public._table_exists('reward_transactions') THEN
    RETURN json_build_object('transactions', 0);
  END IF;

  FOREACH u IN ARRAY p_user_ids LOOP
    FOR i IN 1..GREATEST(1, p_events_per_user) LOOP
      v_points := 5 + (random()*25)::int;
      e := CASE WHEN p_establishment_ids IS NOT NULL AND array_length(p_establishment_ids,1) IS NOT NULL THEN 
            p_establishment_ids[(1 + floor(random()*array_length(p_establishment_ids,1)))::int]
          ELSE NULL END;

      INSERT INTO public.reward_transactions (
        id, user_id, establishment_id, points, transaction_type, source, description, metadata, created_at
      ) VALUES (
        gen_random_uuid(), u, e, v_points, 'earn', 'seed_activity', 'Seeded reward activity', jsonb_build_object('dev_seed', true), now() - (floor(random()*20)||' days')::interval
      ) RETURNING id INTO v_tx_id;
      PERFORM public._log_seed_record(p_seed_run_id, 'reward_transactions', v_tx_id);
      total_tx := total_tx + 1;

      -- Upsert user_rewards
      IF public._table_exists('user_rewards') THEN
        INSERT INTO public.user_rewards(user_id, points, lifetime_points, updated_at)
        VALUES (u, v_points, v_points, now())
        ON CONFLICT (user_id)
        DO UPDATE SET 
          points = GREATEST(0, public.user_rewards.points + EXCLUDED.points),
          lifetime_points = public.user_rewards.lifetime_points + EXCLUDED.lifetime_points,
          updated_at = now();
      END IF;
    END LOOP;
  END LOOP;

  RETURN json_build_object('transactions', total_tx);
END;
$$;

-- 8) Clear Dev Seed
CREATE OR REPLACE FUNCTION public.clear_dev_seed(p_seed_run_id uuid DEFAULT NULL)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public
AS $$
DECLARE
  rec RECORD;
  deleted_count int := 0;
  total int := 0;
BEGIN
  FOR rec IN 
    SELECT * FROM public.dev_seed_records 
    WHERE p_seed_run_id IS NULL OR seed_run_id = p_seed_run_id
  LOOP
    BEGIN
      EXECUTE format('DELETE FROM %I WHERE id = $1', rec.table_name) USING rec.record_id;
      deleted_count := deleted_count + 1;
    EXCEPTION WHEN OTHERS THEN
      -- Ignore failures, continue
      NULL;
    END;
    total := total + 1;
  END LOOP;

  IF p_seed_run_id IS NOT NULL THEN
    DELETE FROM public.dev_seed_registry WHERE id = p_seed_run_id;
  END IF;

  RETURN json_build_object('attempted', total, 'deleted', deleted_count);
END;
$$;

-- Grants
GRANT EXECUTE ON FUNCTION public._table_exists(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public._log_seed_record(uuid, text, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.seed_establishments(uuid[], int, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.seed_cocktails_for_establishments(uuid[], int, int, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.seed_reviews(uuid[], uuid[], int, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.seed_analytics(uuid[], uuid[], int, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.seed_rewards_activity(uuid[], uuid[], int, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.clear_dev_seed(uuid) TO authenticated;

-- From previous diff ensure grants exist
DO $$ BEGIN
  PERFORM 1 FROM pg_proc WHERE proname = 'update_user_points' AND nspname = 'public' FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid;
  EXCEPTION WHEN undefined_function THEN NULL;
END $$;
-- Safe re-grants
GRANT EXECUTE ON FUNCTION public.batch_update_user_points(jsonb) TO authenticated;