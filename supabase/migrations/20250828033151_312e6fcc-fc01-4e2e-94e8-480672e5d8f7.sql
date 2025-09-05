-- Fix function search_path security vulnerabilities
-- Pin search_path and use fully-qualified object names for all functions

CREATE OR REPLACE FUNCTION public.is_admin(p_uid uuid)
RETURNS boolean 
LANGUAGE sql 
STABLE 
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT user_type = 'admin' FROM public.profiles WHERE id = p_uid),
    false
  )
$$;


-- Update has_active_role function  
CREATE OR REPLACE FUNCTION public.has_active_role(p_user_id uuid, p_role text)
RETURNS boolean
LANGUAGE sql
STABLE 
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = p_user_id
      AND role::text = p_role
      AND is_active = true
  );
$$;

-- Update get_current_user_type function
CREATE OR REPLACE FUNCTION public.get_current_user_type()
RETURNS text
LANGUAGE sql
STABLE 
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT user_type FROM public.profiles WHERE id = auth.uid();
$$;

-- Update cleanup_old_webhook_events function
CREATE OR REPLACE FUNCTION public.cleanup_old_webhook_events()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  DELETE FROM public.webhook_events 
  WHERE processed_at < now() - interval '30 days';
END;
$$;

-- Update cleanup_notification_dedup_log function
CREATE OR REPLACE FUNCTION public.cleanup_notification_dedup_log()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  DELETE FROM public.notification_dedup_log 
  WHERE expires_at < now() AND status = 'completed';
END;
$$;

-- Update purge_old_logs function
CREATE OR REPLACE FUNCTION public.purge_old_logs()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Adjust retention periods to your compliance needs
  DELETE FROM public.http_request_logs WHERE created_at < now() - interval '90 days';
  DELETE FROM public.security_event_logs WHERE created_at < now() - interval '180 days';
  -- Keep payment_audit_logs longer if needed for dispute resolution
  DELETE FROM public.payment_audit_logs WHERE created_at < now() - interval '365 days';
END;
$$;

-- Update anonymize_user_data function
CREATE OR REPLACE FUNCTION public.anonymize_user_data(p_user_id uuid, p_tables text[] DEFAULT ARRAY['payment_audit_logs'::text, 'device_fingerprints'::text, 'payment_patterns'::text])
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_request_id UUID;
  v_table_name TEXT;
BEGIN
  -- Create anonymization request
  INSERT INTO public.data_anonymization_requests (
    user_id,
    request_type,
    tables_affected,
    anonymization_method,
    requested_by
  ) VALUES (
    p_user_id,
    'user_request',
    p_tables,
    jsonb_build_object(
      'method', 'hash_replacement',
      'preserve_structure', true,
      'hash_algorithm', 'sha256'
    ),
    auth.uid()
  ) RETURNING id INTO v_request_id;
  
  -- Process anonymization for each table
  FOREACH v_table_name IN ARRAY p_tables
  LOOP
    CASE v_table_name
      WHEN 'payment_audit_logs' THEN
        UPDATE public.payment_audit_logs
        SET 
          user_id = NULL,
          ip_address = NULL,
          user_agent = 'ANONYMIZED',
          metadata = jsonb_build_object('anonymized', true, 'original_user_id_hash', encode(sha256(user_id::text::bytea), 'hex'))
        WHERE user_id = p_user_id;
      
      WHEN 'device_fingerprints' THEN
        UPDATE public.device_fingerprints
        SET 
          user_id = NULL,
          device_data = jsonb_build_object('anonymized', true),
          fingerprint_hash = encode(sha256((fingerprint_hash || 'ANON')::bytea), 'hex')
        WHERE user_id = p_user_id;
      
      WHEN 'payment_patterns' THEN
        UPDATE public.payment_patterns
        SET 
          user_id = NULL,
          pattern_data = jsonb_build_object('anonymized', true)
        WHERE user_id = p_user_id;
    END CASE;
  END LOOP;
  
  -- Update request status
  UPDATE public.data_anonymization_requests
  SET 
    status = 'completed',
    completed_at = now(),
    executed_by = auth.uid(),
    verification_hash = encode(sha256((p_user_id::text || now()::text)::bytea), 'hex')
  WHERE id = v_request_id;
  
  -- Log compliance action
  INSERT INTO public.compliance_audit_trail (
    compliance_type,
    action_type,
    user_id,
    affected_data_type,
    action_details,
    performed_by
  ) VALUES (
    'GDPR',
    'data_anonymization',
    p_user_id,
    'user_data',
    jsonb_build_object(
      'request_id', v_request_id,
      'tables_anonymized', p_tables,
      'method', 'hash_replacement'
    ),
    auth.uid()
  );
  
  RETURN v_request_id;
END;
$$;

-- Update _table_exists function
CREATE OR REPLACE FUNCTION public._table_exists(p_table text)
RETURNS boolean
LANGUAGE sql
STABLE
SET search_path = ''
AS $$
  SELECT EXISTS(
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = p_table
  );
$$;

-- Update _log_seed_record function
CREATE OR REPLACE FUNCTION public._log_seed_record(p_seed_run_id uuid, p_table text, p_record_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF p_seed_run_id IS NOT NULL THEN
    INSERT INTO public.dev_seed_records(seed_run_id, table_name, record_id)
    VALUES (p_seed_run_id, p_table, p_record_id);
  END IF;
END;
$$;

-- Update calculate_device_risk_score function
CREATE OR REPLACE FUNCTION public.calculate_device_risk_score(fingerprint_data jsonb, user_history jsonb DEFAULT '{}'::jsonb)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  risk_score NUMERIC := 0;
  device_age_days NUMERIC;
  failed_attempts INTEGER;
BEGIN
  -- Base risk factors
  
  -- New device penalty
  IF (fingerprint_data->>'first_seen_at')::timestamp > (now() - interval '24 hours') THEN
    risk_score := risk_score + 20;
  END IF;
  
  -- Check for suspicious user agent patterns
  IF fingerprint_data->>'user_agent' ~* '(bot|crawler|spider|headless)' THEN
    risk_score := risk_score + 50;
  END IF;
  
  -- VPN/Proxy detection (basic)
  IF fingerprint_data->>'is_vpn' = 'true' THEN
    risk_score := risk_score + 30;
  END IF;
  
  -- Failed attempts
  failed_attempts := COALESCE((user_history->>'failed_attempts')::integer, 0);
  risk_score := risk_score + (failed_attempts * 10);
  
  -- Geographic anomalies
  IF user_history->>'geo_anomaly' = 'true' THEN
    risk_score := risk_score + 25;
  END IF;
  
  -- Cap risk score at 100
  RETURN LEAST(100, risk_score);
END;
$$;

-- Update check_user_consent function
CREATE OR REPLACE FUNCTION public.check_user_consent(p_user_id uuid, p_consent_type text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  has_consent BOOLEAN := false;
BEGIN
  SELECT consent_given INTO has_consent
  FROM public.user_consent_tracking
  WHERE user_id = p_user_id
    AND consent_type = p_consent_type
    AND consent_given = true
    AND (expires_at IS NULL OR expires_at > now())
    AND withdrawn_at IS NULL
  ORDER BY created_at DESC
  LIMIT 1;
  
  RETURN COALESCE(has_consent, false);
END;
$$;
