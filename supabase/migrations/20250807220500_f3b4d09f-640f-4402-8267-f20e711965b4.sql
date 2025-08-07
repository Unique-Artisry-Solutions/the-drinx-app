-- Enhance payment_audit_logs table with additional security fields
ALTER TABLE public.payment_audit_logs 
ADD COLUMN IF NOT EXISTS request_headers JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS geolocation_data JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS session_id TEXT,
ADD COLUMN IF NOT EXISTS referrer_url TEXT,
ADD COLUMN IF NOT EXISTS device_fingerprint TEXT;

-- Add indexes for security event analysis
CREATE INDEX IF NOT EXISTS idx_payment_audit_ip_timestamp 
ON public.payment_audit_logs (ip_address, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_payment_audit_user_timestamp 
ON public.payment_audit_logs (user_id, created_at DESC) 
WHERE user_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_payment_audit_security_flags 
ON public.payment_audit_logs USING GIN (security_flags);

-- Enhance security_event_logs table
ALTER TABLE public.security_event_logs 
ADD COLUMN IF NOT EXISTS request_headers JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS session_id TEXT,
ADD COLUMN IF NOT EXISTS response_time_ms INTEGER,
ADD COLUMN IF NOT EXISTS endpoint TEXT;

-- Add indexes for security monitoring
CREATE INDEX IF NOT EXISTS idx_security_events_type_severity 
ON public.security_event_logs (event_type, severity, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_security_events_ip_timestamp 
ON public.security_event_logs (ip_address, created_at DESC);

-- Create a view for comprehensive payment audit analysis
CREATE OR REPLACE VIEW payment_audit_analysis AS
SELECT 
  pal.id,
  pal.request_id,
  pal.user_id,
  pal.ip_address,
  pal.user_agent,
  pal.payment_method_id,
  pal.amount,
  pal.currency,
  pal.status,
  pal.error_code,
  pal.error_message,
  pal.stripe_payment_intent_id,
  pal.processing_time_ms,
  pal.security_flags,
  pal.request_headers,
  pal.geolocation_data,
  pal.session_id,
  pal.referrer_url,
  pal.device_fingerprint,
  pal.created_at,
  -- Risk scoring
  CASE 
    WHEN 'suspicious_activity' = ANY(pal.security_flags) THEN 3
    WHEN array_length(pal.security_flags, 1) > 0 THEN 2
    ELSE 1
  END as risk_score,
  -- Anonymized IP for privacy
  CASE 
    WHEN pal.ip_address IS NOT NULL THEN 
      split_part(pal.ip_address, '.', 1) || '.' || 
      split_part(pal.ip_address, '.', 2) || '.***.**'
    ELSE NULL
  END as anonymized_ip
FROM public.payment_audit_logs pal;

-- Create RLS policy for payment audit analysis view
ALTER VIEW payment_audit_analysis OWNER TO postgres;

-- Create a view for security event analysis
CREATE OR REPLACE VIEW security_event_analysis AS
SELECT 
  sel.id,
  sel.event_type,
  sel.severity,
  sel.ip_address,
  sel.user_agent,
  sel.user_id,
  sel.details,
  sel.request_headers,
  sel.session_id,
  sel.response_time_ms,
  sel.endpoint,
  sel.created_at,
  -- Event frequency analysis
  COUNT(*) OVER (
    PARTITION BY sel.ip_address, sel.event_type 
    ORDER BY sel.created_at 
    RANGE BETWEEN INTERVAL '1 hour' PRECEDING AND CURRENT ROW
  ) as events_last_hour,
  -- Anonymized IP for privacy
  CASE 
    WHEN sel.ip_address IS NOT NULL THEN 
      split_part(sel.ip_address, '.', 1) || '.' || 
      split_part(sel.ip_address, '.', 2) || '.***.**'
    ELSE NULL
  END as anonymized_ip
FROM public.security_event_logs sel;

-- Grant permissions
GRANT SELECT ON payment_audit_analysis TO authenticated;
GRANT SELECT ON security_event_analysis TO authenticated;