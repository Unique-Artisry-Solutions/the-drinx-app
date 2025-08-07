-- Create security event logs table for audit compliance
CREATE TABLE IF NOT EXISTS public.security_event_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  ip_address TEXT NOT NULL,
  user_agent TEXT,
  user_id UUID,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create payment audit logs table for detailed payment tracking
CREATE TABLE IF NOT EXISTS public.payment_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id TEXT NOT NULL,
  user_id UUID,
  ip_address TEXT NOT NULL,
  user_agent TEXT,
  payment_method_id TEXT,
  amount NUMERIC,
  currency TEXT,
  status TEXT NOT NULL CHECK (status IN ('initiated', 'processing', 'succeeded', 'failed', 'cancelled')),
  error_code TEXT,
  error_message TEXT,
  stripe_payment_intent_id TEXT,
  processing_time_ms INTEGER,
  security_flags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.security_event_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_audit_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access only
CREATE POLICY "Admins can view all security event logs" 
ON public.security_event_logs 
FOR ALL
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.user_type = 'admin'
));

CREATE POLICY "Admins can view all payment audit logs" 
ON public.payment_audit_logs 
FOR ALL
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.user_type = 'admin'
));

-- Users can view their own payment audit logs
CREATE POLICY "Users can view their own payment audit logs" 
ON public.payment_audit_logs 
FOR SELECT
USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_security_event_logs_created_at ON public.security_event_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_security_event_logs_event_type ON public.security_event_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_security_event_logs_severity ON public.security_event_logs(severity);
CREATE INDEX IF NOT EXISTS idx_security_event_logs_ip_address ON public.security_event_logs(ip_address);

CREATE INDEX IF NOT EXISTS idx_payment_audit_logs_created_at ON public.payment_audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_payment_audit_logs_request_id ON public.payment_audit_logs(request_id);
CREATE INDEX IF NOT EXISTS idx_payment_audit_logs_user_id ON public.payment_audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_audit_logs_status ON public.payment_audit_logs(status);
CREATE INDEX IF NOT EXISTS idx_payment_audit_logs_ip_address ON public.payment_audit_logs(ip_address);