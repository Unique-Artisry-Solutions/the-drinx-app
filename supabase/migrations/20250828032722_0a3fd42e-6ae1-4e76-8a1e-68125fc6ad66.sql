-- Secure payment_audit_logs table with strict RLS policies

-- Drop existing policies that are too permissive
DROP POLICY IF EXISTS "Users can view their own payment audit logs" ON public.payment_audit_logs;
DROP POLICY IF EXISTS "Admins can view payment audit logs" ON public.payment_audit_logs;
DROP POLICY IF EXISTS "Admins can view all payment audit logs" ON public.payment_audit_logs;

-- Create strict policies: SELECT only for admins and service_role
CREATE POLICY "pal_select_admin" ON public.payment_audit_logs
  FOR SELECT USING (
    public.is_admin(auth.uid()) OR auth.role() = 'service_role'
  );

-- INSERT only for service_role (webhooks, backend processes)
CREATE POLICY "pal_insert_service" ON public.payment_audit_logs
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- UPDATE/DELETE only for service_role and admins
CREATE POLICY "pal_update_admin_service" ON public.payment_audit_logs
  FOR UPDATE USING (
    public.is_admin(auth.uid()) OR auth.role() = 'service_role'
  );

CREATE POLICY "pal_delete_admin_service" ON public.payment_audit_logs
  FOR DELETE USING (
    public.is_admin(auth.uid()) OR auth.role() = 'service_role'
  );

-- Revoke direct table access from anon and authenticated roles
REVOKE ALL ON TABLE public.payment_audit_logs FROM anon, authenticated;

-- Create masked view for users to see their own payment activity (non-sensitive data only)
DROP VIEW IF EXISTS public.payment_audit_logs_my_v;
CREATE VIEW public.payment_audit_logs_my_v
  WITH (security_invoker = true) AS
SELECT
  id,
  user_id,
  created_at,
  status,
  -- Mask IP address (show only first 2 octets)
  CASE 
    WHEN ip_address IS NOT NULL THEN 
      split_part(ip_address, '.', 1) || '.' || split_part(ip_address, '.', 2) || '.xxx.xxx'
    ELSE NULL
  END as ip_masked,
  -- Truncate user agent to remove detailed fingerprinting info
  CASE 
    WHEN user_agent IS NOT NULL THEN 
      left(user_agent, 50) || '...'
    ELSE NULL
  END as user_agent_sample,
  -- Mask payment method ID (show only type hint)
  CASE 
    WHEN payment_method_id IS NOT NULL AND payment_method_id LIKE 'pm_%' THEN 'card'
    WHEN payment_method_id IS NOT NULL AND payment_method_id LIKE 'ba_%' THEN 'bank'
    WHEN payment_method_id IS NOT NULL THEN 'other'
    ELSE NULL
  END as payment_method_type,
  amount,
  currency,
  error_code,
  processing_time_ms
FROM public.payment_audit_logs
WHERE user_id = auth.uid();

-- Grant SELECT access to the masked view for authenticated users
GRANT SELECT ON public.payment_audit_logs_my_v TO authenticated;

-- Create index for better performance on the masked view
CREATE INDEX IF NOT EXISTS idx_payment_audit_logs_user_created 
  ON public.payment_audit_logs(user_id, created_at DESC);