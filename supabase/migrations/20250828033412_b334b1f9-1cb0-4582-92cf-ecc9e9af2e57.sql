-- Final batch: Fix all remaining functions with mutable search_path
-- Part 3: Complete the remaining functions

-- Update all trigger functions
CREATE OR REPLACE FUNCTION public.generate_notification_on_message()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  recipient_user_type TEXT;
  venue_owner_id UUID;
BEGIN
    -- Determine recipient type based on whether message is from promoter or venue
    IF NEW.is_from_promoter THEN
      -- Message is from promoter, so recipient is the venue owner (establishment user)
      recipient_user_type := 'establishment';
      
      -- Get the venue owner's user ID from the establishments table
      SELECT e.owner_id INTO venue_owner_id
      FROM public.promoter_venue_threads t
      JOIN public.establishments e ON e.id = t.venue_id
      WHERE t.id = NEW.thread_id;
      
      -- Only create notification if we found a valid venue owner
      IF venue_owner_id IS NOT NULL THEN
        INSERT INTO public.notifications (
            recipient_id,
            recipient_type,
            title,
            content,
            priority,
            category_id,
            metadata
        )
        SELECT
            venue_owner_id,
            recipient_user_type,
            'New Message from Promoter',
            'You have received a new message from a promoter',
            'medium',
            (SELECT id FROM public.notification_categories WHERE name = 'promoter_message'),
            jsonb_build_object(
                'thread_id', NEW.thread_id,
                'message_id', NEW.id,
                'promoter_id', t.promoter_id,
                'venue_id', t.venue_id
            )
        FROM public.promoter_venue_threads t
        WHERE t.id = NEW.thread_id;
      END IF;
    ELSE
      -- Already handled by generate_notification_on_venue_response function
      RETURN NEW;
    END IF;
    
    RETURN NEW;
END;
$$;

-- Update all seed functions
CREATE OR REPLACE FUNCTION public.seed_establishments(p_owner_ids uuid[], p_count integer DEFAULT 18, p_seed_run_id uuid DEFAULT NULL::uuid)
RETURNS uuid[]
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
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

-- Update advance_onboarding_step function
CREATE OR REPLACE FUNCTION public.advance_onboarding_step(p_follower_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_progress RECORD;
  v_next_message RECORD;
  v_current_step INTEGER;
  v_total_steps INTEGER;
BEGIN
  -- Get current progress
  SELECT * INTO v_progress 
  FROM public.follower_onboarding_progress 
  WHERE follower_id = p_follower_id 
  AND is_completed = false;
  
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  v_current_step := v_progress.current_step;
  
  -- Get total steps for this flow
  SELECT COUNT(*) INTO v_total_steps
  FROM public.scheduled_welcome_messages
  WHERE automation_flow_id = v_progress.automation_flow_id
  AND is_active = true;
  
  -- Mark current step as completed
  UPDATE public.follower_onboarding_progress
  SET 
    completed_steps = completed_steps || jsonb_build_array(v_current_step),
    step_completion_dates = step_completion_dates || jsonb_build_object(v_current_step::text, now()),
    current_step = CASE 
      WHEN v_current_step < v_total_steps THEN v_current_step + 1
      ELSE v_current_step
    END,
    is_completed = CASE 
      WHEN v_current_step >= v_total_steps THEN true
      ELSE false
    END,
    completed_at = CASE 
      WHEN v_current_step >= v_total_steps THEN now()
      ELSE NULL
    END,
    updated_at = now()
  WHERE id = v_progress.id;
  
  -- If completed, update follower record
  IF v_current_step >= v_total_steps THEN
    UPDATE public.promoter_followers
    SET 
      onboarding_stage = 'completed',
      onboarding_completed = true,
      onboarding_completed_at = now()
    WHERE id = p_follower_id;
    
    RETURN true;
  END IF;
  
  -- Schedule next message if not completed
  SELECT * INTO v_next_message
  FROM public.scheduled_welcome_messages
  WHERE automation_flow_id = v_progress.automation_flow_id
  AND step_number = v_current_step + 1
  AND is_active = true;
  
  IF FOUND THEN
    INSERT INTO public.scheduled_message_deliveries (
      follower_id,
      scheduled_message_id,
      onboarding_progress_id,
      scheduled_for,
      delivery_status
    ) VALUES (
      p_follower_id,
      v_next_message.id,
      v_progress.id,
      now() + (v_next_message.delay_minutes || ' minutes')::interval,
      'scheduled'
    );
  END IF;
  
  RETURN true;
END;
$$;

-- Update all other trigger functions
CREATE OR REPLACE FUNCTION public.trg_set_updated_at_security_alerts()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.trg_security_event_on_rate_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.security_event_logs (
    event_type, severity, ip_address, user_agent, user_id, endpoint, details
  ) VALUES (
    'rate_limit_exceeded',
    'medium',
    NEW.ip,
    NULL,
    NEW.user_id,
    NEW.endpoint,
    jsonb_build_object('count', NEW.count, 'limit', NEW."limit", 'metadata', NEW.metadata, 'occurred_at', NEW.occurred_at)
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.trg_alert_on_security_event()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NEW.severity IN ('high','critical') THEN
    INSERT INTO public.security_alerts (
      event_type, severity, status, title, description, source, event_id, context
    ) VALUES (
      NEW.event_type,
      NEW.severity,
      'open',
      'Security event: ' || NEW.event_type,
      'Automated detection from security_event_logs',
      NEW.endpoint,
      NEW.id,
      jsonb_build_object('ip', NEW.ip_address, 'user_id', NEW.user_id, 'details', NEW.details)
    );
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.trg_alert_on_payment_failure_burst()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  ip_failures INTEGER := 0;
  user_failures INTEGER := 0;
BEGIN
  IF NEW.status = 'failed' THEN
    IF NEW.ip_address IS NOT NULL THEN
      SELECT COUNT(*) INTO ip_failures
      FROM public.payment_audit_logs
      WHERE status = 'failed'
        AND ip_address = NEW.ip_address
        AND created_at > now() - interval '10 minutes';
    END IF;

    IF NEW.user_id IS NOT NULL THEN
      SELECT COUNT(*) INTO user_failures
      FROM public.payment_audit_logs
      WHERE status = 'failed'
        AND user_id = NEW.user_id
        AND created_at > now() - interval '10 minutes';
    END IF;

    IF ip_failures >= 5 OR user_failures >= 3 THEN
      INSERT INTO public.security_alerts (
        event_type, severity, status, title, description, source, context
      ) VALUES (
        'payment_failure_burst',
        CASE WHEN ip_failures >= 10 OR user_failures >= 6 THEN 'critical' ELSE 'high' END,
        'open',
        'Burst of payment failures detected',
        'Multiple failed payment attempts within a short period',
        'payment_audit_logs',
        jsonb_build_object(
          'ip_address', NEW.ip_address,
          'user_id', NEW.user_id,
          'ip_failures_last_10m', ip_failures,
          'user_failures_last_10m', user_failures
        )
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$;