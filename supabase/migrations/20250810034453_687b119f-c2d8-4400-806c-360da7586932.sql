
-- Week 2: Audit & Logging Enhancement
-- 1) Payment audit logs: ensure a comprehensive table exists and compatible with current edge functions
CREATE TABLE IF NOT EXISTS public.payment_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id TEXT NOT NULL,
  user_id UUID NULL,
  ip_address TEXT NULL,
  user_agent TEXT NULL,
  payment_method_id TEXT NULL,
  amount NUMERIC NULL,
  currency TEXT NULL,
  status TEXT NOT NULL, -- initiated | processing | succeeded | failed | cancelled
  error_code TEXT NULL,
  error_message TEXT NULL,
  stripe_payment_intent_id TEXT NULL,
  processing_time_ms INTEGER NULL,
  security_flags TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  request_headers JSONB NOT NULL DEFAULT '{}'::jsonb,
  geolocation_data JSONB NULL,
  session_id TEXT NULL,
  referrer_url TEXT NULL,
  device_fingerprint TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Make sure all expected columns exist (forward compatible)
ALTER TABLE public.payment_audit_logs
  ADD COLUMN IF NOT EXISTS request_id TEXT,
  ADD COLUMN IF NOT EXISTS user_id UUID,
  ADD COLUMN IF NOT EXISTS ip_address TEXT,
  ADD COLUMN IF NOT EXISTS user_agent TEXT,
  ADD COLUMN IF NOT EXISTS payment_method_id TEXT,
  ADD COLUMN IF NOT EXISTS amount NUMERIC,
  ADD COLUMN IF NOT EXISTS currency TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT,
  ADD COLUMN IF NOT EXISTS error_code TEXT,
  ADD COLUMN IF NOT EXISTS error_message TEXT,
  ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT,
  ADD COLUMN IF NOT EXISTS processing_time_ms INTEGER,
  ADD COLUMN IF NOT EXISTS security_flags TEXT[] DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN IF NOT EXISTS request_headers JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS geolocation_data JSONB,
  ADD COLUMN IF NOT EXISTS session_id TEXT,
  ADD COLUMN IF NOT EXISTS referrer_url TEXT,
  ADD COLUMN IF NOT EXISTS device_fingerprint TEXT,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();

CREATE INDEX IF NOT EXISTS idx_payment_audit_logs_created_at ON public.payment_audit_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payment_audit_logs_user ON public.payment_audit_logs (user_id);
CREATE INDEX IF NOT EXISTS idx_payment_audit_logs_ip ON public.payment_audit_logs (ip_address);
CREATE INDEX IF NOT EXISTS idx_payment_audit_logs_status ON public.payment_audit_logs (status);

ALTER TABLE public.payment_audit_logs ENABLE ROW LEVEL SECURITY;

-- Admins can read payment audit logs
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'payment_audit_logs' AND policyname = 'Admins can view payment audit logs'
  ) THEN
    CREATE POLICY "Admins can view payment audit logs"
      ON public.payment_audit_logs
      FOR SELECT
      USING (EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.id = auth.uid() AND p.user_type = 'admin'
      ));
  END IF;
END$$;

-- No INSERT/UPDATE/DELETE policies needed (service role bypasses RLS)

-----------------------------------------------------------------------
-- 2) Enhance payment_failure_logs with IP and User-Agent, request context
-- Only apply if table exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables 
             WHERE table_schema='public' AND table_name='payment_failure_logs') THEN
    ALTER TABLE public.payment_failure_logs
      ADD COLUMN IF NOT EXISTS ip_address TEXT,
      ADD COLUMN IF NOT EXISTS user_agent TEXT,
      ADD COLUMN IF NOT EXISTS request_id TEXT,
      ADD COLUMN IF NOT EXISTS request_headers JSONB NOT NULL DEFAULT '{}'::jsonb;

    CREATE INDEX IF NOT EXISTS idx_payment_failure_logs_created_at ON public.payment_failure_logs (created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_payment_failure_logs_ip ON public.payment_failure_logs (ip_address);
  END IF;
END$$;

-----------------------------------------------------------------------
-- 3) Security event logging: generalized security events (rate limit, CORS, suspicious activity, auth failures)
CREATE TABLE IF NOT EXISTS public.security_event_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL, -- rate_limit_exceeded | suspicious_activity | cors_violation | authentication_failed | invalid_token_usage | payment_attempt
  severity TEXT NOT NULL, -- low | medium | high | critical
  ip_address TEXT NULL,
  user_agent TEXT NULL,
  user_id UUID NULL,
  endpoint TEXT NULL,
  response_time_ms INTEGER NULL,
  request_headers JSONB NOT NULL DEFAULT '{}'::jsonb,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  session_id TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_security_event_logs_created_at ON public.security_event_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_security_event_logs_event_type ON public.security_event_logs (event_type);
