-- Continue fixing remaining functions with mutable search_path
-- Part 2: Additional functions that need search_path pinning

-- Update calculate_fees_and_taxes function
CREATE OR REPLACE FUNCTION public.calculate_fees_and_taxes(p_amount numeric, p_region text DEFAULT 'US'::text, p_event_type text DEFAULT NULL::text)
RETURNS TABLE(gross_amount numeric, platform_fee numeric, processing_fee numeric, total_fees numeric, tax_amount numeric, net_amount numeric)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_fee_structure RECORD;
  v_tax_config RECORD;
  v_platform_fee NUMERIC := 0;
  v_processing_fee NUMERIC := 0;
  v_tax_amount NUMERIC := 0;
BEGIN
  -- Get fee structure
  SELECT * INTO v_fee_structure
  FROM public.fee_structures
  WHERE region = p_region 
    AND (event_type = p_event_type OR event_type IS NULL)
    AND is_active = true
    AND (effective_until IS NULL OR effective_until > now())
  ORDER BY event_type NULLS LAST
  LIMIT 1;
  
  -- Fallback to global default if no region-specific structure found
  IF NOT FOUND THEN
    SELECT * INTO v_fee_structure
    FROM public.fee_structures
    WHERE region = 'GLOBAL' AND is_active = true
    LIMIT 1;
  END IF;
  
  -- Calculate platform fee
  IF v_fee_structure IS NOT NULL THEN
    v_platform_fee := (p_amount * v_fee_structure.platform_fee_percentage / 100) + v_fee_structure.platform_fee_fixed;
    v_processing_fee := (p_amount * v_fee_structure.payment_processing_fee_percentage / 100) + v_fee_structure.payment_processing_fee_fixed;
  END IF;
  
  -- Get tax configuration
  SELECT * INTO v_tax_config
  FROM public.tax_configurations
  WHERE region = p_region 
    AND is_active = true
    AND (threshold_amount IS NULL OR p_amount >= threshold_amount)
  LIMIT 1;
  
  -- Calculate tax if applicable
  IF v_tax_config IS NOT NULL AND v_tax_config.withholding_required THEN
    v_tax_amount := (p_amount - v_platform_fee - v_processing_fee) * v_tax_config.tax_rate;
  END IF;
  
  -- Return calculated values
  gross_amount := p_amount;
  platform_fee := v_platform_fee;
  processing_fee := v_processing_fee;
  total_fees := v_platform_fee + v_processing_fee;
  tax_amount := v_tax_amount;
  net_amount := p_amount - v_platform_fee - v_processing_fee - v_tax_amount;
  
  RETURN NEXT;
END;
$$;

-- Update switch_active_role function
CREATE OR REPLACE FUNCTION public.switch_active_role(role_to_activate user_role)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    -- Check if the user has the role they're trying to activate
    IF NOT EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role = role_to_activate
    ) THEN
        -- Create the role if it doesn't exist
        INSERT INTO public.user_roles (user_id, role, is_active)
        VALUES (auth.uid(), role_to_activate, false);
    END IF;

    -- First deactivate all roles for the user
    UPDATE public.user_roles 
    SET is_active = false 
    WHERE user_id = auth.uid();
    
    -- Then activate the specified role
    UPDATE public.user_roles 
    SET is_active = true 
    WHERE user_id = auth.uid() 
    AND role = role_to_activate;

    -- Verify the role was activated
    IF NOT EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role = role_to_activate 
        AND is_active = true
    ) THEN
        RAISE EXCEPTION 'Failed to activate role';
    END IF;
END;
$$;

-- Update record_campaign_segment_interaction function
CREATE OR REPLACE FUNCTION public.record_campaign_segment_interaction(p_campaign_id uuid, p_segment_id uuid, p_interaction_type text, p_value numeric DEFAULT 1, p_date date DEFAULT CURRENT_DATE)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Try to update existing record first
  WITH upsert AS (
    UPDATE public.campaign_segment_performance
    SET 
      impressions = CASE WHEN p_interaction_type = 'impression' THEN impressions + p_value::INTEGER ELSE impressions END,
      clicks = CASE WHEN p_interaction_type = 'click' THEN clicks + p_value::INTEGER ELSE clicks END,
      conversions = CASE WHEN p_interaction_type = 'conversion' THEN conversions + p_value::INTEGER ELSE conversions END,
      conversion_value = CASE WHEN p_interaction_type = 'conversion' THEN conversion_value + p_value ELSE conversion_value END,
      updated_at = now()
    WHERE 
      campaign_id = p_campaign_id
      AND segment_id = p_segment_id
      AND date = p_date
    RETURNING *
  )
  -- If no record exists, insert one
  INSERT INTO public.campaign_segment_performance (
    campaign_id, 
    segment_id, 
    date, 
    impressions, 
    clicks, 
    conversions, 
    conversion_value
  )
  SELECT 
    p_campaign_id, 
    p_segment_id, 
    p_date,
    CASE WHEN p_interaction_type = 'impression' THEN p_value::INTEGER ELSE 0 END,
    CASE WHEN p_interaction_type = 'click' THEN p_value::INTEGER ELSE 0 END,
    CASE WHEN p_interaction_type = 'conversion' THEN p_value::INTEGER ELSE 0 END,
    CASE WHEN p_interaction_type = 'conversion' THEN p_value ELSE 0 END
  WHERE NOT EXISTS (SELECT 1 FROM upsert);
