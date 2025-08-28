-- Final Phase: Complete Remaining Critical RLS Policies

-- Notification and System Tables
CREATE POLICY "System can manage notification delivery logs" ON public.notification_delivery_logs FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Admins can view notification delivery logs" ON public.notification_delivery_logs FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "System can manage notification status" ON public.notification_delivery_status FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Promoters can manage notification preferences" ON public.promoter_notification_preferences FOR ALL USING (auth.uid() = promoter_id OR public.is_admin(auth.uid()));
CREATE POLICY "System can read notification types" ON public.promoter_notification_types FOR SELECT USING (true);
CREATE POLICY "Admins can manage notification types" ON public.promoter_notification_types FOR ALL USING (public.is_admin(auth.uid()));

-- Reward System Tables
CREATE POLICY "System can manage reward cache" ON public.reward_cache_control FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Admins can view reward cache" ON public.reward_cache_control FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "System can manage reward health" ON public.reward_system_health FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Admins can view reward health" ON public.reward_system_health FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "System can manage user activity patterns" ON public.reward_user_activity_patterns FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Users can view their activity patterns" ON public.reward_user_activity_patterns FOR SELECT USING (auth.uid() = user_id);

-- User Activity and Streaks
CREATE POLICY "Users can view their activity streaks" ON public.user_activity_streaks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can manage activity streaks" ON public.user_activity_streaks FOR ALL USING (auth.role() = 'service_role');

-- Security Tables
CREATE POLICY "Admins can view rate limit violations" ON public.security_rate_limit_violations FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "System can manage rate limit violations" ON public.security_rate_limit_violations FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Admins can manage rate limits" ON public.security_rate_limits FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "System can read rate limits" ON public.security_rate_limits FOR SELECT USING (auth.role() = 'service_role');

-- System Audit
CREATE POLICY "Admins can view system settings audit" ON public.system_settings_audit_log FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "System can log settings changes" ON public.system_settings_audit_log FOR INSERT WITH CHECK (auth.role() = 'service_role');