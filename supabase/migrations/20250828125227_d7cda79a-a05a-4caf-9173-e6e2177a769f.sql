-- Phase 1: High Priority Financial/Security Tables (existing tables only)

-- Price History (existing table)
ALTER TABLE public.price_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage price history" 
ON public.price_history FOR ALL 
USING (public.is_admin(auth.uid()));
CREATE POLICY "System can insert price history" 
ON public.price_history FOR INSERT 
WITH CHECK (auth.role() = 'service_role');

-- Security Event Logs (admin and service only)
ALTER TABLE public.security_event_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view security event logs" 
ON public.security_event_logs FOR SELECT 
USING (public.is_admin(auth.uid()));
CREATE POLICY "Service can manage security event logs" 
ON public.security_event_logs FOR ALL 
USING (auth.role() = 'service_role');

-- Phase 2: Analytics Tables
-- Analytics Weekly Rollup (admin access only)
ALTER TABLE public.analytics_weekly_rollup ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view analytics rollup" 
ON public.analytics_weekly_rollup FOR SELECT 
USING (public.is_admin(auth.uid()));
CREATE POLICY "System can manage analytics rollup" 
ON public.analytics_weekly_rollup FOR ALL 
USING (auth.role() = 'service_role');

-- Reward Performance Metrics (admin access only)
ALTER TABLE public.reward_performance_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view reward metrics" 
ON public.reward_performance_metrics FOR SELECT 
USING (public.is_admin(auth.uid()));
CREATE POLICY "System can manage reward metrics" 
ON public.reward_performance_metrics FOR ALL 
USING (auth.role() = 'service_role');

-- Audience Segment Analytics (promoters can view their own)
ALTER TABLE public.audience_segment_analytics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Promoters can view their segment analytics" 
ON public.audience_segment_analytics FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.audience_segments s 
  WHERE s.id = audience_segment_analytics.segment_id 
  AND (s.promoter_id = auth.uid() OR public.is_admin(auth.uid()))
));
CREATE POLICY "System can manage segment analytics" 
ON public.audience_segment_analytics FOR ALL 
USING (auth.role() = 'service_role');