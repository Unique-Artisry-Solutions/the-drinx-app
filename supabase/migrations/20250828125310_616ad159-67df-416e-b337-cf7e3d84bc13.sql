-- Phase 2: Analytics and Configuration Tables (continuing implementation)

-- Notification Dedup Log (service role only)
ALTER TABLE public.notification_dedup_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service can manage notification dedup log" 
ON public.notification_dedup_log FOR ALL 
USING (auth.role() = 'service_role');

-- Bin Database (admin and system access)
ALTER TABLE public.bin_database ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage BIN data" 
ON public.bin_database FOR ALL 
USING (public.is_admin(auth.uid()));
CREATE POLICY "System can read BIN data" 
ON public.bin_database FOR SELECT 
USING (auth.role() = 'service_role');

-- Device Fingerprints (users can see their own, admins see all)
ALTER TABLE public.device_fingerprints ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own device fingerprints" 
ON public.device_fingerprints FOR SELECT 
USING (auth.uid() = user_id OR public.is_admin(auth.uid()));
CREATE POLICY "Users can insert their own device fingerprints" 
ON public.device_fingerprints FOR INSERT 
WITH CHECK (auth.uid() = user_id OR auth.role() = 'service_role');
CREATE POLICY "Service can update device fingerprints" 
ON public.device_fingerprints FOR UPDATE 
USING (auth.role() = 'service_role' OR public.is_admin(auth.uid()));

-- User Consent Tracking (users manage their own, admins view all)
ALTER TABLE public.user_consent_tracking ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own consent" 
ON public.user_consent_tracking FOR ALL 
USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all consent tracking" 
ON public.user_consent_tracking FOR SELECT 
USING (public.is_admin(auth.uid()));

-- Fraud Detection Rules (admin only)
ALTER TABLE public.fraud_detection_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage fraud detection rules" 
ON public.fraud_detection_rules FOR ALL 
USING (public.is_admin(auth.uid()));

-- Feature Metrics (users see their own, admins see all)
ALTER TABLE public.feature_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can record their own metrics" 
ON public.feature_metrics FOR INSERT 
WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can read their own metrics" 
ON public.feature_metrics FOR SELECT 
USING (auth.uid() = user_id OR public.is_admin(auth.uid()));
CREATE POLICY "Admins can manage all feature metrics" 
ON public.feature_metrics FOR ALL 
USING (public.is_admin(auth.uid()));