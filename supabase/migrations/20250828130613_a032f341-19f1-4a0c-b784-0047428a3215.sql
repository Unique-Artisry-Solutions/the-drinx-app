-- FINAL SECURITY CLEANUP: Add RLS policies for all remaining tables

-- Affiliate System
CREATE POLICY "Admins can manage affiliate commissions" ON public.affiliate_commissions FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Partners can view their commissions" ON public.affiliate_commissions FOR SELECT USING (EXISTS (SELECT 1 FROM affiliate_partners WHERE id = affiliate_commissions.affiliate_partner_id AND user_id = auth.uid()));

CREATE POLICY "Users can view partner programs" ON public.affiliate_partners FOR SELECT USING (true);
CREATE POLICY "Admins can manage affiliate partners" ON public.affiliate_partners FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Partners can update their info" ON public.affiliate_partners FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage affiliate payouts" ON public.affiliate_payouts FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Partners can view their payouts" ON public.affiliate_payouts FOR SELECT USING (EXISTS (SELECT 1 FROM affiliate_partners WHERE id = affiliate_payouts.affiliate_partner_id AND user_id = auth.uid()));

CREATE POLICY "Public can view affiliate programs" ON public.affiliate_programs FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage affiliate programs" ON public.affiliate_programs FOR ALL USING (public.is_admin(auth.uid()));

-- Analytics Tables (Admin only)
CREATE POLICY "Admins can view analytics rollups" ON public.analytics_daily_rollup FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can view analytics rollups" ON public.analytics_monthly_rollup FOR SELECT USING (public.is_admin(auth.uid()));

-- Event Management
CREATE POLICY "Event creators can manage discount codes" ON public.event_discount_codes FOR ALL USING (EXISTS (SELECT 1 FROM events WHERE id = event_discount_codes.event_id AND created_by = auth.uid()));
CREATE POLICY "Public can view active discount codes" ON public.event_discount_codes FOR SELECT USING (is_active = true);

-- Campaign Management
CREATE POLICY "Promoters can view campaign analytics" ON public.campaign_segment_analytics FOR SELECT USING (EXISTS (SELECT 1 FROM promoter_marketing_campaigns pmc WHERE pmc.id = campaign_segment_analytics.campaign_id AND pmc.promoter_id = auth.uid()));
CREATE POLICY "Admins can view all campaign analytics" ON public.campaign_segment_analytics FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Promoters can manage segment mappings" ON public.campaign_segment_mappings FOR ALL USING (EXISTS (SELECT 1 FROM promoter_marketing_campaigns pmc WHERE pmc.id = campaign_segment_mappings.campaign_id AND pmc.promoter_id = auth.uid()));

CREATE POLICY "Promoters can view segment performance" ON public.campaign_segment_performance FOR SELECT USING (EXISTS (SELECT 1 FROM promoter_marketing_campaigns pmc WHERE pmc.id = campaign_segment_performance.campaign_id AND pmc.promoter_id = auth.uid()));
CREATE POLICY "System can update segment performance" ON public.campaign_segment_performance FOR ALL USING (auth.role() = 'service_role');

-- Content Management
CREATE POLICY "Admins can manage flagged content" ON public.flagged_content_queue FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "System can flag content" ON public.flagged_content_queue FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Pricing System
CREATE POLICY "Event creators can manage pricing tiers" ON public.ticket_pricing_tiers FOR ALL USING (EXISTS (SELECT 1 FROM events WHERE id = ticket_pricing_tiers.event_id AND created_by = auth.uid()));
CREATE POLICY "Public can view pricing tiers" ON public.ticket_pricing_tiers FOR SELECT USING (true);

CREATE POLICY "Admins can view pricing rules" ON public.pricing_rules FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "System can manage pricing rules" ON public.pricing_rules FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Admins can manage pricing automations" ON public.pricing_automations FOR ALL USING (public.is_admin(auth.uid()));

-- Referral System
CREATE POLICY "Users can view referral programs" ON public.referral_programs FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage referral programs" ON public.referral_programs FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can view their referral rewards" ON public.referral_rewards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can manage referral rewards" ON public.referral_rewards FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Public can view referral tiers" ON public.referral_tiers FOR SELECT USING (true);
CREATE POLICY "Admins can manage referral tiers" ON public.referral_tiers FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can view their referrals" ON public.user_referrals FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_id);
CREATE POLICY "Users can create referrals" ON public.user_referrals FOR INSERT WITH CHECK (auth.uid() = referrer_id);

