-- FINAL CRITICAL SECURITY POLICIES ONLY

-- Event Discount Codes - Critical for event security
CREATE POLICY "Event creators can manage discount codes" ON public.event_discount_codes FOR ALL USING (EXISTS (SELECT 1 FROM events WHERE id = event_discount_codes.event_id AND created_by = auth.uid()));
CREATE POLICY "Public can view active discount codes" ON public.event_discount_codes FOR SELECT USING (is_active = true);

-- Price History - Critical for financial auditing  
CREATE POLICY "Admins can view price history" ON public.price_history FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "System can log price changes" ON public.price_history FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- User Referrals - Correct column names
CREATE POLICY "Users can view their referrals" ON public.user_referrals FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referee_id);
CREATE POLICY "Users can create referrals" ON public.user_referrals FOR INSERT WITH CHECK (auth.uid() = referrer_id);

-- Scarcity Indicators - Marketing security
CREATE POLICY "Public can view active scarcity indicators" ON public.scarcity_indicators FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage scarcity indicators" ON public.scarcity_indicators FOR ALL USING (public.is_admin(auth.uid()));

-- Streak Settings - User engagement security
CREATE POLICY "Establishments can manage their streak settings" ON public.streak_settings FOR ALL USING (EXISTS (SELECT 1 FROM establishments WHERE id = streak_settings.establishment_id AND owner_id = auth.uid()));
CREATE POLICY "Public can view active streak settings" ON public.streak_settings FOR SELECT USING (is_active = true);