-- Restrict function execution and grant explicit permissions

-- 1) Revoke all function privileges from PUBLIC in public schema
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM PUBLIC;

-- 2) Grant execute to authenticated role for specific safe functions used by the app
GRANT EXECUTE ON FUNCTION public.track_analytics_event(uuid, text, jsonb, text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.track_follower_journey_event(uuid, text, jsonb, text, text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.verify_event_access_token(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_join_bar_crawl(text) TO authenticated;
