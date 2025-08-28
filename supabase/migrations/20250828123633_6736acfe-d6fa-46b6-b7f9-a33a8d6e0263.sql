-- Enable RLS on security_event_logs table
ALTER TABLE public.security_event_logs ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies to recreate them properly
DROP POLICY IF EXISTS "Admins can manage security event logs" ON public.security_event_logs;
DROP POLICY IF EXISTS "Service can insert security event logs" ON public.security_event_logs;

-- Policy for admins to have full access to security event logs
CREATE POLICY "Admins can manage security event logs" 
ON public.security_event_logs 
FOR ALL 
USING (public.is_admin(auth.uid()));

-- Additional policy for admin inserts with proper check
CREATE POLICY "Admins can insert security event logs" 
ON public.security_event_logs 
FOR INSERT 
WITH CHECK (public.is_admin(auth.uid()));

-- Allow service role for system operations (automated logging)
CREATE POLICY "Service can manage security event logs" 
ON public.security_event_logs 
FOR ALL 
USING (auth.role() = 'service_role');

-- Additional service role insert policy
CREATE POLICY "Service can insert security event logs" 
ON public.security_event_logs 
FOR INSERT 
WITH CHECK (auth.role() = 'service_role');