CREATE INDEX IF NOT EXISTS idx_security_event_logs_severity ON public.security_event_logs (severity);
CREATE INDEX IF NOT EXISTS idx_security_event_logs_ip ON public.security_event_logs (ip_address);

ALTER TABLE public.security_event_logs ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'security_event_logs' AND policyname = 'Admins can view security events'
  ) THEN
    CREATE POLICY "Admins can view security events"
      ON public.security_event_logs
      FOR SELECT
      USING (EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.id = auth.uid() AND p.user_type = 'admin'
      ));
  END IF;
END$$;

-----------------------------------------------------------------------
-- 4) HTTP request/response logging (sanitized headers/body metadata)
CREATE TABLE IF NOT EXISTS public.http_request_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id TEXT NOT NULL,
  function_name TEXT NOT NULL,
  method TEXT NULL,
  path TEXT NULL,
  query_params JSONB NOT NULL DEFAULT '{}'::jsonb,
  request_headers JSONB NOT NULL DEFAULT '{}'::jsonb,
  response_headers JSONB NULL,
  body_summary JSONB NULL, -- sanitized keys only (no secrets)
  body_hash TEXT NULL,     -- hash to correlate payloads without storing sensitive data
  user_id UUID NULL,
  ip_address TEXT NULL,
  user_agent TEXT NULL,
  status_code INTEGER NULL,
  response_time_ms INTEGER NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_http_request_logs_created_at ON public.http_request_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_http_request_logs_function ON public.http_request_logs (function_name);
CREATE INDEX IF NOT EXISTS idx_http_request_logs_ip ON public.http_request_logs (ip_address);

ALTER TABLE public.http_request_logs ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'http_request_logs' AND policyname = 'Admins can view http request logs'
  ) THEN
    CREATE POLICY "Admins can view http request logs"
      ON public.http_request_logs
      FOR SELECT
      USING (EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.id = auth.uid() AND p.user_type = 'admin'
      ));
  END IF;
END$$;

-----------------------------------------------------------------------
-- 5) Security Alerts (real-time monitoring and SOC workflow)
CREATE TABLE IF NOT EXISTS public.security_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  severity TEXT NOT NULL,   -- low | medium | high | critical
  status TEXT NOT NULL DEFAULT 'open', -- open | acknowledged | resolved
  title TEXT NOT NULL,
  description TEXT NULL,
  source TEXT NULL,         -- which subsystem/function/table raised it
  event_id UUID NULL,       -- link to security_event_logs.id (when available)
  context JSONB NOT NULL DEFAULT '{}'::jsonb,
  notified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ NULL,
  acknowledged_by UUID NULL
);

CREATE INDEX IF NOT EXISTS idx_security_alerts_created_at ON public.security_alerts (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_security_alerts_status ON public.security_alerts (status);
CREATE INDEX IF NOT EXISTS idx_security_alerts_severity ON public.security_alerts (severity);

ALTER TABLE public.security_alerts ENABLE ROW LEVEL SECURITY;

-- Admins can view and manage alerts
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'security_alerts' AND policyname = 'Admins can view alerts'
  ) THEN
    CREATE POLICY "Admins can view alerts"
      ON public.security_alerts
      FOR SELECT
      USING (EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.id = auth.uid() AND p.user_type = 'admin'
      ));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'security_alerts' AND policyname = 'Admins can update alerts'
  ) THEN
    CREATE POLICY "Admins can update alerts"
      ON public.security_alerts
      FOR UPDATE
      USING (EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.id = auth.uid() AND p.user_type = 'admin'
      ));
  END IF;
END$$;

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.trg_set_updated_at_security_alerts()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END$$;

DROP TRIGGER IF EXISTS set_updated_at_security_alerts ON public.security_alerts;
CREATE TRIGGER set_updated_at_security_alerts
BEFORE UPDATE ON public.security_alerts
FOR EACH ROW EXECUTE FUNCTION public.trg_set_updated_at_security_alerts();

