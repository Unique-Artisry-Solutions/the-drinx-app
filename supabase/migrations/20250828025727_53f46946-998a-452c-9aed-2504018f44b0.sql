-- List offending views with security_invoker off
-- Query to identify views that need fixing:
-- SELECT n.nspname, c.relname, c.reloptions
-- FROM pg_class c
-- JOIN pg_namespace n ON n.oid = c.relnamespace
-- WHERE c.relkind = 'v' AND n.nspname = 'public'
--   AND NOT (COALESCE(array_to_string(c.reloptions, ','), '') ~* 'security_invoker=(on|true|1)');

-- Fix identified views to use security_invoker = true
-- This ensures views respect RLS policies from underlying tables

-- Fix revenue_reports view
ALTER VIEW public.revenue_reports SET (security_invoker = true);

-- Fix promoter_campaign_performance_view
ALTER VIEW public.promoter_campaign_performance_view SET (security_invoker = true);

-- Fix promoter_audience_trends_view  
ALTER VIEW public.promoter_audience_trends_view SET (security_invoker = true);

-- Note: If any other views exist that must stay privileged for system functions,
-- they should be moved to a private schema or have anon/authenticated roles revoked