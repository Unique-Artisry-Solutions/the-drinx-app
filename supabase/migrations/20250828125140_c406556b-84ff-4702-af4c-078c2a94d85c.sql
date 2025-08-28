-- Phase 1: High Priority Financial/Security Tables

-- Affiliate Commissions (financial data - admin only)
ALTER TABLE public.affiliate_commissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage affiliate commissions" 
ON public.affiliate_commissions FOR ALL 
USING (public.is_admin(auth.uid()));

-- Affiliate Payouts (financial data - admin only)  
ALTER TABLE public.affiliate_payouts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage affiliate payouts" 
ON public.affiliate_payouts FOR ALL 
USING (public.is_admin(auth.uid()));

-- Pricing Tiers (promoters can manage their own)
ALTER TABLE public.pricing_tiers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Promoters can manage their pricing tiers" 
ON public.pricing_tiers FOR ALL 
USING (auth.uid() = promoter_id OR public.is_admin(auth.uid()));

-- Price History (read-only for promoters, full access for admins)
ALTER TABLE public.price_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Promoters can view their price history" 
ON public.price_history FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.pricing_tiers pt 
  WHERE pt.id = price_history.pricing_tier_id 
  AND (pt.promoter_id = auth.uid() OR public.is_admin(auth.uid()))
));
CREATE POLICY "Admins can manage price history" 
ON public.price_history FOR ALL 
USING (public.is_admin(auth.uid()));
CREATE POLICY "System can insert price history" 
ON public.price_history FOR INSERT 
WITH CHECK (auth.role() = 'service_role');

-- Rate Limiting Logs (admin and service only)
ALTER TABLE public.rate_limiting_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view rate limiting logs" 
ON public.rate_limiting_logs FOR SELECT 
USING (public.is_admin(auth.uid()));
CREATE POLICY "Service can manage rate limiting logs" 
ON public.rate_limiting_logs FOR ALL 
USING (auth.role() = 'service_role');

-- Security Event Logs (admin and service only)
ALTER TABLE public.security_event_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view security event logs" 
ON public.security_event_logs FOR SELECT 
USING (public.is_admin(auth.uid()));
CREATE POLICY "Service can manage security event logs" 
ON public.security_event_logs FOR ALL 
USING (auth.role() = 'service_role');