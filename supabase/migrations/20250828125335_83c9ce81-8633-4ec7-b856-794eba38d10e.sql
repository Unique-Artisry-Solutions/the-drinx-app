-- Phase 3: Additional Tables Needing RLS Policies

-- Scarcity Indicators (promoters can manage their own)
ALTER TABLE public.scarcity_indicators ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Promoters can manage their scarcity indicators" 
ON public.scarcity_indicators FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.urgency_campaigns uc 
  WHERE uc.id = scarcity_indicators.urgency_campaign_id 
  AND (uc.promoter_id = auth.uid() OR public.is_admin(auth.uid()))
));

-- Suggestion Feedback (establishments can provide feedback)
ALTER TABLE public.suggestion_feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Establishments can provide feedback" 
ON public.suggestion_feedback FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.establishments e 
  WHERE e.id = suggestion_feedback.establishment_id 
  AND (e.owner_id = auth.uid() OR public.is_admin(auth.uid()))
));

-- SMS Delivery Logs (users see their own, admins see all)
ALTER TABLE public.sms_delivery_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their SMS logs" 
ON public.sms_delivery_logs FOR SELECT 
USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all SMS logs" 
ON public.sms_delivery_logs FOR ALL 
USING (public.is_admin(auth.uid()));
CREATE POLICY "System can insert SMS logs" 
ON public.sms_delivery_logs FOR INSERT 
WITH CHECK (auth.role() = 'service_role');

-- Notification Delivery Status (system managed)
ALTER TABLE public.notification_delivery_status ENABLE ROW LEVEL SECURITY;
CREATE POLICY "System can manage notification delivery status" 
ON public.notification_delivery_status FOR ALL 
USING (auth.role() = 'service_role');
CREATE POLICY "Users can view their notification status" 
ON public.notification_delivery_status FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.notifications n 
  WHERE n.id = notification_delivery_status.notification_id 
  AND (n.recipient_id = auth.uid() OR public.is_admin(auth.uid()))
));

-- Affiliate Tracking Links (public read, admin manage)
ALTER TABLE public.affiliate_tracking_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active tracking links" 
ON public.affiliate_tracking_links FOR SELECT 
USING (is_active = true);
CREATE POLICY "Admins can manage tracking links" 
ON public.affiliate_tracking_links FOR ALL 
USING (public.is_admin(auth.uid()));

-- Mocktail Suggestion Notifications (users see their own)
ALTER TABLE public.mocktail_suggestion_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their notifications" 
ON public.mocktail_suggestion_notifications FOR SELECT 
USING (auth.uid() = user_id);
CREATE POLICY "Establishments can see their notifications" 
ON public.mocktail_suggestion_notifications FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.establishments e 
  WHERE e.id = mocktail_suggestion_notifications.establishment_id 
  AND e.owner_id = auth.uid()
));