-- Urgency and Demand
CREATE POLICY "Event creators can manage urgency campaigns" ON public.urgency_campaigns FOR ALL USING (EXISTS (SELECT 1 FROM events WHERE id = urgency_campaigns.event_id AND created_by = auth.uid()));
CREATE POLICY "Public can view active urgency campaigns" ON public.urgency_campaigns FOR SELECT USING (is_active = true);

CREATE POLICY "System can track demand metrics" ON public.demand_metrics FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Admins can view demand metrics" ON public.demand_metrics FOR SELECT USING (public.is_admin(auth.uid()));

-- Marketing Materials
CREATE POLICY "Bar Crawl creators can manage marketing materials" ON public.bar_crawl_marketing_materials FOR ALL USING (EXISTS (SELECT 1 FROM bar_crawls WHERE id = bar_crawl_marketing_materials.bar_crawl_id AND organizer_id = auth.uid()));
CREATE POLICY "Public can view published marketing materials" ON public.bar_crawl_marketing_materials FOR SELECT USING (status = 'published');

-- Countdown Timers
CREATE POLICY "Event creators can manage countdown timers" ON public.countdown_timers FOR ALL USING (EXISTS (SELECT 1 FROM events WHERE id = countdown_timers.event_id AND created_by = auth.uid()));
CREATE POLICY "Public can view active countdown timers" ON public.countdown_timers FOR SELECT USING (is_active = true);

-- Drink Popularity
CREATE POLICY "Establishments can view their drink metrics" ON public.drink_popularity_metrics FOR SELECT USING (EXISTS (SELECT 1 FROM establishments WHERE id = drink_popularity_metrics.establishment_id AND owner_id = auth.uid()));
CREATE POLICY "System can update drink metrics" ON public.drink_popularity_metrics FOR ALL USING (auth.role() = 'service_role');

-- SMS Campaign Stats
CREATE POLICY "Promoters can view their SMS stats" ON public.sms_campaign_stats FOR SELECT USING (EXISTS (SELECT 1 FROM promoter_marketing_campaigns WHERE id = sms_campaign_stats.campaign_id AND promoter_id = auth.uid()));
CREATE POLICY "System can update SMS stats" ON public.sms_campaign_stats FOR ALL USING (auth.role() = 'service_role');

-- Promotion Analytics
CREATE POLICY "Promoters can view their promotion analytics" ON public.promotion_analytics FOR SELECT USING (auth.uid() = promoter_id);
CREATE POLICY "System can manage promotion analytics" ON public.promotion_analytics FOR ALL USING (auth.role() = 'service_role');

-- Event Statistics
CREATE POLICY "Event creators can view their event stats" ON public.event_statistics FOR SELECT USING (EXISTS (SELECT 1 FROM events WHERE id = event_statistics.event_id AND created_by = auth.uid()));
CREATE POLICY "System can update event statistics" ON public.event_statistics FOR ALL USING (auth.role() = 'service_role');

-- Ticket Transaction History
CREATE POLICY "Users can view their ticket transactions" ON public.ticket_transaction_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Event creators can view their event transactions" ON public.ticket_transaction_history FOR SELECT USING (EXISTS (SELECT 1 FROM events WHERE id = ticket_transaction_history.event_id AND created_by = auth.uid()));

-- Seasonal Trend Analysis
CREATE POLICY "Admins can view seasonal trends" ON public.seasonal_trend_analysis FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "System can manage seasonal trends" ON public.seasonal_trend_analysis FOR ALL USING (auth.role() = 'service_role');

-- Compliance Audit Report  
CREATE POLICY "Admins can view compliance reports" ON public.compliance_audit_report FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "System can create compliance reports" ON public.compliance_audit_report FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Streak Performance
CREATE POLICY "Establishments can view their streak performance" ON public.streak_performance FOR SELECT USING (EXISTS (SELECT 1 FROM establishments WHERE id = streak_performance.establishment_id AND owner_id = auth.uid()));
CREATE POLICY "System can manage streak performance" ON public.streak_performance FOR ALL USING (auth.role() = 'service_role');