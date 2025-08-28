-- Final Phase: Complete Remaining RLS Policies for All Tables

-- Affiliate Programs and Partners (admin only)
CREATE POLICY "Admins can manage affiliate programs" ON public.affiliate_programs FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can manage affiliate partners" ON public.affiliate_partners FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can manage affiliate commissions" ON public.affiliate_commissions FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can manage affiliate payouts" ON public.affiliate_payouts FOR ALL USING (public.is_admin(auth.uid()));

-- Analytics Rollup Tables (admin/system access)
CREATE POLICY "Admins can view daily analytics" ON public.analytics_daily_rollup FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "System can manage daily analytics" ON public.analytics_daily_rollup FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Admins can view monthly analytics" ON public.analytics_monthly_rollup FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "System can manage monthly analytics" ON public.analytics_monthly_rollup FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "System can manage weekly analytics" ON public.analytics_weekly_rollup FOR ALL USING (auth.role() = 'service_role');

-- Marketing and Campaign Tables
CREATE POLICY "Admins can manage marketing materials" ON public.bar_crawl_marketing_materials FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Promoters can manage their campaign segments" ON public.campaign_segment_mappings FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "System can manage campaign performance" ON public.campaign_segment_performance FOR ALL USING (auth.role() = 'service_role');

-- Pricing and Commerce Tables  
CREATE POLICY "Promoters can manage their pricing automations" ON public.pricing_automations FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Promoters can manage their pricing rules" ON public.pricing_rules FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Event organizers can manage ticket pricing" ON public.ticket_pricing_tiers FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "System can log ticket transactions" ON public.ticket_transaction_history FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Admins can view demand metrics" ON public.demand_metrics FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "System can update demand metrics" ON public.demand_metrics FOR ALL USING (auth.role() = 'service_role');

-- Discount and Promotion Tables
CREATE POLICY "Event creators can manage discount codes" ON public.event_discount_codes FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "System can record discount redemptions" ON public.event_discount_redemptions FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Promoters can manage countdown timers" ON public.countdown_timers FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Promoters can manage urgency campaigns" ON public.urgency_campaigns FOR ALL USING (public.is_admin(auth.uid()));

-- Referral System Tables
CREATE POLICY "Promoters can manage referral programs" ON public.referral_programs FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "System can manage referral rewards" ON public.referral_rewards FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Promoters can manage referral tiers" ON public.referral_tiers FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Users can view their referrals" ON public.user_referrals FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_user_id);
CREATE POLICY "System can manage user referrals" ON public.user_referrals FOR ALL USING (auth.role() = 'service_role');