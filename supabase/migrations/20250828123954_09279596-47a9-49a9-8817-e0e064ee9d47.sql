-- Enable RLS on payment_audit_logs table
ALTER TABLE public.payment_audit_logs ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies to recreate them properly
DROP POLICY IF EXISTS "pal_select_admin" ON public.payment_audit_logs;
DROP POLICY IF EXISTS "pal_insert_service" ON public.payment_audit_logs;
DROP POLICY IF EXISTS "pal_update_admin_service" ON public.payment_audit_logs;
DROP POLICY IF EXISTS "pal_delete_admin_service" ON public.payment_audit_logs;
DROP POLICY IF EXISTS "Admins can manage payment audit logs" ON public.payment_audit_logs;
DROP POLICY IF EXISTS "Service can manage payment audit logs" ON public.payment_audit_logs;

-- Policy for admins to have full read access to payment audit logs
CREATE POLICY "Admins can select payment audit logs" 
ON public.payment_audit_logs 
FOR SELECT 
USING (public.is_admin(auth.uid()));

-- Policy for admins to update payment audit logs
CREATE POLICY "Admins can update payment audit logs" 
ON public.payment_audit_logs 
FOR UPDATE 
USING (public.is_admin(auth.uid()));

-- Policy for admins to delete payment audit logs (for compliance)
CREATE POLICY "Admins can delete payment audit logs" 
ON public.payment_audit_logs 
FOR DELETE 
USING (public.is_admin(auth.uid()));

-- Allow service role for system operations (automated audit logging)
CREATE POLICY "Service can insert payment audit logs" 
ON public.payment_audit_logs 
FOR INSERT 
WITH CHECK (auth.role() = 'service_role');

-- Additional service role policies for system maintenance
CREATE POLICY "Service can select payment audit logs" 
ON public.payment_audit_logs 
FOR SELECT 
USING (auth.role() = 'service_role');

CREATE POLICY "Service can update payment audit logs" 
ON public.payment_audit_logs 
FOR UPDATE 
USING (auth.role() = 'service_role');

CREATE POLICY "Service can delete payment audit logs" 
ON public.payment_audit_logs 
FOR DELETE 
USING (auth.role() = 'service_role');