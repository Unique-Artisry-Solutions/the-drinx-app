-- Secure security_event_logs table with RLS and retention policies
-- Security logs can leak system details, so make them admin/service-only

-- Enable Row Level Security on security_event_logs
ALTER TABLE public.security_event_logs ENABLE ROW LEVEL SECURITY;

-- Revoke all permissions from anon and authenticated roles
REVOKE ALL ON TABLE public.security_event_logs FROM anon, authenticated;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS sel_select_admin ON public.security_event_logs;
DROP POLICY IF EXISTS sel_insert_service ON public.security_event_logs;

-- Create policy for SELECT: only admins and service role can read security logs
CREATE POLICY sel_select_admin ON public.security_event_logs
  FOR SELECT USING (public.is_admin(auth.uid()) OR auth.role() = 'service_role');

-- Create policy for INSERT: only admins and service role can insert security logs  
CREATE POLICY sel_insert_service ON public.security_event_logs
  FOR INSERT WITH CHECK (public.is_admin(auth.uid()) OR auth.role() = 'service_role');

-- Create retention function to automatically delete logs older than 90 days
CREATE OR REPLACE FUNCTION public._prune_security_logs() 
RETURNS void
LANGUAGE sql 
SECURITY DEFINER 
SET search_path = ''
AS $$ 
  DELETE FROM public.security_event_logs 
  WHERE created_at < now() - interval '90 days'; 
$$;

-- Create a trigger to automatically prune old logs daily (alternative to cron)
CREATE OR REPLACE FUNCTION public._trigger_prune_security_logs()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Only prune once per day by checking if any log from today exists
  IF NOT EXISTS (
    SELECT 1 FROM public.security_event_logs 
    WHERE created_at >= CURRENT_DATE 
    AND created_at < CURRENT_DATE + interval '1 day'
    LIMIT 1
  ) THEN
    PERFORM public._prune_security_logs();
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger that runs the pruning function on insert
DROP TRIGGER IF EXISTS trigger_prune_security_logs ON public.security_event_logs;
CREATE TRIGGER trigger_prune_security_logs
  AFTER INSERT ON public.security_event_logs
  FOR EACH ROW
  EXECUTE FUNCTION public._trigger_prune_security_logs();