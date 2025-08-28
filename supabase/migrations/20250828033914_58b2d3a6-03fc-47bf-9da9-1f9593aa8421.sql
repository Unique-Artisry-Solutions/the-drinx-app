-- Fix materialized view API exposure by revoking public access
-- Materialized views don't support RLS, so they shouldn't be exposed to public API

-- Revoke all permissions on materialized view from anon and authenticated roles
REVOKE ALL ON MATERIALIZED VIEW public.reward_analytics_materialized FROM anon, authenticated;

-- Create a private schema for sensitive views if it doesn't exist
CREATE SCHEMA IF NOT EXISTS private;

-- Move the materialized view to private schema
ALTER MATERIALIZED VIEW public.reward_analytics_materialized SET SCHEMA private;

-- Create an admin-only RPC function to access the materialized view data if needed
CREATE OR REPLACE FUNCTION public.get_reward_analytics()
RETURNS TABLE(
  establishment_id uuid,
  total_points_earned bigint,
  total_points_redeemed bigint,
  active_users bigint,
  avg_transaction_value numeric,
  period_start date,
  period_end date
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Only allow admins to access this data
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;
  
  RETURN QUERY
  SELECT 
    r.establishment_id,
    r.total_points_earned,
    r.total_points_redeemed, 
    r.active_users,
    r.avg_transaction_value,
    r.period_start,
    r.period_end
  FROM private.reward_analytics_materialized r;
END;
$$;