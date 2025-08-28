-- Phase 4: Remaining Tables Needing RLS Policies

-- Streak Settings (establishments can manage their own)
ALTER TABLE public.streak_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Establishments can manage their streak settings" 
ON public.streak_settings FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.establishments e 
  WHERE e.id = streak_settings.establishment_id 
  AND (e.owner_id = auth.uid() OR public.is_admin(auth.uid()))
));

-- Follower Engagement Scores (promoters can view their followers' scores)
ALTER TABLE public.follower_engagement_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Promoters can view their follower scores" 
ON public.follower_engagement_scores FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.promoter_followers pf 
  WHERE pf.id = follower_engagement_scores.follower_id 
  AND (pf.promoter_id = auth.uid() OR public.is_admin(auth.uid()))
));
CREATE POLICY "System can manage engagement scores" 
ON public.follower_engagement_scores FOR ALL 
USING (auth.role() = 'service_role');

-- Follower Journey Events (promoters can view their followers' events)
ALTER TABLE public.follower_journey_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Promoters can view their follower events" 
ON public.follower_journey_events FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.promoter_followers pf 
  WHERE pf.id = follower_journey_events.follower_id 
  AND (pf.promoter_id = auth.uid() OR public.is_admin(auth.uid()))
));
CREATE POLICY "System can insert journey events" 
ON public.follower_journey_events FOR INSERT 
WITH CHECK (auth.role() = 'service_role');

-- Event Discount Redemptions (event creators can view)
ALTER TABLE public.event_discount_redemptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Event creators can view redemptions" 
ON public.event_discount_redemptions FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.event_discount_codes edc 
  JOIN public.events e ON e.id = edc.event_id 
  WHERE edc.id = event_discount_redemptions.discount_code_id 
  AND (e.created_by = auth.uid() OR public.is_admin(auth.uid()))
));
CREATE POLICY "System can insert redemptions" 
ON public.event_discount_redemptions FOR INSERT 
WITH CHECK (auth.role() = 'service_role');

-- Ticket Transfers (users can manage their own transfers)
ALTER TABLE public.ticket_transfers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can create ticket transfers" 
ON public.ticket_transfers FOR INSERT 
WITH CHECK (auth.uid() = from_user_id);
CREATE POLICY "Users can view their transfers" 
ON public.ticket_transfers FOR SELECT 
USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);
CREATE POLICY "System can update transfers" 
ON public.ticket_transfers FOR UPDATE 
USING (auth.role() = 'service_role');