END;
$$;

-- Update run_retention_cleanup function
CREATE OR REPLACE FUNCTION public.run_retention_cleanup()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  rec RECORD;
  cutoff TIMESTAMPTZ;
  del_sql TEXT;
  total_deleted BIGINT := 0;
  table_deleted BIGINT;
BEGIN
  FOR rec IN 
    SELECT * FROM public.data_retention_policies 
    WHERE is_active = true AND auto_deletion_enabled = true
  LOOP
    cutoff := now() - (COALESCE(rec.retention_period_days, 0) || ' days')::interval;

    -- Only operate on tables that have a created_at column
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = rec.data_type AND column_name = 'created_at'
    ) THEN
      del_sql := format('DELETE FROM %I WHERE created_at < $1', rec.data_type);
      EXECUTE del_sql USING cutoff;
      GET DIAGNOSTICS table_deleted = ROW_COUNT;
      total_deleted := total_deleted + COALESCE(table_deleted, 0);
    END IF;
  END LOOP;

  UPDATE public.data_retention_policies
  SET last_cleanup_at = now()
  WHERE is_active = true AND auto_deletion_enabled = true;

  RETURN json_build_object('deleted_rows', total_deleted, 'timestamp', now());
END;
$$;

-- Update get_or_create_thread function
CREATE OR REPLACE FUNCTION public.get_or_create_thread(p_promoter_id uuid, p_venue_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  thread_id UUID;
BEGIN
  -- Try to find existing active thread
  SELECT id INTO thread_id
  FROM public.promoter_venue_threads
  WHERE promoter_id = p_promoter_id 
    AND venue_id = p_venue_id 
    AND is_archived = false;
  
  -- If found, return it
  IF thread_id IS NOT NULL THEN
    RETURN thread_id;
  END IF;
  
  -- Try to create new thread
  BEGIN
    INSERT INTO public.promoter_venue_threads (promoter_id, venue_id, is_archived)
    VALUES (p_promoter_id, p_venue_id, false)
    RETURNING id INTO thread_id;
    
    RETURN thread_id;
  EXCEPTION 
    WHEN unique_violation THEN
      -- If constraint violation (another thread was created concurrently),
      -- query again for the existing thread
      SELECT id INTO thread_id
      FROM public.promoter_venue_threads
      WHERE promoter_id = p_promoter_id 
        AND venue_id = p_venue_id 
        AND is_archived = false;
      
      RETURN thread_id;
  END;
END;
$$;

-- Update merge_duplicate_threads function
CREATE OR REPLACE FUNCTION public.merge_duplicate_threads()
RETURNS TABLE(merged_count integer, deleted_threads uuid[])
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  duplicate_record RECORD;
  primary_thread_id UUID;
  secondary_thread_ids UUID[];
  merged_total INTEGER := 0;
  all_deleted_threads UUID[] := ARRAY[]::UUID[];
BEGIN
  -- Find and merge duplicate threads
  FOR duplicate_record IN
    SELECT promoter_id, venue_id, array_agg(id ORDER BY created_at ASC) as thread_ids
    FROM public.promoter_venue_threads 
    WHERE is_archived = false
    GROUP BY promoter_id, venue_id 
    HAVING COUNT(*) > 1
  LOOP
    -- Take the first (oldest) thread as primary
    primary_thread_id := duplicate_record.thread_ids[1];
    secondary_thread_ids := duplicate_record.thread_ids[2:];
    
    -- Move all messages from secondary threads to primary thread
    UPDATE public.promoter_venue_messages 
    SET thread_id = primary_thread_id 
    WHERE thread_id = ANY(secondary_thread_ids);
    
    -- Archive secondary threads instead of deleting to preserve history
    UPDATE public.promoter_venue_threads 
    SET is_archived = true, updated_at = now()
    WHERE id = ANY(secondary_thread_ids);
    
    merged_total := merged_total + array_length(secondary_thread_ids, 1);
    all_deleted_threads := all_deleted_threads || secondary_thread_ids;
  END LOOP;
  
  RETURN QUERY SELECT merged_total, all_deleted_threads;
END;
$$;