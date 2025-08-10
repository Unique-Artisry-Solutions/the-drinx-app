-- Create tables for persistent rate limiting and violation logging
-- Security: RLS enabled, only service role (edge functions) will access

-- Rate limits table
CREATE TABLE IF NOT EXISTS public.security_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint TEXT NOT NULL,
  user_id UUID NULL,
  ip TEXT NOT NULL,
  window_key TEXT NOT NULL,
  window_start TIMESTAMPTZ NOT NULL DEFAULT now(),
  count INTEGER NOT NULL DEFAULT 0,
  "limit" INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT security_rate_limits_unique UNIQUE (endpoint, user_id, ip, window_key)
);

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_security_rate_limits_endpoint ON public.security_rate_limits(endpoint);
CREATE INDEX IF NOT EXISTS idx_security_rate_limits_window ON public.security_rate_limits(window_start);
CREATE INDEX IF NOT EXISTS idx_security_rate_limits_ip ON public.security_rate_limits(ip);

-- Updated at trigger
CREATE TRIGGER set_timestamp_security_rate_limits
BEFORE UPDATE ON public.security_rate_limits
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS (no public policies; service role bypasses RLS)
ALTER TABLE public.security_rate_limits ENABLE ROW LEVEL SECURITY;

-- Violations log table
CREATE TABLE IF NOT EXISTS public.security_rate_limit_violations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint TEXT NOT NULL,
  user_id UUID NULL,
  ip TEXT NOT NULL,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  count INTEGER NOT NULL,
  "limit" INTEGER NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_security_rate_limit_violations_endpoint ON public.security_rate_limit_violations(endpoint);
CREATE INDEX IF NOT EXISTS idx_security_rate_limit_violations_time ON public.security_rate_limit_violations(occurred_at);
CREATE INDEX IF NOT EXISTS idx_security_rate_limit_violations_ip ON public.security_rate_limit_violations(ip);

ALTER TABLE public.security_rate_limit_violations ENABLE ROW LEVEL SECURITY;