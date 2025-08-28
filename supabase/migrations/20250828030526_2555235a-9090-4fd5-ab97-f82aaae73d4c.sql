-- Enable RLS on all public tables that don't have it enabled
-- This fixes the "RLS Disabled in Public" security warnings

-- First, let's document which tables will be affected
-- Tables that currently don't have RLS enabled in public schema:
-- (This query identifies them for audit purposes)
/*
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND rowsecurity = false;
*/

DO $$
DECLARE 
  r RECORD;
  affected_tables TEXT[] := ARRAY[]::TEXT[];
  table_count INTEGER := 0;
BEGIN
  RAISE NOTICE 'Starting RLS enablement for public schema tables...';
  
  -- Enable RLS for all public tables that don't have it
  FOR r IN 
    SELECT schemaname, tablename
    FROM pg_tables 
    WHERE schemaname = 'public' 
    AND rowsecurity = false
    AND tablename NOT LIKE 'pg_%'  -- Skip any system tables
  LOOP
    -- Enable RLS on the table
    EXECUTE format('ALTER TABLE %I.%I ENABLE ROW LEVEL SECURITY', r.schemaname, r.tablename);
    
    -- Track affected tables for audit
    affected_tables := affected_tables || (r.schemaname || '.' || r.tablename);
    table_count := table_count + 1;
    
    RAISE NOTICE 'Enabled RLS on: %.%', r.schemaname, r.tablename;
  END LOOP;
  
  RAISE NOTICE 'RLS enablement completed. Total tables affected: %', table_count;
  
  -- Log the affected tables for audit purposes
  IF table_count > 0 THEN
    RAISE NOTICE 'Affected tables: %', array_to_string(affected_tables, ', ');
  ELSE
    RAISE NOTICE 'No tables needed RLS enablement - all public tables already have RLS enabled';
  END IF;
END$$;

-- Note: After enabling RLS, you may need to create appropriate policies
-- for tables that don't have any policies yet. Tables with RLS enabled
-- but no policies will deny all access by default.

-- To check which tables now have RLS but no policies:
-- SELECT schemaname, tablename 
-- FROM pg_tables t
-- WHERE schemaname = 'public' 
-- AND rowsecurity = true
-- AND NOT EXISTS (
--   SELECT 1 FROM pg_policies p 
--   WHERE p.schemaname = t.schemaname 
--   AND p.tablename = t.tablename
-- );