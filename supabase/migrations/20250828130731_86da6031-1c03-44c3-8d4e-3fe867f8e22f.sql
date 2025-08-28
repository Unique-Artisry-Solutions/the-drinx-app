-- FINAL SECURITY CLEANUP: Corrected version

-- Event Management
CREATE POLICY "Event creators can manage discount codes" ON public.event_discount_codes FOR ALL USING (EXISTS (SELECT 1 FROM events WHERE id = event_discount_codes.event_id AND created_by = auth.uid()));
CREATE POLICY "Public can view active discount codes" ON public.event_discount_codes FOR SELECT USING (is_active = true);

-- Pricing System  
CREATE POLICY "Event creators can manage pricing tiers" ON public.ticket_pricing_tiers FOR ALL USING (EXISTS (SELECT 1 FROM events WHERE id = ticket_pricing_tiers.event_id AND created_by = auth.uid()));
CREATE POLICY "Public can view pricing tiers" ON public.ticket_pricing_tiers FOR SELECT USING (true);

CREATE POLICY "Admins can view pricing rules" ON public.pricing_rules FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "System can manage pricing rules" ON public.pricing_rules FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Admins can manage pricing automations" ON public.pricing_automations FOR ALL USING (public.is_admin(auth.uid()));

-- Price History
CREATE POLICY "Admins can view price history" ON public.price_history FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "System can log price changes" ON public.price_history FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Scarcity Indicators  
CREATE POLICY "Public can view active scarcity indicators" ON public.scarcity_indicators FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage scarcity indicators" ON public.scarcity_indicators FOR ALL USING (public.is_admin(auth.uid()));

-- Urgency Campaigns
CREATE POLICY "Event creators can manage urgency campaigns" ON public.urgency_campaigns FOR ALL USING (EXISTS (SELECT 1 FROM events WHERE id = urgency_campaigns.event_id AND created_by = auth.uid()));
CREATE POLICY "Public can view active urgency campaigns" ON public.urgency_campaigns FOR SELECT USING (is_active = true);

-- Referral System
CREATE POLICY "Users can view referral programs" ON public.referral_programs FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage referral programs" ON public.referral_programs FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can view their referral rewards" ON public.referral_rewards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can manage referral rewards" ON public.referral_rewards FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Public can view referral tiers" ON public.referral_tiers FOR SELECT USING (true);
CREATE POLICY "Admins can manage referral tiers" ON public.referral_tiers FOR ALL USING (public.is_admin(auth.uid()));

-- User Referrals (simplified - will adjust after checking actual columns)
CREATE POLICY "Users can view their referrals" ON public.user_referrals FOR SELECT USING (auth.uid() = referrer_id);
CREATE POLICY "Users can create referrals" ON public.user_referrals FOR INSERT WITH CHECK (auth.uid() = referrer_id);

-- Countdown Timers
CREATE POLICY "Event creators can manage countdown timers" ON public.countdown_timers FOR ALL USING (EXISTS (SELECT 1 FROM events WHERE id = countdown_timers.event_id AND created_by = auth.uid()));
CREATE POLICY "Public can view active countdown timers" ON public.countdown_timers FOR SELECT USING (is_active = true);

-- Content Management
CREATE POLICY "Admins can manage flagged content" ON public.flagged_content_queue FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "System can flag content" ON public.flagged_content_queue FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Reward System Metrics
CREATE POLICY "Admins can view reward metrics" ON public.reward_performance_metrics FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "System can log reward metrics" ON public.reward_performance_metrics FOR INSERT WITH CHECK (auth.role() = 'service_role');