-----------------------------------------------------------------------
-- 6) Real-time enablement for alerts
ALTER TABLE public.security_alerts REPLICA IDENTITY FULL;
DO $$
BEGIN
  -- Add to realtime publication if not already present
  PERFORM 1
  FROM pg_publication_tables
  WHERE pubname = 'supabase_realtime'
    AND schemaname = 'public'
    AND tablename = 'security_alerts';

  IF NOT FOUND THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.security_alerts';
  END IF;
END$$;

-----------------------------------------------------------------------
-- 7) Detection + auto-alerts via triggers

-- a) On rate limit violations, mirror into security_event_logs
CREATE OR REPLACE FUNCTION public.trg_security_event_on_rate_limit()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
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
END$$;

DROP TRIGGER IF EXISTS security_event_on_rate_limit ON public.security_rate_limit_violations;
CREATE TRIGGER security_event_on_rate_limit
AFTER INSERT ON public.security_rate_limit_violations
FOR EACH ROW EXECUTE FUNCTION public.trg_security_event_on_rate_limit();

-- b) Auto-create alerts on high/critical security events
CREATE OR REPLACE FUNCTION public.trg_alert_on_security_event()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
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
END$$;

DROP TRIGGER IF EXISTS alert_on_security_event ON public.security_event_logs;
CREATE TRIGGER alert_on_security_event
AFTER INSERT ON public.security_event_logs
FOR EACH ROW EXECUTE FUNCTION public.trg_alert_on_security_event();

-- c) Burst detection on failed payments (5+ failures from same IP in 10 minutes, or 3+ per user)
CREATE OR REPLACE FUNCTION public.trg_alert_on_payment_failure_burst()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
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
END$$;

DROP TRIGGER IF EXISTS alert_on_payment_failure_burst ON public.payment_audit_logs;
CREATE TRIGGER alert_on_payment_failure_burst
AFTER INSERT ON public.payment_audit_logs
FOR EACH ROW EXECUTE FUNCTION public.trg_alert_on_payment_failure_burst();

-----------------------------------------------------------------------
-- 8) Helpful views for Security Monitoring UI

-- Recent suspicious payment failures by IP (>=5 in last 10 minutes)
CREATE OR REPLACE VIEW public.suspicious_payment_failures_10min AS
SELECT
  ip_address,
  COUNT(*) AS fail_count,
  MIN(created_at) AS first_seen,
  MAX(created_at) AS last_seen
FROM public.payment_audit_logs
WHERE status = 'failed'
  AND ip_address IS NOT NULL
  AND created_at > now() - interval '10 minutes'
GROUP BY ip_address
HAVING COUNT(*) >= 5;

-- Recent suspicious payment failures by user (>=3 in last 10 minutes)
CREATE OR REPLACE VIEW public.suspicious_user_failures_10min AS
SELECT
  user_id,
  COUNT(*) AS fail_count,
  MIN(created_at) AS first_seen,
  MAX(created_at) AS last_seen
FROM public.payment_audit_logs
WHERE status = 'failed'
  AND user_id IS NOT NULL
  AND created_at > now() - interval '10 minutes'
GROUP BY user_id
HAVING COUNT(*) >= 3;

-- Hot IPs from rate limit violations (last 10 minutes)
CREATE OR REPLACE VIEW public.hot_ips_rate_limit_violations_10min AS
SELECT
  ip,
  COUNT(*) AS violations,
  MIN(occurred_at) AS first_seen,
  MAX(occurred_at) AS last_seen
FROM public.security_rate_limit_violations
WHERE occurred_at > now() - interval '10 minutes'
GROUP BY ip
HAVING COUNT(*) >= 3;

-- CORS violations (last hour)
CREATE OR REPLACE VIEW public.cors_violations_1h AS
SELECT *
FROM public.security_event_logs
WHERE event_type = 'cors_violation'
  AND created_at > now() - interval '1 hour';

-----------------------------------------------------------------------
-- 9) Optional retention functions (manual scheduling)
CREATE OR REPLACE FUNCTION public.purge_old_logs()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  -- Adjust retention periods to your compliance needs
  DELETE FROM public.http_request_logs WHERE created_at < now() - interval '90 days';
  DELETE FROM public.security_event_logs WHERE created_at < now() - interval '180 days';
  -- Keep payment_audit_logs longer if needed for dispute resolution
  DELETE FROM public.payment_audit_logs WHERE created_at < now() - interval '365 days';
END$$;
