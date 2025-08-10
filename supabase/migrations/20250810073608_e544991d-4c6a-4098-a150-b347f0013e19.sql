-- Fix function signature grants after initial revoke
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM PUBLIC;

-- Grant execute to authenticated for approved functions with correct signatures
GRANT EXECUTE ON FUNCTION public.track_analytics_event(uuid, text, jsonb, text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.track_follower_journey_event(uuid, text, jsonb, text, text, text, inet) TO authenticated;
GRANT EXECUTE ON FUNCTION public.verify_event_access_token(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_join_bar_crawl(uuid) TO authenticated;