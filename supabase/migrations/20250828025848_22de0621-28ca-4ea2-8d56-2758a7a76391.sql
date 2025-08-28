-- Get all views that need security_invoker = true
-- This query identifies all views in public schema without proper security_invoker setting
DO $$ 
DECLARE
    view_record RECORD;
BEGIN
    -- Fix all views that don't have security_invoker = true
    FOR view_record IN 
        SELECT n.nspname as schema_name, c.relname as view_name
        FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE c.relkind = 'v' 
        AND n.nspname = 'public'
        AND NOT (COALESCE(array_to_string(c.reloptions, ','), '') ~* 'security_invoker=(on|true|1)')
    LOOP
        EXECUTE format('ALTER VIEW %I.%I SET (security_invoker = true)', view_record.schema_name, view_record.view_name);
        RAISE NOTICE 'Fixed view: %.%', view_record.schema_name, view_record.view_name;
    END LOOP;
END $$;

-- Additional explicit fixes for any views that might have been missed
-- These are common view patterns that might exist

-- Try to fix any potential views (will silently skip if they don't exist)
DO $$
DECLARE
    view_names TEXT[] := ARRAY[
        'analytics_events_view',
        'user_analytics_view', 
        'establishment_analytics_view',
        'event_analytics_view',
        'payment_summary_view',
        'user_engagement_view',
        'follower_stats_view',
        'campaign_performance_view',
        'ticket_sales_view',
        'venue_performance_view'
    ];
    view_name TEXT;
BEGIN
    FOREACH view_name IN ARRAY view_names
    LOOP
        BEGIN
            EXECUTE format('ALTER VIEW public.%I SET (security_invoker = true)', view_name);
            RAISE NOTICE 'Fixed view: public.%', view_name;
        EXCEPTION 
            WHEN undefined_table THEN
                -- View doesn't exist, skip silently
                NULL;
        END;
    END LOOP;
END $$;